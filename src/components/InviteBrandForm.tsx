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
import { Loader2, Mail } from "lucide-react";

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
    let code = 'FFORECAST-';
    for (let i = 0; i < 12; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const onSubmit = async (data: InviteFormData) => {
    setLoading(true);
    try {
      const inviteCode = generateInviteCode();
      
      // Inserir convite na tabela brand_invites
      const { error: insertError } = await supabase
        .from('brand_invites')
        .insert({
          stylist_id: stylistId,
          brand_name: data.brandName,
          brand_email: data.brandEmail,
          invite_code: inviteCode,
          status: 'pending',
        });

      if (insertError) {
        throw insertError;
      }

      toast({
        title: "Convite enviado!",
        description: `Um convite foi criado para ${data.brandName}. Compartilhe o link de convite com a marca.`,
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
  );
};

export default InviteBrandForm;
