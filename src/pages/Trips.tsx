
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Users, Plane } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface Trip {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  num_people: number;
  created_at: string;
}

const Trips = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadTrips();
    }
  }, [user]);

  const loadTrips = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading trips:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as viagens",
        variant: "destructive",
      });
      return;
    }

    setTrips(data || []);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-800">Minhas Viagens</h1>
          <Link to="/trips/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Viagem
            </Button>
          </Link>
        </div>
        
        {trips.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-neutral-600 text-center">Ainda não há viagens cadastradas.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <div key={trip.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-neutral-800">{trip.title}</h2>
                    <Plane className="h-5 w-5 text-neutral-500" />
                  </div>
                  <p className="text-neutral-600 mb-4 line-clamp-2">{trip.description}</p>
                  <div className="space-y-2 text-sm text-neutral-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(trip.start_date).toLocaleDateString('pt-BR')} - {new Date(trip.end_date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{trip.num_people} pessoa{trip.num_people !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <Link to={`/trips/${trip.id}`}>
                      <Button variant="outline">Ver Detalhes</Button>
                    </Link>
                    <Link to={`/expenses?trip=${trip.id}`}>
                      <Button>Gerenciar Despesas</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Trips;
