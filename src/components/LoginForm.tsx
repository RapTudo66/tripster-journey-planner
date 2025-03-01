
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      await signIn(email, password);
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo de volta!",
      });
      navigate('/'); // Navega para a página inicial
    } catch (error: any) {
      console.error('Erro no login:', error);
      toast({
        title: "Erro no login",
        description: error.message || "Credenciais inválidas",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-lg border bg-card/95 backdrop-blur-sm p-8 shadow-xl">
      <h2 className="text-2xl font-semibold mb-6 text-white">Bem-vindo de Volta</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white">E-mail</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Digite seu e-mail"
            required
            className="bg-neutral-800/70 border-neutral-700 text-white placeholder:text-neutral-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-white">Senha</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Digite sua senha"
            required
            className="bg-neutral-800/70 border-neutral-700 text-white placeholder:text-neutral-400"
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary-dark mt-4"
          disabled={isLoading}
        >
          {isLoading ? "Carregando..." : "Entrar"}
        </Button>
      </form>
    </div>
  );
};
