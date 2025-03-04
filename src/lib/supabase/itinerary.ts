
import type { PointOfInterest, Restaurant, ItineraryDay } from './types';
import { madridPOIs, madridRestaurants } from '../data/madridData';

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
