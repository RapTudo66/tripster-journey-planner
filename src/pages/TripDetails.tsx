
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, Users, Wallet, Map, MapPin, Utensils } from "lucide-react";

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
}

interface Restaurant {
  name: string;
  rating: number;
  cuisine: string;
  priceLevel: string;
  imageUrl: string;
}

const getMockPointsOfInterest = (city: string): PointOfInterest[] => {
  const cityLower = city.toLowerCase();
  
  if (cityLower.includes("lisboa") || cityLower.includes("lisbon")) {
    return [
      {
        name: "Torre de Belém",
        type: "Monumento",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Belem_Tower_at_night%2C_Lisbon_%282%29.jpg/1200px-Belem_Tower_at_night%2C_Lisbon_%282%29.jpg"
      },
      {
        name: "Mosteiro dos Jerónimos",
        type: "Monumento",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Jeronimos_monatary.jpg/1200px-Jeronimos_monatary.jpg"
      },
      {
        name: "Castelo de São Jorge",
        type: "Monumento",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Castelo_de_S._Jorge_em_Lisboa_%28129356643%29.jpeg/1200px-Castelo_de_S._Jorge_em_Lisboa_%28129356643%29.jpeg"
      },
      {
        name: "Oceanário de Lisboa",
        type: "Atração",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Oceanario_Lisboa.jpg/1200px-Oceanario_Lisboa.jpg"
      }
    ];
  } else if (cityLower.includes("porto")) {
    return [
      {
        name: "Ponte Dom Luís I",
        type: "Monumento",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Bridge%2C_Porto.jpg/1200px-Bridge%2C_Porto.jpg"
      },
      {
        name: "Livraria Lello",
        type: "Atração",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Escadaria_vermelha_livraria_Lello.jpg/800px-Escadaria_vermelha_livraria_Lello.jpg"
      },
      {
        name: "Ribeira",
        type: "Bairro",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Ribeira%2C_Porto.jpg/1200px-Ribeira%2C_Porto.jpg"
      },
      {
        name: "Caves do Vinho do Porto",
        type: "Atração",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Porto_wine_cellars_of_Vila_Nova_de_Gaia_%286937654864%29.jpg/1200px-Porto_wine_cellars_of_Vila_Nova_de_Gaia_%286937654864%29.jpg"
      }
    ];
  } else if (cityLower.includes("paris")) {
    return [
      {
        name: "Torre Eiffel",
        type: "Monumento",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Tour_eiffel_at_sunrise_from_the_trocadero.jpg/800px-Tour_eiffel_at_sunrise_from_the_trocadero.jpg"
      },
      {
        name: "Museu do Louvre",
        type: "Museu",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Louvre_Museum_Wikimedia_Commons.jpg/1200px-Louvre_Museum_Wikimedia_Commons.jpg"
      },
      {
        name: "Notre-Dame",
        type: "Monumento",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Cath%C3%A9drale_Notre-Dame_de_Paris%2C_20_March_2014.jpg/1200px-Cath%C3%A9drale_Notre-Dame_de_Paris%2C_20_March_2014.jpg"
      },
      {
        name: "Arco do Triunfo",
        type: "Monumento",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Arc_de_Triomphe_de_l%27%C3%89toile%2C_Paris_21_October_2010.jpg/1200px-Arc_de_Triomphe_de_l%27%C3%89toile%2C_Paris_21_October_2010.jpg"
      }
    ];
  } else {
    return [
      {
        name: "Monumentos Históricos",
        type: "Monumento",
        imageUrl: "https://images.unsplash.com/photo-1601921004897-b7d582836990?q=80&w=1170&auto=format&fit=crop"
      },
      {
        name: "Museus",
        type: "Museu",
        imageUrl: "https://images.unsplash.com/photo-1503089414-6321c9741c3e?q=80&w=1169&auto=format&fit=crop"
      },
      {
        name: "Parques e Jardins",
        type: "Parque",
        imageUrl: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?q=80&w=1170&auto=format&fit=crop"
      },
      {
        name: "Atrações Turísticas",
        type: "Atração",
        imageUrl: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=1172&auto=format&fit=crop"
      }
    ];
  }
};

const getMockRestaurants = (city: string): Restaurant[] => {
  const cityLower = city.toLowerCase();
  
  if (cityLower.includes("lisboa") || cityLower.includes("lisbon")) {
    return [
      {
        name: "Belcanto",
        rating: 4.8,
        cuisine: "Portuguesa Contemporânea",
        priceLevel: "€€€€",
        imageUrl: "https://media-cdn.tripadvisor.com/media/photo-s/17/f5/39/f7/belcanto-is-chef-jose.jpg"
      },
      {
        name: "Time Out Market",
        rating: 4.6,
        cuisine: "Várias",
        priceLevel: "€€",
        imageUrl: "https://media-cdn.tripadvisor.com/media/photo-s/12/33/2d/d5/time-out-market-lisboa.jpg"
      },
      {
        name: "Cervejaria Ramiro",
        rating: 4.7,
        cuisine: "Mariscos",
        priceLevel: "€€€",
        imageUrl: "https://media-cdn.tripadvisor.com/media/photo-s/11/01/a8/6c/photo4jpg.jpg"
      }
    ];
  } else if (cityLower.includes("porto")) {
    return [
      {
        name: "Cantinho do Avillez",
        rating: 4.7,
        cuisine: "Portuguesa Contemporânea",
        priceLevel: "€€€",
        imageUrl: "https://media-cdn.tripadvisor.com/media/photo-s/10/04/25/72/main-dining-room.jpg"
      },
      {
        name: "Café Santiago",
        rating: 4.6,
        cuisine: "Portuguesa",
        priceLevel: "€€",
        imageUrl: "https://media-cdn.tripadvisor.com/media/photo-s/18/7a/ce/31/francesinha.jpg"
      },
      {
        name: "Majestic Café",
        rating: 4.5,
        cuisine: "Café",
        priceLevel: "€€€",
        imageUrl: "https://media-cdn.tripadvisor.com/media/photo-s/13/17/a9/0d/the-beautiful-majestic.jpg"
      }
    ];
  } else if (cityLower.includes("paris")) {
    return [
      {
        name: "Le Jules Verne",
        rating: 4.5,
        cuisine: "Francesa",
        priceLevel: "€€€€",
        imageUrl: "https://media-cdn.tripadvisor.com/media/photo-s/1c/c9/91/d2/salle-du-restaurant.jpg"
      },
      {
        name: "L'Ambroisie",
        rating: 4.9,
        cuisine: "Francesa Contemporânea",
        priceLevel: "€€€€",
        imageUrl: "https://media-cdn.tripadvisor.com/media/photo-s/03/eb/99/96/l-ambroisie.jpg"
      },
      {
        name: "Le Comptoir du Relais",
        rating: 4.6,
        cuisine: "Francesa",
        priceLevel: "€€€",
        imageUrl: "https://media-cdn.tripadvisor.com/media/photo-s/11/55/58/58/lunch-for-two.jpg"
      }
    ];
  } else {
    return [
      {
        name: "Restaurante Premiado",
        rating: 4.8,
        cuisine: "Alta Gastronomia",
        priceLevel: "€€€€",
        imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1170&auto=format&fit=crop"
      },
      {
        name: "Cozinha Regional",
        rating: 4.7,
        cuisine: "Tradicional",
        priceLevel: "€€€",
        imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1074&auto=format&fit=crop"
      },
      {
        name: "Café Popular",
        rating: 4.5,
        cuisine: "Informal",
        priceLevel: "€€",
        imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1170&auto=format&fit=crop"
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

  useEffect(() => {
    if (user && id) {
      loadTrip();
    }
  }, [user, id]);

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
      setPointsOfInterest(getMockPointsOfInterest(city));
      setRestaurants(getMockRestaurants(city));
    }
    
    setLoading(false);
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

        {/* Pontos de Interesse */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Pontos de Interesse</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pointsOfInterest.map((poi, index) => (
              <div key={index} className="bg-card rounded-lg shadow border border-border overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={poi.imageUrl} 
                    alt={poi.name} 
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground">{poi.name}</h3>
                  <p className="text-sm text-muted-foreground">{poi.type}</p>
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
                <div className="h-48 overflow-hidden">
                  <img 
                    src={restaurant.imageUrl} 
                    alt={restaurant.name} 
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-foreground">{restaurant.name}</h3>
                    <div className="bg-primary/10 text-primary px-2 py-0.5 rounded text-sm font-medium">
                      {restaurant.rating}/5
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{restaurant.cuisine}</p>
                  <p className="text-sm text-muted-foreground mt-1">{restaurant.priceLevel}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetails;
