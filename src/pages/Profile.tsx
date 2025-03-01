
import { Navigation } from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BackgroundImage } from "@/components/BackgroundImage";
import { LoginForm } from "@/components/LoginForm";
import { RegisterForm } from "@/components/RegisterForm";

const Profile = () => {
  return (
    <div className="min-h-screen bg-neutral-50 relative">
      <Navigation />
      
      {/* Imagem de fundo */}
      <BackgroundImage />
      
      <div className="relative z-10 max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-card/80 backdrop-blur-sm">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="register">Registrar</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm />
          </TabsContent>
          <TabsContent value="register">
            <RegisterForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
