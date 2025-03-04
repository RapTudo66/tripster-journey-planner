
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { ItineraryDay } from "@/lib/supabase";
import { formatDate } from "@/utils/dateUtils";
import { useToast } from "@/components/ui/use-toast";

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

  const exportToPdf = () => {
    // In a real app, we would generate a PDF here
    // For this mockup, we'll just show a toast
    toast({
      title: "Exportando roteiro",
      description: "O roteiro foi exportado para PDF com sucesso!",
    });

    // Simulate PDF download
    setTimeout(() => {
      const element = document.createElement("a");
      element.setAttribute("href", "data:text/plain;charset=utf-8,");
      element.setAttribute("download", `Roteiro_${trip.title.replace(/\s+/g, "_")}.pdf`);
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 1000);
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
