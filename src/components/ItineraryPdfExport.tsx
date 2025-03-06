
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { ItineraryDay } from "@/lib/supabase/types";
import { formatDate } from "@/utils/dateUtils";
import { useToast } from "@/components/ui/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useEffect, useState } from "react";

interface Trip {
  id: string;
  title: string;
  description?: string;
  start_date?: string | null;
  end_date?: string | null;
  num_people: number;
  country?: string;
  city?: string;
}

interface ItineraryPdfExportProps {
  trip: Trip;
  itinerary: ItineraryDay[];
}

interface ImageCache {
  [key: string]: string;
}

export const ItineraryPdfExport = ({ trip, itinerary }: ItineraryPdfExportProps) => {
  const { toast } = useToast();
  const [imageCache, setImageCache] = useState<ImageCache>({});
  const [isExporting, setIsExporting] = useState(false);

  const attractionImageMap: Record<string, string> = {
    "Torre Eiffel": "/lovable-uploads/5afdc361-b902-4687-aee5-b875480642aa.png",
    "Museu do Louvre": "https://images.unsplash.com/photo-1565098772267-60af42b81ef2?auto=format&fit=crop&q=80&w=500&h=300",
    "Catedral de Notre-Dame": "https://images.unsplash.com/photo-1584266337025-b45ee5ea0e8f?auto=format&fit=crop&q=80&w=500&h=300",
    "Museu d'Orsay": "https://images.unsplash.com/photo-1587979931372-fc9e39ebda34?auto=format&fit=crop&q=80&w=500&h=300",
    "Palácio de Versalhes": "https://images.unsplash.com/photo-1551410224-699683e15636?auto=format&fit=crop&q=80&w=500&h=300",
    "Montmartre": "https://images.unsplash.com/photo-1555425748-831a8289f2c9?auto=format&fit=crop&q=80&w=500&h=300",
    "Sacré-Cœur": "https://images.unsplash.com/photo-1541484037724-b3a05b8a8b38?auto=format&fit=crop&q=80&w=500&h=300",
    "Arco do Triunfo": "https://images.unsplash.com/photo-1511739172509-0e5b94a8e9a9?auto=format&fit=crop&q=80&w=500&h=300",
    "Champs-Élysées": "https://images.unsplash.com/photo-1552308243-d8ceb9ce1ae2?auto=format&fit=crop&q=80&w=500&h=300",
    "Moulin Rouge": "https://images.unsplash.com/photo-1555636222-cae8c8ab2e2d?auto=format&fit=crop&q=80&w=500&h=300",
    "La Défense": "https://images.unsplash.com/photo-1593159426340-9396c3dc4ba3?auto=format&fit=crop&q=80&w=500&h=300",
    "Jardim de Luxemburgo": "https://images.unsplash.com/photo-1558177585-761f38c631bb?auto=format&fit=crop&q=80&w=500&h=300",
    "Catedral de Notre-Dame e Île de la Cité": "https://images.unsplash.com/photo-1584266337025-b45ee5ea0e8f?auto=format&fit=crop&q=80&w=500&h=300",
    "Passeio pelo Quartier Latin": "https://images.unsplash.com/photo-1551999570-57c3a9611984?auto=format&fit=crop&q=80&w=500&h=300",
    "Montmartre e Basílica de Sacré-Cœur": "https://images.unsplash.com/photo-1555425748-831a8289f2c9?auto=format&fit=crop&q=80&w=500&h=300",
    "Champs-Élysées e Arco do Triunfo": "https://images.unsplash.com/photo-1552308243-d8ceb9ce1ae2?auto=format&fit=crop&q=80&w=500&h=300",
    
    "Le Café Marly": "https://images.unsplash.com/photo-1560624052-3423b279830c?auto=format&fit=crop&q=80&w=500&h=300",
    "Le Procope": "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80&w=500&h=300",
    "Les Deux Magots": "https://images.unsplash.com/photo-1477763816053-7c86d5fa8db1?auto=format&fit=crop&q=80&w=500&h=300",
    "La Petite Venise": "https://images.unsplash.com/photo-1546530967-10442bc8e4d3?auto=format&fit=crop&q=80&w=500&h=300",
    "Le Train Bleu": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=500&h=300",
    "La Mère Catherine": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=500&h=300"
  };

  const fallbackImageMap = {
    attraction: "https://images.unsplash.com/photo-1558452919-08ae4aea8e29?auto=format&fit=crop&q=80&w=500&h=300",
    museum: "https://images.unsplash.com/photo-1503152889424-9c280f38cb1c?auto=format&fit=crop&q=80&w=500&h=300",
    restaurant: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=500&h=300",
    park: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&q=80&w=500&h=300",
    monument: "https://images.unsplash.com/photo-1552432552-06c0b0a94f08?auto=format&fit=crop&q=80&w=500&h=300",
    church: "https://images.unsplash.com/photo-1554232682-b9ef9c92f8de?auto=format&fit=crop&q=80&w=500&h=300"
  };

  const getCityImage = async (city: string, country: string): Promise<string> => {
    try {
      if (city.toLowerCase() === "paris") {
        return "/lovable-uploads/4766d627-1aec-4187-b6e3-b353bba4fce0.png";
      }
      
      const unsplashResponse = await fetch(
        `https://source.unsplash.com/1600x900/?${city},${country},landmark`
      );
      
      if (unsplashResponse.ok) {
        return unsplashResponse.url;
      }
      
      throw new Error('Failed to fetch image');
    } catch (error) {
      console.error('Error fetching city image:', error);
      return 'https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?auto=format&fit=crop&w=1600&h=900&q=80';
    }
  };

  const getImageForAttraction = async (name: string, category: string = 'attraction'): Promise<string> => {
    if (imageCache[name]) {
      return imageCache[name];
    }
    
    if (attractionImageMap[name]) {
      const imageUrl = attractionImageMap[name];
      setImageCache(prev => ({ ...prev, [name]: imageUrl }));
      return imageUrl;
    }
    
    let fallbackUrl = fallbackImageMap.attraction;
    
    if (name.toLowerCase().includes('museu') || name.toLowerCase().includes('museum')) {
      fallbackUrl = fallbackImageMap.museum;
    } else if (name.toLowerCase().includes('restaurante') || name.toLowerCase().includes('café') || 
               name.toLowerCase().includes('cafe') || name.toLowerCase().includes('restaurant')) {
      fallbackUrl = fallbackImageMap.restaurant;
    } else if (name.toLowerCase().includes('parque') || name.toLowerCase().includes('jardim') || 
               name.toLowerCase().includes('park') || name.toLowerCase().includes('garden')) {
      fallbackUrl = fallbackImageMap.park;
    } else if (name.toLowerCase().includes('igreja') || name.toLowerCase().includes('catedral') || 
               name.toLowerCase().includes('church') || name.toLowerCase().includes('cathedral')) {
      fallbackUrl = fallbackImageMap.church;
    } else if (name.toLowerCase().includes('monumento') || name.toLowerCase().includes('monument') || 
               name.toLowerCase().includes('palácio') || name.toLowerCase().includes('palace')) {
      fallbackUrl = fallbackImageMap.monument;
    }
    
    setImageCache(prev => ({ ...prev, [name]: fallbackUrl }));
    return fallbackUrl;
  };

  const loadImageAsDataUrl = async (url: string): Promise<string> => {
    try {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      
      return new Promise((resolve, reject) => {
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const dataUrl = canvas.toDataURL('image/jpeg');
            resolve(dataUrl);
          } else {
            reject(new Error('Failed to get canvas context'));
          }
        };
        
        img.onerror = () => {
          reject(new Error(`Failed to load image: ${url}`));
        };
        
        img.src = url;
      });
    } catch (error) {
      console.error('Error converting image to data URL:', error);
      return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
    }
  };

  const exportToPdf = async () => {
    setIsExporting(true);
    toast({
      title: "Exportando roteiro",
      description: "Preparando seu PDF. Isso pode levar alguns segundos...",
    });

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      pdf.addFont('https://fonts.gstatic.com/s/robotocondensed/v27/ieVl2ZhZI2eCN5jzbjEETS9weq8-19K7DQ.ttf', 'RobotoCondensed', 'normal');
      pdf.addFont('https://fonts.gstatic.com/s/robotocondensed/v27/ieVi2ZhZI2eCN5jzbjEETS9weq8-32meKCM.ttf', 'RobotoCondensed', 'bold');
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      
      const cityImageUrl = await getCityImage(trip.city || '', trip.country || '');
      const cityImageDataUrl = await loadImageAsDataUrl(cityImageUrl);
      
      pdf.addImage(cityImageDataUrl, 'JPEG', 0, 0, pageWidth, pageHeight);
      
      pdf.setFillColor(0, 0, 0);
      pdf.setGState({ opacity: 0.5 });
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      pdf.setGState({ opacity: 1.0 });
      
      const titleText = trip.title.toUpperCase();
      const titleWidth = pdf.getStringUnitWidth(titleText) * 40 / pdf.internal.scaleFactor;
      const titleX = (pageWidth - titleWidth) / 2;
      pdf.text(titleText, titleX, pageHeight / 2 - 30);
      
      const subtitleText = `${trip.city}, ${trip.country}`;
      const subtitleWidth = pdf.getStringUnitWidth(subtitleText) * 18 / pdf.internal.scaleFactor;
      const subtitleX = (pageWidth - subtitleWidth) / 2;
      pdf.text(subtitleText, subtitleX, pageHeight / 2 - 15);
      
      pdf.setDrawColor(255, 255, 255);
      pdf.setLineWidth(0.5);
      pdf.line(pageWidth/4, pageHeight/2 - 5, pageWidth*3/4, pageHeight/2 - 5);
      
      const introTextLines = [
        `Aqui está um roteiro detalhado para ${itinerary.length} dias em ${trip.city},`,
        "cobrindo pontos turísticos icônicos, restaurantes recomendados",
        "e dicas para aproveitar ao máximo a cidade."
      ];
      
      let yPos = pageHeight / 2 + 10;
      
      introTextLines.forEach(line => {
        const introWidth = pdf.getStringUnitWidth(line) * 14 / pdf.internal.scaleFactor;
        const introX = (pageWidth - introWidth) / 2;
        pdf.text(line, introX, yPos);
        yPos += 8;
      });
      
      const dateText = `${formatDate(trip.start_date || '')} - ${formatDate(trip.end_date || '')}`;
      const dateWidth = pdf.getStringUnitWidth(dateText) * 14 / pdf.internal.scaleFactor;
      const dateX = (pageWidth - dateWidth) / 2;
      pdf.text(dateText, dateX, yPos);
      
      const peopleText = `${trip.num_people} pessoa${trip.num_people !== 1 ? 's' : ''}`;
      const peopleWidth = pdf.getStringUnitWidth(peopleText) * 14 / pdf.internal.scaleFactor;
      const peopleX = (pageWidth - peopleWidth) / 2;
      pdf.text(peopleText, peopleX, yPos);
      
      pdf.setFontSize(10);
      pdf.text("Página 1 de " + (itinerary.length + 1), pageWidth - 40, pageHeight - 10);
      
      const isParis = trip.city?.toLowerCase() === "paris";
      
      for (let i = 0; i < itinerary.length; i++) {
        const day = itinerary[i];
        
        pdf.addPage();
        let yPosition = margin;
        
        pdf.setFillColor(250, 245, 255);
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');
        
        pdf.setFillColor(106, 27, 154);
        pdf.rect(margin, yPosition, pageWidth - 2 * margin, 25, 'F');
        
        pdf.setTextColor(255, 255, 255);
        pdf.setFont("RobotoCondensed", "bold");
        pdf.setFontSize(20);
        
        let dayTitle = `DIA ${day.day}`;
        if (day.date) {
          dayTitle += ` - ${formatDate(day.date)}`;
        }
        
        if (day.theme) {
          dayTitle += ` - ${day.theme.toUpperCase()}`;
        } else if (isParis) {
          if (day.day === 1) {
            dayTitle += " - CLÁSSICOS DE PARIS";
          } else if (day.day === 2) {
            dayTitle += " - ARTE E MONTMARTRE";
          } else if (day.day === 3) {
            dayTitle += " - VERSALHES E MODERNIDADE";
          }
        }
        
        pdf.text(dayTitle, margin + 5, yPosition + 16);
        
        yPosition += 35;
        
        pdf.setTextColor(106, 27, 154);
        pdf.setFontSize(18);
        pdf.setFont("RobotoCondensed", "bold");
        pdf.text("Manhã", margin, yPosition);
        pdf.line(margin, yPosition + 2, pageWidth - margin, yPosition + 2);
        
        yPosition += 15;
        pdf.setTextColor(50, 50, 50);
        pdf.setFont("RobotoCondensed", "normal");
        pdf.setFontSize(12);
        
        for (let poiIndex = 0; poiIndex < day.morning.length; poiIndex++) {
          const poi = day.morning[poiIndex];
          
          pdf.setFont("RobotoCondensed", "bold");
          pdf.text(`${poiIndex + 1}. ${poi.name} (${poi.openingHours || ''})`, margin, yPosition);
          yPosition += 8;
          
          const poiImageUrl = await getImageForAttraction(poi.name, poi.type?.toLowerCase() || 'attraction');
          const poiDataUrl = await loadImageAsDataUrl(poiImageUrl);
          
          const imageWidth = 60;
          const imageHeight = 36;
          pdf.addImage(poiDataUrl, 'JPEG', margin, yPosition, imageWidth, imageHeight);
          
          yPosition += imageHeight + 5;
          
          pdf.setFont("RobotoCondensed", "normal");
          
          if (poi.description) {
            const descriptionLines = pdf.splitTextToSize(poi.description, pageWidth - 2 * margin - 10);
            descriptionLines.forEach(line => {
              pdf.text(`    ${line}`, margin, yPosition);
              yPosition += 6;
            });
          }
          
          if (poi.ticketPrice) {
            pdf.text(`    Dica: ${poi.ticketPrice}`, margin, yPosition);
            yPosition += 6;
          }
          
          if (poi.address) {
            pdf.text(`    Endereço: ${poi.address}`, margin, yPosition);
            yPosition += 6;
          }
          
          yPosition += 6;
        }
        
        yPosition += 10;
        pdf.setTextColor(233, 112, 13);
        pdf.setFontSize(18);
        pdf.setFont("RobotoCondensed", "bold");
        pdf.text("Almoço", margin, yPosition);
        pdf.line(margin, yPosition + 2, pageWidth - margin, yPosition + 2);
        
        yPosition += 15;
        pdf.setTextColor(50, 50, 50);
        pdf.setFontSize(12);
        
        if (day.lunch) {
          pdf.setFont("RobotoCondensed", "bold");
          const lunchTitle = day.lunch.openingHours 
            ? `${day.lunch.name} (${day.lunch.openingHours})`
            : day.lunch.name;
          pdf.text(lunchTitle, margin, yPosition);
          yPosition += 8;
          
          const restaurantImageUrl = await getImageForAttraction(day.lunch.name, 'restaurant');
          const restaurantDataUrl = await loadImageAsDataUrl(restaurantImageUrl);
          
          const imageWidth = 60;
          const imageHeight = 36;
          pdf.addImage(restaurantDataUrl, 'JPEG', margin, yPosition, imageWidth, imageHeight);
          
          yPosition += imageHeight + 5;
          
          pdf.setFont("RobotoCondensed", "normal");
          
          if (day.lunch.description) {
            const descriptionLines = pdf.splitTextToSize(day.lunch.description, pageWidth - 2 * margin - 10);
            descriptionLines.forEach(line => {
              pdf.text(`    ${line}`, margin, yPosition);
              yPosition += 6;
            });
          }
          
          if (day.lunch.cuisine) {
            pdf.text(`    Cozinha: ${day.lunch.cuisine}`, margin, yPosition);
            yPosition += 6;
          }
          
          if (day.lunch.priceLevel) {
            pdf.text(`    Preço médio: ${day.lunch.priceLevel}`, margin, yPosition);
            yPosition += 6;
          }
          
          if (day.lunch.address) {
            pdf.text(`    Endereço: ${day.lunch.address}`, margin, yPosition);
            yPosition += 6;
          }
        } else {
          pdf.setFont("RobotoCondensed", "italic");
          pdf.text("Sugestão: explore restaurantes locais.", margin, yPosition);
          yPosition += 6;
        }
        
        yPosition += 10;
        pdf.setTextColor(106, 27, 154);
        pdf.setFontSize(18);
        pdf.setFont("RobotoCondensed", "bold");
        pdf.text("Tarde", margin, yPosition);
        pdf.line(margin, yPosition + 2, pageWidth - margin, yPosition + 2);
        
        yPosition += 15;
        pdf.setTextColor(50, 50, 50);
        pdf.setFontSize(12);
        
        for (let poiIndex = 0; poiIndex < day.afternoon.length; poiIndex++) {
          const poi = day.afternoon[poiIndex];
          
          pdf.setFont("RobotoCondensed", "bold");
          pdf.text(`${poiIndex + 3}. ${poi.name} (${poi.openingHours || ''})`, margin, yPosition);
          yPosition += 8;
          
          const poiImageUrl = await getImageForAttraction(poi.name, poi.type?.toLowerCase() || 'attraction');
          const poiDataUrl = await loadImageAsDataUrl(poiImageUrl);
          
          const imageWidth = 60;
          const imageHeight = 36;
          pdf.addImage(poiDataUrl, 'JPEG', margin, yPosition, imageWidth, imageHeight);
          
          yPosition += imageHeight + 5;
          
          pdf.setFont("RobotoCondensed", "normal");
          
          if (poi.description) {
            const descriptionLines = pdf.splitTextToSize(poi.description, pageWidth - 2 * margin - 10);
            descriptionLines.forEach(line => {
              pdf.text(`    ${line}`, margin, yPosition);
              yPosition += 6;
            });
          }
          
          if (poi.ticketPrice) {
            pdf.text(`    Dica: ${poi.ticketPrice}`, margin, yPosition);
            yPosition += 6;
          }
          
          if (poi.address) {
            pdf.text(`    Endereço: ${poi.address}`, margin, yPosition);
            yPosition += 6;
          }
          
          yPosition += 6;
        }
        
        yPosition += 10;
        pdf.setTextColor(233, 112, 13);
        pdf.setFontSize(18);
        pdf.setFont("RobotoCondensed", "bold");
        pdf.text("Jantar", margin, yPosition);
        pdf.line(margin, yPosition + 2, pageWidth - margin, yPosition + 2);
        
        yPosition += 15;
        pdf.setTextColor(50, 50, 50);
        pdf.setFontSize(12);
        
        if (day.dinner) {
          pdf.setFont("RobotoCondensed", "bold");
          const dinnerTitle = day.dinner.openingHours 
            ? `${day.dinner.name} (${day.dinner.openingHours})`
            : day.dinner.name;
          pdf.text(dinnerTitle, margin, yPosition);
          yPosition += 8;
          
          const restaurantImageUrl = await getImageForAttraction(day.dinner.name, 'restaurant');
          const restaurantDataUrl = await loadImageAsDataUrl(restaurantImageUrl);
          
          const imageWidth = 60;
          const imageHeight = 36;
          pdf.addImage(restaurantDataUrl, 'JPEG', margin, yPosition, imageWidth, imageHeight);
          
          yPosition += imageHeight + 5;
          
          pdf.setFont("RobotoCondensed", "normal");
          
          if (day.dinner.description) {
            const descriptionLines = pdf.splitTextToSize(day.dinner.description, pageWidth - 2 * margin - 10);
            descriptionLines.forEach(line => {
              pdf.text(`    ${line}`, margin, yPosition);
              yPosition += 6;
            });
          }
          
          if (day.dinner.cuisine) {
            pdf.text(`    Cozinha: ${day.dinner.cuisine}`, margin, yPosition);
            yPosition += 6;
          }
          
          if (day.dinner.priceLevel) {
            pdf.text(`    Preço médio: ${day.dinner.priceLevel}`, margin, yPosition);
            yPosition += 6;
          }
          
          if (day.dinner.address) {
            pdf.text(`    Endereço: ${day.dinner.address}`, margin, yPosition);
            yPosition += 6;
          }
        } else {
          pdf.setFont("RobotoCondensed", "italic");
          pdf.text("Sugestão: explore restaurantes locais.", margin, yPosition);
          yPosition += 6;
        }
        
        if (isParis && day.day === itinerary.length) {
          yPosition += 10;
          pdf.setTextColor(106, 27, 154);
          pdf.setFontSize(16);
          pdf.setFont("RobotoCondensed", "bold");
          pdf.text("Dicas Extras", margin, yPosition);
          pdf.line(margin, yPosition + 2, pageWidth - margin, yPosition + 2);
          
          yPosition += 15;
          pdf.setTextColor(50, 50, 50);
          pdf.setFontSize(12);
          
          const tips = [
            "✅ Transporte: Compre um Paris Visite Pass para metrô ilimitado.",
            "✅ Ingressos: Sempre compre antecipado para evitar filas.",
            "✅ Idioma: Algumas frases em francês ajudam na comunicação."
          ];
          
          tips.forEach(tip => {
            pdf.text(tip, margin, yPosition);
            yPosition += 6;
          });
        }
        
        pdf.setFontSize(10);
        pdf.text(`Página ${i + 2} de ${itinerary.length + 1}`, pageWidth - 40, pageHeight - 10);
      }
      
      pdf.save(`Roteiro_${trip.title.replace(/\s+/g, "_")}.pdf`);
      
      toast({
        title: "Exportação concluída",
        description: "O roteiro foi exportado para PDF com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      toast({
        title: "Erro ao exportar",
        description: "Ocorreu um erro ao exportar o roteiro. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button 
      onClick={exportToPdf} 
      className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600"
      disabled={isExporting}
    >
      <FileDown className="h-4 w-4" />
      <span>{isExporting ? "Exportando..." : "Exportar PDF"}</span>
    </Button>
  );
};
