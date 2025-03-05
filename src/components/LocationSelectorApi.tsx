
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Globe, MapPin, Loader2 } from "lucide-react";
import { useLocationData } from '@/hooks/useLocationData';
import { Skeleton } from '@/components/ui/skeleton';

interface LocationSelectorApiProps {
  onCountryChange: (country: string) => void;
  onCityChange: (city: string) => void;
  selectedCountry: string;
  selectedCity: string;
  disabled?: boolean;
}

export const LocationSelectorApi = ({
  onCountryChange,
  onCityChange,
  selectedCountry,
  selectedCity,
  disabled = false
}: LocationSelectorApiProps) => {
  const {
    countries,
    cities,
    isLoadingCountries,
    isLoadingCities,
    handleCountryChange,
    handleCityChange,
  } = useLocationData();

  // Atualizar o estado local e propagar para o componente pai
  const handleLocalCountryChange = (countryName: string) => {
    handleCountryChange(countryName);
    onCountryChange(countryName);
  };

  const handleLocalCityChange = (cityName: string) => {
    handleCityChange(cityName);
    onCityChange(cityName);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>País</Label>
        {isLoadingCountries ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <Select
            value={selectedCountry}
            onValueChange={handleLocalCountryChange}
            disabled={disabled || isLoadingCountries}
          >
            <SelectTrigger className="w-full border-input pl-9">
              <Globe className="h-4 w-4 text-muted-foreground absolute left-3" />
              <SelectValue placeholder="Selecione o país" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {countries.sort((a, b) => a.name.localeCompare(b.name)).map((country) => (
                <SelectItem key={country.code} value={country.name}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
      
      <div className="space-y-2">
        <Label>Cidade</Label>
        {isLoadingCities ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <Select
            value={selectedCity}
            onValueChange={handleLocalCityChange}
            disabled={disabled || !selectedCountry || isLoadingCities}
          >
            <SelectTrigger className="w-full border-input pl-9">
              {isLoadingCities ? (
                <Loader2 className="h-4 w-4 text-muted-foreground absolute left-3 animate-spin" />
              ) : (
                <MapPin className="h-4 w-4 text-muted-foreground absolute left-3" />
              )}
              <SelectValue placeholder="Selecione a cidade" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {cities.map((city) => (
                <SelectItem key={city.name} value={city.name}>
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
};
