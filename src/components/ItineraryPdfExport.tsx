
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { ItineraryDay } from "@/lib/supabase";
import { formatDate } from "@/utils/dateUtils";
import { useToast } from "@/components/ui/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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

export const ItineraryPdfExport = ({ trip, itinerary }: ItineraryPdfExportProps) => {
  const { toast } = useToast();

  const getCityImage = async (city: string, country: string): Promise<string> => {
    try {
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

  const exportToPdf = async () => {
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
      const img = new Image();
      img.crossOrigin = "Anonymous";
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = cityImageUrl;
      });
      
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        
        // Add cover page with image
        const imgData = canvas.toDataURL('image/jpeg');
        pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight);
        
        // Add overlay for better text visibility
        pdf.setFillColor(0, 0, 0);
        pdf.setGState({opacity: 0.5});
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');
        
        // Reset opacity
        pdf.setGState({opacity: 1.0});
        
        // Add title text
        pdf.setTextColor(255, 255, 255);
        pdf.setFont("RobotoCondensed", "bold");
        pdf.setFontSize(32);
        
        const titleText = trip.title;
        const titleWidth = pdf.getStringUnitWidth(titleText) * 32 / pdf.internal.scaleFactor;
        const titleX = (pageWidth - titleWidth) / 2;
        pdf.text(titleText, titleX, pageHeight / 2 - 20);
        
        // Add introduction text
        pdf.setFont("RobotoCondensed", "normal");
        pdf.setFontSize(16);
        const introText = `Aqui está um roteiro detalhado para ${itinerary.length} dias em ${trip.city},`;
        const introText2 = "cobrindo pontos turísticos icônicos, restaurantes recomendados";
        const introText3 = "e dicas para aproveitar ao máximo a cidade.";
        
        const introWidth = pdf.getStringUnitWidth(introText) * 16 / pdf.internal.scaleFactor;
        const introX = (pageWidth - introWidth) / 2;
        pdf.text(introText, introX, pageHeight / 2 + 10);
        
        const intro2Width = pdf.getStringUnitWidth(introText2) * 16 / pdf.internal.scaleFactor;
        const intro2X = (pageWidth - intro2Width) / 2;
        pdf.text(introText2, intro2X, pageHeight / 2 + 20);
        
        const intro3Width = pdf.getStringUnitWidth(introText3) * 16 / pdf.internal.scaleFactor;
        const intro3X = (pageWidth - intro3Width) / 2;
        pdf.text(introText3, intro3X, pageHeight / 2 + 30);
        
        // Add dates and people
        const dateText = `${formatDate(trip.start_date || '')} - ${formatDate(trip.end_date || '')}`;
        const dateWidth = pdf.getStringUnitWidth(dateText) * 16 / pdf.internal.scaleFactor;
        const dateX = (pageWidth - dateWidth) / 2;
        pdf.text(dateText, dateX, pageHeight / 2 + 50);
        
        const peopleText = `${trip.num_people} pessoa${trip.num_people !== 1 ? 's' : ''}`;
        const peopleWidth = pdf.getStringUnitWidth(peopleText) * 16 / pdf.internal.scaleFactor;
        const peopleX = (pageWidth - peopleWidth) / 2;
        pdf.text(peopleText, peopleX, pageHeight / 2 + 60);
        
        // Add page number
        pdf.setFontSize(10);
        pdf.text("Página 1 de " + (itinerary.length + 1), pageWidth - 40, pageHeight - 10);
        
        // Generate pages for each day
        for (let i = 0; i < itinerary.length; i++) {
          const day = itinerary[i];
          
          pdf.addPage();
          let yPosition = margin;
          
          // Create a light purple gradient background
          pdf.setFillColor(250, 245, 255);
          pdf.rect(0, 0, pageWidth, pageHeight, 'F');
          
          // Day header with dark purple background
          pdf.setFillColor(90, 78, 148);
          pdf.rect(margin, yPosition, pageWidth - 2 * margin, 25, 'F');
          
          // Day title
          pdf.setTextColor(255, 255, 255);
          pdf.setFont("RobotoCondensed", "bold");
          pdf.setFontSize(20);
          pdf.text(`DIA ${day.day} - ${formatDate(day.date)}`, margin + 5, yPosition + 16);
          
          yPosition += 35;
          
          // Morning section
          pdf.setTextColor(90, 78, 148);
          pdf.setFontSize(18);
          pdf.text("Manhã", margin, yPosition);
          pdf.setLineWidth(0.5);
          pdf.line(margin, yPosition + 2, pageWidth - margin, yPosition + 2);
          
          yPosition += 15;
          pdf.setTextColor(60, 60, 60);
          pdf.setFont("RobotoCondensed", "normal");
          pdf.setFontSize(12);
          
          for (const poi of day.morning) {
            pdf.setFont("RobotoCondensed", "bold");
            pdf.text(`• ${poi.name}`, margin, yPosition);
            yPosition += 6;
            
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
          
          // Lunch section
          yPosition += 10;
          pdf.setTextColor(233, 164, 80);
          pdf.setFontSize(18);
          pdf.setFont("RobotoCondensed", "bold");
          pdf.text("Almoço", margin, yPosition);
          pdf.line(margin, yPosition + 2, pageWidth - margin, yPosition + 2);
          
          yPosition += 15;
          pdf.setTextColor(60, 60, 60);
          pdf.setFontSize(12);
          
          if (day.lunch) {
            pdf.setFont("RobotoCondensed", "bold");
            pdf.text(day.lunch.name, margin, yPosition);
            yPosition += 6;
            
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
          }
          
          // Afternoon section
          yPosition += 10;
          pdf.setTextColor(90, 78, 148);
          pdf.setFontSize(18);
          pdf.setFont("RobotoCondensed", "bold");
          pdf.text("Tarde", margin, yPosition);
          pdf.line(margin, yPosition + 2, pageWidth - margin, yPosition + 2);
          
          yPosition += 15;
          pdf.setTextColor(60, 60, 60);
          pdf.setFontSize(12);
          
          for (const poi of day.afternoon) {
            pdf.setFont("RobotoCondensed", "bold");
            pdf.text(`• ${poi.name}`, margin, yPosition);
            yPosition += 6;
            
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
          
          // Dinner section
          yPosition += 10;
          pdf.setTextColor(233, 164, 80);
          pdf.setFontSize(18);
          pdf.setFont("RobotoCondensed", "bold");
          pdf.text("Jantar", margin, yPosition);
          pdf.line(margin, yPosition + 2, pageWidth - margin, yPosition + 2);
          
          yPosition += 15;
          pdf.setTextColor(60, 60, 60);
          pdf.setFontSize(12);
          
          if (day.dinner) {
            pdf.setFont("RobotoCondensed", "bold");
            pdf.text(day.dinner.name, margin, yPosition);
            yPosition += 6;
            
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
      }
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      toast({
        title: "Erro ao exportar",
        description: "Ocorreu um erro ao exportar o roteiro. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      onClick={exportToPdf} 
      className="flex items-center gap-2 bg-primary hover:bg-primary/90"
    >
      <FileDown className="h-4 w-4" />
      <span>Exportar PDF</span>
    </Button>
  );
};
