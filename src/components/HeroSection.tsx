
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

// Imagens de capitais do mundo para uso aleatório
const capitalImages = [
  "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop", // Paris
  "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?q=80&w=2070&auto=format&fit=crop", // Londres
  "https://images.unsplash.com/photo-1522083165195-3424ed129620?q=80&w=2070&auto=format&fit=crop", // Tóquio
  "https://images.unsplash.com/photo-1534430480872-3498386e7856?q=80&w=2070&auto=format&fit=crop", // Nova York
  "https://images.unsplash.com/photo-1577334928618-2f7402b70b4c?q=80&w=2071&auto=format&fit=crop", // Roma
  "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2070&auto=format&fit=crop", // Sidney
  "https://images.unsplash.com/photo-1597534458220-9fb4969f2df5?q=80&w=2069&auto=format&fit=crop", // Lisboa
  "https://images.unsplash.com/photo-1560455310-57cf2676a8f9?q=80&w=2071&auto=format&fit=crop", // Berlim
  "https://images.unsplash.com/photo-1589352757699-28891ca59104?q=80&w=2070&auto=format&fit=crop", // Madri
  "https://images.unsplash.com/photo-1549996154-d8061c91acb8?q=80&w=2070&auto=format&fit=crop", // São Paulo
];

export const HeroSection = () => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  useEffect(() => {
    // Seleciona uma imagem aleatória das capitais
    const randomIndex = Math.floor(Math.random() * capitalImages.length);
    setBackgroundImage(capitalImages[randomIndex]);
  }, []);

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Imagem de fundo */}
      {backgroundImage && (
        <div 
          className="absolute inset-0 bg-image-fade-in" 
          style={{ 
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>
      )}
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in drop-shadow-lg">
          Find out. Plan. Travel with magic!
        </h1>
        <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto animate-slide-up drop-shadow-md">
          Crie roteiros detalhados, controle despesas e visualize suas aventuras
          com nossa plataforma intuitiva de planejamento de viagens.
        </p>
        <a
          href="/trips/new"
          className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200 animate-slide-up shadow-lg"
        >
          Começar a Planejar
          <ArrowRight className="ml-2" size={20} />
        </a>
      </div>
    </div>
  );
};
