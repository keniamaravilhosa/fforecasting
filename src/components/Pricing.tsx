import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
  const navigate = useNavigate();

  const features = [
    { name: "Acesso a tendências", stylist: true, brand: true },
    { name: "Atualizações periódicas", stylist: true, brand: true },
    { name: "Dashboard personalizado", stylist: true, brand: true },
    { name: "Sistema de convites ilimitados", stylist: true, brand: false },
    { name: "Programa de bônus por indicação", stylist: true, brand: false },
    { name: "Acesso premium automático", stylist: true, brand: false },
    { name: "Tendências personalizadas", stylist: false, brand: true },
    { name: "Scores customizados (4 critérios)", stylist: false, brand: true },
    { name: "Análise de público-alvo", stylist: false, brand: true },
    { name: "Insights baseados em dados", stylist: false, brand: true },
    { name: "Atualizações em tempo real", stylist: false, brand: true },
    { name: "Acesso prioritário a novidades", stylist: false, brand: true },
    { name: "Suporte especializado", stylist: false, brand: true },
    { name: "Relatórios detalhados", stylist: false, brand: true },
    { name: "Consultoria exclusiva", stylist: false, brand: true },
  ];

  return (
    <section id="pricing" className="py-20 lg:py-32 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4 sm:text-4xl">
            Planos e Preços
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Escolha o plano ideal para suas necessidades. Compare recursos e encontre a melhor opção para você.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto">
          {/* Card Estilista */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl">Estilista</CardTitle>
              <CardDescription>Para profissionais da moda</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">GRATUITO</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    {feature.stylist ? (
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <X className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    )}
                    <span className={feature.stylist ? "text-foreground" : "text-muted-foreground"}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => navigate('/register')}
              >
                Começar Gratuitamente
              </Button>
            </CardFooter>
          </Card>

          {/* Card Marca de Moda */}
          <Card className="hover:shadow-xl transition-shadow border-terracotta/50 shadow-lg relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <Badge className="bg-terracotta hover:bg-dark-terracotta text-white px-4 py-1">
                Mais Popular
              </Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">Marca de Moda</CardTitle>
              <CardDescription>Para empresas de moda</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-terracotta">R$ 99,90</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    {feature.brand ? (
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <X className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    )}
                    <span className={feature.brand ? "text-foreground font-medium" : "text-muted-foreground"}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-terracotta hover:bg-dark-terracotta text-white" 
                onClick={() => navigate('/register')}
              >
                Assinar Agora
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Todos os planos incluem acesso seguro, suporte técnico e atualizações constantes. 
            Marcas de moda só podem acessar a plataforma através de convites de estilistas cadastrados.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
