
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Link, useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Clock, Ticket, Info, Star, Share, Phone } from "lucide-react";
import { SocialMediaFeed } from "@/components/SocialMediaFeed";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PointOfInterestDetailProps {
  name: string;
  type: string;
  imageUrl: string;
  description?: string;
  address?: string;
  openingHours?: string;
  ticketPrice?: string;
  rating?: number;
  reviews?: number;
  images?: string[];
  videos?: string[];
  phone?: string;
  website?: string;
}

const PointOfInterestDetail = () => {
  const { id: tripId, poiId } = useParams<{ id: string; poiId: string }>();
  const location = useLocation();
  const [poi, setPoi] = useState<PointOfInterestDetailProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'info' | 'photos' | 'videos' | 'social'>('info');

  useEffect(() => {
    if (location.state?.poi) {
      setPoi(location.state.poi);
      setLoading(false);
    } else {
      // Fallback for when state is not passed - you could fetch from an API here
      setLoading(false);
    }
  }, [location.state]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <p className="text-muted-foreground">Carregando detalhes...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!poi) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">
              Ponto de interesse não encontrado
            </h1>
            <p className="mt-2 text-muted-foreground">
              O ponto de interesse solicitado não existe ou você não tem permissão para visualizá-lo.
            </p>
            <div className="mt-8">
              <Link to={`/trips/${tripId}`}>
                <Button>Voltar para Detalhes da Viagem</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mock additional images if none provided
  const allImages = poi.images || [
    poi.imageUrl,
    `https://source.unsplash.com/random/800x600/?${poi.type.toLowerCase()}`,
    `https://source.unsplash.com/random/800x600/?${poi.name.toLowerCase().replace(/\s+/g, "")}`,
    `https://source.unsplash.com/random/800x600/?tourism,${poi.type.toLowerCase()}`,
    `https://source.unsplash.com/random/800x600/?landmark,${poi.type.toLowerCase()}`
  ];

  // Mock videos if none provided
  const allVideos = poi.videos || [
    "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "https://www.youtube.com/embed/jNQXAC9IVRw"
  ];

  // Mock description if none provided
  const description = poi.description || 
    `${poi.name} é um dos pontos turísticos mais importantes da região. Localizado em um local de fácil acesso, 
    oferece uma experiência única para todos os visitantes. Com uma rica história e uma arquitetura impressionante, 
    é um lugar que não pode faltar em seu roteiro de viagem.
    
    Visite e descubra por que milhares de turistas escolhem este lugar todos os anos. Você encontrará exposições 
    fascinantes, espaços bem organizados e uma equipe profissional pronta para responder a todas as suas perguntas.`;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link to={`/trips/${tripId}`} className="inline-flex items-center text-primary hover:underline">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Voltar para detalhes da viagem
          </Link>
        </div>

        <div className="bg-card rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="h-[400px] relative">
            <img 
              src={poi.imageUrl} 
              alt={poi.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <div className="flex justify-between items-end">
                <div>
                  <span className="inline-block bg-primary/90 text-white px-3 py-1 rounded-full text-sm font-medium mb-2">
                    {poi.type}
                  </span>
                  <h1 className="text-3xl font-bold text-white">{poi.name}</h1>
                </div>
                {poi.rating && (
                  <div className="flex items-center gap-1 bg-yellow-500/90 text-white px-3 py-1 rounded-full">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="font-bold">{poi.rating}</span>
                    {poi.reviews && <span className="text-sm">({poi.reviews})</span>}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {poi.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-foreground">Endereço</h3>
                    <p className="text-muted-foreground">{poi.address}</p>
                  </div>
                </div>
              )}
              
              {poi.openingHours && (
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-foreground">Horário de Funcionamento</h3>
                    <p className="text-muted-foreground">{poi.openingHours}</p>
                  </div>
                </div>
              )}
              
              {poi.ticketPrice && (
                <div className="flex items-start gap-3">
                  <Ticket className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-foreground">Ingresso</h3>
                    <p className="text-muted-foreground">{poi.ticketPrice}</p>
                  </div>
                </div>
              )}

              {poi.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-foreground">Telefone</h3>
                    <p className="text-muted-foreground">{poi.phone}</p>
                  </div>
                </div>
              )}
            </div>

            <Tabs defaultValue="info" className="mb-6" onValueChange={(value) => setActiveTab(value as any)}>
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="info">Informações</TabsTrigger>
                <TabsTrigger value="photos">Fotos</TabsTrigger>
                <TabsTrigger value="videos">Vídeos</TabsTrigger>
                <TabsTrigger value="social">Redes Sociais</TabsTrigger>
              </TabsList>
              
              <TabsContent value="info" className="mt-6">
                <div className="prose max-w-none">
                  <div className="flex items-start gap-3 mb-4">
                    <Info className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                    <h2 className="text-xl font-bold text-foreground mt-0">Sobre {poi.name}</h2>
                  </div>
                  <div className="whitespace-pre-line text-muted-foreground">
                    {description}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="photos" className="mt-6">
                <h2 className="text-xl font-bold text-foreground mb-4">Galeria de Fotos</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allImages.map((img, index) => (
                    <div key={index} className="rounded-lg overflow-hidden h-48 bg-muted">
                      <img src={img} alt={`${poi.name} - imagem ${index + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="videos" className="mt-6">
                <h2 className="text-xl font-bold text-foreground mb-4">Vídeos</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {allVideos.map((videoUrl, index) => (
                    <div key={index} className="rounded-lg overflow-hidden h-72 bg-muted">
                      <iframe 
                        src={videoUrl} 
                        title={`${poi.name} - video ${index + 1}`}
                        className="w-full h-full" 
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="social" className="mt-6">
                <SocialMediaFeed location={poi.address?.split(",").pop()?.trim() || "Lisboa"} poiName={poi.name} />
              </TabsContent>
            </Tabs>

            <div className="flex justify-center mt-6">
              <Button variant="outline" className="flex items-center gap-2">
                <Share className="h-4 w-4" />
                Compartilhar
              </Button>
            </div>
          </div>
        </div>

        {poi.type === "Museu" && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-foreground mb-4">Exposições em Destaque</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-lg shadow border border-border overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={`https://source.unsplash.com/random/800x600/?museum,exhibit,${i}`} 
                      alt={`Exposição ${i}`} 
                      className="w-full h-full object-cover transition-transform hover:scale-105" 
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground">Exposição {i}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Uma exposição fascinante que apresenta artefatos históricos e obras de arte importantes.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">Atrações Relacionadas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-lg shadow border border-border overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={`https://source.unsplash.com/random/800x600/?attraction,${i}`} 
                    alt={`Atração Relacionada ${i}`} 
                    className="w-full h-full object-cover transition-transform hover:scale-105" 
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground">Atração Relacionada {i}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Outro ponto de interesse próximo que também vale a pena visitar durante sua viagem.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointOfInterestDetail;
