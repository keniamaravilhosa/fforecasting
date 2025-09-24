import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Store, 
  Palette, 
  TrendingUp, 
  Users, 
  Crown, 
  Gift,
  ArrowRight,
  Check
} from "lucide-react";

interface UserTypeSelectionProps {
  onSelectType: (type: 'brand' | 'stylist') => void;
}

const UserTypeSelection = ({ onSelectType }: UserTypeSelectionProps) => {
  return (
    <section className="py-20">
      <div className="container px-4 md:px-6 max-w-4xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Escolha seu <span className="text-terracotta">Perfil</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-[600px] mx-auto">
            Selecione como você deseja usar o FForecasting para uma experiência personalizada
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Marca Card */}
          <Card className="relative overflow-hidden border-2 hover:border-terracotta/50 transition-all duration-300 cursor-pointer group">
            <div className="absolute top-4 right-4">
              <Badge className="bg-terracotta text-white">Recomendado</Badge>
            </div>
            
            <CardHeader className="text-center pb-6">
              <div className="mx-auto p-4 bg-accent rounded-full w-fit mb-4 group-hover:bg-peach/30 transition-colors">
                <Store className="h-8 w-8 text-terracotta" />
              </div>
              <CardTitle className="text-2xl">Sou uma Marca</CardTitle>
              <CardDescription className="text-base">
                Marcas de moda feminina que buscam insights estratégicos baseados em dados
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-terracotta flex-shrink-0" />
                  <span className="text-sm">Ranking personalizado de tendências</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-terracotta flex-shrink-0" />
                  <span className="text-sm">Scores baseados no seu público-alvo</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-terracotta flex-shrink-0" />
                  <span className="text-sm">Dashboard com métricas detalhadas</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-terracotta flex-shrink-0" />
                  <span className="text-sm">Questionário de diagnóstico</span>
                </div>
              </div>
              
              <Button 
                className="w-full bg-terracotta hover:bg-dark-terracotta text-white"
                onClick={() => onSelectType('brand')}
              >
                Continuar como Marca
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Acesso completo • Sem compromisso inicial
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Estilista Card */}
          <Card className="relative overflow-hidden border-2 hover:border-peach/50 transition-all duration-300 cursor-pointer group">
            <div className="absolute top-4 right-4">
              <Badge variant="secondary" className="bg-peach/20 text-dark-terracotta">
                <Crown className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            </div>
            
            <CardHeader className="text-center pb-6">
              <div className="mx-auto p-4 bg-peach/20 rounded-full w-fit mb-4 group-hover:bg-peach/40 transition-colors">
                <Palette className="h-8 w-8 text-terracotta" />
              </div>
              <CardTitle className="text-2xl">Sou Estilista</CardTitle>
              <CardDescription className="text-base">
                Profissionais de moda que desejam indicar marcas e acessar conteúdo premium
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Gift className="h-4 w-4 text-secondary flex-shrink-0" />
                  <span className="text-sm">Gerar links de convite únicos</span>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-4 w-4 text-secondary flex-shrink-0" />
                  <span className="text-sm">Acesso premium ao indicar marcas</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-secondary flex-shrink-0" />
                  <span className="text-sm">Rede exclusiva de profissionais</span>
                </div>
                <div className="flex items-center gap-3">
                  <Crown className="h-4 w-4 text-secondary flex-shrink-0" />
                  <span className="text-sm">Scores completos das tendências</span>
                </div>
              </div>
              
              <Button 
                variant="outline"
                className="w-full border-peach hover:bg-peach/10 text-terracotta"
                onClick={() => onSelectType('stylist')}
              >
                Continuar como Estilista
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Gratuito • Ganhe acesso premium indicando
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Não tem certeza? Você pode alterar seu tipo de conta depois.
          </p>
        </div>
      </div>
    </section>
  );
};

export default UserTypeSelection;