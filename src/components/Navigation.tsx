
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, UserCheck } from "lucide-react";

export const Navigation = () => {
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-foreground">TripShare</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
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
                <Button className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Entrar
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
