
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
  
  // Se estamos gerando um roteiro para Paris com 3 dias, usamos um roteiro pré-definido
  if (days === 3 && pointsOfInterest.some(poi => poi.name.includes("Torre Eiffel") || 
                                           poi.name.includes("Louvre") || 
                                           poi.name.includes("Notre-Dame"))) {
    return generateParisItinerary(dates);
  }
  
  // Para outros destinos, mantemos a lógica original
  
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
 * Generates a predefined Paris itinerary for 3 days
 */
const generateParisItinerary = (dates: string[]): ItineraryDay[] => {
  // Torre Eiffel POI
  const torreEiffel: PointOfInterest = {
    name: "Torre Eiffel",
    type: "Monumento",
    description: "Chegue cedo para evitar filas. Suba até o segundo andar ou vá até o topo para uma vista panorâmica incrível.",
    rating: 4.8,
    openingHours: "08h30 - 10h00",
    ticketPrice: "€17,10 - €28,30",
    address: "Champ de Mars, 5 Av. Anatole France, 75007 Paris",
    imageUrl: "/lovable-uploads/5afdc361-b902-4687-aee5-b875480642aa.png",
    location: { lat: 48.8584, lng: 2.2945 }
  };
  
  // Museu do Louvre POI
  const louvre: PointOfInterest = {
    name: "Museu do Louvre",
    type: "Museu",
    description: "Visite a Mona Lisa, a Vênus de Milo e outras obras icônicas.",
    rating: 4.7,
    openingHours: "10h30 - 13h30",
    ticketPrice: "€17",
    address: "Rue de Rivoli, 75001 Paris",
    imageUrl: "https://images.unsplash.com/photo-1565098772267-60af42b81ef2?auto=format&fit=crop&q=80&w=500&h=300",
    location: { lat: 48.8606, lng: 2.3376 }
  };
  
  // Le Café Marly Restaurant
  const cafeMarly: Restaurant = {
    name: "Le Café Marly",
    cuisine: "Francesa",
    priceLevel: "€€€",
    rating: 4.2,
    address: "No Louvre, vista para a pirâmide",
    description: "Sugestão: Steak tartare ou salada Niçoise.",
    openingHours: "13h45 - 15h00",
    imageUrl: "https://images.unsplash.com/photo-1560624052-3423b279830c?auto=format&fit=crop&q=80&w=500&h=300",
    location: { lat: 48.8622, lng: 2.3359 }
  };
  
  // Notre-Dame POI
  const notreDame: PointOfInterest = {
    name: "Catedral de Notre-Dame e Île de la Cité",
    type: "Catedral",
    description: "Caminhada pela Île de la Cité e visita à Catedral (se reaberta após restauração).",
    rating: 4.7,
    openingHours: "15h30 - 16h30",
    address: "Parvis Notre-Dame - Pl. Jean-Paul II, 75004",
    imageUrl: "https://images.unsplash.com/photo-1584266337025-b45ee5ea0e8f?auto=format&fit=crop&q=80&w=500&h=300",
    location: { lat: 48.8530, lng: 2.3499 }
  };
  
  // Quartier Latin POI
  const quartierLatin: PointOfInterest = {
    name: "Passeio pelo Quartier Latin",
    type: "Bairro",
    description: "Explore a Rue de la Huchette, o Panthéon e a Sorbonne.",
    rating: 4.5,
    openingHours: "16h45 - 18h00",
    imageUrl: "https://images.unsplash.com/photo-1551999570-57c3a9611984?auto=format&fit=crop&q=80&w=500&h=300",
    location: { lat: 48.8462, lng: 2.3443 }
  };
  
  // Le Procope Restaurant
  const leProcope: Restaurant = {
    name: "Le Procope",
    cuisine: "Francesa",
    priceLevel: "€€€",
    rating: 4.4,
    address: "Restaurante histórico desde 1686",
    description: "Sugestão: Coq au vin ou sopa de cebola.",
    openingHours: "19h30 - 21h30",
    imageUrl: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80&w=500&h=300",
    location: { lat: 48.8531, lng: 2.3392 }
  };
  
  // Museu d'Orsay POI
  const orsay: PointOfInterest = {
    name: "Museu d'Orsay",
    type: "Museu",
    description: "Impressionismo e pós-impressionismo: Van Gogh, Monet e Renoir.",
    rating: 4.7,
    openingHours: "09h00 - 11h00",
    ticketPrice: "€16",
    address: "1 Rue de la Légion d'Honneur, 75007",
    imageUrl: "https://images.unsplash.com/photo-1587979931372-fc9e39ebda34?auto=format&fit=crop&q=80&w=500&h=300",
    location: { lat: 48.8600, lng: 2.3266 }
  };
  
  // Jardim de Luxemburgo POI
  const luxemburgo: PointOfInterest = {
    name: "Jardim de Luxemburgo",
    type: "Parque",
    description: "Passeio relaxante pelo jardim mais elegante de Paris.",
    rating: 4.6,
    openingHours: "11h30 - 12h30",
    address: "75006 Paris",
    imageUrl: "https://images.unsplash.com/photo-1558177585-761f38c631bb?auto=format&fit=crop&q=80&w=500&h=300",
    location: { lat: 48.8462, lng: 2.3372 }
  };
  
  // Les Deux Magots Restaurant
  const lesDeux: Restaurant = {
    name: "Les Deux Magots",
    cuisine: "Francesa",
    priceLevel: "€€€",
    rating: 4.3,
    address: "Café histórico frequentado por Sartre e Hemingway",
    description: "Sugestão: Croque-monsieur ou quiche Lorraine.",
    openingHours: "12h45 - 14h00",
    imageUrl: "https://images.unsplash.com/photo-1477763816053-7c86d5fa8db1?auto=format&fit=crop&q=80&w=500&h=300",
    location: { lat: 48.8539, lng: 2.3336 }
  };
  
  // Montmartre POI
  const montmartre: PointOfInterest = {
    name: "Montmartre e Basílica de Sacré-Cœur",
    type: "Bairro",
    description: "Suba até a Sacré-Cœur para uma vista incrível da cidade. Passeie pela Place du Tertre e veja artistas de rua.",
    rating: 4.7,
    openingHours: "14h30 - 17h00",
    address: "35 Rue du Chevalier de la Barre, 75018 Paris",
    imageUrl: "https://images.unsplash.com/photo-1555425748-831a8289f2c9?auto=format&fit=crop&q=80&w=500&h=300",
    location: { lat: 48.8867, lng: 2.3431 }
  };
  
  // Moulin Rouge POI
  const moulinRouge: PointOfInterest = {
    name: "Moulin Rouge",
    type: "Teatro",
    description: "Foto na icônica fachada do cabaré mais famoso do mundo.",
    rating: 4.4,
    openingHours: "17h30 - 18h00",
    address: "82 Bd de Clichy, 75018 Paris",
    imageUrl: "https://images.unsplash.com/photo-1555636222-cae8c8ab2e2d?auto=format&fit=crop&q=80&w=500&h=300",
    location: { lat: 48.8841, lng: 2.3322 }
  };
  
  // La Mère Catherine Restaurant
  const laMere: Restaurant = {
    name: "La Mère Catherine",
    cuisine: "Francesa",
    priceLevel: "€€€",
    rating: 4.2,
    address: "Montmartre",
    description: "Pratos clássicos franceses, como confit de pato.",
    openingHours: "20h00 - 23h00",
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=500&h=300",
    location: { lat: 48.8855, lng: 2.3402 }
  };
  
  // Palácio de Versalhes POI
  const versalhes: PointOfInterest = {
    name: "Palácio de Versalhes",
    type: "Palácio",
    description: "Destaques: Salão dos Espelhos, Jardins e o Petit Trianon. Dica: Pegue o RER C cedo para evitar multidões.",
    rating: 4.8,
    openingHours: "08h30 - 12h30",
    ticketPrice: "€20",
    address: "Place d'Armes, 78000 Versailles",
    imageUrl: "https://images.unsplash.com/photo-1551410224-699683e15636?auto=format&fit=crop&q=80&w=500&h=300",
    location: { lat: 48.8048, lng: 2.1203 }
  };
  
  // La Petite Venise Restaurant
  const laPetite: Restaurant = {
    name: "La Petite Venise",
    cuisine: "Francesa",
    priceLevel: "€€€",
    rating: 4.3,
    address: "Nos jardins de Versalhes",
    description: "Sugestão: Peixe grelhado com legumes ou risoto.",
    openingHours: "13h00 - 14h30",
    imageUrl: "https://images.unsplash.com/photo-1546530967-10442bc8e4d3?auto=format&fit=crop&q=80&w=500&h=300",
    location: { lat: 48.8044, lng: 2.1183 }
  };
  
  // La Défense POI
  const defense: PointOfInterest = {
    name: "La Défense",
    type: "Bairro",
    description: "Bairro moderno com arranha-céus e o Grande Arco.",
    rating: 4.3,
    openingHours: "15h30 - 17h00",
    address: "92800 Puteaux",
    imageUrl: "https://images.unsplash.com/photo-1601049676869-9character=0ad19008f?auto=format&fit=crop&q=80&w=500&h=300",
    location: { lat: 48.8918, lng: 2.2362 }
  };
  
  // Champs-Élysées e Arco do Triunfo POI
  const champsElysees: PointOfInterest = {
    name: "Champs-Élysées e Arco do Triunfo",
    type: "Avenida",
    description: "Caminhada pela avenida mais famosa de Paris até o Arco do Triunfo.",
    rating: 4.7,
    openingHours: "17h30 - 19h00",
    address: "Avenue des Champs-Élysées, 75008 Paris",
    imageUrl: "https://images.unsplash.com/photo-1552308243-d8ceb9ce1ae2?auto=format&fit=crop&q=80&w=500&h=300",
    location: { lat: 48.8698, lng: 2.3075 }
  };
  
  // Le Train Bleu Restaurant
  const leTrainBleu: Restaurant = {
    name: "Le Train Bleu",
    cuisine: "Francesa",
    priceLevel: "€€€€",
    rating: 4.5,
    address: "Restaurante Belle Époque na Gare de Lyon",
    description: "Sugestão: Filet mignon ao molho de trufas.",
    openingHours: "20h00 - 22h30",
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=500&h=300",
    location: { lat: 48.8448, lng: 2.3735 }
  };
  
  // Criar o itinerário para os 3 dias em Paris
  return [
    {
      day: 1,
      date: dates[0],
      theme: "Clássicos de Paris",
      morning: [torreEiffel, louvre],
      lunch: cafeMarly,
      afternoon: [notreDame, quartierLatin],
      dinner: leProcope
    },
    {
      day: 2,
      date: dates[1],
      theme: "Arte, Montmartre e Noite Parisiense",
      morning: [orsay, luxemburgo],
      lunch: lesDeux,
      afternoon: [montmartre, moulinRouge],
      dinner: laMere
    },
    {
      day: 3,
      date: dates[2],
      theme: "Palácio de Versalhes e Modernidade em Paris",
      morning: [versalhes],
      lunch: laPetite,
      afternoon: [defense, champsElysees],
      dinner: leTrainBleu
    }
  ];
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
