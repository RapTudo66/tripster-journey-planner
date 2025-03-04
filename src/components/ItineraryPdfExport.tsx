
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

  const exportToPdf = async () => {
    toast({
      title: "Exportando roteiro",
      description: "Preparando seu PDF. Isso pode levar alguns segundos...",
    });

    try {
      // Create a new PDF document
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      
      // Add title page
      pdf.setFillColor(102, 89, 165); // Primary color
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(24);
      const titleText = `Roteiro: ${trip.title}`;
      const titleWidth = pdf.getStringUnitWidth(titleText) * 24 / pdf.internal.scaleFactor;
      const titleX = (pageWidth - titleWidth) / 2;
      pdf.text(titleText, titleX, 50);
      
      pdf.setFontSize(16);
      const cityText = `${trip.city}, ${trip.country}`;
      const cityWidth = pdf.getStringUnitWidth(cityText) * 16 / pdf.internal.scaleFactor;
      const cityX = (pageWidth - cityWidth) / 2;
      pdf.text(cityText, cityX, 60);
      
      const dateText = `${formatDate(trip.start_date || '')} - ${formatDate(trip.end_date || '')}`;
      const dateWidth = pdf.getStringUnitWidth(dateText) * 16 / pdf.internal.scaleFactor;
      const dateX = (pageWidth - dateWidth) / 2;
      pdf.text(dateText, dateX, 70);
      
      pdf.setFontSize(14);
      const numPeopleText = `${trip.num_people} pessoa${trip.num_people !== 1 ? 's' : ''}`;
      const peopleWidth = pdf.getStringUnitWidth(numPeopleText) * 14 / pdf.internal.scaleFactor;
      const peopleX = (pageWidth - peopleWidth) / 2;
      pdf.text(numPeopleText, peopleX, 80);
      
      // Generate pages for each day
      let yPosition = 0;
      
      for (let i = 0; i < itinerary.length; i++) {
        const day = itinerary[i];
        
        // Add a new page for each day
        pdf.addPage();
        yPosition = margin;
        
        // Day header
        pdf.setFillColor(102, 89, 165); // Primary color
        pdf.rect(margin, yPosition, pageWidth - 2 * margin, 15, 'F');
        
        pdf.setTextColor(255, 255, 255);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(14);
        pdf.text(`Dia ${day.day} - ${formatDate(day.date)}`, margin + 5, yPosition + 10);
        
        yPosition += 20;
        
        // Morning section
        pdf.setTextColor(102, 89, 165);
        pdf.setFontSize(12);
        pdf.text("Manhã", margin, yPosition);
        pdf.setLineWidth(0.5);
        pdf.line(margin, yPosition + 1, pageWidth - margin, yPosition + 1);
        
        yPosition += 10;
        pdf.setTextColor(0, 0, 0);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        
        if (day.morning.length > 0) {
          for (const poi of day.morning) {
            pdf.setFont("helvetica", "bold");
            pdf.text(poi.name, margin, yPosition);
            yPosition += 5;
            
            pdf.setFont("helvetica", "normal");
            pdf.text(`Tipo: ${poi.type}`, margin, yPosition);
            yPosition += 5;
            
            if (poi.openingHours) {
              pdf.text(`Horário: ${poi.openingHours}`, margin, yPosition);
              yPosition += 5;
            }
            
            if (poi.ticketPrice) {
              pdf.text(`Preço: ${poi.ticketPrice}`, margin, yPosition);
              yPosition += 5;
            }
            
            yPosition += 5;
          }
        } else {
          pdf.text("Tempo livre para explorar a cidade.", margin, yPosition);
          yPosition += 10;
        }
        
        // Lunch section
        if (yPosition > pageHeight - 50) {
          pdf.addPage();
          yPosition = margin;
        }
        
        pdf.setTextColor(240, 213, 143); // Accent color for meals
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text("Almoço", margin, yPosition);
        pdf.setLineWidth(0.5);
        pdf.line(margin, yPosition + 1, pageWidth - margin, yPosition + 1);
        
        yPosition += 10;
        pdf.setTextColor(0, 0, 0);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        
        if (day.lunch) {
          pdf.setFont("helvetica", "bold");
          pdf.text(day.lunch.name, margin, yPosition);
          yPosition += 5;
          
          pdf.setFont("helvetica", "normal");
          pdf.text(`Cozinha: ${day.lunch.cuisine}`, margin, yPosition);
          yPosition += 5;
          
          pdf.text(`Preço: ${day.lunch.priceLevel}`, margin, yPosition);
          yPosition += 5;
          
          if (day.lunch.rating) {
            pdf.text(`Avaliação: ${day.lunch.rating}/5`, margin, yPosition);
            yPosition += 5;
          }
          
          yPosition += 5;
        } else {
          pdf.text("Sugestão: explore restaurantes locais.", margin, yPosition);
          yPosition += 10;
        }
        
        // Afternoon section
        if (yPosition > pageHeight - 50) {
          pdf.addPage();
          yPosition = margin;
        }
        
        pdf.setTextColor(102, 89, 165);
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text("Tarde", margin, yPosition);
        pdf.setLineWidth(0.5);
        pdf.line(margin, yPosition + 1, pageWidth - margin, yPosition + 1);
        
        yPosition += 10;
        pdf.setTextColor(0, 0, 0);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        
        if (day.afternoon.length > 0) {
          for (const poi of day.afternoon) {
            pdf.setFont("helvetica", "bold");
            pdf.text(poi.name, margin, yPosition);
            yPosition += 5;
            
            pdf.setFont("helvetica", "normal");
            pdf.text(`Tipo: ${poi.type}`, margin, yPosition);
            yPosition += 5;
            
            if (poi.openingHours) {
              pdf.text(`Horário: ${poi.openingHours}`, margin, yPosition);
              yPosition += 5;
            }
            
            if (poi.ticketPrice) {
              pdf.text(`Preço: ${poi.ticketPrice}`, margin, yPosition);
              yPosition += 5;
            }
            
            yPosition += 5;
          }
        } else {
          pdf.text("Tempo livre para explorar a cidade.", margin, yPosition);
          yPosition += 10;
        }
        
        // Dinner section
        if (yPosition > pageHeight - 50) {
          pdf.addPage();
          yPosition = margin;
        }
        
        pdf.setTextColor(240, 213, 143); // Accent color for meals
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text("Jantar", margin, yPosition);
        pdf.setLineWidth(0.5);
        pdf.line(margin, yPosition + 1, pageWidth - margin, yPosition + 1);
        
        yPosition += 10;
        pdf.setTextColor(0, 0, 0);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        
        if (day.dinner) {
          pdf.setFont("helvetica", "bold");
          pdf.text(day.dinner.name, margin, yPosition);
          yPosition += 5;
          
          pdf.setFont("helvetica", "normal");
          pdf.text(`Cozinha: ${day.dinner.cuisine}`, margin, yPosition);
          yPosition += 5;
          
          pdf.text(`Preço: ${day.dinner.priceLevel}`, margin, yPosition);
          yPosition += 5;
          
          if (day.dinner.rating) {
            pdf.text(`Avaliação: ${day.dinner.rating}/5`, margin, yPosition);
            yPosition += 5;
          }
          
          yPosition += 5;
        } else {
          pdf.text("Sugestão: explore restaurantes locais.", margin, yPosition);
          yPosition += 10;
        }
      }
      
      // Download PDF
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
