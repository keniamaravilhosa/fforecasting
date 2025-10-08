import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Store } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const brandSchema = z.object({
  brandName: z.string().min(1, "Nome da marca é obrigatório"),
  targetAudience: z.enum(['15-19_anos', '20-29_anos', '30-45_anos', '46-60_anos', '60+_anos']),
  priceRange: z.enum(['popular_100', 'medio_300', 'alto_600', 'luxo']),
  businessModel: z.enum(['b2b', 'b2c', 'marketplace', 'atacado_varejo']),
  mainChallenges: z.string().optional(),
});

type BrandFormData = z.infer<typeof brandSchema>;

interface BrandRegistrationProps {
  onBack: () => void;
  inviteCode?: string;
  inviteData?: any;
  onRegistrationSuccess?: () => void;
  onInviteUsed?: (inviteCode: string, brandId: string) => void; // ← Adicionar esta prop
}

const BrandRegistration = ({ 
  onBack, 
  inviteCode, 
  inviteData, 
  onRegistrationSuccess,
  onInviteUsed 
}: BrandRegistrationProps) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const form = useForm<BrandFormData>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      brandName: inviteData?.brand_name || "",
      targetAudience: "20-29_anos",
      priceRange: "medio_300",
      businessModel: "b2c",
      mainChallenges: "",
    },
  });

  const handleSubmit = async (data: BrandFormData) => {
    if (!user) {
      toast.error("Você precisa estar logado para continuar");
      return;
    }

    setLoading(true);
    
    try {
      // Verificar se tem convite válido (se veio de /invite)
      if (inviteCode && inviteData) {
        // Verificar se o email do usuário corresponde ao email do convite
        if (user.email !== inviteData.brand_email) {
          throw new Error("Email não corresponde ao convite. Use o email: " + inviteData.brand_email);
        }
      }

      // CORREÇÃO: Usar upsert em vez de insert para o profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id, // ← CORREÇÃO: usar id em vez de user_id
          user_id: user.id,
          user_type: 'brand',
          full_name: data.brandName,
          email: user.email || '',
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        })
        .select()
        .single();

      if (profileError) {
        console.error('Erro no profile:', profileError);
        // Se der erro de duplicidade, buscar o profile existente
        if (profileError.code === '23505') {
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', user.id)
            .single();
          
          if (existingProfile) {
            // Continuar com o profile existente
            await createBrandAndUpdateInvite(existingProfile.id, data);
            return;
          }
        }
        throw profileError;
      }

      await createBrandAndUpdateInvite(profile.id, data);

    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || "Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // CORREÇÃO: Função separada para criar brand e atualizar convite
  const createBrandAndUpdateInvite = async (profileId: string, data: BrandFormData) => {
    try {
      // CORREÇÃO: Criar brand com retorno do ID
      const { data: brand, error: brandError } = await supabase
        .from('brands')
        .insert({
          profile_id: profileId,
          brand_name: data.brandName,
          target_audience: data.targetAudience,
          price_range: data.priceRange,
          business_model: data.businessModel,
          main_challenges: data.mainChallenges || null,
        })
        .select()
        .single(); // ← CORREÇÃO: .single() para pegar o ID da brand

      if (brandError) {
        console.error('Erro na brand:', brandError);
        
        // Se for erro de duplicidade, buscar a brand existente
        if (brandError.code === '23505') {
          const { data: existingBrand } = await supabase
            .from('brands')
            .select('id')
            .eq('profile_id', profileId)
            .single();
          
          if (existingBrand) {
            // Usar brand existente e atualizar convite
            await updateInviteStatus(existingBrand.id);
            completeRegistration();
            return;
          }
        }
        throw brandError;
      }

      // CORREÇÃO: Atualizar convite com o ID da brand
      await updateInviteStatus(brand.id);
      completeRegistration();

    } catch (error: any) {
      throw error;
    }
  };

  // CORREÇÃO: Função separada para atualizar convite
  const updateInviteStatus = async (brandId: string) => {
    if (!inviteCode) return;

    try {
      // CORREÇÃO: Atualizar corretamente o convite
      const { error: updateError } = await supabase
        .from('brand_invites')
        .update({ 
          status: 'used',
          brand_id: brandId, // ← CORREÇÃO: usar brandId (id da brands) em vez de profileId
          updated_at: new Date().toISOString()
        })
        .eq('invite_code', inviteCode);

      if (updateError) {
        console.error("Erro ao atualizar convite:", updateError);
        // Não falhar o processo todo se apenas a atualização do convite falhar
      }

      // CORREÇÃO: Chamar callback se existir
      if (onInviteUsed) {
        onInviteUsed(inviteCode, brandId);
      }

    } catch (error) {
      console.error("Erro no update do convite:", error);
    }
  };

  const completeRegistration = () => {
    toast.success("Cadastro realizado com sucesso!");
    
    if (onRegistrationSuccess) {
      onRegistrationSuccess();
    }
    
    navigate("/dashboard");
  };

  return (
    <section className="py-12">
      <div className="container px-4 md:px-6 max-w-2xl mx-auto">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-4 text-terracotta hover:text-dark-terracotta"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto p-3 bg-accent rounded-full w-fit mb-4">
                <Store className="h-6 w-6 text-terracotta" />
              </div>
              <CardTitle className="text-2xl">Cadastro da Marca</CardTitle>
              <CardDescription>
                Conte-nos sobre sua marca para personalizar sua experiência
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Informações da Marca</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="brandName">Nome da Marca *</Label>
                    <Input
                      {...form.register("brandName")}
                      id="brandName"
                      placeholder="Ex: Sua Marca Fashion"
                    />
                    {form.formState.errors.brandName && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.brandName.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Diagnostic Questions */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Diagnóstico da Marca</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="targetAudience">Público-Alvo Principal *</Label>
                    <Select value={form.watch("targetAudience")} onValueChange={(value) => form.setValue("targetAudience", value as any)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione seu público principal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15-19_anos">15-19 anos</SelectItem>
                        <SelectItem value="20-29_anos">20-29 anos</SelectItem>
                        <SelectItem value="30-45_anos">30-45 anos</SelectItem>
                        <SelectItem value="46-60_anos">46-60 anos</SelectItem>
                        <SelectItem value="60+_anos">60+ anos</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.targetAudience && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.targetAudience.message}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="priceRange">Faixa de Preço *</Label>
                    <Select value={form.watch("priceRange")} onValueChange={(value) => form.setValue("priceRange", value as any)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione sua faixa de preço" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="popular_100">Popular (até R$ 100)</SelectItem>
                        <SelectItem value="medio_300">Médio (R$ 100-300)</SelectItem>
                        <SelectItem value="alto_600">Alto (R$ 300-600)</SelectItem>
                        <SelectItem value="luxo">Luxo (R$ 600+)</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.priceRange && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.priceRange.message}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="businessModel">Modelo de Negócio *</Label>
                    <Select value={form.watch("businessModel")} onValueChange={(value) => form.setValue("businessModel", value as any)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Como você vende?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="b2c">B2C (Direto ao Consumidor)</SelectItem>
                        <SelectItem value="b2b">B2B (Atacado/Lojistas)</SelectItem>
                        <SelectItem value="marketplace">Marketplaces</SelectItem>
                        <SelectItem value="atacado_varejo">Atacado e Varejo</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.businessModel && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.businessModel.message}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mainChallenges">Principais Desafios (Opcional)</Label>
                    <Textarea
                      {...form.register("mainChallenges")}
                      id="mainChallenges"
                      placeholder="Conte-nos sobre os principais desafios da sua marca em relação a tendências..."
                      rows={3}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-terracotta hover:bg-dark-terracotta text-white"
                  disabled={loading}
                >
                  {loading ? "Criando conta..." : "Criar Conta e Acessar Dashboard"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default BrandRegistration;
