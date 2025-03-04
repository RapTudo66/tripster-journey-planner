
import type { PointOfInterest, Restaurant } from './types';

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
