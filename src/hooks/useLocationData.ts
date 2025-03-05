
import { useState, useEffect } from 'react';
import { fetchCountries, fetchCitiesByCountry, CountryData, CityData } from '../services/locationService';
import { useToast } from '@/components/ui/use-toast';

export const useLocationData = () => {
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('');
  const [cities, setCities] = useState<CityData[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  // Carregar países ao montar o componente
  useEffect(() => {
    const loadCountries = async () => {
      setIsLoadingCountries(true);
      setErrorMessage(null);
      try {
        const data = await fetchCountries();
        if (data.length === 0) {
          setErrorMessage('Não foi possível carregar a lista de países.');
          toast({
            title: 'Erro',
            description: 'Não foi possível carregar a lista de países.',
            variant: 'destructive',
          });
        } else {
          setCountries(data);
        }
      } catch (error) {
        console.error('Error in useLocationData:', error);
        setErrorMessage('Erro ao carregar países.');
        toast({
          title: 'Erro',
          description: 'Falha ao carregar dados de países.',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingCountries(false);
      }
    };

    loadCountries();
  }, [toast]);

  // Carregar cidades quando o país selecionado mudar
  useEffect(() => {
    if (!selectedCountryCode) {
      setCities([]);
      return;
    }

    const loadCities = async () => {
      setIsLoadingCities(true);
      setErrorMessage(null);
      try {
        const data = await fetchCitiesByCountry(selectedCountryCode);
        if (data.length === 0) {
          toast({
            title: 'Aviso',
            description: 'Não foram encontradas cidades para este país.',
          });
        }
        setCities(data);
      } catch (error) {
        console.error('Error loading cities:', error);
        setErrorMessage('Erro ao carregar cidades.');
        toast({
          title: 'Erro',
          description: 'Falha ao carregar dados de cidades.',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingCities(false);
      }
    };

    loadCities();
  }, [selectedCountryCode, toast]);

  // Função para atualizar o país selecionado
  const handleCountryChange = (countryName: string) => {
    setSelectedCountry(countryName);
    setSelectedCity('');
    
    const country = countries.find(c => c.name === countryName);
    if (country) {
      setSelectedCountryCode(country.code);
    } else {
      setSelectedCountryCode('');
    }
  };

  // Função para atualizar a cidade selecionada
  const handleCityChange = (cityName: string) => {
    setSelectedCity(cityName);
  };

  return {
    countries,
    cities,
    selectedCountry,
    selectedCity,
    isLoadingCountries,
    isLoadingCities,
    errorMessage,
    handleCountryChange,
    handleCityChange,
  };
};
