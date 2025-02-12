# VALENTINE'S DATE GENERATOR - LEAN PRD

## USER STORIES

1. As a user, I want to input my location and partner's interests, so that I can get personalized date suggestions
2. As a user, I want to receive restaurant recommendations based on my location, so I can plan where to eat
3. As a user, I want to get gift suggestions based on my partner's interests, so I can choose a meaningful present
4. As a user, I want to receive a complete date night plan, so I can execute a well-thought-out evening
5. As a user, I want to see loading states while content generates, so I know the system is working

## FRONTEND ARCHITECTURE

1. Setup & Configuration

   - Next.js 14 project with App Router
   - TailwindCSS for styling
   - shadcn/ui component library

   Project structure:
   src/
   app/
   page.tsx
   layout.tsx
   components/
   ui/ # shadcn components
   forms/ # form components
   suggestions/ # suggestion display components
   lib/
   utils.ts
   api.ts # API client functions
   types/
   index.ts # shared types

2. Core Features

   Pages/Routes:

   - Single page application (app/page.tsx)

   Key Components:

   - InputForm: Location and preferences input
   - DatePlan: Display generated plan
   - RestaurantSuggestions: Restaurant cards
   - GiftIdeas: Gift suggestion cards
   - LoadingSpinner: API call feedback

   State Management:

   - React useState for form inputs
   - React useState for generation results

   UI/UX:

   - Mobile-first responsive design
   - Smooth loading transitions
   - Error state handling
   - Clear section separation

3. Data Flow
   - Form submission triggers API call
   - Loading states during API calls
   - Results displayed in organized sections
   - Error handling with user feedback

## BACKEND ARCHITECTURE

1. Setup & Configuration

   - Next.js API routes
   - Environment variables:
     OPENAI_API_KEY
     TAVILY_API_KEY

2. Core Features

   API Endpoints:
   /api/generate-plan
   POST {
   location: string
   interests: string[]
   budget?: string
   preferences?: string
   }

   Data Processing:

   1. Process user input
   2. Query Tavily for local restaurants/activities
   3. Generate plan using OpenAI
   4. Format and return response

3. Data Flow
   - Request validation
   - Parallel API calls to Tavily and OpenAI
   - Response formatting with typed interfaces
   - Error handling with appropriate status codes

## INTEGRATION POINTS

API Contracts:

interface GeneratePlanRequest {
location: string
interests: string[]
budget?: string
preferences?: string
}

interface Restaurant {
name: string
cuisine: string
priceRange: string
location: string
rating?: number
}

interface GiftIdea {
item: string
description: string
estimatedPrice: string
relevance: string
}

interface PlanItem {
time: string
activity: string
description: string
location?: string
}

interface GeneratePlanResponse {
success: boolean
data?: DatePlan
error?: string
}

Environment Variables:
OPENAI_API_KEY=sk-...
TAVILY_API_KEY=tvly-...

Shared Utilities:

- API response parsing
- Error handling utilities
- Date/time formatting
- Location validation

## IMPLEMENTATION NOTES

- Begin with basic form and OpenAI integration
- Add Tavily integration for location-based suggestions
- Focus on mobile-first responsive design
- Implement proper error handling and loading states
- Ensure clean and intuitive user interface
