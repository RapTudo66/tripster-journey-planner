import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
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
import { CalendarIcon, AlertCircle } from "lucide-react";
import { City, getCitiesByCountry } from "@/utils/locationData";
import { LocationSelector } from "@/components/LocationSelector";
import { LocationSelectorApi } from "@/components/LocationSelectorApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

const calculateTripDuration = (startDate: Date | undefined, endDate: Date | undefined): number => {
  if (!startDate || !endDate) return 0;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays + 1; // Include both start and end days
};

const NewTrip = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [tripName, setTripName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [availableCities, setAvailableCities] = useState<City[]>([]);
  const [numPeople, setNumPeople] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [tripDuration, setTripDuration] = useState<number>(0);
  const [useApiData, setUseApiData] = useState<boolean>(true);

  useEffect(() => {
    if (selectedCountry && !useApiData) {
      setAvailableCities(getCitiesByCountry(selectedCountry));
      setSelectedCity("");
    } else {
      setAvailableCities([]);
    }
  }, [selectedCountry, useApiData]);

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
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

    if (!tripName || !numPeople || !selectedCountry || !selectedCity) {
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
      description: description || `Viagem para ${selectedCity}, ${selectedCountry}`,
      country: selectedCountry,
      city: selectedCity,
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

      navigate(`/trips/${data.id}`);
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

            {tripDuration > 0 && (
              <div className="p-3 bg-primary/10 rounded-md border border-primary/20">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                  <p className="text-sm font-medium text-primary">
                    Duração da viagem: {tripDuration} {tripDuration === 1 ? 'dia' : 'dias'}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-1 pl-7">
                  {tripDuration < 3 ? (
                    "Viagem curta: serão sugeridos apenas os principais pontos turísticos."
                  ) : tripDuration < 7 ? (
                    "Viagem média: bom equilíbrio entre atrações e tempo livre."
                  ) : (
                    "Viagem longa: roteiro detalhado com diversas atrações e experiências locais."
                  )}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between mb-2 p-2 bg-muted rounded">
              <span className="text-sm font-medium">Origem dos dados de localização:</span>
              <div className="flex items-center space-x-2">
                <Button 
                  type="button" 
                  variant={useApiData ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUseApiData(true)}
                >
                  API Externa
                </Button>
                <Button 
                  type="button" 
                  variant={!useApiData ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUseApiData(false)}
                >
                  Dados Locais
                </Button>
              </div>
            </div>

            {useApiData ? (
              <LocationSelectorApi
                selectedCountry={selectedCountry}
                selectedCity={selectedCity}
                onCountryChange={handleCountryChange}
                onCityChange={handleCityChange}
              />
            ) : (
              <LocationSelector
                selectedCountry={selectedCountry}
                selectedCity={selectedCity}
                onCountryChange={handleCountryChange}
                onCityChange={handleCityChange}
              />
            )}

            {selectedCity && selectedCountry && !useApiData && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h3 className="font-medium text-sm text-foreground mb-2">
                  Pontos de interesse em {selectedCity}:
                </h3>
                <ul className="space-y-1">
                  {availableCities
                    .find(city => city.name === selectedCity)
                    ?.pointsOfInterest.map((poi, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block"></span>
                        {poi}
                      </li>
                    ))}
                </ul>
              </div>
            )}

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

            {(!startDate || !endDate) && (
              <div className="flex items-center gap-2 p-3 bg-amber-50 rounded border border-amber-200 text-amber-800">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm">
                  Recomendamos definir as datas da viagem para gerar um roteiro adequado.
                </p>
              </div>
            )}

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white">
              Criar Viagem
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewTrip;
