
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

// Imagens de capitais do mundo para uso aleatório
const capitalImages = [
  "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop", // Paris
  "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?q=80&w=2070&auto=format&fit=crop", // Londres
  "https://images.unsplash.com/photo-1522083165195-3424ed129620?q=80&w=2070&auto=format&fit=crop", // Tóquio
  "https://images.unsplash.com/photo-1534430480872-3498386e7856?q=80&w=2070&auto=format&fit=crop", // Nova York
  "https://images.unsplash.com/photo-1577334928618-2f7402b70b4c?q=80&w=2071&auto=format&fit=crop", // Roma
  "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2070&auto=format&fit=crop", // Sidney
  "https://images.unsplash.com/photo-1597534458220-9fb4969f2df5?q=80&w=2069&auto=format&fit=crop", // Lisboa
  "https://images.unsplash.com/photo-1560455310-57cf2676a8f9?q=80&w=2071&auto=format&fit=crop", // Berlim
  "https://images.unsplash.com/photo-1589352757699-28891ca59104?q=80&w=2070&auto=format&fit=crop", // Madri
  "https://images.unsplash.com/photo-1549996154-d8061c91acb8?q=80&w=2070&auto=format&fit=crop", // São Paulo
];

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const { toast } = useToast();
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Seleciona uma imagem aleatória das capitais
    const randomIndex = Math.floor(Math.random() * capitalImages.length);
    setBackgroundImage(capitalImages[randomIndex]);
  }, []);

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
      navigate('/dashboard');
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
    <div className="min-h-screen bg-neutral-50 relative">
      <Navigation />
      
      {/* Imagem de fundo */}
      {backgroundImage && (
        <div 
          className="absolute inset-0 z-0 bg-image-fade-in" 
          style={{ 
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-70"></div>
        </div>
      )}
      
      <div className="relative z-10 max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-card/80 backdrop-blur-sm">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="register">Registrar</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <div className="rounded-lg border bg-white/90 backdrop-blur-sm p-8 shadow-xl">
              <h2 className="text-2xl font-semibold mb-6">Bem-vindo de Volta</h2>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Digite seu e-mail"
                    required
                    className="bg-white/70"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Digite sua senha"
                    required
                    className="bg-white/70"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-dark"
                  disabled={isLoading}
                >
                  {isLoading ? "Carregando..." : "Entrar"}
                </Button>
              </form>
            </div>
          </TabsContent>
          <TabsContent value="register">
            <div className="rounded-lg border bg-white/90 backdrop-blur-sm p-8 shadow-xl">
              <h2 className="text-2xl font-semibold mb-6">Criar Conta</h2>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full-name">Nome Completo</Label>
                  <Input
                    id="full-name"
                    name="full-name"
                    type="text"
                    placeholder="Digite seu nome completo"
                    required
                    className="bg-white/70"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">E-mail</Label>
                  <Input
                    id="register-email"
                    name="email"
                    type="email"
                    placeholder="Digite seu e-mail"
                    required
                    className="bg-white/70"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Senha</Label>
                  <Input
                    id="register-password"
                    name="password"
                    type="password"
                    placeholder="Crie uma senha"
                    required
                    minLength={6}
                    className="bg-white/70"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Senha</Label>
                  <Input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    placeholder="Confirme sua senha"
                    required
                    minLength={6}
                    className="bg-white/70"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-dark"
                  disabled={isLoading}
                >
                  {isLoading ? "Carregando..." : "Criar Conta"}
                </Button>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
