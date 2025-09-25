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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Palette, Crown, Gift } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const stylistSchema = z.object({
  fullName: z.string().min(1, "Nome é obrigatório"),
  experience: z.enum(['iniciante', '1-3_anos', '3-5_anos', '5-10_anos', 'mais_10_anos']),
  portfolio: z.string().optional(),
  specialties: z.array(z.string()).optional(),
});

type StylistFormData = z.infer<typeof stylistSchema>;

interface StylistRegistrationProps {
  onBack: () => void;
}

const StylistRegistration = ({ onBack }: StylistRegistrationProps) => {
  const [loading, setLoading] = useState(false);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  const form = useForm<StylistFormData>({
    resolver: zodResolver(stylistSchema),
    defaultValues: {
      fullName: "",
      experience: "1-3_anos",
      portfolio: "",
      specialties: [],
    },
  });

  const handleSpecialtyChange = (specialty: string, checked: boolean) => {
    let newSpecialties = [...selectedSpecialties];
    if (checked) {
      newSpecialties.push(specialty);
    } else {
      newSpecialties = newSpecialties.filter(s => s !== specialty);
    }
    setSelectedSpecialties(newSpecialties);
    form.setValue("specialties", newSpecialties);
  };

  const handleSubmit = async (data: StylistFormData) => {
    if (!user) {
      toast.error("Você precisa estar logado para continuar");
      return;
    }

    setLoading(true);
    
    try {
      // Create profile first
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          user_type: 'stylist',
          full_name: data.fullName,
          email: user.email || '',
        })
        .select()
        .single();

      if (profileError) throw profileError;

      // Create stylist data
      const { error: stylistError } = await supabase
        .from('stylists')
        .insert({
          profile_id: profile.id,
          experience: data.experience,
          portfolio: data.portfolio || null,
          specialties: selectedSpecialties,
          premium_access: false,
        });

      if (stylistError) throw stylistError;

      toast.success("Cadastro realizado com sucesso! Bem-vindo ao FForecasting!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || "Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
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
              <div className="mx-auto p-3 bg-peach/20 rounded-full w-fit mb-4">
                <Palette className="h-6 w-6 text-terracotta" />
              </div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <CardTitle className="text-2xl">Cadastro de Estilista</CardTitle>
                <Badge className="bg-peach/20 text-terracotta">
                  <Crown className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              </div>
              <CardDescription>
                Junte-se à nossa rede exclusiva de profissionais de moda
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {/* Premium Benefits */}
              <div className="mb-6 p-4 bg-peach/10 rounded-lg border border-peach/20">
                <div className="flex items-center gap-2 mb-3">
                  <Gift className="h-4 w-4 text-terracotta" />
                  <h3 className="font-semibold text-sm">Benefícios Exclusivos</h3>
                </div>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Acesso premium automático ao indicar marcas</li>
                  <li>• Scores completos das 200+ tendências</li>
                  <li>• Rede exclusiva de estilistas profissionais</li>
                  <li>• Links de convite rastreáveis e personalizados</li>
                </ul>
              </div>

              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Informações Profissionais</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nome Completo *</Label>
                    <Input
                      {...form.register("fullName")}
                      id="fullName"
                      placeholder="Seu nome profissional"
                    />
                    {form.formState.errors.fullName && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.fullName.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Professional Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Experiência Profissional</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="experience">Tempo de Experiência *</Label>
                    <Select value={form.watch("experience")} onValueChange={(value) => form.setValue("experience", value as any)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione sua experiência" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="iniciante">Iniciante</SelectItem>
                        <SelectItem value="1-3_anos">1-3 anos</SelectItem>
                        <SelectItem value="3-5_anos">3-5 anos</SelectItem>
                        <SelectItem value="5-10_anos">5-10 anos</SelectItem>
                        <SelectItem value="mais_10_anos">Mais de 10 anos</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.experience && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.experience.message}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="portfolio">Portfolio/Instagram (Opcional)</Label>
                    <Input
                      {...form.register("portfolio")}
                      id="portfolio"
                      placeholder="https://instagram.com/seu_perfil ou link do portfolio"
                      type="url"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Especialidades</Label>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {[
                        "Personal Styling",
                        "Fashion Consulting", 
                        "Visual Merchandising",
                        "Trend Forecasting",
                        "Brand Consulting",
                        "Editorial Fashion"
                      ].map((specialty) => (
                        <div key={specialty} className="flex items-center space-x-2">
                          <Checkbox 
                            id={specialty} 
                            checked={selectedSpecialties.includes(specialty)}
                            onCheckedChange={(checked) => handleSpecialtyChange(specialty, checked as boolean)}
                          />
                          <Label htmlFor={specialty} className="text-sm font-normal">
                            {specialty}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-terracotta hover:bg-dark-terracotta text-white"
                  disabled={loading}
                >
                  {loading ? "Criando conta..." : "Criar Conta e Acessar Rede"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default StylistRegistration;