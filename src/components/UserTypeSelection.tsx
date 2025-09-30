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
  onSelectType: (type: 'stylist') => void;
}

const UserTypeSelection = ({ onSelectType }: UserTypeSelectionProps) => {
  return (
    <div className="py-12 bg-gradient-to-b from-peach/10 to-background">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Bem-vindo à FForecasting</h1>
          <p className="text-xl text-muted-foreground">
            Complete seu cadastro como estilista
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Stylist Card */}
          <Card className="relative overflow-hidden hover:shadow-xl transition-shadow border-2 border-terracotta">
            <div className="absolute top-4 right-4">
              <Badge className="bg-peach text-terracotta">
                <Crown className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-terracotta" />
                Estilista
              </CardTitle>
              <CardDescription>
                Acesse insights exclusivos e indique marcas para ganhar benefícios
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Gift className="h-5 w-5 text-terracotta mt-0.5" />
                  <div>
                    <p className="font-medium">Sistema de Indicações</p>
                    <p className="text-sm text-muted-foreground">Ganhe acesso premium indicando marcas qualificadas</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-terracotta mt-0.5" />
                  <div>
                    <p className="font-medium">Tendências Exclusivas</p>
                    <p className="text-sm text-muted-foreground">Análises profundas do mercado de moda</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-terracotta mt-0.5" />
                  <div>
                    <p className="font-medium">Rede de Profissionais</p>
                    <p className="text-sm text-muted-foreground">Conecte-se com outros estilistas e marcas</p>
                  </div>
                </div>
              </div>
              <Button 
                className="w-full bg-terracotta hover:bg-dark-terracotta text-white"
                onClick={() => onSelectType('stylist')}
                size="lg"
              >
                Continuar como Estilista
              </Button>
            </CardContent>
          </Card>

          {/* Info para Marcas */}
          <div className="mt-8 p-6 bg-accent/50 rounded-lg text-center">
            <h3 className="font-semibold mb-2">Você é uma marca?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              O acesso para marcas é exclusivo por convite. Entre em contato com um estilista parceiro para receber seu link de cadastro.
            </p>
            <Badge variant="outline" className="text-xs">
              Acesso Restrito
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTypeSelection;