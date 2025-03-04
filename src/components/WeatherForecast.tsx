
import { CalendarDays, CloudRain, CloudSun, Sun, Thermometer } from "lucide-react";
import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/components/ui/use-toast";

interface WeatherData {
  date: string;
  temperature: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

interface WeatherForecastProps {
  city: string;
  country: string;
  startDate: string;
  endDate: string;
}

// This is a mockup of weather data
const generateMockWeatherData = (startDate: string, endDate: string): WeatherData[] => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  const weatherTypes = [
    { description: 'Ensolarado', icon: 'sun', temp: { min: 25, max: 35 } },
    { description: 'Parcialmente nublado', icon: 'cloud-sun', temp: { min: 20, max: 30 } },
    { description: 'Nublado', icon: 'cloud', temp: { min: 18, max: 25 } },
    { description: 'Chuvoso', icon: 'cloud-rain', temp: { min: 15, max: 22 } },
  ];
  
  const result: WeatherData[] = [];
  
  for (let i = 0; i < days; i++) {
    const currentDate = new Date(start);
    currentDate.setDate(currentDate.getDate() + i);
    
    const weatherType = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
    const temperature = Math.floor(
      weatherType.temp.min + Math.random() * (weatherType.temp.max - weatherType.temp.min)
    );
    
    result.push({
      date: currentDate.toISOString().split('T')[0],
      temperature,
      description: weatherType.description,
      icon: weatherType.icon,
      humidity: Math.floor(40 + Math.random() * 45),
      windSpeed: Math.floor(5 + Math.random() * 20),
    });
  }
  
  return result;
};

const WeatherIcon = ({ icon }: { icon: string }) => {
  switch (icon) {
    case 'sun':
      return <Sun className="h-8 w-8 text-yellow-500" />;
    case 'cloud-sun':
      return <CloudSun className="h-8 w-8 text-blue-400" />;
    case 'cloud':
      return <CloudSun className="h-8 w-8 text-gray-400" />;
    case 'cloud-rain':
      return <CloudRain className="h-8 w-8 text-blue-600" />;
    default:
      return <Sun className="h-8 w-8 text-yellow-500" />;
  }
};

export const WeatherForecast = ({ city, country, startDate, endDate }: WeatherForecastProps) => {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // In a real app, we would fetch weather data from an API
    // For this mockup, we'll generate random weather data
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate mock data
        const data = generateMockWeatherData(startDate, endDate);
        setWeatherData(data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar a previsão do tempo",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (city && country && startDate && endDate) {
      fetchWeatherData();
    }
  }, [city, country, startDate, endDate]);

  if (loading) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">Carregando previsão do tempo...</p>
      </div>
    );
  }

  if (weatherData.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">Previsão do tempo não disponível</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow border border-border overflow-hidden">
      <div className="bg-primary text-white p-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          Previsão do Tempo para {city}, {country}
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <div className="inline-flex min-w-full">
          {weatherData.map((day, index) => (
            <div 
              key={index} 
              className="flex-shrink-0 w-[140px] p-4 text-center border-r border-border last:border-r-0"
            >
              <p className="font-medium mb-2">
                {format(parseISO(day.date), "EEE, dd MMM", { locale: ptBR })}
              </p>
              
              <div className="flex justify-center mb-2">
                <WeatherIcon icon={day.icon} />
              </div>
              
              <p className="font-bold text-lg mb-1">
                {day.temperature}°C
              </p>
              
              <p className="text-sm text-muted-foreground mb-3">
                {day.description}
              </p>
              
              <div className="text-xs text-muted-foreground space-y-1">
                <div className="flex items-center justify-center gap-1">
                  <Thermometer className="h-3 w-3" />
                  <span>Umidade: {day.humidity}%</span>
                </div>
                
                <div className="flex items-center justify-center gap-1">
                  <CloudSun className="h-3 w-3" />
                  <span>Vento: {day.windSpeed} km/h</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
