
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, Users, Wallet, Map as MapIcon, MapPin, Utensils, Star } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Trip {
  id: string;
  title: string;
  description: string;
  start_date: string | null;
  end_date: string | null;
  num_people: number;
  created_at: string;
}

interface PointOfInterest {
  name: string;
  type: string;
  imageUrl: string;
  location?: {
    lat: number;
    lng: number;
  };
  address?: string;
}

interface Restaurant {
  name: string;
  rating: number;
  cuisine: string;
  priceLevel: string;
  imageUrl: string;
  location?: {
    lat: number;
    lng: number;
  };
  address?: string;
  reviews?: number;
}

interface Country {
  id: string;
  name: string;
}

interface City {
  id: string;
  name: string;
  countryId: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

// Define sample countries and cities data
const countries: Country[] = [
  { id: "pt", name: "Portugal" },
  { id: "fr", name: "França" },
  { id: "it", name: "Itália" },
  { id: "es", name: "Espanha" },
  { id: "jp", name: "Japão" }
];

const cities: City[] = [
  { id: "lisbon", name: "Lisboa", countryId: "pt", coordinates: { lat: 38.7223, lng: -9.1393 } },
  { id: "porto", name: "Porto", countryId: "pt", coordinates: { lat: 41.1579, lng: -8.6291 } },
  { id: "faro", name: "Faro", countryId: "pt", coordinates: { lat: 37.0193, lng: -7.9304 } },
  { id: "paris", name: "Paris", countryId: "fr", coordinates: { lat: 48.8566, lng: 2.3522 } },
  { id: "nice", name: "Nice", countryId: "fr", coordinates: { lat: 43.7102, lng: 7.2620 } },
  { id: "marseille", name: "Marselha", countryId: "fr", coordinates: { lat: 43.2965, lng: 5.3698 } },
  { id: "rome", name: "Roma", countryId: "it", coordinates: { lat: 41.9028, lng: 12.4964 } },
  { id: "venice", name: "Veneza", countryId: "it", coordinates: { lat: 45.4408, lng: 12.3155 } },
  { id: "milan", name: "Milão", countryId: "it", coordinates: { lat: 45.4642, lng: 9.1900 } },
  { id: "madrid", name: "Madrid", countryId: "es", coordinates: { lat: 40.4168, lng: -3.7038 } },
  { id: "barcelona", name: "Barcelona", countryId: "es", coordinates: { lat: 41.3851, lng: 2.1734 } },
  { id: "seville", name: "Sevilha", countryId: "es", coordinates: { lat: 37.3891, lng: -5.9845 } },
  { id: "tokyo", name: "Tóquio", countryId: "jp", coordinates: { lat: 35.6762, lng: 139.6503 } },
  { id: "osaka", name: "Osaka", countryId: "jp", coordinates: { lat: 34.6937, lng: 135.5023 } },
  { id: "kyoto", name: "Quioto", countryId: "jp", coordinates: { lat: 35.0116, lng: 135.7681 } }
];

const getPointsOfInterestForCity = (cityId: string): PointOfInterest[] => {
  switch (cityId) {
    case "lisbon":
      return [
        {
          name: "Torre de Belém",
          type: "Monumento",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Belem_Tower_at_night%2C_Lisbon_%282%29.jpg/1200px-Belem_Tower_at_night%2C_Lisbon_%282%29.jpg",
          location: { lat: 38.6916, lng: -9.2164 },
          address: "Av. Brasília, 1400-038 Lisboa"
        },
        {
          name: "Mosteiro dos Jerónimos",
          type: "Monumento",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Jeronimos_monatary.jpg/1200px-Jeronimos_monatary.jpg",
          location: { lat: 38.6979, lng: -9.2068 },
          address: "Praça do Império, 1400-206 Lisboa"
        },
        {
          name: "Castelo de São Jorge",
          type: "Monumento",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Castelo_de_S._Jorge_em_Lisboa_%28129356643%29.jpeg/1200px-Castelo_de_S._Jorge_em_Lisboa_%28129356643%29.jpeg",
          location: { lat: 38.7139, lng: -9.1337 },
          address: "R. de Santa Cruz do Castelo, 1100-129 Lisboa"
        },
        {
          name: "Oceanário de Lisboa",
          type: "Atração",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Oceanario_Lisboa.jpg/1200px-Oceanario_Lisboa.jpg",
          location: { lat: 38.7633, lng: -9.0950 },
          address: "Esplanada Dom Carlos I, 1990-005 Lisboa"
        },
        {
          name: "Praça do Comércio",
          type: "Local Histórico",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Vista_da_Pra%C3%A7a_do_Com%C3%A9rcio_Lisboa.jpg/1200px-Vista_da_Pra%C3%A7a_do_Com%C3%A9rcio_Lisboa.jpg",
          location: { lat: 38.7075, lng: -9.1364 },
          address: "Praça do Comércio, 1100-148 Lisboa"
        }
      ];
    case "porto":
      return [
        {
          name: "Ponte Dom Luís I",
          type: "Monumento",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Bridge%2C_Porto.jpg/1200px-Bridge%2C_Porto.jpg",
          location: { lat: 41.1396, lng: -8.6093 },
          address: "Ponte Luiz I, Porto"
        },
        {
          name: "Livraria Lello",
          type: "Atração",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Escadaria_vermelha_livraria_Lello.jpg/800px-Escadaria_vermelha_livraria_Lello.jpg",
          location: { lat: 41.1473, lng: -8.6148 },
          address: "R. das Carmelitas 144, 4050-161 Porto"
        },
        {
          name: "Ribeira",
          type: "Bairro",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Ribeira%2C_Porto.jpg/1200px-Ribeira%2C_Porto.jpg",
          location: { lat: 41.1410, lng: -8.6131 },
          address: "Ribeira, Porto"
        },
        {
          name: "Caves do Vinho do Porto",
          type: "Atração",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Porto_wine_cellars_of_Vila_Nova_de_Gaia_%286937654864%29.jpg/1200px-Porto_wine_cellars_of_Vila_Nova_de_Gaia_%286937654864%29.jpg",
          location: { lat: 41.1387, lng: -8.6119 },
          address: "Vila Nova de Gaia, Porto"
        },
        {
          name: "Palácio da Bolsa",
          type: "Monumento",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Pal%C3%A1cio_da_Bolsa.jpg/1200px-Pal%C3%A1cio_da_Bolsa.jpg",
          location: { lat: 41.1414, lng: -8.6153 },
          address: "R. de Ferreira Borges, 4050-253 Porto"
        }
      ];
    case "paris":
      return [
        {
          name: "Torre Eiffel",
          type: "Monumento",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Tour_eiffel_at_sunrise_from_the_trocadero.jpg/800px-Tour_eiffel_at_sunrise_from_the_trocadero.jpg",
          location: { lat: 48.8584, lng: 2.2945 },
          address: "Champ de Mars, 5 Avenue Anatole France, 75007 Paris"
        },
        {
          name: "Museu do Louvre",
          type: "Museu",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Louvre_Museum_Wikimedia_Commons.jpg/1200px-Louvre_Museum_Wikimedia_Commons.jpg",
          location: { lat: 48.8606, lng: 2.3376 },
          address: "Rue de Rivoli, 75001 Paris"
        },
        {
          name: "Notre-Dame",
          type: "Monumento",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Cath%C3%A9drale_Notre-Dame_de_Paris%2C_20_March_2014.jpg/1200px-Cath%C3%A9drale_Notre-Dame_de_Paris%2C_20_March_2014.jpg",
          location: { lat: 48.8530, lng: 2.3499 },
          address: "6 Parvis Notre-Dame - Pl. Jean-Paul II, 75004 Paris"
        },
        {
          name: "Arco do Triunfo",
          type: "Monumento",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Arc_de_Triomphe_de_l%27%C3%89toile%2C_Paris_21_October_2010.jpg/1200px-Arc_de_Triomphe_de_l%27%C3%89toile%2C_Paris_21_October_2010.jpg",
          location: { lat: 48.8738, lng: 2.2950 },
          address: "Place Charles de Gaulle, 75008 Paris"
        },
        {
          name: "Museu d'Orsay",
          type: "Museu",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Musee_d%27Orsay_from_Right_Bank_Summer_2019.jpg/1200px-Musee_d%27Orsay_from_Right_Bank_Summer_2019.jpg",
          location: { lat: 48.8599, lng: 2.3266 },
          address: "1 Rue de la Légion d'Honneur, 75007 Paris"
        }
      ];
    case "rome":
      return [
        {
          name: "Coliseu",
          type: "Monumento",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Colosseo_2020.jpg/1200px-Colosseo_2020.jpg",
          location: { lat: 41.8902, lng: 12.4922 },
          address: "Piazza del Colosseo, 00184 Roma"
        },
        {
          name: "Vaticano",
          type: "Local Religioso",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/St_Peter%27s_Square%2C_Vatican_City_-_April_2007.jpg/1200px-St_Peter%27s_Square%2C_Vatican_City_-_April_2007.jpg",
          location: { lat: 41.9022, lng: 12.4533 },
          address: "Cidade do Vaticano"
        },
        {
          name: "Fontana di Trevi",
          type: "Monumento",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Trevi_Fountain%2C_Rome%2C_Italy_2_-_May_2007.jpg/1200px-Trevi_Fountain%2C_Rome%2C_Italy_2_-_May_2007.jpg",
          location: { lat: 41.9009, lng: 12.4833 },
          address: "Piazza di Trevi, 00187 Roma"
        },
        {
          name: "Panteão",
          type: "Monumento",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Pantheon_Rome.jpg/1200px-Pantheon_Rome.jpg",
          location: { lat: 41.8986, lng: 12.4769 },
          address: "Piazza della Rotonda, 00186 Roma"
        },
        {
          name: "Fórum Romano",
          type: "Sítio Arqueológico",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Foro_Romano_Forum_Romanum_Roman_Forum_%284990947435%29.jpg/1200px-Foro_Romano_Forum_Romanum_Roman_Forum_%284990947435%29.jpg",
          location: { lat: 41.8924, lng: 12.4853 },
          address: "Via della Salara Vecchia, 00186 Roma"
        }
      ];
    case "tokyo":
      return [
        {
          name: "Templo Sensō-ji",
          type: "Templo",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Cloudy_Sensō-ji.jpg/1200px-Cloudy_Sensō-ji.jpg",
          location: { lat: 35.7147, lng: 139.7966 },
          address: "2 Chome-3-1 Asakusa, Taito City, Tokyo 111-0032"
        },
        {
          name: "Torre de Tóquio",
          type: "Torre",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Tokyo_Tower_at_night_in_2023_2.jpg/1200px-Tokyo_Tower_at_night_in_2023_2.jpg",
          location: { lat: 35.6586, lng: 139.7454 },
          address: "4 Chome-2-8 Shibakoen, Minato City, Tokyo 105-0011"
        },
        {
          name: "Palácio Imperial",
          type: "Palácio",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Tokyo_imperial_palace_03.jpg/1200px-Tokyo_imperial_palace_03.jpg",
          location: { lat: 35.6852, lng: 139.7528 },
          address: "1-1 Chiyoda, Chiyoda City, Tokyo 100-8111"
        },
        {
          name: "Cruzamento de Shibuya",
          type: "Local Turístico",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Shibuya_Crossing%2C_Tokyo_%28Unsplash%29.jpg/1200px-Shibuya_Crossing%2C_Tokyo_%28Unsplash%29.jpg",
          location: { lat: 35.6595, lng: 139.7004 },
          address: "Shibuya, Tokyo"
        },
        {
          name: "Meiji Jingu",
          type: "Santuário",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Meiji_Shrine_in_Tokyo_%2814349376153%29.jpg/1200px-Meiji_Shrine_in_Tokyo_%2814349376153%29.jpg",
          location: { lat: 35.6763, lng: 139.6993 },
          address: "1-1 Yoyogikamizonocho, Shibuya City, Tokyo 151-8557"
        }
      ];
    default:
      // For other cities, return generic data
      const city = cities.find(c => c.id === cityId);
      if (!city) return [];
      
      const { lat, lng } = city.coordinates;
      return [
        {
          name: `Principais Monumentos de ${city.name}`,
          type: "Monumento",
          imageUrl: "https://images.unsplash.com/photo-1601921004897-b7d582836990?q=80&w=1170&auto=format&fit=crop",
          location: { lat: lat + 0.01, lng: lng - 0.01 }
        },
        {
          name: `Museus de ${city.name}`,
          type: "Museu",
          imageUrl: "https://images.unsplash.com/photo-1503089414-6321c9741c3e?q=80&w=1169&auto=format&fit=crop",
          location: { lat: lat - 0.01, lng: lng + 0.01 }
        },
        {
          name: `Parques e Jardins de ${city.name}`,
          type: "Parque",
          imageUrl: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?q=80&w=1170&auto=format&fit=crop",
          location: { lat: lat + 0.02, lng: lng + 0.02 }
        },
        {
          name: `Atrações Turísticas de ${city.name}`,
          type: "Atração",
          imageUrl: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=1172&auto=format&fit=crop",
          location: { lat: lat - 0.02, lng: lng - 0.02 }
        },
        {
          name: `Centro Histórico de ${city.name}`,
          type: "Local Histórico",
          imageUrl: "https://images.unsplash.com/photo-1519923041107-e4dc8d9193da?q=80&w=1170&auto=format&fit=crop",
          location: { lat, lng }
        }
      ];
  }
};

const getRestaurantsForCity = (cityId: string): Restaurant[] => {
  switch (cityId) {
    case "lisbon":
      return [
        {
          name: "Belcanto",
          rating: 4.8,
          cuisine: "Portuguesa Contemporânea",
          priceLevel: "€€€€",
          imageUrl: "https://media-cdn.tripadvisor.com/media/photo-s/17/f5/39/f7/belcanto-is-chef-jose.jpg",
          location: { lat: 38.7094, lng: -9.1421 },
          address: "R. Serpa Pinto 10A, 1200-026 Lisboa",
          reviews: 986
        },
        {
          name: "Time Out Market",
          rating: 4.6,
          cuisine: "Várias",
          priceLevel: "€€",
          imageUrl: "https://media-cdn.tripadvisor.com/media/photo-s/12/33/2d/d5/time-out-market-lisboa.jpg",
          location: { lat: 38.7067, lng: -9.1459 },
          address: "Av. 24 de Julho 49, 1200-479 Lisboa",
          reviews: 1432
        },
        {
          name: "Cervejaria Ramiro",
          rating: 4.7,
          cuisine: "Mariscos",
          priceLevel: "€€€",
          imageUrl: "https://media-cdn.tripadvisor.com/media/photo-s/11/01/a8/6c/photo4jpg.jpg",
          location: { lat: 38.7232, lng: -9.1357 },
          address: "Av. Almirante Reis 1, 1150-007 Lisboa",
          reviews: 2187
        },
        {
          name: "Pastéis de Belém",
          rating: 4.5,
          cuisine: "Café & Pastelaria",
          priceLevel: "€",
          imageUrl: "https://media-cdn.tripadvisor.com/media/photo-s/13/ef/de/b6/img-20180731-130120-largejpg.jpg",
          location: { lat: 38.6975, lng: -9.2030 },
          address: "R. de Belém 84-92, 1300-085 Lisboa",
          reviews: 3214
        }
      ];
    case "porto":
      return [
        {
          name: "Cantinho do Avillez",
          rating: 4.7,
          cuisine: "Portuguesa Contemporânea",
          priceLevel: "€€€",
          imageUrl: "https://media-cdn.tripadvisor.com/media/photo-s/10/04/25/72/main-dining-room.jpg",
          location: { lat: 41.1464, lng: -8.6152 },
          address: "R. de Mouzinho da Silveira 166, 4050-426 Porto",
          reviews: 876
        },
        {
          name: "Café Santiago",
          rating: 4.6,
          cuisine: "Portuguesa",
          priceLevel: "€€",
          imageUrl: "https://media-cdn.tripadvisor.com/media/photo-s/18/7a/ce/31/francesinha.jpg",
          location: { lat: 41.1465, lng: -8.6094 },
          address: "R. de Passos Manuel 226, 4000-382 Porto",
          reviews: 1245
        },
        {
          name: "Majestic Café",
          rating: 4.5,
          cuisine: "Café",
          priceLevel: "€€€",
          imageUrl: "https://media-cdn.tripadvisor.com/media/photo-s/13/17/a9/0d/the-beautiful-majestic.jpg",
          location: { lat: 41.1471, lng: -8.6071 },
          address: "R. de Santa Catarina 112, 4000-442 Porto",
          reviews: 2134
        },
        {
          name: "Casa Guedes",
          rating: 4.7,
          cuisine: "Sanduíches",
          priceLevel: "€",
          imageUrl: "https://media-cdn.tripadvisor.com/media/photo-s/15/8a/1c/b3/perfeita.jpg",
          location: { lat: 41.1480, lng: -8.6034 },
          address: "Praça dos Poveiros 130, 4000-393 Porto",
          reviews: 1678
        }
      ];
    case "paris":
      return [
        {
          name: "Le Jules Verne",
          rating: 4.5,
          cuisine: "Francesa",
          priceLevel: "€€€€",
          imageUrl: "https://media-cdn.tripadvisor.com/media/photo-s/1c/c9/91/d2/salle-du-restaurant.jpg",
          location: { lat: 48.8584, lng: 2.2945 },
          address: "Tour Eiffel, Avenue Gustave Eiffel, 75007 Paris",
          reviews: 1563
        },
        {
          name: "L'Ambroisie",
          rating: 4.9,
          cuisine: "Francesa Contemporânea",
          priceLevel: "€€€€",
          imageUrl: "https://media-cdn.tripadvisor.com/media/photo-s/03/eb/99/96/l-ambroisie.jpg",
          location: { lat: 48.8549, lng: 2.3610 },
          address: "9 Place des Vosges, 75004 Paris",
          reviews: 874
        },
        {
          name: "Le Comptoir du Relais",
          rating: 4.6,
          cuisine: "Francesa",
          priceLevel: "€€€",
          imageUrl: "https://media-cdn.tripadvisor.com/media/photo-s/11/55/58/58/lunch-for-two.jpg",
          location: { lat: 48.8536, lng: 2.3363 },
          address: "9 Carrefour de l'Odéon, 75006 Paris",
          reviews: 1265
        },
        {
          name: "Angelina Paris",
          rating: 4.4,
          cuisine: "Café & Pastelaria",
          priceLevel: "€€",
          imageUrl: "https://media-cdn.tripadvisor.com/media/photo-s/16/85/6c/cc/hot-chocolate.jpg",
          location: { lat: 48.8659, lng: 2.3293 },
          address: "226 Rue de Rivoli, 75001 Paris",
          reviews: 2435
        }
      ];
    case "rome":
      return [
        {
          name: "La Pergola",
          rating: 4.9,
          cuisine: "Italiana Contemporânea",
          priceLevel: "€€€€",
          imageUrl: "https://media-cdn.tripadvisor.com/media/photo-s/1c/c2/7b/d4/chef-heinz-beck.jpg",
          location: { lat: 41.9187, lng: 12.4474 },
          address: "Via Alberto Cadlolo 101, 00136 Roma",
          reviews: 1287
        },
        {
          name: "Roscioli",
          rating: 4.7,
          cuisine: "Italiana",
          priceLevel: "€€€",
          imageUrl: "https://media-cdn.tripadvisor.com/media/photo-s/1a/9a/1d/e0/carbonara.jpg",
          location: { lat: 41.8936, lng: 12.4747 },
          address: "Via dei Giubbonari 21, 00186 Roma",
          reviews: 2156
        },
        {
          name: "Pizzarium",
          rating: 4.6,
          cuisine: "Pizza",
          priceLevel: "€€",
          imageUrl: "https://media-cdn.tripadvisor.com/media/photo-s/13/b2/92/d1/photo0jpg.jpg",
          location: { lat: 41.9062, lng: 12.4475 },
          address: "Via della Meloria 43, 00136 Roma",
          reviews: 3254
        },
        {
          name: "Gelateria Giolitti",
          rating: 4.5,
          cuisine: "Sorvetes",
          priceLevel: "€",
          imageUrl: "https://media-cdn.tripadvisor.com/media/photo-s/10/0a/ac/15/20170716-163941-largejpg.jpg",
          location: { lat: 41.9009, lng: 12.4787 },
          address: "Via degli Uffici del Vicario 40, 00186 Roma",
          reviews: 4532
        }
      ];
    case "tokyo":
      return [
        {
          name: "Sukiyabashi Jiro",
          rating: 4.9,
          cuisine: "Sushi",
          priceLevel: "€€€€",
          imageUrl: "https://media-cdn.tripadvisor.com/media/photo-s/18/27/7a/5a/sukiyabashi-jiro-honten.jpg",
          location: { lat: 35.6741, lng: 139.7631 },
          address: "4 Chome-2-15 Ginza, Chuo City, Tokyo 104-0061",
          reviews: 756
        },
        {
          name: "Ichiran Ramen",
          rating: 4.6,
          cuisine: "Ramen",
          priceLevel: "€€",
          imageUrl: "https://media-cdn.tripadvisor.com/media/photo-s/14/81/44/d9/classic-ramen.jpg",
          location: { lat: 35.6702, lng: 139.7597 },
          address: "1 Chome-22-7 Jinnan, Shibuya City, Tokyo 150-0041",
          reviews: 3245
        },
        {
          name: "Robot Restaurant",
          rating: 4.3,
          cuisine: "Entretenimento",
          priceLevel: "€€€",
          imageUrl: "https://media-cdn.tripadvisor.com/media/photo-s/12/2b/50/3a/main-show.jpg",
          location: { lat: 35.6942, lng: 139.7019 },
          address: "1 Chome-7-1 Kabukicho, Shinjuku City, Tokyo 160-0021",
          reviews: 2134
        },
        {
          name: "Tsukiji Outer Market",
          rating: 4.7,
          cuisine: "Frutos do Mar",
          priceLevel: "€€",
          imageUrl: "https://media-cdn.tripadvisor.com/media/photo-s/0f/5c/63/e0/tsukiji-market.jpg",
          location: { lat: 35.6654, lng: 139.7707 },
          address: "4 Chome-16-2 Tsukiji, Chuo City, Tokyo 104-0045",
          reviews: 4561
        }
      ];
    default:
      // For other cities, return generic data
      const city = cities.find(c => c.id === cityId);
      if (!city) return [];
      
      const { lat, lng } = city.coordinates;
      return [
        {
          name: `Restaurante Premiado em ${city.name}`,
          rating: 4.8,
          cuisine: "Alta Gastronomia",
          priceLevel: "€€€€",
          imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1170&auto=format&fit=crop",
          location: { lat: lat + 0.015, lng: lng - 0.015 },
          reviews: 756
        },
        {
          name: `Cozinha Regional de ${city.name}`,
          rating: 4.7,
          cuisine: "Tradicional",
          priceLevel: "€€€",
          imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1074&auto=format&fit=crop",
          location: { lat: lat - 0.015, lng: lng + 0.015 },
          reviews: 548
        },
        {
          name: `Café Popular de ${city.name}`,
          rating: 4.5,
          cuisine: "Informal",
          priceLevel: "€€",
          imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1170&auto=format&fit=crop",
          location: { lat: lat + 0.025, lng: lng + 0.025 },
          reviews: 932
        },
        {
          name: `Bistrô Típico de ${city.name}`,
          rating: 4.6,
          cuisine: "Europeia",
          priceLevel: "€€",
          imageUrl: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?q=80&w=1887&auto=format&fit=crop",
          location: { lat: lat - 0.025, lng: lng - 0.025 },
          reviews: 724
        }
      ];
  }
};

const getCityCoordinates = (cityId: string): { lat: number; lng: number } => {
  const city = cities.find(c => c.id === cityId);
  if (city) return city.coordinates;
  return { lat: 38.7223, lng: -9.1393 }; // Default to Lisbon if city not found
};

const loadGoogleMapsScript = (callback: () => void) => {
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDYCQCtkxeSRisRajDluEHW_BIpVEJzC-s&callback=initMap`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
  script.onload = callback;
};

const TripDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [pointsOfInterest, setPointsOfInterest] = useState<PointOfInterest[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    if (user && id) {
      loadTrip();
    }
  }, [user, id]);

  useEffect(() => {
    window.initMap = () => {
      if (mapRef.current && !googleMapRef.current && mapLoaded === false) {
        initializeMap();
      }
    };

    return () => {
      window.initMap = () => {};
    };
  }, [pointsOfInterest, restaurants, selectedCity]);

  useEffect(() => {
    if (!loading && trip && mapRef.current && !mapLoaded) {
      loadGoogleMapsScript(() => {
        // Script carregado, a função initMap será chamada pelo callback
      });
    }
  }, [loading, trip, mapRef.current]);

  // Filter cities based on selected country
  useEffect(() => {
    if (selectedCountry) {
      const filtered = cities.filter(city => city.countryId === selectedCountry);
      setFilteredCities(filtered);
      
      // If the current selected city doesn't belong to the new country, reset it
      if (selectedCity && !filtered.some(city => city.id === selectedCity)) {
        setSelectedCity("");
      }
    } else {
      setFilteredCities([]);
      setSelectedCity("");
    }
  }, [selectedCountry]);

  // Update POIs and restaurants when city changes
  useEffect(() => {
    if (selectedCity) {
      const pois = getPointsOfInterestForCity(selectedCity);
      const rests = getRestaurantsForCity(selectedCity);
      setPointsOfInterest(pois);
      setRestaurants(rests);
      
      // Reset map to reload with new markers
      if (googleMapRef.current) {
        googleMapRef.current = null;
        setMapLoaded(false);
        // Reinitialize the map after a short delay
        setTimeout(() => {
          if (mapRef.current) {
            initializeMap();
          }
        }, 100);
      }
    }
  }, [selectedCity]);

  const loadTrip = async () => {
    if (!user || !id) return;

    setLoading(true);
    
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error loading trip:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os detalhes da viagem",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    setTrip(data as Trip);
    
    if (data) {
      // Set initial country and city based on trip title
      const tripCity = data.title.split(" ").pop() || data.title;
      
      // Try to find the city in our data
      const cityMatch = cities.find(city => 
        city.name.toLowerCase().includes(tripCity.toLowerCase()) || 
        tripCity.toLowerCase().includes(city.name.toLowerCase())
      );
      
      if (cityMatch) {
        setSelectedCountry(cityMatch.countryId);
        setSelectedCity(cityMatch.id);
      } else {
        // Default to Portugal/Lisbon if no match
        setSelectedCountry("pt");
        setSelectedCity("lisbon");
      }
    }
    
    setLoading(false);
  };

  const initializeMap = () => {
    if (!mapRef.current || mapLoaded) return;

    try {
      const coordinates = getCityCoordinates(selectedCity);
      const mapOptions: google.maps.MapOptions = {
        center: coordinates,
        zoom: 13,
        mapTypeId: 'roadmap',
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        styles: [
          {
            featureType: "all",
            elementType: "labels.text.fill",
            stylers: [{ color: "#6E59A5" }]
          },
          {
            featureType: "water",
            elementType: "geometry.fill",
            stylers: [{ color: "#d6bcfa" }]
          }
        ]
      };

      const map = new google.maps.Map(mapRef.current, mapOptions);
      googleMapRef.current = map;

      pointsOfInterest.forEach((poi, index) => {
        if (poi.location) {
          const marker = new google.maps.Marker({
            position: poi.location,
            map,
            title: poi.name,
            label: {
              text: `${index + 1}`,
              color: "white"
            },
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: "#9b87f5",
              fillOpacity: 1,
              strokeColor: "white",
              strokeWeight: 1,
              scale: 12
            }
          });

          const infowindow = new google.maps.InfoWindow({
            content: `
              <div style="max-width: 200px; font-family: Arial, sans-serif;">
                <h3 style="margin: 0 0 8px; font-size: 16px; color: #6E59A5;">${poi.name}</h3>
                <p style="margin: 0; font-size: 12px; color: #666;">${poi.type}</p>
                ${poi.address ? `<p style="margin-top: 4px; font-size: 12px; color: #666;">${poi.address}</p>` : ''}
              </div>
            `
          });

          marker.addListener("click", () => {
            infowindow.open(map, marker);
          });
        }
      });

      restaurants.forEach((restaurant, index) => {
        if (restaurant.location) {
          const marker = new google.maps.Marker({
            position: restaurant.location,
            map,
            title: restaurant.name,
            label: {
              text: `${index + 1}`,
              color: "white"
            },
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: "#f0d58f",
              fillOpacity: 1,
              strokeColor: "white",
              strokeWeight: 1,
              scale: 12
            }
          });

          const infowindow = new google.maps.InfoWindow({
            content: `
              <div style="max-width: 200px; font-family: Arial, sans-serif;">
                <h3 style="margin: 0 0 8px; font-size: 16px; color: #6E59A5;">${restaurant.name}</h3>
                <div style="display: flex; align-items: center; margin-bottom: 4px;">
                  <span style="color: #f0d58f; margin-right: 4px;">★</span>
                  <span style="font-size: 14px; color: #666;">${restaurant.rating}</span>
                </div>
                <p style="margin: 0; font-size: 12px; color: #666;">${restaurant.cuisine} · ${restaurant.priceLevel}</p>
                ${restaurant.address ? `<p style="margin-top: 4px; font-size: 12px; color: #666;">${restaurant.address}</p>` : ''}
              </div>
            `
          });

          marker.addListener("click", () => {
            infowindow.open(map, marker);
          });
        }
      });

      setMapLoaded(true);
    } catch (error) {
      console.error("Erro ao inicializar o mapa:", error);
      setMapError("Não foi possível carregar o mapa. Verifique a conexão e recarregue a página.");
    }
  };

  const getDetailedPOI = (poi: PointOfInterest, index: number) => {
    const openingHours = ["10:00 - 18:00", "09:30 - 19:00", "10:00 - 20:00", "09:00 - 17:00"][index % 4];
    const ticketPrice = ["€10,00", "€12,50", "€8,00", "Gratuito"][index % 4];
    const rating = (4 + (index % 10) / 10).toFixed(1);
    const reviews = 100 + (index * 52) % 900;
    
    return {
      ...poi,
      openingHours,
      ticketPrice,
      rating: parseFloat(rating),
      reviews,
      images: [
        poi.imageUrl,
        `https://source.unsplash.com/random/800x600/?${poi.type.toLowerCase()},${index + 1}`,
        `https://source.unsplash.com/random/800x600/?${poi.type.toLowerCase()},${index + 2}`
      ],
      videos: [
        "https://www.youtube.com/embed/dQw4w9WgXcQ",
        "https://www.youtube.com/embed/jNQXAC9IVRw"
      ],
      description: `${poi.name} é um ${poi.type.toLowerCase()} espetacular localizado em uma das regiões mais visitadas. 
        
Com uma história rica e impressionante arquitetura, este local oferece uma experiência cultural única para todos os visitantes. Você encontrará coleções fascinantes, exposições temporárias e um ambiente acolhedor.

Fundado há muitas décadas, o ${poi.name} se tornou um símbolo cultural da região, atraindo milhares de turistas anualmente. A equipe é atenciosa e sempre disposta a fornecer informações detalhadas sobre as exposições e a história do local.

Se você está planejando sua visita, recomendamos reservar pelo menos 2-3 horas para aproveitar completamente tudo o que este lugar tem a oferecer. Não deixe de visitar a loja de souvenirs onde você pode encontrar lembranças únicas para levar para casa.`
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <p className="text-muted-foreground">Carregando detalhes da viagem...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">
              Viagem não encontrada
            </h1>
            <p className="mt-2 text-muted-foreground">
              A viagem solicitada não existe ou você não tem permissão para visualizá-la.
            </p>
            <div className="mt-8">
              <Link to="/trips">
                <Button>Voltar para Minhas Viagens</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <Link to="/trips" className="text-primary hover:underline mb-4 inline-block">
            &larr; Voltar para Minhas Viagens
          </Link>
          <h1 className="text-3xl font-bold text-foreground">{trip.title}</h1>
          <p className="mt-2 text-muted-foreground">{trip.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card p-6 rounded-lg shadow border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Datas</h2>
            </div>
            <p className="text-muted-foreground">
              {trip.start_date 
                ? new Date(trip.start_date).toLocaleDateString('pt-BR')
                : 'Data não definida'} 
              {' - '} 
              {trip.end_date
                ? new Date(trip.end_date).toLocaleDateString('pt-BR')
                : 'Data não definida'}
            </p>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Pessoas</h2>
            </div>
            <p className="text-muted-foreground">
              {trip.num_people} pessoa{trip.num_people !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Despesas</h2>
            </div>
            <div className="mt-2">
              <Link to={`/expenses?trip=${trip.id}`}>
                <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                  Ver Despesas
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Country and City Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-card p-6 rounded-lg shadow border border-border">
            <h2 className="text-lg font-semibold mb-4">Selecione o país</h2>
            <Select
              value={selectedCountry}
              onValueChange={(value) => setSelectedCountry(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um país" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.id} value={country.id}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow border border-border">
            <h2 className="text-lg font-semibold mb-4">Selecione a cidade</h2>
            <Select
              value={selectedCity}
              onValueChange={(value) => setSelectedCity(value)}
              disabled={!selectedCountry || filteredCities.length === 0}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={!selectedCountry ? "Selecione um país primeiro" : "Selecione uma cidade"} />
              </SelectTrigger>
              <SelectContent>
                {filteredCities.map((city) => (
                  <SelectItem key={city.id} value={city.id}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <MapIcon className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Mapa da Cidade</h2>
          </div>
          
          <div className="bg-card rounded-lg shadow border border-border overflow-hidden">
            <div ref={mapRef} className="w-full h-[500px]"></div>
            
            {mapError && (
              <div className="p-4 text-center text-destructive">
                <p>{mapError}</p>
              </div>
            )}
            
            <div className="p-4 bg-card border-t border-border">
              <div className="flex flex-wrap gap-4 items-center justify-center">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-sm text-muted-foreground">Pontos de Interesse</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-accent"></div>
                  <span className="text-sm text-muted-foreground">Restaurantes</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Pontos de Interesse</h2>
            {selectedCity && (
              <span className="text-muted-foreground ml-2">
                em {filteredCities.find(c => c.id === selectedCity)?.name || selectedCity}
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pointsOfInterest.map((poi, index) => {
              const detailedPoi = getDetailedPOI(poi, index);
              
              return (
                <Link 
                  key={index}
                  to={`/trips/${id}/poi/${index}`}
                  state={{ poi: detailedPoi }}
                  className="bg-card rounded-lg shadow border border-border overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={poi.imageUrl} 
                      alt={poi.name} 
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                    <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground">{poi.name}</h3>
                    <p className="text-sm text-muted-foreground">{poi.type}</p>
                    {poi.address && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{poi.address}</p>
                    )}
                    <div className="mt-2 flex justify-end">
                      <div className="text-xs bg-primary/10 rounded-full px-2 py-1 text-primary">
                        Ver detalhes
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-6">
            <Utensils className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Restaurantes Recomendados</h2>
            {selectedCity && (
              <span className="text-muted-foreground ml-2">
                em {filteredCities.find(c => c.id === selectedCity)?.name || selectedCity}
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant, index) => (
              <div key={index} className="bg-card rounded-lg shadow border border-border overflow-hidden">
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={restaurant.imageUrl} 
                    alt={restaurant.name} 
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                  <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-foreground">{restaurant.name}</h3>
                    <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-0.5 rounded text-sm font-medium">
                      {restaurant.rating}
                      <Star className="h-3 w-3 fill-current" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{restaurant.cuisine}</p>
                  <p className="text-sm text-muted-foreground mt-1">{restaurant.priceLevel}</p>
                  {restaurant.address && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{restaurant.address}</p>
                  )}
                  {restaurant.reviews && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {restaurant.reviews} avaliações
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

declare global {
  interface Window {
    initMap: () => void;
    google: typeof google;
  }
}

export default TripDetails;
