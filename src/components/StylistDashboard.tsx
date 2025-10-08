import { useState, useEffect, lazy, Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import InviteBrandForm from "@/components/InviteBrandForm";

const TrendsCarousel = lazy(() => import("@/components/ui/trendscarousel").then(module => ({ default: module.TrendsCarousel })));
import { useStylistInvites } from "@/hooks/useStylistInvites";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { 
  Gift, 
  Users, 
  Crown, 
  Copy, 
  ExternalLink,
  CheckCircle,
  Clock,
  XCircle,
  Palette, 
  Shirt, 
  Leaf, 
  Sparkles 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StylistDashboardProps {
  hasPremiumAccess: boolean;
}

const StylistDashboard = ({ hasPremiumAccess }: StylistDashboardProps) => {
  const { toast } = useToast();
  const { profile } = useProfile();
  const [stylistId, setStylistId] = useState<string | null>(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [showInviteForm, setShowInviteForm] = useState(false);
  
  const { invites, loading: invitesLoading, refreshInvites } = useStylistInvites(stylistId);

  // Buscar ID do estilista baseado no profile
  useEffect(() => {
    const fetchStylistId = async () => {
      if (!profile?.id) return;

      const { data, error } = await supabase
        .from('stylists')
        .select('id')
        .eq('profile_id', profile.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching stylist:', error);
      } else if (data) {
        setStylistId(data.id);
      }
    };

    fetchStylistId();
  }, [profile]);

  // Trends Data - CORRIGIDO: fora da função getStatusColor
  const trendsData = [
    {
      id: 1,
      icon: Palette,
      title: "Cottagecore Aesthetic: O Novo Romantismo Rural",
      description: "Movimento que celebra simplicidade e conexão com a natureza atinge 92% de engajamento no TikTok.",
      image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=500&h=300&fit=crop",
      category: "Estilo",
      score: 92
    },
    {
      id: 2,
      icon: Shirt,
      title: "Moda Sem Gênero: A Revolução Inclusiva",
      description: "Consumidores jovens buscam expressão livre através de peças unissex - crescimento de 78% em 2024.",
      image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=500&h=300&fit=crop",
      category: "Comportamento",
      score: 78
    },
    {
      id: 3,
      icon: Leaf,
      title: "Sustentabilidade como Diferencial Competitivo",
      description: "Marcas com práticas eco-friendly registram 65% mais fidelidade entre millennials.",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=300&fit=crop",
      category: "Valores",
      score: 65
    },
    {
      id: 4,
      icon: Sparkles,
      title: "Tecnologia Wearable na Moda",
      description: "Integração entre moda e tecnologia cresce 45% com peças inteligentes e conectadas.",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=300&fit=crop",
      category: "Inovação",
      score: 45
    }
  ];

  const copyInviteLink = async (inviteCode: string) => {
    const inviteUrl = `${window.location.origin}/invite/${inviteCode}`;
    
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(inviteUrl);
      } else {
        // Fallback para navegadores sem suporte à Clipboard API
        const textArea = document.createElement("textarea");
        textArea.value = inviteUrl;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      
      toast({
        title: "Link copiado!",
        description: "O link de convite foi copiado para sua área de transferência.",
      });
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o link. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleInviteSent = () => {
    setShowInviteForm(false);
    refreshInvites();
  };

  const acceptedInvites = invites.filter(inv => inv.status === 'accepted' || inv.status === 'used').length;
  const pendingInvites = invites.filter(inv => inv.status === 'pending').length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
      case 'used':
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
      case 'used':
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
    <>
      {/* Modal de Boas-Vindas */}
      <Dialog open={showWelcomeModal} onOpenChange={setShowWelcomeModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-terracotta" />
              Sistema de Convites - Como Funciona
            </DialogTitle>
          </DialogHeader>
          
          {/* CONTEÚDO DO CARD DE CONVITES */}
          <div className="space-y-4">
            <div className="p-4 bg-peach/10 border border-peach/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="h-4 w-4 text-terracotta" />
                <span className="font-semibold text-sm">Como Funciona</span>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>1. Crie convites para marcas informando nome e email</li>
                <li>2. Compartilhe o link de convite gerado</li>
                <li>3. Quando elas se cadastram, você ganha acesso premium</li>
              </ul>
            </div>
            
            <div className="p-4 bg-accent rounded-lg">
              <p className="text-sm text-muted-foreground">
                Convites expiram em 30 dias. Acompanhe o status de cada convite no seu dashboard.
              </p>
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <Button 
              onClick={() => setShowWelcomeModal(false)}
              className="bg-terracotta hover:bg-dark-terracotta"
            >
              Entendi, vamos começar!
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* CONTEÚDO DO DASHBOARD */}
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
                <div className="text-2xl font-bold">{invites.length}</div>
                <p className="text-xs text-muted-foreground">
                  {acceptedInvites} aceito{acceptedInvites !== 1 ? 's' : ''} • {pendingInvites} pendente{pendingInvites !== 1 ? 's' : ''}
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
                <div className="text-2xl font-bold">{acceptedInvites}</div>
                <p className="text-xs text-muted-foreground">
                  {acceptedInvites > 0 ? `${acceptedInvites} marca${acceptedInvites !== 1 ? 's' : ''} conectada${acceptedInvites !== 1 ? 's' : ''}` : 'Nenhuma marca ainda'}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Taxa de Conversão
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {invites.length > 0 ? Math.round((acceptedInvites / invites.length) * 100) : 0}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {acceptedInvites} de {invites.length} convites aceitos
                </p>
              </CardContent>
            </Card>
          </div>

          {/* ⭐ NOVO COMPONENTE DE TENDÊNCIAS */}
          <div className="mb-8">
            <Suspense fallback={
              <div className="space-y-4">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-64 w-full" />
              </div>
            }>
              <TrendsCarousel trends={trendsData} />
            </Suspense>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Invite System */}
            <div className="lg:col-span-2">
              {showInviteForm ? (
                <div className="mb-6">
                  <InviteBrandForm 
                    stylistId={stylistId || ''} 
                    onInviteSent={handleInviteSent}
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => setShowInviteForm(false)}
                    className="w-full mt-4"
                  >
                    Cancelar
                  </Button>
                </div>
              ) : (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Sistema de Convites</CardTitle>
                    <CardDescription>
                      Convide marcas qualificadas para se cadastrarem na plataforma
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-peach/10 border border-peach/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Gift className="h-4 w-4 text-terracotta" />
                        <span className="font-semibold text-sm">Como Funciona</span>
                      </div>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>1. Crie um convite informando nome e email da marca</li>
                        <li>2. Compartilhe o link de convite gerado com a marca</li>
                        <li>3. Quando ela se cadastra, você ganha acesso premium</li>
                      </ul>
                    </div>
                    
                    <Button 
                      onClick={() => setShowInviteForm(true)} 
                      className="w-full bg-terracotta hover:bg-dark-terracotta"
                      disabled={!stylistId}
                    >
                      <Gift className="h-4 w-4 mr-2" />
                      Convidar Nova Marca
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Invitations History */}
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Indicações</CardTitle>
                  <CardDescription>
                    Acompanhe o status das suas indicações
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {invitesLoading ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Carregando convites...
                    </div>
                  ) : invites.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Você ainda não enviou nenhum convite. Comece convidando sua primeira marca!
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {invites.map((invite) => (
                        <div key={invite.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3 flex-1">
                            {getStatusIcon(invite.status)}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold truncate">{invite.brand_name}</h4>
                              <p className="text-sm text-muted-foreground truncate">{invite.brand_email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {invite.status === 'pending' && (
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => copyInviteLink(invite.invite_code)}
                                title="Copiar link"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            )}
                            <div className="text-right">
                              <Badge className={getStatusColor(invite.status)}>
                                {invite.status === 'accepted' ? 'Aceito' : 
                                 invite.status === 'used' ? 'Utilizado' :
                                 invite.status === 'pending' ? 'Pendente' : 'Expirado'}
                              </Badge>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(invite.created_at).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
                    <Users className={`h-4 w-4 ${hasPremiumAccess ? 'text-terracotta' : 'text-gray-400'}`} />
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
    </>
  );
};

export default StylistDashboard;
