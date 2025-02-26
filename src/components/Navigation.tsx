
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, UserCheck } from "lucide-react";

export const Navigation = () => {
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-neutral-900">TripShare</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <UserCheck className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                <Link to="/trips">
                  <Button variant="outline">Minhas Viagens</Button>
                </Link>
                <Button 
                  variant="ghost" 
                  onClick={() => signOut()}
                >
                  Sair
                </Button>
              </>
            ) : (
              <Link to="/profile">
                <Button className="flex items-center gap-2">
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
