
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Calendar, 
  Users, 
  Plane, 
  Trash2, 
  AlertCircle 
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Trip {
  id: string;
  title: string;
  description: string;
  start_date: string | null;
  end_date: string | null;
  num_people: number;
  created_at: string;
}

const Trips = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [deletingTripId, setDeletingTripId] = useState<string | null>(null);
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

  const handleDeleteTrip = async (tripId: string) => {
    if (!user) return;

    // Fechar o diálogo
    setDeletingTripId(null);

    // Deletar a viagem
    const { error: deleteError } = await supabase
      .from('trips')
      .delete()
      .eq('id', tripId);

    if (deleteError) {
      console.error('Error deleting trip:', deleteError);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a viagem",
        variant: "destructive",
      });
      return;
    }

    // Atualizar a lista de viagens
    await loadTrips();
    
    toast({
      title: "Viagem excluída",
      description: "A viagem foi excluída com sucesso",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Minhas Viagens</h1>
          <Link to="/trips/new">
            <Button className="bg-primary hover:bg-primary/90 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Nova Viagem
            </Button>
          </Link>
        </div>
        
        {trips.length === 0 ? (
          <div className="bg-card rounded-lg shadow p-6">
            <p className="text-muted-foreground text-center">Ainda não há viagens cadastradas.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <div key={trip.id} className="bg-card rounded-lg shadow hover:shadow-md transition-shadow border border-border">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-card-foreground">{trip.title}</h2>
                    <Plane className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-muted-foreground mb-4 line-clamp-2">{trip.description}</p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>
                        {trip.start_date 
                          ? new Date(trip.start_date).toLocaleDateString('pt-BR') 
                          : 'Data não definida'} 
                        {' - '} 
                        {trip.end_date 
                          ? new Date(trip.end_date).toLocaleDateString('pt-BR')
                          : 'Data não definida'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      <span>{trip.num_people} pessoa{trip.num_people !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex gap-2">
                      <Link to={`/trips/${trip.id}`}>
                        <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                          Ver Detalhes
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        className="border-destructive text-destructive hover:bg-destructive/10"
                        onClick={() => setDeletingTripId(trip.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Link to={`/expenses?trip=${trip.id}`}>
                      <Button className="bg-primary hover:bg-primary/90 text-white">
                        Gerenciar Despesas
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <AlertDialog open={!!deletingTripId} onOpenChange={(open) => !open && setDeletingTripId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                Confirmar exclusão
              </AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir esta viagem? Esta ação não pode ser desfeita e todas as despesas associadas a esta viagem também serão excluídas.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => deletingTripId && handleDeleteTrip(deletingTripId)}
                className="bg-destructive hover:bg-destructive/90"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Trips;
