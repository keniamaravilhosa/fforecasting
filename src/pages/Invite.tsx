// src/pages/Invite.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import BrandRegistration from "@/components/BrandRegistration";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, Loader2, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Invite = () => {
  const { code } = useParams<{ code: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [validating, setValidating] = useState(true);
  const [inviteValid, setInviteValid] = useState(false);
  const [inviteData, setInviteData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [emailMismatch, setEmailMismatch] = useState(false);

  useEffect(() => {
    const validateInvite = async () => {
      if (!code) {
        setError("Código de convite inválido");
        setValidating(false);
        return;
      }

      try {
        // SEMPRE usa a RPC para validar (evita problemas de RLS)
        const { data, error } = await supabase.rpc('validate_invite_code', {
          invite_code_param: code
        });

        if (error) {
          console.error('Error validating invite:', error);
          setError("Erro ao validar convite");
          setInviteValid(false);
        } else if (data) {
          // Type assertion para o resultado da RPC
          const result = data as { valid: boolean; reason?: string; required_email?: string; brand_name?: string; stylist_id?: string };
          
          if (result.valid) {
            setInviteData({
              brand_name: result.brand_name,
              brand_email: result.required_email,
              stylist_id: result.stylist_id
            });
            
            // Se está logado, verifica se o email corresponde
            if (user && user.email !== result.required_email) {
              setEmailMismatch(true);
            }
            
            setInviteValid(true);
          } else {
            // Convite inválido
            if (result.reason === 'expired') {
              setError("Este convite expirou");
            } else if (result.reason === 'already_used') {
              setError("Este convite já foi utilizado");
            } else {
              setError("Convite não encontrado");
            }
            setInviteValid(false);
          }
        }
      } catch (error) {
        console.error('Error in invite validation:', error);
        setError("Erro ao validar convite");
        setInviteValid(false);
      } finally {
        setValidating(false);
      }
    };

    validateInvite();
  }, [code, user]);

  // Função para atualizar o status do convite quando for utilizado
  const updateInviteStatus = async () => {
    if (!code) return;

    try {
      const { error } = await supabase
        .from('brand_invites')
        .update({ 
          status: 'used' as any,
          used_at: new Date().toISOString()
        })
        .eq('invite_code', code);

      if (error) {
        console.error("Erro ao atualizar status do convite:", error);
      }
    } catch (err) {
      console.error("Erro ao atualizar convite:", err);
    }
  };

  // Se já está logado e tem perfil, redirecionar
  useEffect(() => {
    const checkProfile = async () => {
      if (user && !validating && inviteValid && !emailMismatch) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (profile) {
          // Limpar localStorage do inviteCode se já tem profile
          localStorage.removeItem('pendingInviteCode');
          toast.info("Você já possui cadastro ativo");
          navigate("/dashboard");
        }
      }
    };

    checkProfile();
  }, [user, validating, inviteValid, emailMismatch, navigate]);

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

  // Se o email não bate, mostrar aviso
  if (emailMismatch && user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 py-12">
          <div className="container px-4 md:px-6 max-w-2xl mx-auto">
            <Alert className="bg-orange-50 border-orange-200">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <div className="space-y-4">
                  <p className="font-semibold">Incompatibilidade de Email</p>
                  <p>
                    Este convite foi enviado para <strong>{inviteData?.brand_email}</strong>, 
                    mas você está logado com outro email.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={async () => {
                        await supabase.auth.signOut();
                        navigate(`/auth`, { state: { inviteCode: code } });
                      }}
                      className="px-4 py-2 bg-terracotta hover:bg-dark-terracotta text-white rounded-lg"
                    >
                      Fazer logout e continuar
                    </button>
                    <button
                      onClick={() => navigate('/')}
                      className="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
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
                    <strong>Email necessário:</strong> {inviteData?.brand_email}
                  </p>
                </div>
                <Alert>
                  <AlertDescription>
                    Para continuar, você precisa primeiro criar uma conta ou fazer login com o email: <strong>{inviteData?.brand_email}</strong>
                  </AlertDescription>
                </Alert>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      localStorage.setItem('pendingInviteCode', code);
                      navigate("/auth", { state: { inviteCode: code } });
                    }}
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
            onBack={() => navigate("/")} 
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
