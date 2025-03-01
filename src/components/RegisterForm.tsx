
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { signUp } = useAuth();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirm-password') as string;
    const fullName = formData.get('full-name') as string;

    if (password !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      await signUp(email, password, fullName);
      toast({
        title: "Registro realizado com sucesso",
        description: "Confira seu e-mail para confirmar o registro",
      });
      // Não navegamos automaticamente após o registro pois o usuário precisa confirmar o email
    } catch (error: any) {
      console.error('Erro no registro:', error);
      toast({
        title: "Erro no registro",
        description: error.message || "Falha ao criar conta",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-lg border bg-card/95 backdrop-blur-sm p-8 shadow-xl">
      <h2 className="text-2xl font-semibold mb-6 text-white">Criar Conta</h2>
      <form onSubmit={handleRegister} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="full-name" className="text-white">Nome Completo</Label>
          <Input
            id="full-name"
            name="full-name"
            type="text"
            placeholder="Digite seu nome completo"
            required
            className="bg-neutral-800/70 border-neutral-700 text-white placeholder:text-neutral-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="register-email" className="text-white">E-mail</Label>
          <Input
            id="register-email"
            name="email"
            type="email"
            placeholder="Digite seu e-mail"
            required
            className="bg-neutral-800/70 border-neutral-700 text-white placeholder:text-neutral-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="register-password" className="text-white">Senha</Label>
          <Input
            id="register-password"
            name="password"
            type="password"
            placeholder="Crie uma senha"
            required
            minLength={6}
            className="bg-neutral-800/70 border-neutral-700 text-white placeholder:text-neutral-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password" className="text-white">Confirmar Senha</Label>
          <Input
            id="confirm-password"
            name="confirm-password"
            type="password"
            placeholder="Confirme sua senha"
            required
            minLength={6}
            className="bg-neutral-800/70 border-neutral-700 text-white placeholder:text-neutral-400"
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary-dark mt-4"
          disabled={isLoading}
        >
          {isLoading ? "Carregando..." : "Criar Conta"}
        </Button>
      </form>
    </div>
  );
};
