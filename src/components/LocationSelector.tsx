
import React, { useState, useEffect } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { City, extendedCountries, getCitiesByCountry } from "@/utils/locationData";
import { Globe, MapPin } from "lucide-react";

interface LocationSelectorProps {
  selectedCountry: string;
  selectedCity: string;
  onCountryChange: (country: string) => void;
  onCityChange: (city: string) => void;
  disabled?: boolean;
}

export const LocationSelector = ({
  selectedCountry,
  selectedCity,
  onCountryChange,
  onCityChange,
  disabled = false
}: LocationSelectorProps) => {
  const [availableCities, setAvailableCities] = useState<City[]>([]);

  useEffect(() => {
    if (selectedCountry) {
      setAvailableCities(getCitiesByCountry(selectedCountry));
    } else {
      setAvailableCities([]);
    }
  }, [selectedCountry]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>País</Label>
        <Select
          value={selectedCountry}
          onValueChange={onCountryChange}
          disabled={disabled}
        >
          <SelectTrigger className="w-full border-input pl-9">
            <Globe className="h-4 w-4 text-muted-foreground absolute left-3" />
            <SelectValue placeholder="Selecione o país" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {extendedCountries.sort((a, b) => a.name.localeCompare(b.name)).map((country) => (
              <SelectItem key={country.name} value={country.name}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label>Cidade</Label>
        <Select
          value={selectedCity}
          onValueChange={onCityChange}
          disabled={disabled || !selectedCountry}
        >
          <SelectTrigger className="w-full border-input pl-9">
            <MapPin className="h-4 w-4 text-muted-foreground absolute left-3" />
            <SelectValue placeholder="Selecione a cidade" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {availableCities.map((city) => (
              <SelectItem key={city.name} value={city.name}>
                {city.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
