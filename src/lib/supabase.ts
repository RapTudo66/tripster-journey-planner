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

export const enrichDataWithDetails = (data: any[]): any[] => {
  return data.map((item, index) => {
    if (item.name && (
      item.name.includes("Madrid") || 
      (item.address && item.address.includes("Madrid")) || 
      (typeof item.city === "string" && item.city.includes("Madrid"))
    )) {
      const mardidOpeningHours = ["10:00 - 20:00", "09:00 - 18:00", "10:00 - 19:00", "08:30 - 17:30", "11:00 - 21:00"][index % 5];
      const madridTicketPrice = ["€15,00", "€12,00", "Gratuito", "€10,00", "€20,00"][index % 5];
      const madridRating = (4.2 + (index % 10) / 10).toFixed(1);
      const madridReviews = 1500 + (index * 73) % 2000;
      const madridPhone = ["+34 91 000 0000", "+34 91 123 4567", "+34 91 234 5678", "+34 91 345 6789"][index % 4];
      const madridWebsite = `http://www.madrid-${item.name.toLowerCase().replace(/\s+/g, '')}.es`;
      
      if (!item.openingHours) item.openingHours = mardidOpeningHours;
      if (!item.ticketPrice && "type" in item) item.ticketPrice = madridTicketPrice;
      if (!item.rating) item.rating = parseFloat(madridRating);
      if (!item.reviews) item.reviews = madridReviews;
      if (!item.phone) item.phone = madridPhone;
      if (!item.website) item.website = madridWebsite;
      if (!item.imageUrl && "type" in item) {
        item.imageUrl = [
          "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=2070&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1543783207-ec64e4d95325?q=80&w=2070&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1558370781-d6196949e317?q=80&w=2070&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1576496638255-f10c8395e660?q=80&w=2073&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1580078958839-027b307f4005?q=80&w=1932&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1600891964599-f61f4d5e0de4?q=80&w=2070&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1568971268907-be8a49d90358?q=80&w=2070&auto=format&fit=crop",
        ][index % 7];
      } else if (!item.imageUrl && "cuisine" in item) {
        item.imageUrl = [
          "https://images.unsplash.com/photo-1515443961218-a51367888e4b?q=80&w=2070&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1600891964599-f61f4d5e0de4?q=80&w=2070&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1506911527366-27fdf93f5f0f?q=80&w=1770&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1562059390-a761a084768e?q=80&w=2119&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop",
        ][index % 5];
      }
    } else {
      const openingHours = ["10:00 - 18:00", "09:30 - 19:00", "10:00 - 20:00", "09:00 - 17:00", "08:30 - 22:00"][index % 5];
      const ticketPrice = ["€10,00", "€12,50", "€8,00", "Gratuito", "€15,00"][index % 5];
      const rating = (4 + (index % 10) / 10).toFixed(1);
      const reviews = 100 + (index * 52) % 900;
      const phone = ["+351 21 000 0000", "+351 22 000 0000", "+351 215 123 456", "+351 223 456 789"][index % 4];
      const website = `http://www.${item.name ? item.name.toLowerCase().replace(/\s+/g, '') : 'local'}.com`;
      
      if (!item.openingHours) item.openingHours = openingHours;
      if (!item.ticketPrice && "type" in item) item.ticketPrice = ticketPrice;
      if (!item.rating) item.rating = parseFloat(rating);
      if (!item.reviews) item.reviews = reviews;
      if (!item.phone) item.phone = phone;
      if (!item.website) item.website = website;
    }
    
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
  return diffDays + 1;
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

const madridPOIs: PointOfInterest[] = [
  {
    name: "Museo del Prado",
    type: "Museu",
    imageUrl: "https://images.unsplash.com/photo-1580078958839-027b307f4005?q=80&w=1932&auto=format&fit=crop",
    address: "Calle de Ruiz de Alarcón, 23, 28014 Madrid",
    location: { lat: 40.4138, lng: -3.6922 },
    openingHours: "10:00 - 20:00",
    ticketPrice: "€15,00",
    rating: 4.8,
    reviews: 25000,
    phone: "+34 91 3 30 28 00",
    website: "https://www.museodelprado.es"
  },
  {
    name: "Parque del Retiro",
    type: "Parque",
    imageUrl: "https://images.unsplash.com/photo-1576496638255-f10c8395e660?q=80&w=2073&auto=format&fit=crop",
    address: "Plaza de la Independencia, 7, 28001 Madrid",
    location: { lat: 40.4169, lng: -3.6836 },
    openingHours: "06:00 - 22:00",
    ticketPrice: "Gratuito",
    rating: 4.7,
    reviews: 30000,
    phone: "+34 915 30 00 41",
    website: "https://www.madrid.es/retiro"
  },
  {
    name: "Palacio Real",
    type: "Monumento",
    imageUrl: "https://images.unsplash.com/photo-1558370781-d6196949e317?q=80&w=2070&auto=format&fit=crop",
    address: "Calle de Bailén, s/n, 28071 Madrid",
    location: { lat: 40.4183, lng: -3.7143 },
    openingHours: "10:00 - 18:00",
    ticketPrice: "€12,00",
    rating: 4.6,
    reviews: 20000,
    phone: "+34 914 54 87 00",
    website: "https://www.patrimonionacional.es/palacio-real-de-madrid"
  },
  {
    name: "Plaza Mayor",
    type: "Praça",
    imageUrl: "https://images.unsplash.com/photo-1543783207-ec64e4d95325?q=80&w=2070&auto=format&fit=crop",
    address: "Plaza Mayor, 28012 Madrid",
    location: { lat: 40.4155, lng: -3.7074 },
    openingHours: "24 horas",
    ticketPrice: "Gratuito",
    rating: 4.5,
    reviews: 15000,
    website: "https://www.esmadrid.com/plaza-mayor"
  },
  {
    name: "Puerta del Sol",
    type: "Ponto turístico",
    imageUrl: "https://images.unsplash.com/photo-1579365017241-c0e398e4c45d?q=80&w=2067&auto=format&fit=crop",
    address: "Puerta del Sol, 28013 Madrid",
    location: { lat: 40.4169, lng: -3.7035 },
    openingHours: "24 horas",
    ticketPrice: "Gratuito",
    rating: 4.3,
    reviews: 10000,
    website: "https://www.esmadrid.com/puerta-del-sol"
  },
  {
    name: "Templo de Debod",
    type: "Monumento",
    imageUrl: "https://images.unsplash.com/photo-1591286458030-8eaf5441bf86?q=80&w=2070&auto=format&fit=crop",
    address: "Calle Ferraz, 1, 28008 Madrid",
    location: { lat: 40.4238, lng: -3.7175 },
    openingHours: "10:00 - 20:00",
    ticketPrice: "Gratuito",
    rating: 4.4,
    reviews: 8000,
    phone: "+34 913 66 74 15",
    website: "https://www.madrid.es/templodebod"
  },
  {
    name: "Museo Reina Sofía",
    type: "Museu",
    imageUrl: "https://images.unsplash.com/photo-1551131618-3f0a5cf2f7e1?q=80&w=2071&auto=format&fit=crop",
    address: "Calle de Santa Isabel, 52, 28012 Madrid",
    location: { lat: 40.4080, lng: -3.6942 },
    openingHours: "10:00 - 21:00",
    ticketPrice: "€12,00",
    rating: 4.5,
    reviews: 18000,
    phone: "+34 917 74 10 00",
    website: "https://www.museoreinasofia.es"
  },
  {
    name: "Gran Vía",
    type: "Avenida",
    imageUrl: "https://images.unsplash.com/photo-1568971268907-be8a49d90358?q=80&w=2070&auto=format&fit=crop",
    address: "Gran Vía, Madrid",
    location: { lat: 40.4198, lng: -3.7016 },
    openingHours: "24 horas",
    ticketPrice: "Gratuito",
    rating: 4.6,
    reviews: 12000,
    website: "https://www.esmadrid.com/gran-via"
  },
  {
    name: "Catedral de la Almudena",
    type: "Igreja",
    imageUrl: "https://images.unsplash.com/photo-1630920578890-66a94fc77db1?q=80&w=2060&auto=format&fit=crop",
    address: "Calle de Bailén, 10, 28013 Madrid",
    location: { lat: 40.4158, lng: -3.7144 },
    openingHours: "09:00 - 20:30",
    ticketPrice: "Gratuito",
    rating: 4.4,
    reviews: 7000,
    phone: "+34 915 42 22 00",
    website: "https://catedraldelaalmudena.es"
  },
  {
    name: "Mercado de San Miguel",
    type: "Mercado",
    imageUrl: "https://images.unsplash.com/photo-1597916829826-02e5bf31174e?q=80&w=2070&auto=format&fit=crop",
    address: "Plaza de San Miguel, s/n, 28005 Madrid",
    location: { lat: 40.4153, lng: -3.7092 },
    openingHours: "10:00 - 00:00",
    ticketPrice: "Gratuito (consumo)",
    rating: 4.3,
    reviews: 9000,
    phone: "+34 915 42 49 36",
    website: "https://www.mercadodesanmiguel.es"
  }
];

const madridRestaurants: Restaurant[] = [
  {
    name: "Sobrino de Botín",
    rating: 4.5,
    cuisine: "Tradicional Espanhola",
    priceLevel: "€€€",
    imageUrl: "https://images.unsplash.com/photo-1515443961218-a51367888e4b?q=80&w=2070&auto=format&fit=crop",
    address: "Calle de Cuchilleros, 17, 28005 Madrid",
    location: { lat: 40.4141, lng: -3.7074 },
    reviews: 5000,
    openingHours: "13:00 - 16:00, 20:00 - 23:00",
    phone: "+34 913 66 42 17",
    website: "https://www.botin.es"
  },
  {
    name: "El Paraguas",
    rating: 4.6,
    cuisine: "Asturiana",
    priceLevel: "€€€€",
    imageUrl: "https://images.unsplash.com/photo-1506911527366-27fdf93f5f0f?q=80&w=1770&auto=format&fit=crop",
    address: "Calle Jorge Juan, 16, 28001 Madrid",
    location: { lat: 40.4235, lng: -3.6834 },
    reviews: 3000,
    openingHours: "13:30 - 16:00, 20:30 - 00:00",
    phone: "+34 914 31 59 40",
    website: "https://www.elparaguas.com"
  },
  {
    name: "DiverXO",
    rating: 4.9,
    cuisine: "Experimental",
    priceLevel: "€€€€€",
    imageUrl: "https://images.unsplash.com/photo-1562059390-a761a084768e?q=80&w=2119&auto=format&fit=crop",
    address: "NH Eurobuilding, Calle de Padre Damián, 23, 28036 Madrid",
    location: { lat: 40.4588, lng: -3.6880 },
    reviews: 2000,
    openingHours: "13:30 - 15:30, 20:30 - 22:30",
    phone: "+34 915 70 07 66",
    website: "https://diverxo.com"
  },
  {
    name: "La Bola",
    rating: 4.4,
    cuisine: "Madrileña",
    priceLevel: "€€",
    imageUrl: "https://images.unsplash.com/photo-1600891964599-f61f4d5e0de4?q=80&w=2070&auto=format&fit=crop",
    address: "Calle de la Bola, 5, 28013 Madrid",
    location: { lat: 40.4190, lng: -3.7103 },
    reviews: 3500,
    openingHours: "13:00 - 16:00, 20:00 - 23:00",
    phone: "+34 915 47 69 30",
    website: "https://www.labola.es"
  },
  {
    name: "Amazonico",
    rating: 4.3,
    cuisine: "Fusion",
    priceLevel: "€€€",
    imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop",
    address: "Calle de Jorge Juan, 20, 28001 Madrid",
    location: { lat: 40.4235, lng: -3.6841 },
    reviews: 4000,
    openingHours: "13:00 - 02:00",
    phone: "+34 915 15 43 32",
    website: "https://www.amazonico.com"
  },
  {
    name: "Casa Lucio",
    rating: 4.5,
    cuisine: "Tradicional Espanhola",
    priceLevel: "€€€",
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2074&auto=format&fit=crop",
    address: "Calle Cava Baja, 35, 28005 Madrid",
    location: { lat: 40.4127, lng: -3.7088 },
    reviews: 3800,
    openingHours: "13:00 - 16:00, 20:00 - 00:00",
    phone: "+34 913 65 32 52",
    website: "https://www.casalucio.es"
  },
  {
    name: "El Corte Inglés Gourmet Experience",
    rating: 4.2,
    cuisine: "Internacional",
    priceLevel: "€€",
    imageUrl: "https://images.unsplash.com/photo-1525183995014-bd94c0750cd5?q=80&w=2070&auto=format&fit=crop",
    address: "Plaza de Callao, 2, 28013 Madrid",
    location: { lat: 40.4194, lng: -3.7061 },
    reviews: 2500,
    openingHours: "10:00 - 22:00",
    phone: "+34 913 79 80 00",
    website: "https://www.elcorteingles.es/gourmetexperience"
  },
  {
    name: "La Carmela",
    rating: 4.6,
    cuisine: "Mediterrânea",
    priceLevel: "€€",
    imageUrl: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=2070&auto=format&fit=crop",
    address: "Calle de Lagasca, 46, 28001 Madrid",
    location: { lat: 40.4253, lng: -3.6854 },
    reviews: 1800,
    openingHours: "13:30 - 16:00, 20:30 - 23:30",
    phone: "+34 914 31 98 20",
    website: "https://www.lacarmela.com"
  }
];

export const generateItinerary = (
  pointsOfInterest: PointOfInterest[], 
  restaurants: Restaurant[], 
  numDays: number,
  dates: string[]
): ItineraryDay[] => {
  const itinerary: ItineraryDay[] = [];
  
  const isMadrid = pointsOfInterest.some(poi => 
    poi.name.includes("Madrid") || 
    (poi.address && poi.address.includes("Madrid"))
  );
  
  const poisToUse = isMadrid && pointsOfInterest.length < 5 ? madridPOIs : [...pointsOfInterest];
  const restaurantsToUse = isMadrid && restaurants.length < 3 ? madridRestaurants : [...restaurants];
  
  const pois = [...poisToUse];
  const rests = [...restaurantsToUse];
  
  pois.sort(() => Math.random() - 0.5);
  rests.sort(() => Math.random() - 0.5);
  
  for (let i = 0; i < numDays; i++) {
    const morning: PointOfInterest[] = [];
    const afternoon: PointOfInterest[] = [];
    
    for (let j = 0; j < 2; j++) {
      if (pois.length > 0) {
        morning.push(pois.shift()!);
      } else if (poisToUse.length > 0) {
        const randomIndex = Math.floor(Math.random() * poisToUse.length);
        morning.push(poisToUse[randomIndex]);
      }
    }
    
    for (let j = 0; j < 2; j++) {
      if (pois.length > 0) {
        afternoon.push(pois.shift()!);
      } else if (poisToUse.length > 0) {
        const randomIndex = Math.floor(Math.random() * poisToUse.length);
        afternoon.push(poisToUse[randomIndex]);
      }
    }
    
    let lunch = null;
    let dinner = null;
    
    if (rests.length > 0) {
      lunch = rests.shift()!;
    } else if (restaurantsToUse.length > 0) {
      const randomIndex = Math.floor(Math.random() * restaurantsToUse.length);
      lunch = restaurantsToUse[randomIndex];
    }
    
    if (rests.length > 0) {
      dinner = rests.shift()!;
    } else if (restaurantsToUse.length > 0) {
      const randomIndex = Math.floor(Math.random() * restaurantsToUse.length);
      dinner = restaurantsToUse[randomIndex];
    }
    
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
