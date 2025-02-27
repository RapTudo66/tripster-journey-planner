
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, MapPin } from "lucide-react";

const NewTrip = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [tripName, setTripName] = useState("");
  const [description, setDescription] = useState("");
  const [cityName, setCityName] = useState("");
  const [numPeople, setNumPeople] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [pointsOfInterest, setPointsOfInterest] = useState<string[]>([]);
  const [showPointsOfInterest, setShowPointsOfInterest] = useState(false);

  const handleCityChange = (city: string) => {
    setCityName(city);
    // Reset points of interest
    setPointsOfInterest([]);
    setShowPointsOfInterest(false);

    // If city is provided, show points of interest
    if (city.trim().length > 2) {
      // Simulate fetching points of interest
      // In a real app, this would be an API call
      setTimeout(() => {
        const mockPointsOfInterest = getMockPointsOfInterest(city);
        setPointsOfInterest(mockPointsOfInterest);
        setShowPointsOfInterest(true);
      }, 500);
    }
  };

  const getMockPointsOfInterest = (city: string) => {
    // This is a mockup, in a real app this would come from an API
    const cityLower = city.toLowerCase();
    
    if (cityLower.includes("lisboa") || cityLower.includes("lisbon")) {
      return [
        "Torre de Belém",
        "Mosteiro dos Jerónimos",
        "Praça do Comércio",
        "Castelo de São Jorge",
        "Time Out Market",
        "Oceanário de Lisboa",
        "Alfama",
        "Bairro Alto",
      ];
    } else if (cityLower.includes("porto")) {
      return [
        "Ponte Dom Luís I",
        "Livraria Lello",
        "Ribeira",
        "Palácio da Bolsa",
        "Clérigos",
        "Caves do Vinho do Porto",
        "Casa da Música"
      ];
    } else if (cityLower.includes("paris")) {
      return [
        "Torre Eiffel",
        "Museu do Louvre",
        "Notre-Dame",
        "Arco do Triunfo",
        "Montmartre",
        "Jardim de Luxemburgo",
        "Disneyland Paris"
      ];
    } else if (cityLower.includes("roma") || cityLower.includes("rome")) {
      return [
        "Coliseu",
        "Fórum Romano",
        "Vaticano",
        "Fontana di Trevi",
        "Panteão",
        "Villa Borghese",
        "Piazza Navona"
      ];
    } else if (cityLower.includes("madrid")) {
      return [
        "Museu do Prado",
        "Parque do Retiro",
        "Palácio Real",
        "Plaza Mayor",
        "Puerta del Sol",
        "Estádio Santiago Bernabéu",
        "Mercado San Miguel"
      ];
    } else {
      return [
        "Monumentos Históricos",
        "Museus",
        "Restaurantes típicos",
        "Parques e jardins",
        "Zonas comerciais",
        "Atividades ao ar livre"
      ];
    }
  };

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
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const newTrip = {
      user_id: user.id,
      title: tripName,
      description: description || `Viagem para ${tripName}`,
      num_people: parseInt(numPeople),
      start_date: startDate ? startDate.toISOString().split('T')[0] : null,
      end_date: endDate ? endDate.toISOString().split('T')[0] : null,
    };

    try {
      const { data, error } = await supabase
        .from('trips')
        .insert([newTrip])
        .select()
        .single();

      if (error) {
        console.error("Erro ao criar viagem:", error);
        toast({
          title: "Erro",
          description: "Não foi possível criar a viagem: " + error.message,
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
    } catch (error) {
      console.error("Erro ao criar viagem:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado ao criar a viagem",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-8">Nova Viagem</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg shadow border border-border">
            <div className="space-y-2">
              <Label htmlFor="tripName">Nome da Viagem</Label>
              <Input
                id="tripName"
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                placeholder="Ex: Viagem a Paris"
                required
                className="border-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Férias de verão em família"
                className="border-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cityName">Cidade</Label>
              <div className="relative">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-muted-foreground absolute left-3" />
                  <Input
                    id="cityName"
                    value={cityName}
                    onChange={(e) => handleCityChange(e.target.value)}
                    placeholder="Ex: Lisboa, Paris, Roma..."
                    className="pl-9 border-input"
                  />
                </div>
                
                {showPointsOfInterest && pointsOfInterest.length > 0 && (
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <h3 className="font-medium text-sm text-foreground mb-2">
                      Pontos de interesse em {cityName}:
                    </h3>
                    <ul className="space-y-1">
                      {pointsOfInterest.map((poi, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block"></span>
                          {poi}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data de Início</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal border-input"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                      {startDate ? (
                        format(startDate, "dd/MM/yyyy", { locale: ptBR })
                      ) : (
                        <span className="text-muted-foreground">Selecione uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Data de Término</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal border-input"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                      {endDate ? (
                        format(endDate, "dd/MM/yyyy", { locale: ptBR })
                      ) : (
                        <span className="text-muted-foreground">Selecione uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      disabled={(date) => startDate ? date < startDate : false}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="numPeople">Número de Pessoas</Label>
              <Select value={numPeople} onValueChange={setNumPeople} required>
                <SelectTrigger className="border-input">
                  <SelectValue placeholder="Selecione o número de pessoas" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? 'pessoa' : 'pessoas'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white">
              Criar Viagem e Adicionar Despesas
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewTrip;
