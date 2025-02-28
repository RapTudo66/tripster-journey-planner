
import { ArrowRight } from "lucide-react";

export const HeroSection = () => {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-hero">
      <div className="absolute inset-0 bg-grid-neutral-100/25 [mask-image:linear-gradient(to_bottom_right,white,transparent,white)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <div className="flex justify-center mb-6">
          <img 
            src="/lovable-uploads/da70ed16-71b2-40f1-bdaa-2f2cf63b1175.png" 
            alt="Magic Route" 
            className="w-32 h-32 animate-fade-in"
          />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-secondary-foreground mb-6 animate-fade-in">
          Find out. Plan. Travel with magic!
        </h1>
        <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto animate-slide-up">
          Crie roteiros detalhados, controle despesas e visualize suas aventuras
          com nossa plataforma intuitiva de planejamento de viagens.
        </p>
        <a
          href="/trips/new"
          className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200 animate-slide-up"
        >
          Começar a Planejar
          <ArrowRight className="ml-2" size={20} />
        </a>
      </div>
    </div>
  );
};
