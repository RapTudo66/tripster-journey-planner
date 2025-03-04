
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

interface BackgroundImageProps {
  className?: string;
  specificCity?: string;
}

export const BackgroundImage = ({ className, specificCity }: BackgroundImageProps) => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  useEffect(() => {
    // Handle specific city cases
    if (specificCity) {
      switch(specificCity.toLowerCase()) {
        case 'madrid':
          setBackgroundImage("https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=2070&auto=format&fit=crop");
          break;
        case 'barcelona':
          setBackgroundImage("https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=2070&auto=format&fit=crop");
          break;
        case 'lisboa':
        case 'lisbon':
          setBackgroundImage("https://images.unsplash.com/photo-1597534458220-9fb4969f2df5?q=80&w=2069&auto=format&fit=crop");
          break;
        case 'paris':
          setBackgroundImage("https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop");
          break;
        case 'london':
        case 'londres':
          setBackgroundImage("https://images.unsplash.com/photo-1505761671935-60b3a7427bad?q=80&w=2070&auto=format&fit=crop");
          break;
        case 'rome':
        case 'roma':
          setBackgroundImage("https://images.unsplash.com/photo-1577334928618-2f7402b70b4c?q=80&w=2071&auto=format&fit=crop");
          break;
        default:
          // Seleciona uma imagem aleatória das capitais
          const randomIndex = Math.floor(Math.random() * capitalImages.length);
          setBackgroundImage(capitalImages[randomIndex]);
      }
    } else {
      // Se não foi especificada uma cidade, seleciona uma imagem aleatória
      const randomIndex = Math.floor(Math.random() * capitalImages.length);
      setBackgroundImage(capitalImages[randomIndex]);
    }
  }, [specificCity]);

  if (!backgroundImage) return null;

  return (
    <div 
      className={`absolute inset-0 z-0 bg-image-fade-in ${className}`} 
      style={{ 
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
    </div>
  );
};
