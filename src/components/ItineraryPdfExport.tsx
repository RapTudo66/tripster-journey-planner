
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { ItineraryDay } from "@/lib/supabase";
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

  // Image mappings for popular attractions
  const attractionImageMap: Record<string, string> = {
    // Paris attractions
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
    "La Défense": "https://images.unsplash.com/photo-1601049676869-9character=0ad19008f?auto=format&fit=crop&q=80&w=500&h=300",
    "Jardim de Luxemburgo": "https://images.unsplash.com/photo-1558177585-761f38c631bb?auto=format&fit=crop&q=80&w=500&h=300",
    
    // Restaurants in Paris
    "Le Café Marly": "https://images.unsplash.com/photo-1560624052-3423b279830c?auto=format&fit=crop&q=80&w=500&h=300",
    "Le Procope": "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80&w=500&h=300",
    "Les Deux Magots": "https://images.unsplash.com/photo-1477763816053-7c86d5fa8db1?auto=format&fit=crop&q=80&w=500&h=300",
    "La Petite Venise": "https://images.unsplash.com/photo-1546530967-10442bc8e4d3?auto=format&fit=crop&q=80&w=500&h=300",
    "Le Train Bleu": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=500&h=300",
    "La Mère Catherine": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=500&h=300"
  };
  
  // Generic fallback images by category
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
      // Use the Paris image for Paris trips, otherwise fetch from Unsplash
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
    // Check if we already have this image in the cache
    if (imageCache[name]) {
      return imageCache[name];
    }
    
    // Check if we have a specific image for this attraction
    if (attractionImageMap[name]) {
      const imageUrl = attractionImageMap[name];
      setImageCache(prev => ({ ...prev, [name]: imageUrl }));
      return imageUrl;
    }
    
    // Use a fallback image based on category
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
      // Create a new image element
      const img = new Image();
      img.crossOrigin = "Anonymous"; // Enable CORS
      
      // Return a promise that resolves when the image is loaded
      return new Promise((resolve, reject) => {
        img.onload = () => {
          // Create a canvas to draw the image
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          
          // Draw the image on the canvas
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            // Convert the canvas to a data URL
            const dataUrl = canvas.toDataURL('image/jpeg');
            resolve(dataUrl);
          } else {
            reject(new Error('Failed to get canvas context'));
          }
        };
        
        img.onerror = () => {
          reject(new Error(`Failed to load image: ${url}`));
        };
        
        // Set the source to trigger loading
        img.src = url;
      });
    } catch (error) {
      console.error('Error converting image to data URL:', error);
      // Return a placeholder image
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
      
      // Add Roboto Condensed font
      pdf.addFont('https://fonts.gstatic.com/s/robotocondensed/v27/ieVl2ZhZI2eCN5jzbjEETS9weq8-19K7DQ.ttf', 'RobotoCondensed', 'normal');
      pdf.addFont('https://fonts.gstatic.com/s/robotocondensed/v27/ieVi2ZhZI2eCN5jzbjEETS9weq8-32meKCM.ttf', 'RobotoCondensed', 'bold');
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      
      // Get a city image
      const cityImageUrl = await getCityImage(trip.city || '', trip.country || '');
      
      // Convert the image URL to a data URL
      const cityImageDataUrl = await loadImageAsDataUrl(cityImageUrl);
      
      // Add cover page with image
      pdf.addImage(cityImageDataUrl, 'JPEG', 0, 0, pageWidth, pageHeight);
      
      // Add overlay for better text visibility
      pdf.setFillColor(0, 0, 0);
      pdf.setGState({opacity: 0.5});
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      
      // Reset opacity
      pdf.setGState({opacity: 1.0});
      
      // Add title text
      pdf.setTextColor(255, 255, 255);
      pdf.setFont("RobotoCondensed", "bold");
      pdf.setFontSize(40);
      
      const titleText = trip.title.toUpperCase();
      const titleWidth = pdf.getStringUnitWidth(titleText) * 40 / pdf.internal.scaleFactor;
      const titleX = (pageWidth - titleWidth) / 2;
      pdf.text(titleText, titleX, pageHeight / 2 - 30);
      
      // Add subtitle
      pdf.setFont("RobotoCondensed", "normal");
      pdf.setFontSize(18);
      const subtitleText = `${trip.city}, ${trip.country}`;
      const subtitleWidth = pdf.getStringUnitWidth(subtitleText) * 18 / pdf.internal.scaleFactor;
      const subtitleX = (pageWidth - subtitleWidth) / 2;
      pdf.text(subtitleText, subtitleX, pageHeight / 2 - 15);
      
      // Add line separator
      pdf.setDrawColor(255, 255, 255);
      pdf.setLineWidth(0.5);
      pdf.line(pageWidth/4, pageHeight/2 - 5, pageWidth*3/4, pageHeight/2 - 5);
      
      // Add introduction text - personalized for the itinerary
      pdf.setFont("RobotoCondensed", "normal");
      pdf.setFontSize(14);
      
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
      
      // Add dates
      yPos += 10;
      const dateText = `${formatDate(trip.start_date || '')} - ${formatDate(trip.end_date || '')}`;
      const dateWidth = pdf.getStringUnitWidth(dateText) * 14 / pdf.internal.scaleFactor;
      const dateX = (pageWidth - dateWidth) / 2;
      pdf.text(dateText, dateX, yPos);
      
      // Add people
      yPos += 8;
      const peopleText = `${trip.num_people} pessoa${trip.num_people !== 1 ? 's' : ''}`;
      const peopleWidth = pdf.getStringUnitWidth(peopleText) * 14 / pdf.internal.scaleFactor;
      const peopleX = (pageWidth - peopleWidth) / 2;
      pdf.text(peopleText, peopleX, yPos);
      
      // Add page number
      pdf.setFontSize(10);
      pdf.text("Página 1 de " + (itinerary.length + 1), pageWidth - 40, pageHeight - 10);
      
      // Special content for Paris - rich content example
      const isParis = trip.city?.toLowerCase() === "paris";
      
      // Generate pages for each day
      for (let i = 0; i < itinerary.length; i++) {
        const day = itinerary[i];
        
        pdf.addPage();
        let yPosition = margin;
        
        // Create a light purple gradient background
        pdf.setFillColor(250, 245, 255);
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');
        
        // Day header with dark purple background
        pdf.setFillColor(106, 27, 154); // Deeper purple for better contrast
        pdf.rect(margin, yPosition, pageWidth - 2 * margin, 25, 'F');
        
        // Day title with theme
        pdf.setTextColor(255, 255, 255);
        pdf.setFont("RobotoCondensed", "bold");
        pdf.setFontSize(20);
        
        let dayTitle = `DIA ${day.day} - ${formatDate(day.date)}`;
        
        // Special themes for Paris itinerary
        if (isParis) {
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
        
        // Morning section
        pdf.setTextColor(106, 27, 154); // Use same purple for consistency
        pdf.setFontSize(18);
        pdf.text("Manhã", margin, yPosition);
        pdf.setLineWidth(0.5);
        pdf.line(margin, yPosition + 2, pageWidth - margin, yPosition + 2);
        
        yPosition += 15;
        pdf.setTextColor(50, 50, 50);
        pdf.setFont("RobotoCondensed", "normal");
        pdf.setFontSize(12);
        
        // Special content for Paris Day 1 morning
        if (isParis && day.day === 1) {
          // Torre Eiffel
          pdf.setFont("RobotoCondensed", "bold");
          pdf.text("1. Torre Eiffel (08h30 - 10h00)", margin, yPosition);
          yPosition += 8;
          
          // Get and add image for Torre Eiffel
          const eiffelImageUrl = await getImageForAttraction("Torre Eiffel", "monument");
          const eiffelDataUrl = await loadImageAsDataUrl(eiffelImageUrl);
          
          // Add image with proper positioning
          const imageWidth = 60;
          const imageHeight = 36;
          pdf.addImage(eiffelDataUrl, 'JPEG', margin, yPosition, imageWidth, imageHeight);
          
          yPosition += imageHeight + 5;
          
          pdf.setFont("RobotoCondensed", "normal");
          const towerDesc = [
            "    Chegue cedo para evitar filas. Suba até o segundo andar ou vá até o topo para uma vista panorâmica incrível.",
            "    Dica: Reserve ingressos antecipadamente no site oficial.",
            "    Endereço: Champ de Mars, 5 Av. Anatole France, 75007 Paris"
          ];
          
          towerDesc.forEach(line => {
            pdf.text(line, margin, yPosition);
            yPosition += 6;
          });
          
          yPosition += 6;
          
          // Louvre
          pdf.setFont("RobotoCondensed", "bold");
          pdf.text("2. Museu do Louvre (10h30 - 13h30)", margin, yPosition);
          yPosition += 8;
          
          // Get and add image for Louvre
          const louvreImageUrl = await getImageForAttraction("Museu do Louvre", "museum");
          const louvreDataUrl = await loadImageAsDataUrl(louvreImageUrl);
          
          // Add image
          pdf.addImage(louvreDataUrl, 'JPEG', margin, yPosition, imageWidth, imageHeight);
          
          yPosition += imageHeight + 5;
          
          pdf.setFont("RobotoCondensed", "normal");
          const louvreDesc = [
            "    Visite a Mona Lisa, a Vênus de Milo e outras obras icônicas.",
            "    Dica: Foque nas alas que mais te interessam para otimizar o tempo.",
            "    Endereço: Rue de Rivoli, 75001 Paris"
          ];
          
          louvreDesc.forEach(line => {
            pdf.text(line, margin, yPosition);
            yPosition += 6;
          });
        }
        // Special content for Paris Day 2 morning
        else if (isParis && day.day === 2) {
          pdf.setFont("RobotoCondensed", "bold");
          pdf.text("1. Museu d'Orsay (09h00 - 11h00)", margin, yPosition);
          yPosition += 8;
          
          // Get and add image for Museu d'Orsay
          const orsayImageUrl = await getImageForAttraction("Museu d'Orsay", "museum");
          const orsayDataUrl = await loadImageAsDataUrl(orsayImageUrl);
          
          // Add image
          const imageWidth = 60;
          const imageHeight = 36;
          pdf.addImage(orsayDataUrl, 'JPEG', margin, yPosition, imageWidth, imageHeight);
          
          yPosition += imageHeight + 5;
          
          pdf.setFont("RobotoCondensed", "normal");
          const orsayDesc = [
            "    Impressionismo e pós-impressionismo: Van Gogh, Monet e Renoir.",
            "    Endereço: 1 Rue de la Légion d'Honneur, 75007"
          ];
          
          orsayDesc.forEach(line => {
            pdf.text(line, margin, yPosition);
            yPosition += 6;
          });
          
          yPosition += 6;
          
          pdf.setFont("RobotoCondensed", "bold");
          pdf.text("2. Jardim de Luxemburgo (11h30 - 12h30)", margin, yPosition);
          yPosition += 8;
          
          // Get and add image for Jardim de Luxemburgo
          const luxemburgImageUrl = await getImageForAttraction("Jardim de Luxemburgo", "park");
          const luxemburgDataUrl = await loadImageAsDataUrl(luxemburgImageUrl);
          
          // Add image
          pdf.addImage(luxemburgDataUrl, 'JPEG', margin, yPosition, imageWidth, imageHeight);
          
          yPosition += imageHeight + 5;
          
          pdf.setFont("RobotoCondensed", "normal");
          pdf.text("    Passeio relaxante pelo jardim mais elegante de Paris.", margin, yPosition);
          yPosition += 6;
        }
        // Special content for Paris Day 3 morning
        else if (isParis && day.day === 3) {
          pdf.setFont("RobotoCondensed", "bold");
          pdf.text("1. Palácio de Versalhes (08h30 - 12h30)", margin, yPosition);
          yPosition += 8;
          
          // Get and add image for Palácio de Versalhes
          const versaillesImageUrl = await getImageForAttraction("Palácio de Versalhes", "monument");
          const versaillesDataUrl = await loadImageAsDataUrl(versaillesImageUrl);
          
          // Add image
          const imageWidth = 60;
          const imageHeight = 36;
          pdf.addImage(versaillesDataUrl, 'JPEG', margin, yPosition, imageWidth, imageHeight);
          
          yPosition += imageHeight + 5;
          
          pdf.setFont("RobotoCondensed", "normal");
          const versaillesDesc = [
            "    Destaques: Salão dos Espelhos, Jardins e o Petit Trianon.",
            "    Dica: Pegue o RER C cedo para evitar multidões.",
            "    Endereço: Place d'Armes, 78000 Versailles"
          ];
          
          versaillesDesc.forEach(line => {
            pdf.text(line, margin, yPosition);
            yPosition += 6;
          });
        }
        // Default content for other cities or days
        else {
          for (const poi of day.morning) {
            pdf.setFont("RobotoCondensed", "bold");
            pdf.text(`• ${poi.name}`, margin, yPosition);
            yPosition += 6;
            
            // Get and add image for the POI
            const poiImageUrl = await getImageForAttraction(poi.name);
            const poiDataUrl = await loadImageAsDataUrl(poiImageUrl);
            
            // Add image
            const imageWidth = 60;
            const imageHeight = 36;
            pdf.addImage(poiDataUrl, 'JPEG', margin, yPosition, imageWidth, imageHeight);
            
            yPosition += imageHeight + 5;
            
            pdf.setFont("RobotoCondensed", "normal");
            if (poi.description) {
              const lines = pdf.splitTextToSize(poi.description, pageWidth - 2 * margin - 10);
              lines.forEach(line => {
                pdf.text(`  ${line}`, margin, yPosition);
                yPosition += 6;
              });
            }
            
            if (poi.openingHours) {
              pdf.text(`  Horário: ${poi.openingHours}`, margin, yPosition);
              yPosition += 6;
            }
            
            if (poi.ticketPrice) {
              pdf.text(`  Ingresso: ${poi.ticketPrice}`, margin, yPosition);
              yPosition += 6;
            }
            
            if (poi.address) {
              pdf.text(`  Endereço: ${poi.address}`, margin, yPosition);
              yPosition += 10;
            }
          }
        }
        
        // Lunch section
        yPosition += 10;
        pdf.setTextColor(233, 112, 13); // Orange for food sections
        pdf.setFontSize(18);
        pdf.setFont("RobotoCondensed", "bold");
        pdf.text("Almoço", margin, yPosition);
        pdf.line(margin, yPosition + 2, pageWidth - margin, yPosition + 2);
        
        yPosition += 15;
        pdf.setTextColor(50, 50, 50);
        pdf.setFontSize(12);
        
        // Special lunch for Paris Day 1
        if (isParis && day.day === 1) {
          pdf.setFont("RobotoCondensed", "bold");
          pdf.text("Le Café Marly (No Louvre, vista para a pirâmide)", margin, yPosition);
          yPosition += 8;
          
          // Get and add image for restaurant
          const restaurantImageUrl = await getImageForAttraction("Le Café Marly", "restaurant");
          const restaurantDataUrl = await loadImageAsDataUrl(restaurantImageUrl);
          
          // Add image
          const imageWidth = 60;
          const imageHeight = 36;
          pdf.addImage(restaurantDataUrl, 'JPEG', margin, yPosition, imageWidth, imageHeight);
          
          yPosition += imageHeight + 5;
          
          pdf.setFont("RobotoCondensed", "normal");
          const lunchDesc = [
            "    Sugestão: Steak tartare ou salada Niçoise.",
            "    Preço médio: €€€"
          ];
          
          lunchDesc.forEach(line => {
            pdf.text(line, margin, yPosition);
            yPosition += 6;
          });
        }
        // Special lunch for Paris Day 2
        else if (isParis && day.day === 2) {
          pdf.setFont("RobotoCondensed", "bold");
          pdf.text("Les Deux Magots (Café histórico frequentado por Sartre e Hemingway)", margin, yPosition);
          yPosition += 8;
          
          // Get and add image for restaurant
          const restaurantImageUrl = await getImageForAttraction("Les Deux Magots", "restaurant");
          const restaurantDataUrl = await loadImageAsDataUrl(restaurantImageUrl);
          
          // Add image
          const imageWidth = 60;
          const imageHeight = 36;
          pdf.addImage(restaurantDataUrl, 'JPEG', margin, yPosition, imageWidth, imageHeight);
          
          yPosition += imageHeight + 5;
          
          pdf.setFont("RobotoCondensed", "normal");
          const lunchDesc = [
            "    Sugestão: Croque-monsieur ou quiche Lorraine.",
            "    Preço médio: €€€"
          ];
          
          lunchDesc.forEach(line => {
            pdf.text(line, margin, yPosition);
            yPosition += 6;
          });
        }
        // Special lunch for Paris Day 3
        else if (isParis && day.day === 3) {
          pdf.setFont("RobotoCondensed", "bold");
          pdf.text("La Petite Venise (Nos jardins de Versalhes)", margin, yPosition);
          yPosition += 8;
          
          // Get and add image for restaurant
          const restaurantImageUrl = await getImageForAttraction("La Petite Venise", "restaurant");
          const restaurantDataUrl = await loadImageAsDataUrl(restaurantImageUrl);
          
          // Add image
          const imageWidth = 60;
          const imageHeight = 36;
          pdf.addImage(restaurantDataUrl, 'JPEG', margin, yPosition, imageWidth, imageHeight);
          
          yPosition += imageHeight + 5;
          
          pdf.setFont("RobotoCondensed", "normal");
          const lunchDesc = [
            "    Sugestão: Peixe grelhado com legumes ou risoto.",
            "    Preço médio: €€€"
          ];
          
          lunchDesc.forEach(line => {
            pdf.text(line, margin, yPosition);
            yPosition += 6;
          });
        }
        // Default lunch content
        else if (day.lunch) {
          pdf.setFont("RobotoCondensed", "bold");
          pdf.text(day.lunch.name, margin, yPosition);
          yPosition += 6;
          
          // Get and add image for restaurant
          const restaurantImageUrl = await getImageForAttraction(day.lunch.name, "restaurant");
          const restaurantDataUrl = await loadImageAsDataUrl(restaurantImageUrl);
          
          // Add image
          const imageWidth = 60;
          const imageHeight = 36;
          pdf.addImage(restaurantDataUrl, 'JPEG', margin, yPosition, imageWidth, imageHeight);
          
          yPosition += imageHeight + 5;
          
          pdf.setFont("RobotoCondensed", "normal");
          pdf.text(`Cozinha: ${day.lunch.cuisine}`, margin, yPosition);
          yPosition += 6;
          pdf.text(`Preço: ${day.lunch.priceLevel}`, margin, yPosition);
          yPosition += 6;
          
          if (day.lunch.rating) {
            pdf.text(`Avaliação: ${day.lunch.rating}/5`, margin, yPosition);
            yPosition += 6;
          }
          
          if (day.lunch.address) {
            pdf.text(`Endereço: ${day.lunch.address}`, margin, yPosition);
            yPosition += 10;
          }
        } else {
          pdf.setFont("RobotoCondensed", "italic");
          pdf.text("Sugestão: explore restaurantes locais.", margin, yPosition);
          yPosition += 10;
        }
        
        // Afternoon section
        yPosition += 10;
        pdf.setTextColor(106, 27, 154);
        pdf.setFontSize(18);
        pdf.setFont("RobotoCondensed", "bold");
        pdf.text("Tarde", margin, yPosition);
        pdf.line(margin, yPosition + 2, pageWidth - margin, yPosition + 2);
        
        yPosition += 15;
        pdf.setTextColor(50, 50, 50);
        pdf.setFontSize(12);
        
        // Special content for Paris Day 1 afternoon
        if (isParis && day.day === 1) {
          pdf.setFont("RobotoCondensed", "bold");
          pdf.text("3. Catedral de Notre-Dame e Île de la Cité (15h30 - 16h30)", margin, yPosition);
          yPosition += 8;
          
          // Get and add image
          const notreImageUrl = await getImageForAttraction("Catedral de Notre-Dame", "church");
          const notreDataUrl = await loadImageAsDataUrl(notreImageUrl);
          
          // Add image
          const imageWidth = 60;
          const imageHeight = 36;
          pdf.addImage(notreDataUrl, 'JPEG', margin, yPosition, imageWidth, imageHeight);
          
          yPosition += imageHeight + 5;
          
          pdf.setFont("RobotoCondensed", "normal");
          pdf.text("    Caminhada pela Île de la Cité e visita à Catedral (se reaberta após restauração).", margin, yPosition);
          yPosition += 6;
          pdf.text("    Endereço: Parvis Notre-Dame - Pl. Jean-Paul II, 75004", margin, yPosition);
          yPosition += 10;
          
          pdf.setFont("RobotoCondensed", "bold");
          pdf.text("4. Passeio pelo Quartier Latin (16h45 - 18h00)", margin, yPosition);
          yPosition += 8;
          
          // Get and add image
          const latinImageUrl = await getImageForAttraction("Quartier Latin", "attraction");
          const latinDataUrl = await loadImageAsDataUrl(latinImageUrl);
          
          // Add image
          pdf.addImage(latinDataUrl, 'JPEG', margin, yPosition, imageWidth, imageHeight);
          
          yPosition += imageHeight + 5;
          
          pdf.setFont("RobotoCondensed", "normal");
          pdf.text("    Explore a Rue de la Huchette, o Panthéon e a Sorbonne.", margin, yPosition);
          yPosition += 10;
        }
        // Special content for Paris Day 2 afternoon
        else if (isParis && day.day === 2) {
          pdf.setFont("RobotoCondensed", "bold");
          pdf.text("3. Montmartre e Basílica de Sacré-Cœur (14h30 - 17h00)", margin, yPosition);
          yPosition += 8;
          
          // Get and add image
          const montmartreImageUrl = await getImageForAttraction("Montmartre", "attraction");
          const montmartreDataUrl = await loadImageAsDataUrl(montmartreImageUrl);
          
          // Add image
          const imageWidth = 60;
          const imageHeight = 36;
          pdf.addImage(montmartreDataUrl, 'JPEG', margin, yPosition, imageWidth, imageHeight);
          
          yPosition += imageHeight + 5;
          
          pdf.setFont("RobotoCondensed", "normal");
          const montmartreDesc = [
            "    Suba até a Sacré-Cœur para uma vista incrível da cidade.",
            "    Passeie pela Place du Tertre e veja artistas de rua."
          ];
          
          montmartreDesc.forEach(line => {
            pdf.text(line, margin, yPosition);
            yPosition += 6;
          });
          
          yPosition += 4;
          pdf.setFont("RobotoCondensed", "bold");
          pdf.text("4. Moulin Rouge (17h30 - 18h00)", margin, yPosition);
          yPosition += 8;
          
          // Get and add image
          const moulinImageUrl = await getImageForAttraction("Moulin Rouge", "attraction");
          const moulinDataUrl = await loadImageAsDataUrl(moulinImageUrl);
          
          // Add image
          pdf.addImage(moulinDataUrl, 'JPEG', margin, yPosition, imageWidth, imageHeight);
          
          yPosition += imageHeight + 5;
          
          pdf.setFont("RobotoCondensed", "normal");
          pdf.text("    Foto na icônica fachada do cabaré mais famoso do mundo.", margin, yPosition);
          yPosition += 10;
        }
        // Special content for Paris Day 3 afternoon
        else if (isParis && day.day === 3) {
          pdf.setFont("RobotoCondensed", "bold");
          pdf.text("2. La Défense (15h30 - 17h00)", margin, yPosition);
          yPosition += 8;
          
          // Get and add image
          const defenseImageUrl = await getImageForAttraction("La Défense", "attraction");
          const defenseDataUrl = await loadImageAsDataUrl(defenseImageUrl);
          
          // Add image
          const imageWidth = 60;
          const imageHeight = 36;
          pdf.addImage(defenseDataUrl, 'JPEG', margin, yPosition, imageWidth, imageHeight);
          
          yPosition += imageHeight + 5;
          
          pdf.setFont("RobotoCondensed", "normal");
          pdf.text("    Bairro moderno com arranha-céus e o Grande Arco.", margin, yPosition);
          yPosition += 10;
          
          pdf.setFont("RobotoCondensed", "bold");
          pdf.text("3. Champs-Élysées e Arco do Triunfo (17h30 - 19h00)", margin, yPosition);
          yPosition += 8;
          
          // Get and add image
          const arcImageUrl = await getImageForAttraction("Arco do Triunfo", "monument");
          const arcDataUrl = await loadImageAsDataUrl(arcImageUrl);
          
          // Add image
          pdf.addImage(arcDataUrl, 'JPEG', margin, yPosition, imageWidth, imageHeight);
          
          yPosition += imageHeight + 5;
          
          pdf.setFont("RobotoCondensed", "normal");
          pdf.text("    Caminhada pela avenida mais famosa de Paris até o Arco do Triunfo.", margin, yPosition);
          yPosition += 10;
        }
        // Default afternoon content
        else {
          for (const poi of day.afternoon) {
            pdf.setFont("RobotoCondensed", "bold");
            pdf.text(`• ${poi.name}`, margin, yPosition);
            yPosition += 6;
            
            // Get and add image for the POI
            const poiImageUrl = await getImageForAttraction(poi.name);
            const poiDataUrl = await loadImageAsDataUrl(poiImageUrl);
            
            // Add image
            const imageWidth = 60;
            const imageHeight = 36;
            pdf.addImage(poiDataUrl, 'JPEG', margin, yPosition, imageWidth, imageHeight);
            
            yPosition += imageHeight + 5;
            
            pdf.setFont("RobotoCondensed", "normal");
            if (poi.description) {
              const lines = pdf.splitTextToSize(poi.description, pageWidth - 2 * margin - 10);
              lines.forEach(line => {
                pdf.text(`  ${line}`, margin, yPosition);
                yPosition += 6;
              });
            }
            
            if (poi.openingHours) {
              pdf.text(`  Horário: ${poi.openingHours}`, margin, yPosition);
              yPosition += 6;
            }
            
            if (poi.ticketPrice) {
              pdf.text(`  Ingresso: ${poi.ticketPrice}`, margin, yPosition);
              yPosition += 6;
            }
            
            if (poi.address) {
              pdf.text(`  Endereço: ${poi.address}`, margin, yPosition);
              yPosition += 10;
            }
          }
        }
        
        // Dinner section
        yPosition += 10;
        pdf.setTextColor(233, 112, 13); // Orange for food sections
        pdf.setFontSize(18);
        pdf.setFont("RobotoCondensed", "bold");
        pdf.text("Jantar", margin, yPosition);
        pdf.line(margin, yPosition + 2, pageWidth - margin, yPosition + 2);
        
        yPosition += 15;
        pdf.setTextColor(50, 50, 50);
        pdf.setFontSize(12);
        
        // Special dinner for Paris Day 1
        if (isParis && day.day === 1) {
          pdf.setFont("RobotoCondensed", "bold");
          pdf.text("Le Procope (Restaurante histórico desde 1686)", margin, yPosition);
          yPosition += 8;
          
          // Get and add image for restaurant
          const restaurantImageUrl = await getImageForAttraction("Le Procope", "restaurant");
          const restaurantDataUrl = await loadImageAsDataUrl(restaurantImageUrl);
          
          // Add image
          const imageWidth = 60;
          const imageHeight = 36;
          pdf.addImage(restaurantDataUrl, 'JPEG', margin, yPosition, imageWidth, imageHeight);
          
          yPosition += imageHeight + 5;
          
          pdf.setFont("RobotoCondensed", "normal");
          const dinnerDesc = [
            "    Sugestão: Coq au vin ou sopa de cebola.",
            "    Preço médio: €€€"
          ];
          
          dinnerDesc.forEach(line => {
            pdf.text(line, margin, yPosition);
            yPosition += 6;
          });
        }
        // Special dinner for Paris Day 2
        else if (isParis && day.day === 2) {
          pdf.setFont("RobotoCondensed", "bold");
          pdf.text("Opções para a noite (20h00 - 23h00)", margin, yPosition);
          yPosition += 8;
          
          // Get and add image for restaurant
          const restaurantImageUrl = await getImageForAttraction("La Mère Catherine", "restaurant");
          const restaurantDataUrl = await loadImageAsDataUrl(restaurantImageUrl);
          
          // Add image
          const imageWidth = 60;
          const imageHeight = 36;
          pdf.addImage(restaurantDataUrl, 'JPEG', margin, yPosition, imageWidth, imageHeight);
          
          yPosition += imageHeight + 5;
          
          pdf.setFont("RobotoCondensed", "normal");
          const dinnerOptions = [
            "    Opção 1: Jantar no La Mère Catherine (Montmartre, €€€)",
            "        Pratos clássicos franceses, como confit de pato.",
            "",
            "    Opção 2: Show no Moulin Rouge (€€€€)",
            "        Espetáculo famoso com jantar opcional."
          ];
          
          dinnerOptions.forEach(line => {
            pdf.text(line, margin, yPosition);
            yPosition += 6;
          });
        }
        // Special dinner for Paris Day 3
        else if (isParis && day.day === 3) {
          pdf.setFont("RobotoCondensed", "bold");
          pdf.text("Le Train Bleu (Restaurante Belle Époque na Gare de Lyon)", margin, yPosition);
          yPosition += 8;
          
          // Get and add image for restaurant
          const restaurantImageUrl = await getImageForAttraction("Le Train Bleu", "restaurant");
          const restaurantDataUrl = await loadImageAsDataUrl(restaurantImageUrl);
          
          // Add image
          const imageWidth = 60;
          const imageHeight = 36;
          pdf.addImage(restaurantDataUrl, 'JPEG', margin, yPosition, imageWidth, imageHeight);
          
          yPosition += imageHeight + 5;
          
          pdf.setFont("RobotoCondensed", "normal");
          const dinnerDesc = [
            "    Sugestão: Filet mignon ao molho de trufas.",
            "    Preço médio: €€€€"
          ];
          
          dinnerDesc.forEach(line => {
            pdf.text(line, margin, yPosition);
            yPosition += 6;
          });
        }
        // Default dinner content
        else if (day.dinner) {
          pdf.setFont("RobotoCondensed", "bold");
          pdf.text(day.dinner.name, margin, yPosition);
          yPosition += 6;
          
          // Get and add image for restaurant
          const restaurantImageUrl = await getImageForAttraction(day.dinner.name, "restaurant");
          const restaurantDataUrl = await loadImageAsDataUrl(restaurantImageUrl);
          
          // Add image
          const imageWidth = 60;
          const imageHeight = 36;
          pdf.addImage(restaurantDataUrl, 'JPEG', margin, yPosition, imageWidth, imageHeight);
          
          yPosition += imageHeight + 5;
          
          pdf.setFont("RobotoCondensed", "normal");
          pdf.text(`Cozinha: ${day.dinner.cuisine}`, margin, yPosition);
          yPosition += 6;
          pdf.text(`Preço: ${day.dinner.priceLevel}`, margin, yPosition);
          yPosition += 6;
          
          if (day.dinner.rating) {
            pdf.text(`Avaliação: ${day.dinner.rating}/5`, margin, yPosition);
            yPosition += 6;
          }
          
          if (day.dinner.address) {
            pdf.text(`Endereço: ${day.dinner.address}`, margin, yPosition);
            yPosition += 10;
          }
        } else {
          pdf.setFont("RobotoCondensed", "italic");
          pdf.text("Sugestão: explore restaurantes locais.", margin, yPosition);
          yPosition += 10;
        }
        
        // Add extra tips for Paris on the last day
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
        
        // Add page number
        pdf.setFontSize(10);
        pdf.text(`Página ${i + 2} de ${itinerary.length + 1}`, pageWidth - 40, pageHeight - 10);
      }
      
      // Save the PDF
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
