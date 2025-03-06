
import { Button } from "@/components/ui/button";
import { FileDown, AlertOctagon } from "lucide-react";
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
        
        // Add introduction text - personalized for 3-day itinerary
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
        
        // Generate pages for each day - with improved formatting
        
        // Special content for Paris - rich content example
        const isParis = trip.city?.toLowerCase() === "paris";
        
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
          
          // Day title with theme for Paris
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
            pdf.setFont("RobotoCondensed", "bold");
            pdf.text("1. Torre Eiffel (08h30 - 10h00)", margin, yPosition);
            yPosition += 8;
            
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
            
            yPosition += 4;
            pdf.setFont("RobotoCondensed", "bold");
            pdf.text("2. Museu do Louvre (10h30 - 13h30)", margin, yPosition);
            yPosition += 8;
            
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
            
            pdf.setFont("RobotoCondensed", "normal");
            const orsayDesc = [
              "    Impressionismo e pós-impressionismo: Van Gogh, Monet e Renoir.",
              "    Endereço: 1 Rue de la Légion d'Honneur, 75007"
            ];
            
            orsayDesc.forEach(line => {
              pdf.text(line, margin, yPosition);
              yPosition += 6;
            });
            
            yPosition += 4;
            pdf.setFont("RobotoCondensed", "bold");
            pdf.text("2. Jardim de Luxemburgo (11h30 - 12h30)", margin, yPosition);
            yPosition += 8;
            
            pdf.setFont("RobotoCondensed", "normal");
            pdf.text("    Passeio relaxante pelo jardim mais elegante de Paris.", margin, yPosition);
            yPosition += 6;
          }
          // Special content for Paris Day 3 morning
          else if (isParis && day.day === 3) {
            pdf.setFont("RobotoCondensed", "bold");
            pdf.text("1. Palácio de Versalhes (08h30 - 12h30)", margin, yPosition);
            yPosition += 8;
            
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
            
            pdf.setFont("RobotoCondensed", "normal");
            pdf.text("    Caminhada pela Île de la Cité e visita à Catedral (se reaberta após restauração).", margin, yPosition);
            yPosition += 6;
            pdf.text("    Endereço: Parvis Notre-Dame - Pl. Jean-Paul II, 75004", margin, yPosition);
            yPosition += 10;
            
            pdf.setFont("RobotoCondensed", "bold");
            pdf.text("4. Passeio pelo Quartier Latin (16h45 - 18h00)", margin, yPosition);
            yPosition += 8;
            
            pdf.setFont("RobotoCondensed", "normal");
            pdf.text("    Explore a Rue de la Huchette, o Panthéon e a Sorbonne.", margin, yPosition);
            yPosition += 10;
          }
          // Special content for Paris Day 2 afternoon
          else if (isParis && day.day === 2) {
            pdf.setFont("RobotoCondensed", "bold");
            pdf.text("3. Montmartre e Basílica de Sacré-Cœur (14h30 - 17h00)", margin, yPosition);
            yPosition += 8;
            
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
            
            pdf.setFont("RobotoCondensed", "normal");
            pdf.text("    Foto na icônica fachada do cabaré mais famoso do mundo.", margin, yPosition);
            yPosition += 10;
          }
          // Special content for Paris Day 3 afternoon
          else if (isParis && day.day === 3) {
            pdf.setFont("RobotoCondensed", "bold");
            pdf.text("2. La Défense (15h30 - 17h00)", margin, yPosition);
            yPosition += 8;
            
            pdf.setFont("RobotoCondensed", "normal");
            pdf.text("    Bairro moderno com arranha-céus e o Grande Arco.", margin, yPosition);
            yPosition += 10;
            
            pdf.setFont("RobotoCondensed", "bold");
            pdf.text("3. Champs-Élysées e Arco do Triunfo (17h30 - 19h00)", margin, yPosition);
            yPosition += 8;
            
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
      className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600"
    >
      <FileDown className="h-4 w-4" />
      <span>Exportar PDF</span>
    </Button>
  );
};
