
export interface City {
  name: string;
  pointsOfInterest: string[];
}

export interface Country {
  name: string;
  cities: City[];
}

export const countries: Country[] = [
  {
    name: "Portugal",
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
      },
    ],
  },
  {
    name: "Espanha",
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
      },
    ],
  },
  {
    name: "França",
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
      },
    ],
  },
  {
    name: "Itália",
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
      },
    ],
  },
  {
    name: "Japão",
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
      },
    ],
  },
];

export const getCountryByName = (countryName: string): Country | undefined => {
  return countries.find(country => country.name === countryName);
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
