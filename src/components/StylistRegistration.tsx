import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Palette, Crown, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StylistRegistrationProps {
  onBack: () => void;
}

const StylistRegistration = ({ onBack }: StylistRegistrationProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    experience: "",
    specialties: [],
    portfolio: "",
    agreeTerms: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeTerms) {
      toast({
        title: "Termos e Condições",
        description: "Por favor, aceite os termos e condições para continuar.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Conta criada com sucesso!",
      description: "Bem-vindo ao FForecasting! Comece indicando marcas para ganhar acesso premium.",
    });

    // In a real app, this would redirect to stylist dashboard
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 2000);
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

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Informações Profissionais</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nome Completo *</Label>
                    <Input
                      id="fullName"
                      placeholder="Seu nome profissional"
                      value={formData.fullName}
                      onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Profissional *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha *</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Mínimo 8 caracteres"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      required
                      minLength={8}
                    />
                  </div>
                </div>

                {/* Professional Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Experiência Profissional</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="experience">Tempo de Experiência *</Label>
                    <Select value={formData.experience} onValueChange={(value) => setFormData(prev => ({ ...prev, experience: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione sua experiência" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-2">1-2 anos</SelectItem>
                        <SelectItem value="3-5">3-5 anos</SelectItem>
                        <SelectItem value="6-10">6-10 anos</SelectItem>
                        <SelectItem value="10+">Mais de 10 anos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="portfolio">Portfolio/Instagram (Opcional)</Label>
                    <Input
                      id="portfolio"
                      placeholder="https://instagram.com/seu_perfil ou link do portfolio"
                      value={formData.portfolio}
                      onChange={(e) => setFormData(prev => ({ ...prev, portfolio: e.target.value }))}
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
                          <Checkbox id={specialty} />
                          <Label htmlFor={specialty} className="text-sm font-normal">
                            {specialty}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Terms */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeTerms}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agreeTerms: checked as boolean }))}
                  />
                  <Label htmlFor="terms" className="text-sm">
                    Aceito os{" "}
                    <a href="#" className="text-terracotta hover:underline">
                      Termos de Uso
                    </a>{" "}
                    e{" "}
                    <a href="#" className="text-terracotta hover:underline">
                      Política de Privacidade
                    </a>
                  </Label>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-terracotta hover:bg-dark-terracotta text-white"
                >
                  Criar Conta e Acessar Rede
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