import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Brain, 
  Network, 
  LineChart, 
  Users2, 
  Target, 
  Zap,
  Shield,
  Clock
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Brain,
      title: "Inteligência Baseada em Dados",
      description: "Algoritmo proprietário que ranqueia tendências com 85% de precisão baseado em 4 critérios objetivos.",
      badge: "IA Avançada"
    },
    {
      icon: Network,
      title: "Sistema de Indicações",
      description: "Rede colaborativa de estilistas que conectam marcas qualificadas e ganham acesso premium automaticamente.",
      badge: "Exclusivo"
    },
    {
      icon: Target,
      title: "Personalização por Marca",
      description: "Scores customizados para cada negócio baseados no público-alvo, posicionamento e objetivos comerciais.",
      badge: "Personalizado"
    },
    {
      icon: LineChart,
      title: "Dashboard Inteligente",
      description: "Interface adaptativa que mostra conteúdo relevante baseado no seu nível de acesso e tipo de usuário.",
      badge: "Premium"
    },
    {
      icon: Users2,
      title: "Curadoria Especializada",
      description: "Time de analistas que monitora e avalia tendências globais para garantir qualidade dos insights.",
      badge: "Expert"
    },
    {
      icon: Zap,
      title: "Onboarding Rápido",
      description: "Processo de cadastro otimizado com questionário de diagnóstico para personalização imediata.",
      badge: "Eficiente"
    },
    {
      icon: Shield,
      title: "Links Seguros",
      description: "Sistema de convites com códigos únicos e rastreamento completo para máxima segurança.",
      badge: "Seguro"
    },
    {
      icon: Clock,
      title: "Atualizações em Tempo Real",
      description: "Tendências e scores atualizados continuamente para decisões baseadas em dados atuais.",
      badge: "Real-time"
    }
  ];

  return (
    <section id="features" className="py-20 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Recursos que <span className="text-terracotta">Revolucionam</span> a Moda
          </h2>
          <p className="mx-auto max-w-[700px] text-lg text-muted-foreground">
            Contra dados não há argumentos. Nossa plataforma combina inteligência artificial, 
            curadoria especializada e rede colaborativa para entregar insights precisos.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card key={index} className="relative overflow-hidden border-0 shadow-sm bg-card hover:shadow-md transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-accent">
                    <feature.icon className="h-5 w-5 text-terracotta" />
                  </div>
                  <Badge variant="secondary" className="text-xs bg-peach/20 text-dark-terracotta">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;