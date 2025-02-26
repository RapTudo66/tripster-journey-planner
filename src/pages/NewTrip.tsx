
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

const NewTrip = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [tripName, setTripName] = useState("");
  const [numPeople, setNumPeople] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para criar uma viagem",
        variant: "destructive",
      });
      return;
    }

    if (!tripName || !numPeople) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    const newTrip = {
      user_id: user.id,
      name: tripName,
      num_people: parseInt(numPeople),
    };

    const { data, error } = await supabase
      .from('trips')
      .insert([newTrip])
      .select()
      .single();

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível criar a viagem",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Viagem criada",
      description: "Sua viagem foi criada com sucesso",
    });

    // Redireciona para a página de despesas com o ID da viagem
    navigate(`/expenses?trip=${data.id}`);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-xl mx-auto">
          <h1 className="text-3xl font-bold text-neutral-800 mb-8">Nova Viagem</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
            <div className="space-y-2">
              <Label htmlFor="tripName">Nome da Viagem</Label>
              <Input
                id="tripName"
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                placeholder="Ex: Viagem a Paris"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numPeople">Número de Pessoas</Label>
              <Select value={numPeople} onValueChange={setNumPeople} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o número de pessoas" />
                </SelectTrigger>
                <SelectContent>
                  {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} pessoas
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full">
              Criar Viagem e Adicionar Despesas
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewTrip;
