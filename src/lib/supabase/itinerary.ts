
import { ItineraryDay, PointOfInterest, Restaurant } from "./types";
import { calculateDays, generateDatesForItinerary } from "./dateUtils";

/**
 * Generates a complete itinerary for a trip
 */
export const generateItinerary = (
  startDate: string,
  endDate: string,
  pointsOfInterest: PointOfInterest[],
  restaurants: Restaurant[]
): ItineraryDay[] => {
  console.log(`Generating itinerary from ${startDate} to ${endDate}`);
  console.log(`Available POIs: ${pointsOfInterest.length}, Restaurants: ${restaurants.length}`);
  
  const days = calculateDays(startDate, endDate);
  const dates = generateDatesForItinerary(startDate, days);
  
  // If we have limited data, make sure we can reuse POIs and restaurants
  const minPOIsNeeded = days * 4; // Approximately 4 POIs per day
  const minRestaurantsNeeded = days * 2; // 2 restaurants per day
  
  // Ensure we have enough data by duplicating if necessary
  let enrichedPOIs = [...pointsOfInterest];
  let enrichedRestaurants = [...restaurants];
  
  // If we don't have enough POIs, duplicate them
  while (enrichedPOIs.length < minPOIsNeeded && pointsOfInterest.length > 0) {
    enrichedPOIs = [...enrichedPOIs, ...pointsOfInterest];
  }
  
  // If we don't have enough restaurants, duplicate them
  while (enrichedRestaurants.length < minRestaurantsNeeded && restaurants.length > 0) {
    enrichedRestaurants = [...enrichedRestaurants, ...restaurants];
  }
  
  // Shuffle the arrays to create variety
  enrichedPOIs = shuffleArray(enrichedPOIs);
  enrichedRestaurants = shuffleArray(enrichedRestaurants);
  
  const itinerary: ItineraryDay[] = [];
  
  for (let i = 0; i < days; i++) {
    // Calculate how many POIs to include in this day
    const morningPOIs = enrichedPOIs.length > 0 ? enrichedPOIs.splice(0, Math.min(2, enrichedPOIs.length)) : [];
    const afternoonPOIs = enrichedPOIs.length > 0 ? enrichedPOIs.splice(0, Math.min(2, enrichedPOIs.length)) : [];
    
    // Get restaurants for lunch and dinner
    const lunch = enrichedRestaurants.length > 0 ? enrichedRestaurants.shift() : null;
    const dinner = enrichedRestaurants.length > 0 ? enrichedRestaurants.shift() : null;
    
    itinerary.push({
      day: i + 1,
      date: dates[i],
      morning: morningPOIs,
      lunch: lunch || null,
      afternoon: afternoonPOIs,
      dinner: dinner || null
    });
  }
  
  console.log(`Generated itinerary with ${itinerary.length} days`);
  return itinerary;
};

/**
 * Helper function to shuffle an array
 */
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
