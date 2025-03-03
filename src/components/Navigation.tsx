
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, UserCheck, Map, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useMobile } from "@/hooks/use-mobile";

export const Navigation = () => {
  const { user, signOut } = useAuth();
  const isMobile = useMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Define TypeScript type para as classes da janela
  declare global {
    interface Window {
      initMap?: () => void;
    }
  }

  // Fecha o menu ao navegar para outra rota
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav className="bg-card border-b border-border shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Map className="h-5 w-5 text-primary" />
              <span className="text-xl font-bold text-foreground">Magic Route</span>
            </Link>
          </div>
          
          {isMobile ? (
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px] bg-card">
                <div className="flex flex-col gap-4 mt-8">
                  {user ? (
                    <>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground p-2 border border-border rounded-md">
                        <UserCheck className="h-4 w-4 text-primary" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      <Link to="/trips" className="w-full">
                        <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 w-full">
                          Minhas Viagens
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost"
                        className="hover:bg-primary/10 hover:text-primary w-full"
                        onClick={() => signOut()}
                      >
                        Sair
                      </Button>
                    </>
                  ) : (
                    <Link to="/profile" className="w-full">
                      <Button className="bg-primary hover:bg-primary-dark text-white flex items-center gap-2 w-full">
                        <LogIn className="h-4 w-4" />
                        Entrar
                      </Button>
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <UserCheck className="h-4 w-4 text-primary" />
                    <span>{user.email}</span>
                  </div>
                  <Link to="/trips">
                    <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                      Minhas Viagens
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost"
                    className="hover:bg-primary/10 hover:text-primary"
                    onClick={() => signOut()}
                  >
                    Sair
                  </Button>
                </>
              ) : (
                <Link to="/profile">
                  <Button className="bg-primary hover:bg-primary-dark text-white flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Entrar
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
