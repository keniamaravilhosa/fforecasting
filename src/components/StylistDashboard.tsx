import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Gift, 
  Users, 
  Crown, 
  Copy, 
  ExternalLink,
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StylistDashboardProps {
  hasPremiumAccess: boolean;
}

const StylistDashboard = ({ hasPremiumAccess }: StylistDashboardProps) => {
  const { toast } = useToast();
  const [inviteLink] = useState("https://fforecasting.com/invite/FFORECAST-ABC123");
  
  // Mock data
  const invitations = [
    { id: 1, brandName: "Bella Boutique", email: "contato@bella.com", status: "accepted", date: "2024-01-15" },
    { id: 2, brandName: "Style Maven", email: "hello@stylemaven.com", status: "pending", date: "2024-01-10" },
    { id: 3, brandName: "Chic Closet", email: "info@chiccloset.com", status: "expired", date: "2024-01-05" }
  ];

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    toast({
      title: "Link copiado!",
      description: "O link de convite foi copiado para sua área de transferência.",
    });
  };

  const generateNewLink = () => {
    toast({
      title: "Novo link gerado!",
      description: "Um novo link de convite foi criado com sucesso.",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-600" />;
      case 'expired':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="py-8">
      <div className="container px-4 md:px-6">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">Dashboard do Estilista</h1>
            {hasPremiumAccess && (
              <Badge className="bg-peach text-terracotta">
                <Crown className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">
            {hasPremiumAccess 
              ? "Acesso premium ativo • Indique mais marcas para manter seus benefícios"
              : "Indique marcas qualificadas e ganhe acesso premium automaticamente"
            }
          </p>
        </div>

        {/* Access Status & Metrics */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Status do Acesso
              </CardTitle>
              <Crown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-lg font-bold ${hasPremiumAccess ? 'text-terracotta' : 'text-muted-foreground'}`}>
                {hasPremiumAccess ? 'Premium' : 'Free'}
              </div>
              <p className="text-xs text-muted-foreground">
                {hasPremiumAccess ? 'Acesso completo' : 'Indique para upgrade'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Convites Enviados
              </CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                1 aceito este mês
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Marcas Conectadas
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">
                Bella Boutique ativa
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Taxa de Conversão
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">33%</div>
              <p className="text-xs text-muted-foreground">
                1 de 3 convites aceitos
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Invite System */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Sistema de Convites</CardTitle>
                <CardDescription>
                  Gere links personalizados para indicar marcas qualificadas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-peach/10 border border-peach/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Gift className="h-4 w-4 text-terracotta" />
                    <span className="font-semibold text-sm">Como Funciona</span>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>1. Gere seu link de convite único</li>
                    <li>2. Envie para marcas que você recomenda</li>
                    <li>3. Quando elas se cadastram, você ganha acesso premium</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Seu Link de Convite</label>
                  <div className="flex gap-2">
                    <Input 
                      value={inviteLink}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={copyInviteLink}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={generateNewLink} className="bg-terracotta hover:bg-dark-terracotta">
                    Gerar Novo Link
                  </Button>
                  <Button variant="outline">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Compartilhar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Invitations History */}
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Indicações</CardTitle>
                <CardDescription>
                  Acompanhe o status das suas indicações
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {invitations.map((invite) => (
                    <div key={invite.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(invite.status)}
                        <div>
                          <h4 className="font-semibold">{invite.brandName}</h4>
                          <p className="text-sm text-muted-foreground">{invite.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(invite.status)}>
                          {invite.status === 'accepted' ? 'Aceito' : 
                           invite.status === 'pending' ? 'Pendente' : 'Expirado'}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(invite.date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Premium Benefits */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {hasPremiumAccess ? 'Benefícios Ativos' : 'Benefícios Premium'}
                </CardTitle>
                <CardDescription>
                  {hasPremiumAccess ? 'Você tem acesso a todos os recursos' : 'Indique marcas para desbloquear'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={`flex items-center gap-3 ${hasPremiumAccess ? '' : 'opacity-60'}`}>
                  <Crown className={`h-4 w-4 ${hasPremiumAccess ? 'text-terracotta' : 'text-gray-400'}`} />
                  <span className="text-sm">Scores completos das tendências</span>
                </div>
                <div className={`flex items-center gap-3 ${hasPremiumAccess ? '' : 'opacity-60'}`}>
                  <TrendingUp className={`h-4 w-4 ${hasPremiumAccess ? 'text-terracotta' : 'text-gray-400'}`} />
                  <span className="text-sm">Ranking prioritário de insights</span>
                </div>
                <div className={`flex items-center gap-3 ${hasPremiumAccess ? '' : 'opacity-60'}`}>
                  <Users className={`h-4 w-4 ${hasPremiumAccess ? 'text-terracotta' : 'text-gray-400'}`} />
                  <span className="text-sm">Rede exclusiva de estilistas</span>
                </div>
                
                {!hasPremiumAccess && (
                  <Button className="w-full mt-4 bg-peach hover:bg-peach/80 text-terracotta">
                    Indicar Primeira Marca
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Dicas de Indicação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="p-3 bg-accent rounded-lg">
                  <strong>Marcas Ideais:</strong> E-commerces de moda feminina com 1+ ano de operação
                </div>
                <div className="p-3 bg-accent rounded-lg">
                  <strong>Abordagem:</strong> Destaque os benefícios dos insights baseados em dados
                </div>
                <div className="p-3 bg-accent rounded-lg">
                  <strong>Timing:</strong> Links expiram em 30 dias - acompanhe regularmente
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StylistDashboard;