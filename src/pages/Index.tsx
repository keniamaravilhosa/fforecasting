import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  return <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />
        
        {/* CTA Section */}
        <section className="py-20 bg-terracotta text-white">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-4 sm:text-[t] text-white">Contra Dados Não Há Argumentos !</h2>
            <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">Fashion For Growth. Fashion For Data. Fashion Forecasting.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-terracotta hover:bg-cream" onClick={() => navigate('/register')}>
                Começar Gratuitamente
              </Button>
             <a
  href="https://api.whatsapp.com/send?phone=5511932763486&text=Ol%C3%A1,%20gostaria%20de%20saber%20mais%20sobre%20a%20plataforma%20de%20tend%C3%AAncias"
  target="_blank"
  rel="noopener noreferrer"
>
  <Button
    size="lg"
    variant="outline"
    className="border-white text-terracotta hover:bg-white/10"
  >
    Falar com Especialista
  </Button>
</a>

            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="container px-4 md:px-6 py-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <h3 className="font-heading font-semibold text-terracotta">FForecasting</h3>
              <p className="text-sm text-muted-foreground">
                Transformando tendências em insights acionáveis para marcas de moda feminina.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Produto</h4>
              <div className="space-y-2 text-sm">
                <div><a href="#" className="text-muted-foreground hover:text-terracotta">Recursos</a></div>
                <div><a href="#" className="text-muted-foreground hover:text-terracotta">Preços</a></div>
                <div><a href="#" className="text-muted-foreground hover:text-terracotta">API</a></div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Empresa</h4>
              <div className="space-y-2 text-sm">
                <div><a href="#" className="text-muted-foreground hover:text-terracotta">Sobre</a></div>
                <div><a href="#" className="text-muted-foreground hover:text-terracotta">Blog</a></div>
                <div><a href="#" className="text-muted-foreground hover:text-terracotta">Carreiras</a></div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Suporte</h4>
              <div className="space-y-2 text-sm">
                <div><a href="#" className="text-muted-foreground hover:text-terracotta">Ajuda</a></div>
                <div><a href="#" className="text-muted-foreground hover:text-terracotta">Contato</a></div>
                <div><a href="#" className="text-muted-foreground hover:text-terracotta">Status</a></div>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; 2024 FForecasting. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>;
};
export default Index;
