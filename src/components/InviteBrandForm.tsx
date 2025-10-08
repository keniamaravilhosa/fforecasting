import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Mail, Copy, Check } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const inviteSchema = z.object({
  brandName: z.string().min(2, "Nome da marca deve ter pelo menos 2 caracteres"),
  brandEmail: z.string().email("Email inválido"),
});

type InviteFormData = z.infer<typeof inviteSchema>;

interface InviteBrandFormProps {
  stylistId: string;
  onInviteSent?: () => void;
}

const InviteBrandForm = ({ stylistId, onInviteSent }: InviteBrandFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
  });

  const generateInviteCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'FFORECAST';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const copyToClipboard = async () => {
    if (!inviteLink) return;
    
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      toast({
        title: "Link copiado!",
        description: "O link de convite foi copiado para a área de transferência",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o link",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: InviteFormData) => {
    setLoading(true);
    try {
      const inviteCode = generateInviteCode();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);
      
      const { error: insertError } = await supabase
        .from('brand_invites')
        .insert({
          stylist_id: stylistId,
          brand_name: data.brandName,
          brand_email: data.brandEmail,
          invite_code: inviteCode,
          status: 'pending',
          expires_at: expiresAt.toISOString(),
        });

      if (insertError) {
        throw insertError;
      }

      const generatedLink = `${window.location.origin}/invite/${inviteCode}`;
      setInviteLink(generatedLink);

      toast({
        title: "🎉 Convite criado com sucesso!",
        description: `Convite para ${data.brandName} foi gerado. Copie o link abaixo.`,
      });

      reset();
      onInviteSent?.();
    } catch (error: any) {
      console.error("Erro ao criar convite:", error);
      toast({
        title: "Erro ao enviar convite",
        description: error.message || "Tente novamente mais tarde",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Convidar Nova Marca</CardTitle>
          <CardDescription>
            Crie um convite exclusivo para uma marca se cadastrar na plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="brandName">Nome da Marca</Label>
              <Input
                id="brandName"
                placeholder="Ex: Bella Boutique"
                {...register("brandName")}
              />
              {errors.brandName && (
                <p className="text-sm text-destructive">{errors.brandName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="brandEmail">Email da Marca</Label>
              <Input
                id="brandEmail"
                type="email"
                placeholder="contato@marca.com"
                {...register("brandEmail")}
              />
              {errors.brandEmail && (
                <p className="text-sm text-destructive">{errors.brandEmail.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-terracotta hover:bg-dark-terracotta"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando convite...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Criar Convite
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {inviteLink && (
        <Alert className="bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-600" />
          <AlertDescription>
            <div className="space-y-3">
              <p className="font-semibold text-green-800">
                ✅ Convite criado com sucesso!
              </p>
              <div className="space-y-2">
                <p className="text-sm text-green-700">
                  Compartilhe este link com a marca:
                </p>
                <div className="flex gap-2">
                  <div className="flex-1 bg-white p-3 rounded border border-green-300 overflow-x-auto">
                    <code className="text-xs text-green-900 break-all">
                      {inviteLink}
                    </code>
                  </div>
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    size="sm"
                    className="shrink-0"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Copiado
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1" />
                        Copiar
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-green-600">
                  ⏰ Este convite expira em 30 dias
                </p>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default InviteBrandForm;
