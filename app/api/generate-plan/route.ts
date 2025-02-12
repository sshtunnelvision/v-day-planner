import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { GeneratePlanRequest, GeneratePlanResponse } from '@/types';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

if (!process.env.TAVILY_API_KEY) {
  throw new Error('Missing TAVILY_API_KEY environment variable');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface TavilyResult {
  url: string;
  title: string;
  content: string;
  score: number;
  raw_content: string | null;
  restaurantUrl?: string | null;
}

async function getRestaurantUrl(restaurantName: string, location: string) {
  const query = `${restaurantName} restaurant ${location} website reservations -list`.trim();
  
  if (!process.env.TAVILY_API_KEY) {
    return null;
  }
  
  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.TAVILY_API_KEY,
      },
      body: JSON.stringify({
        api_key: process.env.TAVILY_API_KEY,
        query,
        search_depth: 'advanced',
        include_domains: ['yelp.com', 'tripadvisor.com', 'opentable.com', 'resy.com'],
        max_results: 1,
      }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.results?.[0]?.url || null;
  } catch (error) {
    console.error('❌ Error getting restaurant URL:', error);
    return null;
  }
}

async function searchRestaurants(location: string, preferences?: string, foodPreference?: string) {
  const query = `best ${foodPreference || ''} restaurant reviews ${location} -list -top10`.trim();
  
  console.log('🔍 Tavily Search Query:', query);
  console.log('🔑 Tavily API Key:', process.env.TAVILY_API_KEY?.slice(0, 10) + '...');

  if (!process.env.TAVILY_API_KEY) {
    throw new Error('Tavily API key is not configured');
  }

  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.TAVILY_API_KEY,
      },
      body: JSON.stringify({
        api_key: process.env.TAVILY_API_KEY,
        query,
        search_depth: 'advanced',
        include_domains: ['yelp.com', 'tripadvisor.com', 'opentable.com'],
        exclude_domains: ['timeout.com', 'thrillist.com', 'forbes.com', 'nytimes.com'],
        max_results: 5,
        sort_by: 'relevance',
        filter_by_date: 'last_12_months',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Tavily API Error:', errorData);
      throw new Error(`Tavily API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log('📊 Tavily Response:', JSON.stringify(data, null, 2));
    
    if (!data.results) {
      console.error('❌ No results in Tavily response:', data);
      return [];
    }

    // Get specific URLs for each restaurant
    const restaurantPromises = data.results.map(async (result: TavilyResult) => {
      const restaurantName = result.content.split('.')[0].trim();
      const url = await getRestaurantUrl(restaurantName, location);
      return {
        ...result,
        restaurantUrl: url
      };
    });

    const enrichedResults = await Promise.all(restaurantPromises);
    return enrichedResults;
  } catch (error) {
    console.error('❌ Error in Tavily search:', error);
    return [];
  }
}

export async function POST(request: Request) {
  try {
    const body: GeneratePlanRequest = await request.json();
    const { location, interests, preferences, foodPreference } = body;

    console.log('🌟 Request Body:', JSON.stringify(body, null, 2));

    // Search for local restaurants
    console.log('🔎 Starting Tavily restaurant search...');
    const restaurantResults = await searchRestaurants(location, preferences, foodPreference);
    console.log('🍽️ Restaurant Results:', JSON.stringify(restaurantResults, null, 2));

    // Generate date plan using OpenAI
    console.log('🤖 Sending request to OpenAI...');
    const completion = await openai.chat.completions.create({
    //DO NOT CHANGE THE MODEL
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a romantic date planning assistant. Generate a Valentine's Day date plan based on the provided information. Include restaurant suggestions, gift ideas, and a schedule. Format the response as JSON matching these types:

          interface Restaurant {
            name: string;
            cuisine: string;
            location: string;
            rating?: number;
            url?: string;  // Use the restaurantUrl field from search results when available, falling back to the review URL if needed
          }

          interface GiftIdea {
            item: string;
            description: string;
            relevance: string;
          }

          interface PlanItem {
            time: string;
            activity: string;
            description: string;
            location?: string;
          }

          The response should include arrays of: restaurants, giftIdeas, and schedule.
          
          IMPORTANT GUIDELINES:
          1. For restaurants:
             - Use the restaurantUrl field from search results when available for direct booking/website links
             - If restaurantUrl is not available, use the review URL as a fallback
             - Only suggest restaurants that have valid URLs
          2. For gift ideas:
             - Focus on thoughtful, personalized suggestions based on interests
             - Include a mix of creative and practical items
             - If specific interests are provided, tailor suggestions accordingly
             - Include at least one handmade or DIY gift option
          3. For the schedule:
             - Create a balanced flow of activities
             - Include specific locations when relevant
             - Consider the local area and interests provided`
        },
        {
          role: 'user',
          content: `Create a Valentine's Day date plan for ${location}.
          Partner's interests: ${interests.join(', ')}
          ${preferences ? `Preferences: ${preferences}` : ''}
          
          Restaurant information from local search:
          ${JSON.stringify(restaurantResults, null, 2)}`
        }
      ],
      response_format: { type: 'json_object' },
    });

    if (!completion.choices[0].message.content) {
      throw new Error('No response from OpenAI');
    }

    console.log('🎯 OpenAI Response:', completion.choices[0].message.content);

    const plan = JSON.parse(completion.choices[0].message.content);

    const response: GeneratePlanResponse = {
      success: true,
      data: plan,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ Error generating date plan:', error);

    const response: GeneratePlanResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };

    return NextResponse.json(response, { status: 500 });
  }
} 