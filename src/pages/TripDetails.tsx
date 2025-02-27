
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, Users, Wallet, Map as MapIcon, MapPin, Utensils, Star } from "lucide-react";

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

// Função para obter coordenadas de acordo com a cidade
const getCityCoordinates = (city: string): { lat: number; lng: number } => {
  const cityLower = city.toLowerCase();
  
  if (cityLower.includes("lisboa") || cityLower.includes("lisbon")) {
    return { lat: 38.7223, lng: -9.1393 };
  } else if (cityLower.includes("porto")) {
    return { lat: 41.1579, lng: -8.6291 };
  } else if (cityLower.includes("paris")) {
    return { lat: 48.8566, lng: 2.3522 };
  } else if (cityLower.includes("roma") || cityLower.includes("rome")) {
    return { lat: 41.9028, lng: 12.4964 };
  } else if (cityLower.includes("madrid")) {
    return { lat: 40.4168, lng: -3.7038 };
  } else {
    // Localização padrão (Lisboa)
    return { lat: 38.7223, lng: -9.1393 };
  }
};

const getMockPointsOfInterest = (city: string): PointOfInterest[] => {
  const cityLower = city.toLowerCase();
  const cityCoords = getCityCoordinates(city);
  
  if (cityLower.includes("lisboa") || cityLower.includes("lisbon")) {
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
      }
    ];
  } else if (cityLower.includes("porto")) {
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
      }
    ];
  } else if (cityLower.includes("paris")) {
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
      }
    ];
  } else {
    // Usar algumas coordenadas fictícias próximas ao centro da cidade para o caso de cidades não específicas
    return [
      {
        name: "Monumentos Históricos",
        type: "Monumento",
        imageUrl: "https://images.unsplash.com/photo-1601921004897-b7d582836990?q=80&w=1170&auto=format&fit=crop",
        location: { lat: cityCoords.lat + 0.01, lng: cityCoords.lng - 0.01 }
      },
      {
        name: "Museus",
        type: "Museu",
        imageUrl: "https://images.unsplash.com/photo-1503089414-6321c9741c3e?q=80&w=1169&auto=format&fit=crop",
        location: { lat: cityCoords.lat - 0.01, lng: cityCoords.lng + 0.01 }
      },
      {
        name: "Parques e Jardins",
        type: "Parque",
        imageUrl: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?q=80&w=1170&auto=format&fit=crop",
        location: { lat: cityCoords.lat + 0.02, lng: cityCoords.lng + 0.02 }
      },
      {
        name: "Atrações Turísticas",
        type: "Atração",
        imageUrl: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=1172&auto=format&fit=crop",
        location: { lat: cityCoords.lat - 0.02, lng: cityCoords.lng - 0.02 }
      }
    ];
  }
};

const getMockRestaurants = (city: string): Restaurant[] => {
  const cityLower = city.toLowerCase();
  const cityCoords = getCityCoordinates(city);
  
  if (cityLower.includes("lisboa") || cityLower.includes("lisbon")) {
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
        name: "Ground Burguer",
        rating: 4.3,
        cuisine: "Hamburgueria",
        priceLevel: "€€",
        imageUrl: "https://media-cdn.tripadvisor.com/media/photo-s/0e/1b/e3/72/burger.jpg",
        location: { lat: 38.7195, lng: -9.1487 },
        address: "Avenidas Novas, Lisboa",
        reviews: 392
      },
      {
        name: "A Cultura do Hambúrguer",
        rating: 4.6,
        cuisine: "Hamburgueria",
        priceLevel: "€€",
        imageUrl: "https://media-cdn.tripadvisor.com/media/photo-s/12/31/e0/37/hamburguer-bacon-and.jpg",
        location: { lat: 38.7103, lng: -9.1564 },
        address: "Bairro Alto - Bica - Cais do Sodré, Lisboa",
        reviews: 634
      }
    ];
  } else if (cityLower.includes("porto")) {
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
      }
    ];
  } else if (cityLower.includes("paris")) {
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
      }
    ];
  } else {
    // Usar algumas coordenadas fictícias para o caso de cidades não específicas
    return [
      {
        name: "Restaurante Premiado",
        rating: 4.8,
        cuisine: "Alta Gastronomia",
        priceLevel: "€€€€",
        imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1170&auto=format&fit=crop",
        location: { lat: cityCoords.lat + 0.015, lng: cityCoords.lng - 0.015 },
        reviews: 756
      },
      {
        name: "Cozinha Regional",
        rating: 4.7,
        cuisine: "Tradicional",
        priceLevel: "€€€",
        imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1074&auto=format&fit=crop",
        location: { lat: cityCoords.lat - 0.015, lng: cityCoords.lng + 0.015 },
        reviews: 548
      },
      {
        name: "Café Popular",
        rating: 4.5,
        cuisine: "Informal",
        priceLevel: "€€",
        imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1170&auto=format&fit=crop",
        location: { lat: cityCoords.lat + 0.025, lng: cityCoords.lng + 0.025 },
        reviews: 932
      }
    ];
  }
};

const TripDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const [pointsOfInterest, setPointsOfInterest] = useState<PointOfInterest[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const mapRef = useRef<HTMLDivElement>(null);
  const cityCoordinates = useRef<{ lat: number; lng: number }>({ lat: 38.7223, lng: -9.1393 }); // Padrão para Lisboa
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (user && id) {
      loadTrip();
    }
  }, [user, id]);

  // Efeito para inicializar o mapa após os dados serem carregados
  useEffect(() => {
    if (!loading && trip && mapRef.current && !mapLoaded) {
      initializeMap();
    }
  }, [loading, trip, mapRef.current]);

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
    
    // Load points of interest and restaurants based on trip title
    if (data) {
      const city = data.title.split(" ").pop() || data.title;
      cityCoordinates.current = getCityCoordinates(city);
      const pois = getMockPointsOfInterest(city);
      const rests = getMockRestaurants(city);
      setPointsOfInterest(pois);
      setRestaurants(rests);
    }
    
    setLoading(false);
  };

  // Inicializa o mapa usando a API do Google Maps
  const initializeMap = () => {
    if (!mapRef.current || mapLoaded) return;

    // Carrega o script da API do Google Maps dinamicamente
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBZxhxp97QsC3YLRwFkRqYBDQzmj4lG2GM&callback=initMap`;
    script.async = true;
    script.defer = true;

    // Define a função de callback global
    window.initMap = () => {
      if (!mapRef.current) return;

      // Cria o mapa centrado nas coordenadas da cidade
      const map = new google.maps.Map(mapRef.current, {
        center: cityCoordinates.current,
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]
      });

      // Adiciona marcadores para pontos de interesse (ícones vermelhos)
      pointsOfInterest.forEach((poi, index) => {
        if (poi.location) {
          const marker = new google.maps.Marker({
            position: poi.location,
            map: map,
            title: poi.name,
            label: {
              text: (index + 1).toString(),
              color: "white"
            },
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: "#FF5252",
              fillOpacity: 1,
              strokeColor: "#FFFFFF",
              strokeWeight: 2,
              scale: 12
            }
          });

          // Adiciona uma janela de informações ao clicar no marcador
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div style="max-width: 200px;">
                <h3 style="margin: 0; font-size: 16px;">${poi.name}</h3>
                <p style="margin: 5px 0 0; font-size: 14px;">${poi.type}</p>
                ${poi.address ? `<p style="margin: 5px 0; font-size: 12px; color: #555;">${poi.address}</p>` : ''}
              </div>
            `
          });

          marker.addListener("click", () => {
            infoWindow.open(map, marker);
          });
        }
      });

      // Adiciona marcadores para restaurantes (ícones amarelos)
      restaurants.forEach((restaurant, index) => {
        if (restaurant.location) {
          const marker = new google.maps.Marker({
            position: restaurant.location,
            map: map,
            title: restaurant.name,
            label: {
              text: (index + 1).toString(),
              color: "white"
            },
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: "#FFC107",
              fillOpacity: 1,
              strokeColor: "#FFFFFF",
              strokeWeight: 2,
              scale: 12
            }
          });

          // Adiciona uma janela de informações ao clicar no marcador
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div style="max-width: 200px;">
                <h3 style="margin: 0; font-size: 16px;">${restaurant.name}</h3>
                <div style="display: flex; align-items: center; margin-top: 5px;">
                  <span style="font-weight: bold; margin-right: 5px;">${restaurant.rating}</span>
                  <span style="color: #FFC107;">★★★★★</span>
                  <span style="margin-left: 5px; font-size: 12px; color: #555;">(${restaurant.reviews} avaliações)</span>
                </div>
                <p style="margin: 5px 0; font-size: 14px;">${restaurant.cuisine} · ${restaurant.priceLevel}</p>
                ${restaurant.address ? `<p style="margin: 5px 0; font-size: 12px; color: #555;">${restaurant.address}</p>` : ''}
              </div>
            `
          });

          marker.addListener("click", () => {
            infoWindow.open(map, marker);
          });
        }
      });

      setMapLoaded(true);
    };

    // Adiciona o script ao documento
    document.head.appendChild(script);
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
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

        {/* Mapa com pontos de interesse e restaurantes */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <MapIcon className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Mapa da Cidade</h2>
          </div>
          
          <div className="bg-card rounded-lg shadow border border-border overflow-hidden">
            <div ref={mapRef} className="w-full h-[500px]"></div>
            <div className="p-4 bg-card border-t border-border">
              <div className="flex flex-wrap gap-4 items-center justify-center">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-[#FF5252]"></div>
                  <span className="text-sm text-muted-foreground">Pontos de Interesse</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-[#FFC107]"></div>
                  <span className="text-sm text-muted-foreground">Restaurantes</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pontos de Interesse */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Pontos de Interesse</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pointsOfInterest.map((poi, index) => (
              <div key={index} className="bg-card rounded-lg shadow border border-border overflow-hidden">
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={poi.imageUrl} 
                    alt={poi.name} 
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                  <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-[#FF5252] text-white flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground">{poi.name}</h3>
                  <p className="text-sm text-muted-foreground">{poi.type}</p>
                  {poi.address && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{poi.address}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Restaurantes Recomendados */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Utensils className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Restaurantes Recomendados</h2>
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
                  <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-[#FFC107] text-white flex items-center justify-center text-sm font-bold">
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

// Adiciona a definição do tipo global para a função de inicialização do mapa
declare global {
  interface Window {
    initMap: () => void;
  }
}

export default TripDetails;
