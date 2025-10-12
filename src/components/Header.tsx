import { Button } from "@/components/ui/button";
import logoIcon from "@/assets/logo-icon.jpg";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";

const Header = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { profile } = useProfile();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const scrollToSection = (sectionId: string) => {
    // Se não estiver na homepage, navegar primeiro
    if (window.location.pathname !== '/') {
      navigate('/');
      // Aguardar navegação e depois fazer scroll
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div 
          className="flex items-center space-x-3 cursor-pointer" 
          onClick={() => navigate('/')}
        >
          <img src={logoIcon} alt="FForecasting" className="h-8 w-8" />
          <span className="logo-text text-xl font-bold">FForecasting</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <button 
            onClick={() => scrollToSection('features')} 
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Recursos
          </button>
          <button 
            onClick={() => scrollToSection('how-it-works')} 
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Como Funciona
          </button>
          <button 
            onClick={() => scrollToSection('pricing')} 
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Preços
          </button>
        </nav>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {profile && (
                <span className="text-sm text-secondary">
                  Olá, {profile.full_name}
                </span>
              )}
              <Button 
                variant="ghost" 
                className="text-sm"
                onClick={() => navigate('/dashboard')}
              >
                Dashboard
              </Button>
              <Button 
                variant="ghost" 
                className="text-sm"
                onClick={handleSignOut}
              >
                Sair
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="ghost" 
                className="text-sm"
                onClick={() => navigate('/auth')}
              >
                Entrar
              </Button>
              <Button 
                className="text-sm bg-terracotta hover:bg-dark-terracotta"
                onClick={() => navigate('/register')}
              >
                Começar Agora
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;