
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
      // Try to get a city image from Unsplash API
      const unsplashResponse = await fetch(
        `https://source.unsplash.com/1600x900/?${city},${country},landmark`
      );
      
      if (unsplashResponse.ok) {
        return unsplashResponse.url;
      }
      
      throw new Error('Failed to fetch image');
    } catch (error) {
      console.error('Error fetching city image:', error);
      // Return a placeholder image URL if the fetch fails
      return 'https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&h=900&q=80';
    }
  };

  const exportToPdf = async () => {
    toast({
      title: "Exportando roteiro",
      description: "Preparando seu PDF. Isso pode levar alguns segundos...",
    });

    try {
      // Add Roboto Condensed font to the PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addFont('https://fonts.gstatic.com/s/robotocondensed/v27/ieVl2ZhZI2eCN5jzbjEETS9weq8-19K7DQ.ttf', 'RobotoCondensed', 'normal');
      pdf.addFont('https://fonts.gstatic.com/s/robotocondensed/v27/ieVi2ZhZI2eCN5jzbjEETS9weq8-32meKCM.ttf', 'RobotoCondensed', 'bold');
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      
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
        
        // Add title page with image
        const imgData = canvas.toDataURL('image/jpeg');
        
        // First page - Cover with image
        pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight);
        
        // Add a semi-transparent overlay for better text visibility
        pdf.setFillColor(0, 0, 0);
        pdf.setGState(new pdf.GState({ opacity: 0.5 }));
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');
        
        // Reset opacity
        pdf.setGState(new pdf.GState({ opacity: 1.0 }));
        
        // Add title text
        pdf.setTextColor(255, 255, 255);
        pdf.setFont("RobotoCondensed", "bold");
        pdf.setFontSize(32);
        
        const titleText = trip.title;
        const titleWidth = pdf.getStringUnitWidth(titleText) * 32 / pdf.internal.scaleFactor;
        const titleX = (pageWidth - titleWidth) / 2;
        pdf.text(titleText, titleX, pageHeight / 2 - 20);
        
        pdf.setFont("RobotoCondensed", "normal");
        pdf.setFontSize(18);
        
        const cityText = `${trip.city || ''}, ${trip.country || ''}`;
        const cityWidth = pdf.getStringUnitWidth(cityText) * 18 / pdf.internal.scaleFactor;
        const cityX = (pageWidth - cityWidth) / 2;
        pdf.text(cityText, cityX, pageHeight / 2);
        
        const dateText = `${formatDate(trip.start_date || '')} - ${formatDate(trip.end_date || '')}`;
        const dateWidth = pdf.getStringUnitWidth(dateText) * 18 / pdf.internal.scaleFactor;
        const dateX = (pageWidth - dateWidth) / 2;
        pdf.text(dateText, dateX, pageHeight / 2 + 10);
        
        const numPeopleText = `${trip.num_people} pessoa${trip.num_people !== 1 ? 's' : ''}`;
        const peopleWidth = pdf.getStringUnitWidth(numPeopleText) * 18 / pdf.internal.scaleFactor;
        const peopleX = (pageWidth - peopleWidth) / 2;
        pdf.text(numPeopleText, peopleX, pageHeight / 2 + 20);
        
        // Generate pages for each day
        let yPosition = 0;
        
        for (let i = 0; i < itinerary.length; i++) {
          const day = itinerary[i];
          
          // Add a new page for each day
          pdf.addPage();
          yPosition = margin;
          
          // Create a light gradient background
          pdf.setFillColor(245, 246, 250);
          pdf.rect(0, 0, pageWidth, pageHeight, 'F');
          
          // Day header with a nicer color scheme
          pdf.setFillColor(90, 78, 148);  // Deep purple
          pdf.rect(margin, yPosition, pageWidth - 2 * margin, 20, 'F');
          
          pdf.setTextColor(255, 255, 255);
          pdf.setFont("RobotoCondensed", "bold");
          pdf.setFontSize(16);
          pdf.text(`Dia ${day.day} - ${formatDate(day.date)}`, margin + 5, yPosition + 13);
          
          yPosition += 30;
          
          // Morning section with improved styling
          pdf.setDrawColor(90, 78, 148);  // Deep purple
          pdf.setLineWidth(0.8);
          
          pdf.setTextColor(90, 78, 148);  // Deep purple
          pdf.setFontSize(14);
          pdf.text("Manhã", margin, yPosition);
          pdf.line(margin + 45, yPosition - 2, pageWidth - margin, yPosition - 2);
          
          yPosition += 10;
          pdf.setTextColor(50, 50, 50);  // Dark gray for better readability
          pdf.setFont("RobotoCondensed", "normal");
          pdf.setFontSize(12);
          
          if (day.morning.length > 0) {
            for (const poi of day.morning) {
              // Add a subtle background for each activity
              pdf.setFillColor(237, 238, 246);
              pdf.roundedRect(margin - 2, yPosition - 4, pageWidth - 2 * margin + 4, 25, 2, 2, 'F');
              
              pdf.setFont("RobotoCondensed", "bold");
              pdf.text(poi.name, margin, yPosition);
              yPosition += 6;
              
              pdf.setFont("RobotoCondensed", "normal");
              pdf.text(`Tipo: ${poi.type}`, margin, yPosition);
              
              if (poi.openingHours) {
                pdf.text(`Horário: ${poi.openingHours}`, margin + 70, yPosition);
              }
              
              yPosition += 6;
              
              if (poi.ticketPrice) {
                pdf.text(`Preço: ${poi.ticketPrice}`, margin, yPosition);
              }
              
              yPosition += 10;
            }
          } else {
            pdf.text("Tempo livre para explorar a cidade.", margin, yPosition);
            yPosition += 10;
          }
          
          // Lunch section with improved styling
          if (yPosition > pageHeight - 60) {
            pdf.addPage();
            
            // Continue the light gradient background
            pdf.setFillColor(245, 246, 250);
            pdf.rect(0, 0, pageWidth, pageHeight, 'F');
            
            yPosition = margin;
          }
          
          yPosition += 5;
          pdf.setTextColor(233, 164, 80);  // Warm orange for meals
          pdf.setFontSize(14);
          pdf.setFont("RobotoCondensed", "bold");
          pdf.text("Almoço", margin, yPosition);
          pdf.setDrawColor(233, 164, 80);
          pdf.line(margin + 45, yPosition - 2, pageWidth - margin, yPosition - 2);
          
          yPosition += 10;
          pdf.setTextColor(50, 50, 50);
          pdf.setFont("RobotoCondensed", "normal");
          pdf.setFontSize(12);
          
          if (day.lunch) {
            // Add a subtle background for the meal
            pdf.setFillColor(249, 237, 226);
            pdf.roundedRect(margin - 2, yPosition - 4, pageWidth - 2 * margin + 4, 25, 2, 2, 'F');
            
            pdf.setFont("RobotoCondensed", "bold");
            pdf.text(day.lunch.name, margin, yPosition);
            yPosition += 6;
            
            pdf.setFont("RobotoCondensed", "normal");
            pdf.text(`Cozinha: ${day.lunch.cuisine}`, margin, yPosition);
            pdf.text(`Preço: ${day.lunch.priceLevel}`, margin + 80, yPosition);
            yPosition += 6;
            
            if (day.lunch.rating) {
              pdf.text(`Avaliação: ${day.lunch.rating}/5`, margin, yPosition);
            }
            
            yPosition += 10;
          } else {
            pdf.text("Sugestão: explore restaurantes locais.", margin, yPosition);
            yPosition += 10;
          }
          
          // Afternoon section with improved styling
          if (yPosition > pageHeight - 60) {
            pdf.addPage();
            
            // Continue the light gradient background
            pdf.setFillColor(245, 246, 250);
            pdf.rect(0, 0, pageWidth, pageHeight, 'F');
            
            yPosition = margin;
          }
          
          yPosition += 5;
          pdf.setTextColor(90, 78, 148);  // Deep purple
          pdf.setFontSize(14);
          pdf.setFont("RobotoCondensed", "bold");
          pdf.text("Tarde", margin, yPosition);
          pdf.setDrawColor(90, 78, 148);
          pdf.line(margin + 45, yPosition - 2, pageWidth - margin, yPosition - 2);
          
          yPosition += 10;
          pdf.setTextColor(50, 50, 50);
          pdf.setFont("RobotoCondensed", "normal");
          pdf.setFontSize(12);
          
          if (day.afternoon.length > 0) {
            for (const poi of day.afternoon) {
              // Add a subtle background for each activity
              pdf.setFillColor(237, 238, 246);
              pdf.roundedRect(margin - 2, yPosition - 4, pageWidth - 2 * margin + 4, 25, 2, 2, 'F');
              
              pdf.setFont("RobotoCondensed", "bold");
              pdf.text(poi.name, margin, yPosition);
              yPosition += 6;
              
              pdf.setFont("RobotoCondensed", "normal");
              pdf.text(`Tipo: ${poi.type}`, margin, yPosition);
              
              if (poi.openingHours) {
                pdf.text(`Horário: ${poi.openingHours}`, margin + 70, yPosition);
              }
              
              yPosition += 6;
              
              if (poi.ticketPrice) {
                pdf.text(`Preço: ${poi.ticketPrice}`, margin, yPosition);
              }
              
              yPosition += 10;
            }
          } else {
            pdf.text("Tempo livre para explorar a cidade.", margin, yPosition);
            yPosition += 10;
          }
          
          // Dinner section with improved styling
          if (yPosition > pageHeight - 60) {
            pdf.addPage();
            
            // Continue the light gradient background
            pdf.setFillColor(245, 246, 250);
            pdf.rect(0, 0, pageWidth, pageHeight, 'F');
            
            yPosition = margin;
          }
          
          yPosition += 5;
          pdf.setTextColor(233, 164, 80);  // Warm orange for meals
          pdf.setFontSize(14);
          pdf.setFont("RobotoCondensed", "bold");
          pdf.text("Jantar", margin, yPosition);
          pdf.setDrawColor(233, 164, 80);
          pdf.line(margin + 45, yPosition - 2, pageWidth - margin, yPosition - 2);
          
          yPosition += 10;
          pdf.setTextColor(50, 50, 50);
          pdf.setFont("RobotoCondensed", "normal");
          pdf.setFontSize(12);
          
          if (day.dinner) {
            // Add a subtle background for the meal
            pdf.setFillColor(249, 237, 226);
            pdf.roundedRect(margin - 2, yPosition - 4, pageWidth - 2 * margin + 4, 25, 2, 2, 'F');
            
            pdf.setFont("RobotoCondensed", "bold");
            pdf.text(day.dinner.name, margin, yPosition);
            yPosition += 6;
            
            pdf.setFont("RobotoCondensed", "normal");
            pdf.text(`Cozinha: ${day.dinner.cuisine}`, margin, yPosition);
            pdf.text(`Preço: ${day.dinner.priceLevel}`, margin + 80, yPosition);
            yPosition += 6;
            
            if (day.dinner.rating) {
              pdf.text(`Avaliação: ${day.dinner.rating}/5`, margin, yPosition);
            }
            
            yPosition += 10;
          } else {
            pdf.text("Sugestão: explore restaurantes locais.", margin, yPosition);
            yPosition += 10;
          }
          
          // Add page number at the bottom
          pdf.setTextColor(130, 130, 130);
          pdf.setFontSize(10);
          pdf.text(`Página ${i + 2} de ${itinerary.length + 1}`, pageWidth - 40, pageHeight - 10);
        }
        
        // Add a footer to the cover page
        pdf.setPage(1);
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(10);
        pdf.text("Página 1 de " + (itinerary.length + 1), pageWidth - 40, pageHeight - 10);
        
        // Download PDF
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
