
import { ArrowRight } from "lucide-react";

export const HeroSection = () => {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-light via-white to-accent-light">
      <div className="absolute inset-0 bg-grid-neutral-100/25 [mask-image:linear-gradient(to_bottom_right,white,transparent,white)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-neutral-800 mb-6 animate-fade-in">
          Plan Your Perfect Journey
        </h1>
        <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto animate-slide-up">
          Create detailed itineraries, track expenses, and visualize your adventures
          with our intuitive travel planning platform.
        </p>
        <a
          href="/trips/new"
          className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200 animate-slide-up"
        >
          Start Planning
          <ArrowRight className="ml-2" size={20} />
        </a>
      </div>
    </div>
  );
};
