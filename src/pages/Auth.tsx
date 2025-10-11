// src/pages/Auth.tsx
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, Mail, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const { signIn, signUp, resetPassword, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Armazenar inviteCode do state ou do localStorage
  const inviteCode = location.state?.inviteCode || localStorage.getItem('pendingInviteCode');
  
  // Se veio inviteCode no state, salvar no localStorage
  useEffect(() => {
    if (location.state?.inviteCode) {
      localStorage.setItem('pendingInviteCode', location.state.inviteCode);
    }
  }, [location.state?.inviteCode]);

  // Detectar se é um reset de senha
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('reset') === 'true') {
      setShowResetForm(true);
    }
  }, [location.search]);

  // CORREÇÃO: Prevenir redirecionamento automático durante reset de senha
  useEffect(() => {
    // Não redirecionar se está no fluxo de reset de senha
    if (showResetForm) {
      return;
    }
    
    const checkAuth = async () => {
      if (user) {
        const savedInviteCode = localStorage.getItem('pendingInviteCode');
        
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (profile) {
          // Limpar invite code se já tem profile
          localStorage.removeItem('pendingInviteCode');
          navigate('/dashboard');
        } else if (savedInviteCode) {
          // Redirecionar para o convite se não tem profile
          navigate(`/invite/${savedInviteCode}`);
        } else {
          // Sem convite, ir para registro de estilista
          navigate('/register');
        }
      }
    };
    checkAuth();
  }, [user, navigate, showResetForm]); // Adicionar showResetForm como dependência

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Preencha todos os campos");
      return;
    }

    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error.message);
      } else {
        const savedInviteCode = localStorage.getItem('pendingInviteCode');
        
        // Após login, verifica se tem convite
        if (savedInviteCode) {
          navigate(`/invite/${savedInviteCode}`);
        } else {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user?.id)
            .maybeSingle();

          if (profile) {
            localStorage.removeItem('pendingInviteCode');
            navigate('/dashboard');
          } else {
            navigate('/register');
          }
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Preencha todos os campos");
      return;
    }

    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres, letras maiúsculas, minúsculas e caracteres especiais.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await signUp(email, password);
      if (error) {
        toast.error(error.message);
      } else {
        const savedInviteCode = localStorage.getItem('pendingInviteCode');
        
        toast.success("Conta criada! Verifique seu email para confirmar.");
        
        // Após signup, se tem convite, redireciona IMEDIATAMENTE
        if (savedInviteCode) {
          // Pequeno delay para mostrar a mensagem de sucesso
          setTimeout(() => {
            navigate(`/invite/${savedInviteCode}`);
          }, 1000);
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetEmail) {
      toast.error("Digite seu email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resetEmail)) {
      toast.error("Digite um email válido");
      return;
    }

    setLoading(true);

    try {
      const { error } = await resetPassword(resetEmail);
      if (error) {
        toast.error("Erro ao enviar email de recuperação");
      } else {
        toast.success("Email de recuperação enviado! Verifique sua caixa de entrada.");
        setShowForgotPassword(false);
        setResetEmail("");
      }
    } catch (error: any) {
      toast.error(error.message || "Erro ao enviar email");
    } finally {
      setLoading(false);
    }
  };

  // CORREÇÃO: Fazer logout após atualização de senha bem-sucedida
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword) {
      toast.error("Digite a nova senha");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Senha atualizada com sucesso! Faça login com sua nova senha.");
        
        // CORREÇÃO: Fazer logout para forçar novo login
        await supabase.auth.signOut();
        
        setShowResetForm(false);
        setNewPassword("");
        navigate('/auth'); // Volta para tela de login, não dashboard
      }
    } catch (error: any) {
      toast.error(error.message || "Erro ao atualizar senha");
    } finally {
      setLoading(false);
    }
  };

  // Se está no fluxo de reset de senha, mostrar apenas o formulário de nova senha
  if (showResetForm) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center py-12 bg-gradient-to-b from-peach/10 to-background">
          <div className="container px-4 md:px-6 max-w-md">
            <Card className="shadow-lg">
              <CardHeader className="text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-terracotta rounded-full flex items-center justify-center">
                  <Lock className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold">Redefinir Senha</CardTitle>
                <CardDescription className="text-base">
                  Digite sua nova senha abaixo
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-6">
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password" className="text-sm font-medium">
                      Nova Senha
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="new-password"
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="pl-10 h-11"
                        required
                        minLength={6}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Use pelo menos 6 caracteres, letras maiúsculas, minúsculas e caracteres especiais.
                    </p>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full h-11 bg-terracotta hover:bg-dark-terracotta text-white font-medium"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Atualizando...
                      </>
                    ) : (
                      "Atualizar Senha"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 bg-gradient-to-b from-peach/10 to-background">
        <div className="container px-4 md:px-6 max-w-md">
          <Card className="shadow-lg">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-terracotta rounded-full flex items-center justify-center">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold">Bem-vindo à FForecasting</CardTitle>
              <CardDescription className="text-base">
                Entre na sua conta ou crie uma nova para continuar
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login" className="data-[state=active]:bg-terracotta data-[state=active]:text-white">
                    Login
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="data-[state=active]:bg-terracotta data-[state=active]:text-white">
                    Cadastro
                  </TabsTrigger>
                </TabsList>
                
                {/* Login Tab */}
                <TabsContent value="login" className="space-y-4">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="text-sm font-medium">
                        Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="seu@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 h-11"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="text-sm font-medium">
                        Senha
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="Sua senha"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 h-11"
                          required
                        />
                      </div>
                      <div className="text-right">
                        <button
                          type="button"
                          onClick={() => setShowForgotPassword(true)}
                          className="text-sm text-terracotta hover:text-dark-terracotta hover:underline"
                        >
                          Esqueci minha senha
                        </button>
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full h-11 bg-terracotta hover:bg-dark-terracotta text-white font-medium"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Entrando...
                        </>
                      ) : (
                        "Entrar na plataforma"
                      )}
                    </Button>
                  </form>
                </TabsContent>

                {/* Signup Tab */}
                <TabsContent value="signup" className="space-y-4">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-sm font-medium">
                        Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="seu@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 h-11"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-sm font-medium">
                        Senha
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="Mínimo 6 caracteres"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 h-11"
                          required
                          minLength={6}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Use pelo menos 6 caracteres, letras maiúsculas, minúsculas e caracteres especiais.
                      </p>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full h-11 bg-terracotta hover:bg-dark-terracotta text-white font-medium"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Criando conta...
                        </>
                      ) : (
                        "Criar minha conta"
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              {/* Informação sobre convites */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 text-center">
                  <strong>É uma marca?</strong> Acesse através de convite de um estilista.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Dialog de Recuperação de Senha */}
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Recuperar Senha</DialogTitle>
            <DialogDescription>
              Digite seu email para receber instruções de recuperação de senha
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleResetPassword} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email" className="text-sm font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="seu@email.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="pl-10 h-11"
                  required
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetEmail("");
                }}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-terracotta hover:bg-dark-terracotta text-white"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Enviar"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Auth;
