export interface City {
  name: string;
  pointsOfInterest: string[];
  restaurants?: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Country {
  name: string;
  code: string;
  cities: City[];
}

// Helper function to generate generic city data
const generateGenericCities = (countryName: string): City[] => {
  const capitalCity: City = {
    name: `Capital de ${countryName}`,
    pointsOfInterest: [
      "Centro Histórico",
      "Museu Nacional",
      "Praça Principal",
      "Catedral",
      "Parque Central",
      "Mercado Local"
    ],
    restaurants: [
      "Restaurante Tradicional",
      "Café Central",
      "Bistrô Local",
      "Restaurante Gourmet",
      "Bar Típico"
    ],
    coordinates: { lat: 0, lng: 0 } // Placeholder coordinates
  };

  const secondCity: City = {
    name: `Cidade Turística de ${countryName}`,
    pointsOfInterest: [
      "Praia Principal",
      "Rua de Compras",
      "Fortaleza Histórica",
      "Mirante Panorâmico",
      "Porto Marítimo",
      "Zona Turística"
    ],
    restaurants: [
      "Restaurante à Beira-Mar",
      "Bar Noturno",
      "Cafeteria Vista Mar",
      "Pizzaria Popular",
      "Restaurante de Frutos do Mar"
    ],
    coordinates: { lat: 0.1, lng: 0.1 } // Placeholder coordinates
  };

  const thirdCity: City = {
    name: `Cidade Cultural de ${countryName}`,
    pointsOfInterest: [
      "Teatro Municipal",
      "Galeria de Arte",
      "Biblioteca Central",
      "Museu de História",
      "Universidade",
      "Centro Cultural"
    ],
    restaurants: [
      "Café Literário",
      "Restaurante Vegano",
      "Bistrô Artístico",
      "Pub Cultural",
      "Cafeteria da Universidade"
    ],
    coordinates: { lat: 0.2, lng: 0.2 } // Placeholder coordinates
  };

  return [capitalCity, secondCity, thirdCity];
};

// Original predefined countries data
export const countries: Country[] = [
  {
    name: "Portugal",
    code: "PT",
    cities: [
      {
        name: "Lisboa",
        pointsOfInterest: [
          "Torre de Belém",
          "Mosteiro dos Jerónimos",
          "Praça do Comércio",
          "Castelo de São Jorge",
          "Time Out Market",
          "Oceanário de Lisboa",
          "Alfama",
          "Bairro Alto",
        ],
        restaurants: [
          "Belcanto",
          "Time Out Market Lisboa",
          "Cervejaria Ramiro",
          "Pastéis de Belém",
          "A Cevicheria",
          "O Talho",
        ],
        coordinates: { lat: 38.7223, lng: -9.1393 }
      },
      {
        name: "Porto",
        pointsOfInterest: [
          "Ponte Dom Luís I",
          "Livraria Lello",
          "Ribeira",
          "Palácio da Bolsa",
          "Clérigos",
          "Caves do Vinho do Porto",
          "Casa da Música",
        ],
        restaurants: [
          "Cantinho 32",
          "Casa Guedes",
          "DOP",
          "The Yeatman",
          "Café Santiago",
          "Café Majestic",
        ],
        coordinates: { lat: 41.1579, lng: -8.6291 }
      },
      {
        name: "Faro",
        pointsOfInterest: [
          "Cidade Velha",
          "Praia de Faro",
          "Ria Formosa",
          "Ilha Deserta",
          "Catedral de Faro",
          "Marina de Faro",
        ],
        restaurants: [
          "Faz Gostos",
          "Se7e Pedras",
          "Estaminé",
          "O Paquete",
          "Tertúlia Algarvia",
          "A Tasca do Ricky",
        ],
        coordinates: { lat: 37.0193, lng: -7.9304 }
      },
    ],
  },
  {
    name: "Espanha",
    code: "ES",
    cities: [
      {
        name: "Madrid",
        pointsOfInterest: [
          "Museu do Prado",
          "Parque do Retiro",
          "Palácio Real",
          "Plaza Mayor",
          "Puerta del Sol",
          "Estádio Santiago Bernabéu",
          "Mercado San Miguel",
        ],
        coordinates: { lat: 40.4168, lng: -3.7038 }
      },
      {
        name: "Barcelona",
        pointsOfInterest: [
          "Sagrada Família",
          "Park Güell",
          "Casa Batlló",
          "La Rambla",
          "Bairro Gótico",
          "Camp Nou",
          "Praia de Barceloneta",
        ],
        coordinates: { lat: 41.3851, lng: 2.1734 }
      },
      {
        name: "Sevilha",
        pointsOfInterest: [
          "Alcázar de Sevilha",
          "Catedral de Sevilha",
          "Giralda",
          "Plaza de España",
          "Bairro de Santa Cruz",
          "Torre del Oro",
        ],
        coordinates: { lat: 37.3891, lng: -5.9845 }
      },
    ],
  },
  {
    name: "França",
    code: "FR",
    cities: [
      {
        name: "Paris",
        pointsOfInterest: [
          "Torre Eiffel",
          "Museu do Louvre",
          "Notre-Dame",
          "Arco do Triunfo",
          "Montmartre",
          "Jardim de Luxemburgo",
          "Disneyland Paris",
        ],
        coordinates: { lat: 48.8566, lng: 2.3522 }
      },
      {
        name: "Lyon",
        pointsOfInterest: [
          "Basílica de Notre-Dame de Fourvière",
          "Vieux Lyon",
          "Place Bellecour",
          "Parc de la Tête d'Or",
          "Museu de Belas Artes",
          "Les Halles de Lyon Paul Bocuse",
        ],
        coordinates: { lat: 45.7640, lng: 4.8357 }
      },
      {
        name: "Nice",
        pointsOfInterest: [
          "Promenade des Anglais",
          "Vieux Nice",
          "Colina do Castelo",
          "Museu Matisse",
          "Place Masséna",
          "Mercado de Cours Saleya",
        ],
        coordinates: { lat: 43.7102, lng: 7.2620 }
      },
    ],
  },
  {
    name: "Itália",
    code: "IT",
    cities: [
      {
        name: "Roma",
        pointsOfInterest: [
          "Coliseu",
          "Fórum Romano",
          "Vaticano",
          "Fontana di Trevi",
          "Panteão",
          "Villa Borghese",
          "Piazza Navona",
        ],
        coordinates: { lat: 41.9028, lng: 12.4964 }
      },
      {
        name: "Veneza",
        pointsOfInterest: [
          "Praça São Marcos",
          "Basílica de São Marcos",
          "Ponte de Rialto",
          "Grande Canal",
          "Palácio Ducal",
          "Ilha de Murano",
          "Ponte dos Suspiros",
        ],
        coordinates: { lat: 45.4408, lng: 12.3155 }
      },
      {
        name: "Florença",
        pointsOfInterest: [
          "Catedral de Santa Maria del Fiore",
          "Galeria Uffizi",
          "Ponte Vecchio",
          "Palazzo Vecchio",
          "Galeria da Academia",
          "Jardins de Boboli",
        ],
        coordinates: { lat: 43.7696, lng: 11.2558 }
      },
    ],
  },
  {
    name: "Japão",
    code: "JP",
    cities: [
      {
        name: "Tóquio",
        pointsOfInterest: [
          "Torre de Tóquio",
          "Templo Senso-ji",
          "Palácio Imperial",
          "Shibuya Crossing",
          "Parque Ueno",
          "Akihabara",
          "Harajuku",
        ],
        coordinates: { lat: 35.6762, lng: 139.6503 }
      },
      {
        name: "Quioto",
        pointsOfInterest: [
          "Templo Kinkaku-ji (Pavilhão Dourado)",
          "Floresta de Bambu de Arashiyama",
          "Fushimi Inari Taisha",
          "Palácio Imperial de Quioto",
          "Distrito de Gion",
          "Templo Kiyomizu-dera",
        ],
        coordinates: { lat: 35.0116, lng: 135.7681 }
      },
      {
        name: "Osaka",
        pointsOfInterest: [
          "Castelo de Osaka",
          "Dotonbori",
          "Aquário Kaiyukan",
          "Universal Studios Japan",
          "Umeda Sky Building",
          "Shinsekai",
        ],
        coordinates: { lat: 34.6937, lng: 135.5023 }
      },
    ],
  },
];

// Extended list of countries with automatically generated cities
export const extendedCountries: Country[] = [
  ...countries,
  { name: "Alemanha", code: "DE", cities: generateGenericCities("Alemanha") },
  { name: "China", code: "CN", cities: generateGenericCities("China") },
  { name: "Canadá", code: "CA", cities: generateGenericCities("Canadá") },
  { name: "Austrália", code: "AU", cities: generateGenericCities("Austrália") },
  { name: "Argentina", code: "AR", cities: generateGenericCities("Argentina") },
  { name: "México", code: "MX", cities: generateGenericCities("México") },
  { name: "Suíça", code: "CH", cities: generateGenericCities("Suíça") },
  { name: "Egito", code: "EG", cities: generateGenericCities("Egito") },
  { name: "Índia", code: "IN", cities: generateGenericCities("Índia") },
  { name: "Tailândia", code: "TH", cities: generateGenericCities("Tailândia") },
  { name: "Coreia do Sul", code: "KR", cities: generateGenericCities("Coreia do Sul") },
  { name: "África do Sul", code: "ZA", cities: generateGenericCities("África do Sul") },
  { name: "Marrocos", code: "MA", cities: generateGenericCities("Marrocos") },
  { name: "Emirados Árabes Unidos", code: "AE", cities: generateGenericCities("Emirados Árabes Unidos") },
  { name: "Nova Zelândia", code: "NZ", cities: generateGenericCities("Nova Zelândia") },
  { name: "Grécia", code: "GR", cities: generateGenericCities("Grécia") },
  { name: "Holanda", code: "NL", cities: generateGenericCities("Holanda") },
  { name: "Suécia", code: "SE", cities: generateGenericCities("Suécia") },
  { name: "Noruega", code: "NO", cities: generateGenericCities("Noruega") },
  { name: "Dinamarca", code: "DK", cities: generateGenericCities("Dinamarca") },
  { name: "Finlândia", code: "FI", cities: generateGenericCities("Finlândia") },
  { name: "Bélgica", code: "BE", cities: generateGenericCities("Bélgica") },
  { name: "Áustria", code: "AT", cities: generateGenericCities("Áustria") },
  { name: "Turquia", code: "TR", cities: generateGenericCities("Turquia") },
  { name: "Irlanda", code: "IE", cities: generateGenericCities("Irlanda") },
  { name: "Rússia", code: "RU", cities: generateGenericCities("Rússia") },
  { name: "Polônia", code: "PL", cities: generateGenericCities("Polônia") },
  { name: "República Tcheca", code: "CZ", cities: generateGenericCities("República Tcheca") },
  { name: "Hungria", code: "HU", cities: generateGenericCities("Hungria") },
  { name: "Croácia", code: "HR", cities: generateGenericCities("Croácia") },
  { name: "Peru", code: "PE", cities: generateGenericCities("Peru") },
  { name: "Chile", code: "CL", cities: generateGenericCities("Chile") },
  { name: "Colômbia", code: "CO", cities: generateGenericCities("Colômbia") },
  { name: "Uruguai", code: "UY", cities: generateGenericCities("Uruguai") },
  { name: "Indonésia", code: "ID", cities: generateGenericCities("Indonésia") },
  { name: "Malásia", code: "MY", cities: generateGenericCities("Malásia") },
  { name: "Vietnã", code: "VN", cities: generateGenericCities("Vietnã") },
  { name: "Singapura", code: "SG", cities: generateGenericCities("Singapura") },
  { name: "Israel", code: "IL", cities: generateGenericCities("Israel") },
  { name: "Jordânia", code: "JO", cities: generateGenericCities("Jordânia") },
];

export const getCountryByName = (countryName: string): Country | undefined => {
  // First check in the original countries list
  const countryFromOriginal = countries.find(country => country.name === countryName);
  if (countryFromOriginal) return countryFromOriginal;
  
  // Then check in the extended countries list
  return extendedCountries.find(country => country.name === countryName);
};

export const getCityByName = (countryName: string, cityName: string): City | undefined => {
  const country = getCountryByName(countryName);
  if (!country) return undefined;
  return country.cities.find(city => city.name === cityName);
};

export const getCitiesByCountry = (countryName: string): City[] => {
  const country = getCountryByName(countryName);
  return country ? country.cities : [];
};

// Dados detalhados sobre pontos de interesse (usado na página TripDetails)
export const getPointsOfInterestForCity = (countryName: string, cityName: string): any[] => {
  const city = getCityByName(countryName, cityName);
  if (!city) return [];
  
  const cityId = cityIds[cityName] || cityName.toLowerCase().replace(/\s+/g, '-');
  
  switch (cityId) {
    case "lisbon":
      return [
        {
          name: "Torre de Belém",
          type: "Monumento",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Belem_Tower_at_night%2C_Lisbon_%282%29.jpg/1200px-Belem_Tower_at_night%2C_Lisbon_%282%29.jpg",
          location: { lat: 38.6916, lng: -9.2164 },
          address: "Av. Brasília, 1400-038 Lisboa"
        },
        {
          name: "Mosteiro dos Jerónimos",
          type: "Monumento",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Jeronimos_monatary.jpg/1200px-Jeronimos_monatary.jpg",
          location: { lat: 38.6979, lng: -9.2068 },
          address: "Praça do Império, 1400-206 Lisboa"
        },
        {
          name: "Castelo de São Jorge",
          type: "Monumento",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Castelo_de_S._Jorge_em_Lisboa_%28129356643%29.jpeg/1200px-Castelo_de_S._Jorge_em_Lisboa_%28129356643%29.jpeg",
          location: { lat: 38.7139, lng: -9.1337 },
          address: "R. de Santa Cruz do Castelo, 1100-129 Lisboa"
        },
        {
          name: "Oceanário de Lisboa",
          type: "Atração",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Oceanario_Lisboa.jpg/1200px-Oceanario_Lisboa.jpg",
          location: { lat: 38.7633, lng: -9.0950 },
          address: "Esplanada Dom Carlos I, 1990-005 Lisboa"
        },
        {
          name: "Praça do Comércio",
          type: "Local Histórico",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Vista_da_Pra%C3%A7a_do_Com%C3%A9rcio_Lisboa.jpg/1200px-Vista_da_Pra%C3%A7a_do_Com%C3%A9rcio_Lisboa.jpg",
          location: { lat: 38.7075, lng: -9.1364 },
          address: "Praça do Comércio, 1100-148 Lisboa"
        }
      ];
    case "porto":
      return [
        {
          name: "Ponte Dom Luís I",
          type: "Monumento",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Bridge%2C_Porto.jpg/1200px-Bridge%2C_Porto.jpg",
          location: { lat: 41.1396, lng: -8.6093 },
          address: "Ponte Luiz I, Porto"
        },
        {
          name: "Livraria Lello",
          type: "Atração",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Escadaria_vermelha_livraria_Lello.jpg/800px-Escadaria_vermelha_livraria_Lello.jpg",
          location: { lat: 41.1473, lng: -8.6148 },
          address: "R. das Carmelitas 144, 4050-161 Porto"
        },
        {
          name: "Ribeira",
          type: "Bairro",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Ribeira%2C_Porto.jpg/1200px-Ribeira%2C_Porto.jpg",
          location: { lat: 41.1410, lng: -8.6131 },
          address: "Ribeira, Porto"
        },
        {
          name: "Caves do Vinho do Porto",
          type: "Atração",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Porto_wine_cellars_of_Vila_Nova_de_Gaia_%286937654864%29.jpg/1200px-Porto_wine_cellars_of_Vila_Nova_de_Gaia_%286937654864%29.jpg",
          location: { lat: 41.1387, lng: -8.6119 },
          address: "Vila Nova de Gaia, Porto"
        },
        {
          name: "Palácio da Bolsa",
          type: "Monumento",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Pal%C3%A1cio_da_Bolsa.jpg/1200px-Pal%C3%A1cio_da_Bolsa.jpg",
          location: { lat: 41.1414, lng: -8.6153 },
          address: "R. de Ferreira Borges, 4050-253 Porto"
        }
      ];
    case "paris":
      return [
        {
          name: "Torre Eiffel",
          type: "Monumento",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Tour_eiffel_at_sunrise_from_the_trocadero.jpg/800px-Tour_eiffel_at_sunrise_from_the_trocadero.jpg",
          location: { lat: 48.8584, lng: 2.2945 },
          address: "Champ de Mars, 5 Avenue Anatole France, 75007 Paris"
        },
        {
          name: "Museu do Louvre",
          type: "Museu",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Louvre_Museum_Wikimedia_Commons.jpg/1200px-Louvre_Museum_Wikimedia_Commons.jpg",
          location: { lat: 48.8606, lng: 2.3376 },
          address: "Rue de Rivoli, 75001 Paris"
        },
        {
          name: "Notre-Dame",
          type: "Monumento",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Cath%C3%A9drale_Notre-Dame_de_Paris%2C_20_March_2014.jpg/1200px-Cath%C3%A9drale_Notre-Dame_de_Paris%2C_20_March_2014.jpg",
          location: { lat: 48.8530, lng: 2.3499 },
          address: "6 Parvis Notre-Dame - Pl. Jean-Paul II, 75004 Paris"
        },
        {
          name: "Arco do Triunfo",
          type: "Monumento",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Arc_de_Triomphe_de_l%27%C3%89toile%2C_Paris_21_October_2010.jpg/1200px-Arc_de_Triomphe_de_l%27%C3%89toile%2C_Paris_21_October_2010.jpg",
          location: { lat: 48.8738, lng: 2.2950 },
          address: "Place Charles de Gaulle, 75008 Paris"
        },
        {
          name: "Museu d'Orsay",
          type: "Museu",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Musee_d%27Orsay_from_Right_Bank_Summer_2019.jpg/1200px-Musee_d%27Orsay_from_Right_Bank_Summer_2019.jpg",
          location: { lat: 48.8599, lng: 2.3266 },
          address: "1 Rue de la Légion d'Honneur, 75007 Paris"
        }
      ];
    // Adicione outros casos para as demais cidades

    default:
      // Para cidades sem dados específicos, geramos dados genéricos
      const coordinates = city?.coordinates || { lat: 0, lng: 0 };
      return city?.pointsOfInterest.map((poi, index) => {
        const { lat, lng } = coordinates;
        const offset = 0.01 * (index % 5); // Offset para espalhar no mapa
        
        return {
          name: poi,
          type: ["Monumento", "Museu", "Atração", "Local Histórico", "Parque"][index % 5],
          imageUrl: `https://source.unsplash.com/random/800x600/?${poi.toLowerCase().replace(/\s+/g, '-')}`,
          location: { 
            lat: lat + (offset * Math.cos(index)), 
            lng: lng + (offset * Math.sin(index)) 
          },
          address: `${poi}, ${cityName}, ${countryName}`
        };
      }) || [];
  }
};

// Dados detalhados sobre restaurantes (usado na página TripDetails)
export const getRestaurantsForCity = (countryName: string, cityName: string): any[] => {
  const city = getCityByName(countryName, cityName);
  if (!city || !city.restaurants) return [];
  
  const cityId = cityIds[cityName] || cityName.toLowerCase().replace(/\s+/g, '-');
  
  switch (cityId) {
    case "lisbon":
      return [
        {
          name: "Belcanto",
          rating: 4.8,
          cuisine: "Portuguesa Contemporânea",
          priceLevel: "€€€€",
          imageUrl: "https://media-cdn.tripadvisor.com/media/photo-s/17/f5/39/f7/belcanto-is-chef-jose.jpg",
          location: { lat: 38.7094, lng: -9.1421 },
          address: "R. Serpa Pinto 10A, 1200-026 Lisboa",
          reviews: 986
        },
        {
          name: "Time Out Market",
          rating: 4.6,
          cuisine: "Várias",
          priceLevel: "€€",
          imageUrl: "https://media-cdn.tripadvisor.com/media/photo-s/12/33/2d/d5/time-out-market-lisboa.jpg",
          location: { lat: 38.7067, lng: -9.1459 },
          address: "Av. 24 de Julho 49, 1200-479 Lisboa",
          reviews: 1432
        },
        {
          name: "Cervejaria Ramiro",
          rating: 4.7,
          cuisine: "Mariscos",
          priceLevel: "€€€",
          imageUrl: "https://media-cdn.tripadvisor.com/media/photo-s/11/01/a8/6c/photo4jpg.jpg",
          location: { lat: 38.7232, lng: -9.1357 },
          address: "Av. Almirante Reis 1, 1150-007 Lisboa",
          reviews: 2187
        },
        {
          name: "Pastéis de Belém",
          rating: 4.5,
          cuisine: "Café & Pastelaria",
          priceLevel: "€",
          imageUrl: "https://media-cdn.tripadvisor.com/media/photo-s/13/ef/de/b6/img-20180731-130120-largejpg.jpg",
          location: { lat: 38.6975, lng: -9.2030 },
          address: "R. de Belém 84-92, 1300-085 Lisboa",
          reviews: 3214
        }
      ];
    case "porto":
      return [
        {
          name: "Cantinho do Avillez",
          rating: 4.7,
          cuisine: "Portuguesa Contemporânea",
          priceLevel: "€€€",
          imageUrl: "https://media-cdn.tripadvisor.com/media/photo-s/10/04/25/72/main-dining-room.jpg",
          location: { lat: 41.1464, lng: -8.6152 },
          address: "R. de Mouzinho da Silveira 166, 4050-426 Porto",
          reviews: 876
        },
        {
          name: "Café Santiago",
          rating: 4.6,
          cuisine: "Portuguesa",
          priceLevel: "€€",
          imageUrl: "https://media-cdn.tripadvisor.com/media/photo-s/18/7a/ce/31/francesinha.jpg",
          location: { lat: 41.1465, lng: -8.6094 },
          address: "R. de Passos Manuel 226, 4000-382 Porto",
          reviews: 1245
        },
        {
          name: "Majestic Café",
          rating: 4.5,
          cuisine: "Café",
          priceLevel: "€€€",
          imageUrl: "https://media-cdn.tripadvisor.com/media/photo-s/13/17/a9/0d/the-beautiful-majestic.jpg",
          location: { lat: 41.1471, lng: -8.6071 },
          address: "R. de Santa Catarina 112, 4000-442 Porto",
          reviews: 2134
        },
        {
          name: "Casa Guedes",
          rating: 4.7,
          cuisine: "Sanduíches",
          priceLevel: "€",
          imageUrl: "https://media-cdn.tripadvisor.com/media/photo-s/15/8a/1c/b3/perfeita.jpg",
          location: { lat: 41.1480, lng: -8.6034 },
          address: "Praça dos Poveiros 130, 4000-393 Porto",
          reviews: 1678
        }
      ];
    // Adicione outros casos para as demais cidades
      
    default:
      // Para cidades sem dados específicos, geramos dados genéricos
      const coordinates = city?.coordinates || { lat: 0, lng: 0 };
      return city?.restaurants.map((restaurant, index) => {
        const { lat, lng } = coordinates;
        const offset = 0.01 * (index % 5); // Offset para espalhar no mapa
        const cuisines = ["Local", "Internacional", "Contemporânea", "Tradicional", "Fusion"];
        const prices = ["€", "€€", "€€€", "€€€€"];
        
        return {
          name: restaurant,
          rating: 4 + (index % 10) / 10,
          cuisine: `${cuisines[index % cuisines.length]} ${countryName}`,
          priceLevel: prices[index % prices.length],
          imageUrl: `https://source.unsplash.com/random/800x600/?restaurant,${restaurant.toLowerCase().replace(/\s+/g, '-')}`,
          location: { 
            lat: lat + (offset * Math.cos(index + 10)), 
            lng: lng + (offset * Math.sin(index + 10)) 
          },
          address: `${restaurant}, ${cityName}, ${countryName}`,
          reviews: 100 + (index * 83) % 900
        };
      }) || [];
  }
};
