
import React from 'react';
import { City, getCityByName } from '@/utils/locationData';

interface CityAttractionsProps {
  country: string;
  city: string;
}

export const CityAttractions = ({ country, city }: CityAttractionsProps) => {
  const cityData = getCityByName(country, city);

  if (!cityData) {
    return <div className="text-muted-foreground">Nenhuma cidade selecionada</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-card p-4 rounded-lg border border-border">
        <h3 className="text-lg font-medium mb-3">Pontos de Interesse</h3>
        <ul className="space-y-1">
          {cityData.pointsOfInterest.map((poi, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block mt-2"></span>
              <span>{poi}</span>
            </li>
          ))}
        </ul>
      </div>
      
      {cityData.restaurants && cityData.restaurants.length > 0 && (
        <div className="bg-card p-4 rounded-lg border border-border">
          <h3 className="text-lg font-medium mb-3">Restaurantes Recomendados</h3>
          <ul className="space-y-1">
            {cityData.restaurants.map((restaurant, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 inline-block mt-2"></span>
                <span>{restaurant}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
