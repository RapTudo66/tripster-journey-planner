
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

const Trips = () => {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-800">Minhas Viagens</h1>
          <Link to="/trips/new">
            <Button>
              <Plus className="h-4 w-4" />
              Nova Viagem
            </Button>
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-neutral-600">Ainda não há viagens cadastradas.</p>
        </div>
      </div>
    </div>
  );
};

export default Trips;
