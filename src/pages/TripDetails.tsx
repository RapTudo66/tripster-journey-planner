
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { 
  supabase, 
  Trip as TripType, 
  PointOfInterest,
  Restaurant,
  ItineraryDay,
  calculateDays,
  generateDatesForItinerary,
  generateItinerary,
  enrichDataWithDetails
} from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { 
  Calendar, 
  Users, 
  Wallet, 
  Map as MapIcon, 
  MapPin, 
  Utensils, 
  Star, 
  Clock, 
  Ticket, 
  Info, 
  CalendarDays,
  Phone
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  getCountryByName, 
  getCityByName,
  getPointsOfInterestForCity,
  getRestaurantsForCity 
} from "@/utils/locationData";

interface Trip {
  id: string;
  title: string;
  description: string;
  start_date: string | null;
  end_date: string | null;
  num_people: number;
  created_at: string;
  country?: string;
  city?: string;
}

const getCityCoordinates = (country: string | undefined, city: string | undefined): { lat: number; lng: number } => {
  if (!country || !city) return { lat: 38.7223, lng: -9.1393 }; // Default to Lisbon

  const cityObj = getCityByName(country, city);
  if (cityObj?.coordinates) return cityObj.coordinates;
  
  return { lat: 38.7223, lng: -9.1393 }; // Default to Lisbon if not found
};

const loadGoogleMapsScript = (callback: () => void) => {
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDYCQCtkxeSRisRajDluEHW_BIpVEJzC-s&callback=initMap`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
  script.onload = callback;
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'Data não definida';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
};

const TripDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const [pointsOfInterest, setPointsOfInterest] = useState<PointOfInterest[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [numDays, setNumDays] = useState(0);
  const [activeTab, setActiveTab] = useState("roteiro");
  const [dataLoaded, setDataLoaded] = useState(false);

  const navigateToPointOfInterest = (poi: PointOfInterest) => {
    return `/trips/${id}/poi/${poi.name.toLowerCase().replace(/\s+/g, "-")}`;
  };

  const navigateToRestaurant = (restaurant: Restaurant) => {
    return `/trips/${id}/restaurant/${restaurant.name.toLowerCase().replace(/\s+/g, "-")}`;
  };

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
  }, [pointsOfInterest, restaurants]);

  useEffect(() => {
    if (!loading && trip && mapRef.current && !mapLoaded) {
      loadGoogleMapsScript(() => {
        // Script carregado, a função initMap será chamada pelo callback
      });
    }
  }, [loading, trip, mapRef.current]);

  useEffect(() => {
    if (trip && trip.start_date && trip.end_date && !dataLoaded) {
      // Only proceed if we have a trip with dates
      const days = calculateDays(trip.start_date, trip.end_date);
      setNumDays(days);
      
      // Load attractions data if we have a country and city
      if (trip.country && trip.city) {
        loadAttractionsData(trip.country, trip.city, days);
        setDataLoaded(true);
      }
    }
  }, [trip, dataLoaded]);

  // This function loads attractions data and generates the itinerary
  const loadAttractionsData = (country: string, city: string, days: number) => {
    console.log(`Loading attractions data for ${city}, ${country}`);
    
    // Get points of interest and restaurants for the selected city
    const pois = getPointsOfInterestForCity(country, city);
    const rests = getRestaurantsForCity(country, city);
    
    if (pois.length === 0 || rests.length === 0) {
      console.log("Warning: No points of interest or restaurants found for this city");
      toast({
        title: "Aviso",
        description: "Não encontramos pontos de interesse ou restaurantes suficientes para esta cidade.",
        variant: "default",
      });
    }
    
    // Enrich the data with additional details
    const enrichedPOIs = enrichDataWithDetails([...pois]) as PointOfInterest[];
    const enrichedRestaurants = enrichDataWithDetails([...rests]) as Restaurant[];
    
    console.log(`Found ${enrichedPOIs.length} POIs and ${enrichedRestaurants.length} restaurants`);
    
    setPointsOfInterest(enrichedPOIs);
    setRestaurants(enrichedRestaurants);
    
    // If we have dates, generate the itinerary
    if (days > 0 && trip?.start_date) {
      console.log(`Generating itinerary for ${days} days`);
      
      const dates = generateDatesForItinerary(trip.start_date, days);
      const newItinerary = generateItinerary(enrichedPOIs, enrichedRestaurants, days, dates);
      
      console.log(`Generated itinerary with ${newItinerary.length} days`);
      setItinerary(newItinerary);
    }
  };

  const loadTrip = async () => {
    if (!user || !id) return;

    setLoading(true);
    setDataLoaded(false);
    
    try {
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

      console.log('Trip loaded:', data);
      setTrip(data as Trip);
      
      setLoading(false);
    } catch (err) {
      console.error("Unexpected error loading trip:", err);
      toast({
        title: "Erro",
        description: "Um erro inesperado ocorreu ao carregar a viagem",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const initializeMap = () => {
    if (!mapRef.current || mapLoaded || !trip?.country || !trip?.city) return;

    try {
      const coordinates = getCityCoordinates(trip.country, trip.city);
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

  const renderItineraryDay = (day: ItineraryDay) => {
    return (
      <div key={day.day} className="mb-8 border border-border rounded-lg overflow-hidden">
        <div className="bg-primary text-white px-4 py-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">Dia {day.day}</h3>
            <div className="flex items-center gap-2">
              <CalendarDays size={16} className="text-white" />
              <span className="text-sm">{formatDate(day.date)}</span>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-card">
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-primary flex items-center gap-2 mb-4">
              <Clock size={20} /> Manhã
            </h4>
            
            {day.morning.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {day.morning.map((poi, index) => (
                  <Link 
                    key={index}
                    to={navigateToPointOfInterest(poi)}
                    state={{ poi }}
                    className="border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="h-48 overflow-hidden">
                      <img src={poi.imageUrl} alt={poi.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="p-4">
                      <h5 className="font-semibold text-lg">{poi.name}</h5>
                      <p className="text-sm text-muted-foreground">{poi.type}</p>
                      
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock size={16} className="text-primary" />
                          <span>{poi.openingHours}</span>
                        </div>
                        {poi.ticketPrice && (
                          <div className="flex items-center gap-2 text-sm">
                            <Ticket size={16} className="text-primary" />
                            <span>{poi.ticketPrice}</span>
                          </div>
                        )}
                        {poi.address && (
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin size={16} className="text-primary" />
                            <span>{poi.address}</span>
                          </div>
                        )}
                        {poi.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone size={16} className="text-primary" />
                            <span>{poi.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground italic">Tempo livre para explorar a cidade.</p>
            )}
          </div>
          
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-accent flex items-center gap-2 mb-4">
              <Utensils size={20} /> Almoço
            </h4>
            
            {day.lunch ? (
              <Link 
                to={navigateToRestaurant(day.lunch)}
                state={{ poi: { ...day.lunch, type: 'Restaurante' } }}
                className="border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="md:flex">
                  <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
                    <img src={day.lunch.imageUrl} alt={day.lunch.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-4 md:w-2/3">
                    <div className="flex justify-between items-start">
                      <h5 className="font-semibold text-lg">{day.lunch.name}</h5>
                      <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-0.5 rounded text-sm font-medium">
                        {day.lunch.rating}
                        <Star className="h-3 w-3 fill-current" />
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{day.lunch.cuisine}</p>
                    <p className="text-sm text-muted-foreground">{day.lunch.priceLevel}</p>
                    
                    <div className="mt-3 space-y-2">
                      {day.lunch.address && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin size={16} className="text-accent" />
                          <span>{day.lunch.address}</span>
                        </div>
                      )}
                      
                      {day.lunch.openingHours && (
                        <div className="flex items-center gap-2 text-sm">
                          <Clock size={16} className="text-accent" />
                          <span>{day.lunch.openingHours}</span>
                        </div>
                      )}
                      
                      {day.lunch.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone size={16} className="text-accent" />
                          <span>{day.lunch.phone}</span>
                        </div>
                      )}
                      
                      {day.lunch.reviews && (
                        <div className="flex items-center gap-2 text-sm">
                          <Star size={16} className="text-accent" />
                          <span>{day.lunch.reviews} avaliações</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ) : (
              <p className="text-muted-foreground italic">Sugestão: explore restaurantes locais.</p>
            )}
          </div>
          
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-primary flex items-center gap-2 mb-4">
              <Clock size={20} /> Tarde
            </h4>
            
            {day.afternoon.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {day.afternoon.map((poi, index) => (
                  <Link 
                    key={index}
                    to={navigateToPointOfInterest(poi)}
                    state={{ poi }}
                    className="border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="h-48 overflow-hidden">
                      <img src={poi.imageUrl} alt={poi.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="p-4">
                      <h5 className="font-semibold text-lg">{poi.name}</h5>
                      <p className="text-sm text-muted-foreground">{poi.type}</p>
                      
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock size={16} className="text-primary" />
                          <span>{poi.openingHours}</span>
                        </div>
                        {poi.ticketPrice && (
                          <div className="flex items-center gap-2 text-sm">
                            <Ticket size={16} className="text-primary" />
                            <span>{poi.ticketPrice}</span>
                          </div>
                        )}
                        {poi.address && (
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin size={16} className="text-primary" />
                            <span>{poi.address}</span>
                          </div>
                        )}
                        {poi.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone size={16} className="text-primary" />
                            <span>{poi.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground italic">Tempo livre para explorar a cidade.</p>
            )}
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-accent flex items-center gap-2 mb-4">
              <Utensils size={20} /> Jantar
            </h4>
            
            {day.dinner ? (
              <Link 
                to={navigateToRestaurant(day.dinner)}
                state={{ poi: { ...day.dinner, type: 'Restaurante' } }}
                className="border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="md:flex">
                  <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
                    <img src={day.dinner.imageUrl} alt={day.dinner.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-4 md:w-2/3">
                    <div className="flex justify-between items-start">
                      <h5 className="font-semibold text-lg">{day.dinner.name}</h5>
                      <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-0.5 rounded text-sm font-medium">
                        {day.dinner.rating}
                        <Star className="h-3 w-3 fill-current" />
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{day.dinner.cuisine}</p>
                    <p className="text-sm text-muted-foreground">{day.dinner.priceLevel}</p>
                    
                    <div className="mt-3 space-y-2">
                      {day.dinner.address && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin size={16} className="text-accent" />
                          <span>{day.dinner.address}</span>
                        </div>
                      )}
                      
                      {day.dinner.openingHours && (
                        <div className="flex items-center gap-2 text-sm">
                          <Clock size={16} className="text-accent" />
                          <span>{day.dinner.openingHours}</span>
                        </div>
                      )}
                      
                      {day.dinner.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone size={16} className="text-accent" />
                          <span>{day.dinner.phone}</span>
                        </div>
                      )}
                      
                      {day.dinner.reviews && (
                        <div className="flex items-center gap-2 text-sm">
                          <Star size={16} className="text-accent" />
                          <span>{day.dinner.reviews} avaliações</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ) : (
              <p className="text-muted-foreground italic">Sugestão: explore restaurantes locais.</p>
            )}
          </div>
        </div>
      </div>
    );
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
          <div className="flex items-center mt-2 text-muted-foreground gap-2">
            <MapPin className="h-4 w-4" />
            <span>{trip.city}, {trip.country}</span>
          </div>
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
                ? formatDate(trip.start_date)
                : 'Data não definida'} 
              {' - '} 
              {trip.end_date
                ? formatDate(trip.end_date)
                : 'Data não definida'}
            </p>
            {numDays > 0 && (
              <p className="mt-2 text-sm text-primary font-medium">
                {numDays} {numDays === 1 ? 'dia' : 'dias'} de viagem
              </p>
            )}
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

        <Tabs defaultValue="roteiro" className="mb-8" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="roteiro">Roteiro</TabsTrigger>
            <TabsTrigger value="mapa">Mapa</TabsTrigger>
            <TabsTrigger value="lugares">Atrações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="roteiro" className="mt-6">
            {numDays > 0 ? (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Calendar className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold text-foreground">Roteiro de Viagem</h2>
                </div>
                
                {itinerary.length > 0 ? (
                  <div>
                    {itinerary.map(day => renderItineraryDay(day))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Roteiro em preparação</h3>
                    <p className="text-muted-foreground">
                      Estamos preparando seu roteiro personalizado. Por favor, tente novamente em alguns instantes.
                    </p>
                    {!dataLoaded && trip.country && trip.city && trip.start_date && trip.end_date && (
                      <div className="mt-4">
                        <Button 
                          onClick={() => {
                            const days = calculateDays(trip.start_date, trip.end_date);
                            loadAttractionsData(trip.country!, trip.city!, days);
                            setDataLoaded(true);
                            toast({
                              title: "Gerando roteiro",
                              description: "Seu roteiro está sendo gerado. Aguarde um momento.",
                            });
                          }}
                        >
                          Gerar Roteiro
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed border-border rounded-lg">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Sem datas definidas</h3>
                <p className="text-muted-foreground">
                  Para gerar um roteiro, defina as datas de início e fim da sua viagem.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="mapa" className="mt-6">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-6">
                <MapIcon className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Mapa de {trip.city}</h2>
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
          </TabsContent>
          
          <TabsContent value="lugares" className="mt-6">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <MapPin className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Atrações em {trip.city}</h2>
              </div>
              
              <h3 className="text-xl font-semibold mb-4">Pontos de Interesse</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {pointsOfInterest.map((poi, index) => (
                  <Link
                    key={index}
                    to={navigateToPointOfInterest(poi)}
                    state={{ poi }}
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
                      
                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-amber-400" />
                          <span className="text-sm">{poi.rating}</span>
                        </div>
                        {poi.openingHours && (
                          <div className="flex items-center gap-1 ml-3">
                            <Clock className="h-4 w-4 text-primary" />
                            <span className="text-xs text-muted-foreground">{poi.openingHours}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              <h3 className="text-xl font-semibold mb-4 mt-10">Restaurantes</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {restaurants.map((restaurant, index) => (
                  <Link
                    key={index}
                    to={navigateToRestaurant(restaurant)}
                    state={{ poi: { ...restaurant, type: 'Restaurante' } }}
                    className="bg-card rounded-lg shadow border border-border overflow-hidden hover:shadow-lg transition-shadow"
                  >
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
                      <h3 className="font-semibold text-foreground">{restaurant.name}</h3>
                      <div className="flex items-center mt-1">
                        <Star className="h-4 w-4 text-amber-400" />
                        <span className="text-sm ml-1">{restaurant.rating}</span>
                        <span className="mx-2 text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">{restaurant.cuisine}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{restaurant.priceLevel}</p>
                      {restaurant.address && (
                        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{restaurant.address}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TripDetails;
