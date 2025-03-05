
import { ItineraryDay, PointOfInterest, Restaurant } from "./types";

/**
 * Generates an itinerary for a trip based on the provided points of interest and restaurants
 */
export const generateItinerary = (
  startDate: string,
  endDate: string,
  pointsOfInterest: PointOfInterest[],
  restaurants: Restaurant[]
): ItineraryDay[] => {
  if (!startDate || !endDate || !pointsOfInterest || !restaurants) {
    return [];
  }

  // Calculate the number of days
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Including start and end days

  console.info(`Generating itinerary for ${diffDays} days`);

  // If we don't have enough POIs, we'll need to reuse them
  const allPOIs = [...pointsOfInterest];
  const allRestaurants = [...restaurants];
  
  // Make sure we have enough POIs and restaurants by repeating if necessary
  while (allPOIs.length < diffDays * 4) {
    allPOIs.push(...pointsOfInterest);
  }
  
  while (allRestaurants.length < diffDays * 2) {
    allRestaurants.push(...restaurants);
  }

  // Create a shuffled copy of POIs and restaurants to randomize the itinerary
  const shuffledPOIs = [...allPOIs].sort(() => 0.5 - Math.random());
  const shuffledRestaurants = [...allRestaurants].sort(() => 0.5 - Math.random());

  // Generate the itinerary for each day
  const itinerary: ItineraryDay[] = [];
  for (let i = 0; i < diffDays; i++) {
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + i);

    // For each day, assign 2 POIs for morning, 2 for afternoon, and 1 restaurant for lunch and dinner
    const morningPOIs = shuffledPOIs.splice(0, 2);
    const afternoonPOIs = shuffledPOIs.splice(0, 2);
    const lunchRestaurant = shuffledRestaurants.splice(0, 1)[0] || null;
    const dinnerRestaurant = shuffledRestaurants.splice(0, 1)[0] || null;

    itinerary.push({
      day: i + 1,
      date: currentDate.toISOString().split('T')[0],
      morning: morningPOIs,
      lunch: lunchRestaurant,
      afternoon: afternoonPOIs,
      dinner: dinnerRestaurant,
    });
  }

  console.info(`Generated itinerary with ${itinerary.length} days`);
  return itinerary;
};

/**
 * Alternative itinerary generator that takes POIs, restaurants, days, and dates as parameters
 */
export const generateItineraryAlternative = (
  pointsOfInterest: PointOfInterest[],
  restaurants: Restaurant[],
  days: number,
  dates: string[]
): ItineraryDay[] => {
  if (!pointsOfInterest || !restaurants || !days || !dates || dates.length === 0) {
    return [];
  }

  console.info(`Generating itinerary for ${days} days`);

  // If we don't have enough POIs, we'll need to reuse them
  const allPOIs = [...pointsOfInterest];
  const allRestaurants = [...restaurants];
  
  // Make sure we have enough POIs and restaurants by repeating if necessary
  while (allPOIs.length < days * 4) {
    allPOIs.push(...pointsOfInterest);
  }
  
  while (allRestaurants.length < days * 2) {
    allRestaurants.push(...restaurants);
  }

  // Create a shuffled copy of POIs and restaurants to randomize the itinerary
  const shuffledPOIs = [...allPOIs].sort(() => 0.5 - Math.random());
  const shuffledRestaurants = [...allRestaurants].sort(() => 0.5 - Math.random());

  // Generate the itinerary for each day
  const itinerary: ItineraryDay[] = [];
  for (let i = 0; i < days; i++) {
    // For each day, assign 2 POIs for morning, 2 for afternoon, and 1 restaurant for lunch and dinner
    const morningPOIs = shuffledPOIs.splice(0, 2);
    const afternoonPOIs = shuffledPOIs.splice(0, 2);
    const lunchRestaurant = shuffledRestaurants.splice(0, 1)[0] || null;
    const dinnerRestaurant = shuffledRestaurants.splice(0, 1)[0] || null;

    itinerary.push({
      day: i + 1,
      date: dates[i],
      morning: morningPOIs,
      lunch: lunchRestaurant,
      afternoon: afternoonPOIs,
      dinner: dinnerRestaurant,
    });
  }

  console.info(`Generated itinerary with ${itinerary.length} days`);
  return itinerary;
};
