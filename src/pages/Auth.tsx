import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Header from "@/components/Header";

const authSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

type AuthFormData = z.infer<typeof authSchema>;

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const navigate = useNavigate();

  const form = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (user && !profileLoading) {
      if (profile) {
        navigate("/dashboard");
      } else {
        navigate("/register");
      }
    }
  }, [user, profile, profileLoading, navigate]);

  const onSubmit = async (data: AuthFormData) => {
    setLoading(true);
    
    try {
      let result;
      if (isLogin) {
        result = await signIn(data.email, data.password);
      } else {
        result = await signUp(data.email, data.password);
      }

      if (result.error) {
        if (result.error.message.includes('Invalid login credentials')) {
          toast.error("Credenciais inválidas. Verifique seu email e senha.");
        } else if (result.error.message.includes('User already registered')) {
          toast.error("Usuário já cadastrado. Faça login ou use outro email.");
        } else {
          toast.error(result.error.message);
        }
      } else {
        if (isLogin) {
          toast.success("Login realizado com sucesso!");
          // O redirecionamento será feito pelo useEffect após verificar o perfil
        } else {
          toast.success("Cadastro realizado! Verifique seu email para confirmar a conta.");
        }
      }
    } catch (error) {
      toast.error("Erro interno. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold text-primary">
              {isLogin ? "Entrar" : "Criar Conta"}
            </CardTitle>
            <CardDescription>
              {isLogin 
                ? "Acesse sua conta FForecasting"
                : "Crie sua conta para começar"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  {...form.register("email")}
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  {...form.register("password")}
                  id="password"
                  type="password"
                  placeholder="••••••"
                />
                {form.formState.errors.password && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={loading}
              >
                {loading ? "Processando..." : isLogin ? "Entrar" : "Criar Conta"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Button
                variant="ghost"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm"
              >
                {isLogin 
                  ? "Não tem conta? Criar uma agora"
                  : "Já tem conta? Fazer login"
                }
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Auth;