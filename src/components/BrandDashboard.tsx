import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Target, 
  BarChart3, 
  Star,
  ArrowUp,
  ArrowDown,
  Minus,
  ExternalLink
} from "lucide-react";

const BrandDashboard = () => {
  // Mock data for trends
  const trends = [
    {
      id: 1,
      name: "Y2K Revival",
      score: 94,
      category: "Styles",
      relevance: 95,
      audience: 92,
      commercial: 96,
      timing: 89,
      change: 5,
      status: "trending"
    },
    {
      id: 2,
      name: "Sustainable Fashion",
      score: 89,
      category: "Values",
      relevance: 87,
      audience: 94,
      commercial: 85,
      timing: 91,
      change: 3,
      status: "growing"
    },
    {
      id: 3,
      name: "Oversized Blazers",
      score: 82,
      category: "Items",
      relevance: 78,
      audience: 89,
      commercial: 84,
      timing: 77,
      change: -2,
      status: "stable"
    },
    {
      id: 4,
      name: "Cottagecore Aesthetic",
      score: 76,
      category: "Styles",
      relevance: 72,
      audience: 85,
      commercial: 71,
      timing: 76,
      change: -5,
      status: "declining"
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-amber-600";
    if (score >= 50) return "text-orange-600";
    return "text-red-600";
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUp className="h-3 w-3 text-green-600" />;
    if (change < 0) return <ArrowDown className="h-3 w-3 text-red-600" />;
    return <Minus className="h-3 w-3 text-gray-600" />;
  };

  return (
    <div className="py-8">
      <div className="container px-4 md:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard da Marca</h1>
          <p className="text-muted-foreground">
            Insights personalizados baseados no seu perfil e público-alvo
          </p>
        </div>

        {/* Metrics Overview */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tendências Ativas
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">247</div>
              <p className="text-xs text-muted-foreground">
                +12 esta semana
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Score Médio
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">84.3</div>
              <p className="text-xs text-muted-foreground">
                +2.1 vs mês anterior
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Alta Relevância
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">
                Score 90+ para você
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Próx. Atualização
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2h</div>
              <p className="text-xs text-muted-foreground">
                Dados em tempo real
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Personalized Trends Ranking */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Ranking Personalizado de Tendências</CardTitle>
                    <CardDescription>
                      Baseado no seu público: Millennials (25-40) • Preço Premium • E-commerce
                    </CardDescription>
                  </div>
                  <Link to="/todas-tendencias">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Ver Todas
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {trends.map((trend, index) => (
                    <div key={trend.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl font-bold text-muted-foreground">
                          #{index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{trend.name}</h3>
                            <Badge variant="secondary">{trend.category}</Badge>
                            <div className="flex items-center gap-1">
                              {getChangeIcon(trend.change)}
                              <span className="text-xs">{Math.abs(trend.change)}</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-4 gap-4 text-xs text-muted-foreground">
                            <div>Relevância: {trend.relevance}%</div>
                            <div>Público: {trend.audience}%</div>
                            <div>Comercial: {trend.commercial}%</div>
                            <div>Timing: {trend.timing}%</div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getScoreColor(trend.score)}`}>
                          {trend.score}
                        </div>
                        <div className="text-xs text-muted-foreground">Score</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Performance Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Análise de Performance</CardTitle>
                <CardDescription>
                  Breakdown dos 4 critérios principais
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Relevância de Mercado</span>
                    <span className="font-semibold">87%</span>
                  </div>
                  <Progress value={87} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Alinhamento com Público</span>
                    <span className="font-semibold">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Potencial Comercial</span>
                    <span className="font-semibold">81%</span>
                  </div>
                  <Progress value={81} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Timing de Entrada</span>
                    <span className="font-semibold">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Target className="h-4 w-4 mr-2" />
                  Atualizar Perfil da Marca
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Relatório Personalizado
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Alertas de Tendências
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandDashboard;