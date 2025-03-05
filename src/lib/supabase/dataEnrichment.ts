
import { PointOfInterest, Restaurant } from "./types";

/**
 * Enriches attractions data with additional details
 */
export const enrichDataWithDetails = (items: PointOfInterest[] | Restaurant[]): PointOfInterest[] | Restaurant[] => {
  return items.map(item => {
    // Add opening hours if not present
    if (!item.openingHours) {
      item.openingHours = "10:00 - 18:00";
    }
    
    // Add ratings for POIs if not present
    if ('type' in item && !item.rating) {
      item.rating = (4 + Math.random()).toFixed(1);
    }
    
    // Add reviews count if not present
    if (!item.reviews) {
      item.reviews = Math.floor(Math.random() * 900) + 100;
    }
    
    // Add phone number if not present
    if (!item.phone) {
      item.phone = `+${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 9000) + 1000}`;
    }
    
    // Add ticket price for POIs if not present and it's a POI
    if ('type' in item && !item.ticketPrice) {
      const prices = ["Grátis", "€5", "€10", "€15", "€20"];
      item.ticketPrice = prices[Math.floor(Math.random() * prices.length)];
    }
    
    return item;
  });
};
