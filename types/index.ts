export interface GeneratePlanRequest {
  location: string;
  interests?: string[];
  budget?: string;
  preferences?: string;
  foodPreference?: string;
}

export interface Restaurant {
  name: string;
  cuisine: string;
  priceRange: string;
  location: string;
  rating?: number;
  url?: string;
}

export interface GiftIdea {
  item: string;
  description: string;
  estimatedPrice: string;
  relevance: string;
}

export interface PlanItem {
  time: string;
  activity: string;
  description: string;
  location?: string;
}

export interface DatePlan {
  restaurants: Restaurant[];
  giftIdeas: GiftIdea[];
  schedule: PlanItem[];
}

export interface GeneratePlanResponse {
  success: boolean;
  data?: DatePlan;
  error?: string;
} 