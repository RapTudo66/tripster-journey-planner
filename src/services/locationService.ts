
// GeoDB Cities API service
// Documentação: https://rapidapi.com/wirefreethought/api/geodb-cities

import { extendedCountries, getCitiesByCountry } from "@/utils/locationData";

interface GeoDBCity {
  id: number;
  wikiDataId: string;
  type: string;
  city: string;
  name: string;
  country: string;
  countryCode: string;
  region: string;
  regionCode: string;
  latitude: number;
  longitude: number;
  population: number;
}

interface GeoDBResponse {
  data: GeoDBCity[];
  metadata: {
    currentOffset: number;
    totalCount: number;
  };
}

export interface CityData {
  name: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  population?: number;
}

export interface CountryData {
  name: string;
  code: string;
}

// NOTE: This API key appears to be invalid or not subscribed to the service
// For a production app, you would want to store this in an environment variable
const API_KEY = 'c9ad6c2e37msh59ee1c7c0522c31p1fd3f0jsn7fadf0b1b05c';
const API_HOST = 'wft-geo-db.p.rapidapi.com';
const BASE_URL = 'https://wft-geo-db.p.rapidapi.com/v1/geo';

const headers = {
  'X-RapidAPI-Key': API_KEY,
  'X-RapidAPI-Host': API_HOST,
};

// Function to get a list of countries from the API
// Falls back to local data if the API call fails
export const fetchCountries = async (): Promise<CountryData[]> => {
  try {
    const response = await fetch(`${BASE_URL}/countries?limit=50`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      console.error(`API error: ${response.status} - ${await response.text()}`);
      // If API fails, fallback to local data
      return getFallbackCountries();
    }

    const data = await response.json();
    return data.data.map((country: any) => ({
      name: country.name,
      code: country.code,
    }));
  } catch (error) {
    console.error('Error fetching countries:', error);
    // If an exception occurs, fallback to local data
    return getFallbackCountries();
  }
};

// Fallback function to return countries from our local data
const getFallbackCountries = (): CountryData[] => {
  return extendedCountries.map(country => ({
    name: country.name,
    code: country.code || country.name.substring(0, 2).toUpperCase(),
  }));
};

// Function to get cities for a country from the API
// Falls back to local data if the API call fails
export const fetchCitiesByCountry = async (countryCode: string): Promise<CityData[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/cities?countryIds=${countryCode}&minPopulation=100000&limit=10&sort=-population`,
      {
        method: 'GET',
        headers,
      }
    );

    if (!response.ok) {
      console.error(`API error: ${response.status} - ${await response.text()}`);
      // If API fails, fallback to local data
      return getFallbackCities(countryCode);
    }

    const data: GeoDBResponse = await response.json();
    return data.data.map((city) => ({
      name: city.city || city.name,
      country: city.country,
      countryCode: city.countryCode,
      latitude: city.latitude,
      longitude: city.longitude,
      population: city.population,
    }));
  } catch (error) {
    console.error(`Error fetching cities for country ${countryCode}:`, error);
    // If an exception occurs, fallback to local data
    return getFallbackCities(countryCode);
  }
};

// Fallback function to return cities from our local data
const getFallbackCities = (countryCode: string): CityData[] => {
  // First, find the country name from our local data
  const countryName = getCountryNameByCode(getFallbackCountries(), countryCode);
  
  if (!countryName) {
    return [];
  }
  
  // Then get cities for that country
  const cities = getCitiesByCountry(countryName);
  
  // Convert to CityData format
  return cities.map(city => ({
    name: city.name,
    country: countryName,
    countryCode: countryCode,
    latitude: city.latitude || 0,
    longitude: city.longitude || 0,
  }));
};

// Função para recuperar o código do país a partir do nome
export const getCountryCodeByName = (countries: CountryData[], countryName: string): string => {
  const country = countries.find(
    (c) => c.name.toLowerCase() === countryName.toLowerCase()
  );
  return country?.code || '';
};

// Função para recuperar o nome do país a partir do código
export const getCountryNameByCode = (countries: CountryData[], countryCode: string): string => {
  const country = countries.find(
    (c) => c.code.toLowerCase() === countryCode.toLowerCase()
  );
  return country?.name || '';
};
