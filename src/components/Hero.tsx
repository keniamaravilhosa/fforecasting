import { Button } from "@/components/ui/button";
import { TrendingUp, Target, BarChart3, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-subtle -z-10" />
      
      <div className="container px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Transforme Tendências em{" "}
                <span className="text-terracotta">Resultados Concretos</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-[500px]">
                Inteligência estratégica baseada em dados que converte tendências abstratas 
                em insights acionáveis para marcas de moda feminina através de uma rede colaborativa de estilistas.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-terracotta hover:bg-dark-terracotta text-white"
                onClick={() => navigate('/register')}
              >
                Começar Gratuitamente
              </Button>
              <Button size="lg" variant="outline">
                Ver Como Funciona
              </Button>
            </div>
            
            <div className="flex items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-secondary rounded-full" />
                <span>70% das marcas via indicação</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-secondary rounded-full" />
                <span>85% precisão nos scores</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-card rounded-xl p-6 shadow-sm border">
                  <div className="flex items-center gap-3 mb-3">
                    <TrendingUp className="h-5 w-5 text-terracotta" />
                    <span className="font-semibold">Tendência: Y2K</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Relevância</span>
                      <span className="score-excellent font-semibold">95%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Público-Alvo</span>
                      <span className="score-excellent font-semibold">92%</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-card rounded-xl p-6 shadow-sm border">
                  <div className="flex items-center gap-3 mb-3">
                    <Target className="h-5 w-5 text-secondary" />
                    <span className="font-semibold">Score Final</span>
                  </div>
                  <div className="text-3xl font-bold text-terracotta">94</div>
                  <div className="text-sm text-muted-foreground">Altamente Recomendado</div>
                </div>
              </div>
              
              <div className="space-y-4 mt-8">
                <div className="bg-card rounded-xl p-6 shadow-sm border">
                  <div className="flex items-center gap-3 mb-3">
                    <BarChart3 className="h-5 w-5 text-secondary" />
                    <span className="font-semibold">Analytics</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Tendências Ativas</span>
                      <span className="font-semibold">247</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Marcas Conectadas</span>
                      <span className="font-semibold">89</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-card rounded-xl p-6 shadow-sm border">
                  <div className="flex items-center gap-3 mb-3">
                    <Users className="h-5 w-5 text-terracotta" />
                    <span className="font-semibold">Rede de Estilistas</span>
                  </div>
                  <div className="text-2xl font-bold text-secondary">127</div>
                  <div className="text-sm text-muted-foreground">Especialistas Ativos</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;