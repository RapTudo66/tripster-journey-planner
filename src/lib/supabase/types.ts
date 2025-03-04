
export type Profile = {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
};

export type Trip = {
  id: string;
  user_id: string;
  name: string;
  num_people: number;
  created_at: string;
  country?: string;
  city?: string;
  title?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
};

export type Expense = {
  id: string;
  user_id: string;
  trip_id: string;
  category: string;
  amount: number;
  description: string;
  created_at: string;
  date?: string;
};

export type SocialMediaPost = {
  id: string;
  platform: string;
  username: string;
  content: string;
  image_url?: string;
  likes: number;
  comments: number;
  posted_at: string;
  location?: string;
  tags?: string[];
};

export interface PointOfInterest {
  name: string;
  type: string;
  imageUrl: string;
  address?: string;
  location?: {
    lat: number;
    lng: number;
  };
  openingHours?: string;
  ticketPrice?: string;
  rating?: number;
  reviews?: number;
  description?: string;
  phone?: string;
  website?: string;
}

export interface Restaurant {
  name: string;
  rating: number;
  cuisine: string;
  priceLevel: string;
  imageUrl: string;
  address?: string;
  location?: {
    lat: number;
    lng: number;
  };
  reviews?: number;
  openingHours?: string;
  phone?: string;
  website?: string;
}

export interface ItineraryDay {
  day: number;
  date: string;
  morning: PointOfInterest[];
  lunch: Restaurant | null;
  afternoon: PointOfInterest[];
  dinner: Restaurant | null;
}
