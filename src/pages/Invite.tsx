import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import BrandRegistration from "@/components/BrandRegistration";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Invite = () => {
  const { code } = useParams<{ code: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [validating, setValidating] = useState(true);
  const [inviteValid, setInviteValid] = useState(false);
  const [inviteData, setInviteData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const validateInvite = async () => {
      if (!code) {
        setError("Código de convite inválido");
        setValidating(false);
        return;
      }

      try {
        console.log("🔍 Validando convite com código:", code);
        
        // Buscar convite na tabela brand_invites - APENAS por invite_code
        const { data, error: fetchError } = await supabase
          .from('brand_invites')
          .select('*')
          .eq('invite_code', code)
          .single();

        console.log("📋 Resultado da busca:", data);
        console.log("❌ Erro da busca:", fetchError);

        if (fetchError) {
          console.error("Erro ao buscar convite:", fetchError);
          if (fetchError.code === 'PGRST116') {
            setError("Convite não encontrado. Verifique se o link está correto.");
          } else {
            setError("Erro ao buscar convite. Tente novamente.");
          }
          setValidating(false);
          return;
        }

        if (!data) {
          setError("Convite não encontrado");
          setValidating(false);
          return;
        }

        console.log("📅 Data de expiração:", data.expires_at);
        console.log("🎯 Status do convite:", data.status);

        // Verificar se já foi utilizado
        if (data.status === 'used' || data.status === 'redeemed') {
          setError("Este convite já foi utilizado");
          setValidating(false);
          return;
        }

        // Verificar se expirou
        const expiresAt = new Date(data.expires_at);
        const now = new Date();
        
        if (expiresAt < now) {
          setError("Este convite expirou. Solicite um novo convite ao estilista.");
          setValidating(false);
          return;
        }

        // Se chegou aqui, o convite é válido
        console.log("✅ Convite válido encontrado");
        setInviteData(data);
        setInviteValid(true);
        
      } catch (err) {
        console.error("Erro ao validar convite:", err);
        setError("Erro interno ao validar convite. Tente novamente.");
      } finally {
        setValidating(false);
      }
    };

    validateInvite();
  }, [code]);

  // Função para atualizar o status do convite quando for utilizado
  const updateInviteStatus = async () => {
    if (!code) return;

    try {
      console.log("🔄 Atualizando status do convite para 'used'");
      
      const { error } = await supabase
        .from('brand_invites')
        .update({ 
          status: 'used',
          used_at: new Date().toISOString()
        })
        .eq('invite_code', code);

      if (error) {
        console.error("❌ Erro ao atualizar status do convite:", error);
      } else {
        console.log("✅ Status do convite atualizado com sucesso");
      }
    } catch (err) {
      console.error("❌ Erro ao atualizar convite:", err);
    }
  };

  // Se já está logado e tem perfil, redirecionar
  useEffect(() => {
    const checkProfile = async () => {
      if (user && !validating && inviteValid) {
        try {
          console.log("👤 Verificando se usuário já tem perfil...");
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

          if (profileError) {
            console.error("Erro ao verificar perfil:", profileError);
            return;
          }

          if (profile) {
            console.log("✅ Perfil encontrado, atualizando convite...");
            await updateInviteStatus();
            navigate('/dashboard');
          }
        } catch (err) {
          console.error("Erro ao verificar perfil:", err);
        }
      }
    };

    checkProfile();
  }, [user, validating, inviteValid, navigate]);

  if (validating) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md w-full mx-4">
            <CardContent className="pt-6 text-center">
              <Loader2 className="h-12 w-12 animate-spin text-terracotta mx-auto mb-4" />
              <p className="text-muted-foreground">Validando convite...</p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (error || !inviteValid) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 py-12">
          <div className="container px-4 md:px-6 max-w-2xl mx-auto">
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error || "Convite inválido"}</AlertDescription>
            </Alert>
            <div className="mt-4 text-center">
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 bg-terracotta hover:bg-dark-terracotta text-white rounded-lg"
              >
                Voltar para a página inicial
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Se não está logado, mostrar que precisa criar conta primeiro
  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 py-12">
          <div className="container px-4 md:px-6 max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Convite Válido!
                </CardTitle>
                <CardDescription>
                  Você foi convidado por um estilista para se cadastrar na FForecasting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-peach/10 border border-peach/20 rounded-lg">
                  <p className="text-sm">
                    <strong>Marca:</strong> {inviteData?.brand_name}
                  </p>
                  <p className="text-sm">
                    <strong>Email:</strong> {inviteData?.brand_email}
                  </p>
                  {inviteData?.stylist_name && (
                    <p className="text-sm">
                      <strong>Estilista:</strong> {inviteData.stylist_name}
                    </p>
                  )}
                </div>
                <Alert>
                  <AlertDescription>
                    Para continuar, você precisa primeiro criar uma conta ou fazer login com o email: <strong>{inviteData?.brand_email}</strong>
                  </AlertDescription>
                </Alert>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate('/auth')}
                    className="flex-1 px-4 py-2 bg-terracotta hover:bg-dark-terracotta text-white rounded-lg"
                  >
                    Criar Conta / Login
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  // Mostrar formulário de registro da marca
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <div className="py-8">
          <div className="container px-4 md:px-6 max-w-2xl mx-auto mb-6">
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Convite validado com sucesso! Complete seu cadastro abaixo.
              </AlertDescription>
            </Alert>
          </div>
          <BrandRegistration 
            onBack={() => navigate('/')} 
            inviteCode={code}
            inviteData={inviteData}
            onRegistrationSuccess={updateInviteStatus}
          />
        </div>
      </main>
    </div>
  );
};

export default Invite;
