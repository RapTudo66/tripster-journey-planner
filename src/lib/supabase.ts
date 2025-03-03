
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://anxmhcprnndtuodmgyea.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFueG1oY3Bybm5kdHVvZG1neWVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzOTIzMzgsImV4cCI6MjA1NTk2ODMzOH0.lT4DUJILUGfhQDqjOYi93Ee0vR5U8L32PNqG9JgUOT0';

export const supabase = createClient(supabaseUrl, supabaseKey);

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

// Helper functions for trip data management
export const enrichDataWithDetails = (data: any[]): any[] => {
  return data.map((item, index) => {
    const openingHours = ["10:00 - 18:00", "09:30 - 19:00", "10:00 - 20:00", "09:00 - 17:00", "08:30 - 22:00"][index % 5];
    const ticketPrice = ["€10,00", "€12,50", "€8,00", "Gratuito", "€15,00"][index % 5];
    const rating = (4 + (index % 10) / 10).toFixed(1);
    const reviews = 100 + (index * 52) % 900;
    const phone = ["+351 21 000 0000", "+351 22 000 0000", "+351 215 123 456", "+351 223 456 789"][index % 4];
    const website = `http://www.${item.name.toLowerCase().replace(/\s+/g, '')}.com`;
    
    if (!item.openingHours) item.openingHours = openingHours;
    if (!item.ticketPrice && "type" in item) item.ticketPrice = ticketPrice;
    if (!item.rating) item.rating = parseFloat(rating);
    if (!item.reviews) item.reviews = reviews;
    if (!item.phone) item.phone = phone;
    if (!item.website) item.website = website;
    
    if ("type" in item && !item.description) {
      item.description = `${item.name} é um ${item.type.toLowerCase()} espetacular. Com uma história rica e impressionante arquitetura, este local oferece uma experiência cultural única para todos os visitantes. Você encontrará coleções fascinantes, exposições temporárias e um ambiente acolhedor.

Fundado há muitas décadas, o ${item.name} se tornou um símbolo cultural da região, atraindo milhares de turistas anualmente. A equipe é atenciosa e sempre disposta a fornecer informações detalhadas sobre as exposições e a história do local.

Se você está planejando sua visita, recomendamos reservar pelo menos 2-3 horas para aproveitar completamente tudo o que este lugar tem a oferecer.`;
    }
    
    return item;
  });
};

export const calculateDays = (startDate: string | null, endDate: string | null): number => {
  if (!startDate || !endDate) return 0;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1; // Incluindo o dia inicial e final
};

export const generateDatesForItinerary = (startDate: string | null, numDays: number): string[] => {
  if (!startDate) return Array(numDays).fill('');
  
  const dates: string[] = [];
  const start = new Date(startDate);
  
  for (let i = 0; i < numDays; i++) {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
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

export const generateItinerary = (
  pointsOfInterest: PointOfInterest[], 
  restaurants: Restaurant[], 
  numDays: number,
  dates: string[]
): ItineraryDay[] => {
  const itinerary: ItineraryDay[] = [];
  
  // Make copies to avoid modifying the originals
  const pois = [...pointsOfInterest];
  const rests = [...restaurants];
  
  // Shuffle the arrays for randomness
  pois.sort(() => Math.random() - 0.5);
  rests.sort(() => Math.random() - 0.5);
  
  for (let i = 0; i < numDays; i++) {
    const morning: PointOfInterest[] = [];
    const afternoon: PointOfInterest[] = [];
    
    // Add 2 POIs for morning activities
    for (let j = 0; j < 2; j++) {
      if (pois.length > 0) {
        morning.push(pois.shift()!);
      }
    }
    
    // Add 2 POIs for afternoon activities
    for (let j = 0; j < 2; j++) {
      if (pois.length > 0) {
        afternoon.push(pois.shift()!);
      }
    }
    
    // Add restaurants for lunch and dinner
    const lunch = rests.length > 0 ? rests.shift()! : null;
    const dinner = rests.length > 0 ? rests.shift()! : null;
    
    itinerary.push({
      day: i + 1,
      date: dates[i],
      morning,
      lunch,
      afternoon,
      dinner
    });
  }
  
  return itinerary;
};
