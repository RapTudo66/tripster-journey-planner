
import { supabase } from "./client";
import { ItineraryDay, PointOfInterest, Restaurant, Trip } from "./types";
import { getPointsOfInterestForCity, getRestaurantsForCity } from "../../utils/locationData";
import { madridPOIs, madridRestaurants } from "../data/madridData";

/**
 * Fetches trips for a specific user
 */
export const fetchUserTrips = async (userId: string) => {
  const { data, error } = await supabase
    .from("trips")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching trips:", error);
    return [];
  }

  return data;
};

/**
 * Fetches a specific trip by ID
 */
export const fetchTripById = async (tripId: string) => {
  const { data, error } = await supabase
    .from("trips")
    .select("*")
    .eq("id", tripId)
    .single();

  if (error) {
    console.error("Error fetching trip:", error);
    return null;
  }

  return data;
};

/**
 * Fetches expenses for a specific trip
 */
export const fetchTripExpenses = async (tripId: string) => {
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("trip_id", tripId)
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching expenses:", error);
    return [];
  }

  return data;
};

/**
 * Loads attractions data for a specific city and country
 */
export const loadAttractionsData = async (city: string, country: string) => {
  console.info(`Loading attractions data for ${city}, ${country}`);
  
  // Special case for Madrid which has detailed data
  if (city === "Madrid" && country === "Espanha") {
    console.info(`Using detailed Madrid data with ${madridPOIs.length} POIs and ${madridRestaurants.length} restaurants`);
    return {
      pointsOfInterest: madridPOIs,
      restaurants: madridRestaurants,
    };
  }
  
  // Use locationData API for other cities
  try {
    const pointsOfInterestData = getPointsOfInterestForCity(country, city);
    const restaurantsData = getRestaurantsForCity(country, city);
    
    if (pointsOfInterestData.length === 0 && restaurantsData.length === 0) {
      console.info("Warning: No points of interest or restaurants found for this city");
      
      // Try to fetch from external API if available
      const apiData = await fetchCityAttractionsData(city, country);
      
      if (apiData && (apiData.pointsOfInterest.length > 0 || apiData.restaurants.length > 0)) {
        console.info(`Successfully loaded ${apiData.pointsOfInterest.length} POIs and ${apiData.restaurants.length} restaurants from API`);
        return apiData;
      }
    }
    
    console.info(`Found ${pointsOfInterestData.length} POIs and ${restaurantsData.length} restaurants`);
    return {
      pointsOfInterest: pointsOfInterestData,
      restaurants: restaurantsData,
    };
  } catch (error) {
    console.error("Error loading attractions data:", error);
    return {
      pointsOfInterest: [],
      restaurants: [],
    };
  }
};

/**
 * Fetch city attractions data from external API (if available)
 * This can be expanded to use real APIs when credentials are provided
 */
export const fetchCityAttractionsData = async (city: string, country: string) => {
  // This is a simulated API call to get city data
  // In a real implementation, this would call an external API like TripAdvisor, Yelp, etc.
  
  try {
    console.info(`Attempting to fetch data for ${city}, ${country} from external API`);
    
    // For now, we'll return a simulated response with basic data
    // In a real implementation, we would use fetch() or axios to call an API
    
    // If we don't have data, generate some basic POIs and restaurants
    const basicPOIs: PointOfInterest[] = [
      {
        name: `Centro Histórico de ${city}`,
        type: "Ponto Turístico",
        imageUrl: `https://source.unsplash.com/random/800x600/?${city.toLowerCase()},historic`,
        description: `Explore as ruas históricas de ${city} e descubra a arquitetura única e a cultura local.`
      },
      {
        name: `Museu Nacional de ${city}`,
        type: "Museu",
        imageUrl: `https://source.unsplash.com/random/800x600/?${city.toLowerCase()},museum`,
        description: `Conheça a história e arte de ${country} neste magnífico museu.`
      },
      {
        name: `Parque Central de ${city}`,
        type: "Parque",
        imageUrl: `https://source.unsplash.com/random/800x600/?${city.toLowerCase()},park`,
        description: `Um espaço verde tranquilo para relaxar e desfrutar da natureza.`
      },
      {
        name: `Catedral de ${city}`,
        type: "Monumento",
        imageUrl: `https://source.unsplash.com/random/800x600/?${city.toLowerCase()},cathedral`,
        description: `Uma impressionante catedral que mostra a história religiosa da região.`
      },
      {
        name: `Mercado de ${city}`,
        type: "Mercado",
        imageUrl: `https://source.unsplash.com/random/800x600/?${city.toLowerCase()},market`,
        description: `Experimente a culinária local e compre artesanato único neste vibrante mercado.`
      }
    ];
    
    const basicRestaurants: Restaurant[] = [
      {
        name: `Restaurante Tradicional de ${city}`,
        rating: 4.7,
        cuisine: `Tradicional ${country}`,
        priceLevel: "€€",
        imageUrl: `https://source.unsplash.com/random/800x600/?${city.toLowerCase()},restaurant`
      },
      {
        name: `Café Central de ${city}`,
        rating: 4.5,
        cuisine: "Café & Pastelaria",
        priceLevel: "€",
        imageUrl: `https://source.unsplash.com/random/800x600/?${city.toLowerCase()},cafe`
      },
      {
        name: `Bistrô ${city} Moderno`,
        rating: 4.6,
        cuisine: "Contemporânea",
        priceLevel: "€€€",
        imageUrl: `https://source.unsplash.com/random/800x600/?${city.toLowerCase()},bistro`
      },
      {
        name: `${city} Gourmet`,
        rating: 4.8,
        cuisine: "Gourmet",
        priceLevel: "€€€€",
        imageUrl: `https://source.unsplash.com/random/800x600/?${city.toLowerCase()},gourmet`
      }
    ];
    
    return {
      pointsOfInterest: basicPOIs,
      restaurants: basicRestaurants
    };
    
  } catch (error) {
    console.error("Error fetching from external API:", error);
    return null;
  }
};
