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
import { Loader2, Mail, Copy } from "lucide-react";

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
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);

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
    let code = '';
    // Gerar exatamente 12 caracteres alfanuméricos
    for (let i = 0; i < 12; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copiado!",
        description: "Link copiado para a área de transferência",
      });
    } catch (err) {
      console.error('Falha ao copiar: ', err);
    }
  };

  const onSubmit = async (data: InviteFormData) => {
    setLoading(true);
    try {
      const inviteCode = generateInviteCode();
      console.log("Código gerado:", inviteCode, "Comprimento:", inviteCode.length);
      
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30); // Convite expira em 30 dias
      
      // Inserir convite na tabela brand_invites
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
        console.error("Erro do Supabase:", insertError);
        throw insertError;
      }

      const inviteLink = `${window.location.origin}/invite/${inviteCode}`;
      setGeneratedLink(inviteLink);

      toast({
        title: "Convite criado com sucesso!",
        description: `Convite gerado para ${data.brandName}. Copie o link abaixo.`,
      });

      reset();
      onInviteSent?.();
    } catch (error: any) {
      console.error("Erro ao criar convite:", error);
      toast({
        title: "Erro ao criar convite",
        description: error.message || "Tente novamente mais tarde",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Convidar Nova Marca</CardTitle>
        <CardDescription>
          Crie um convite exclusivo para uma marca se cadastrar na plataforma
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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

        {/* Link gerado */}
        {generatedLink && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm font-medium text-green-800 mb-2">
              Convite criado! Compartilhe este link:
            </p>
            <div className="flex items-center gap-2">
              <Input
                value={generatedLink}
                readOnly
                className="flex-1 text-sm"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(generatedLink)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InviteBrandForm;
