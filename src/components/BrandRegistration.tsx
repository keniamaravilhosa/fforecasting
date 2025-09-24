import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Store } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BrandRegistrationProps {
  onBack: () => void;
}

const BrandRegistration = ({ onBack }: BrandRegistrationProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    brandName: "",
    email: "",
    password: "",
    targetAudience: "",
    priceRange: "",
    businessModel: "",
    mainChallenges: "",
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
      description: "Redirecionando para seu dashboard personalizado...",
    });

    // In a real app, this would redirect to dashboard
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
              <div className="mx-auto p-3 bg-accent rounded-full w-fit mb-4">
                <Store className="h-6 w-6 text-terracotta" />
              </div>
              <CardTitle className="text-2xl">Cadastro da Marca</CardTitle>
              <CardDescription>
                Conte-nos sobre sua marca para personalizar sua experiência
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Informações Básicas</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="brandName">Nome da Marca *</Label>
                    <Input
                      id="brandName"
                      placeholder="Ex: Sua Marca Fashion"
                      value={formData.brandName}
                      onChange={(e) => setFormData(prev => ({ ...prev, brandName: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Profissional *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="contato@suamarca.com"
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

                {/* Diagnostic Questions */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Diagnóstico da Marca</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="targetAudience">Público-Alvo Principal *</Label>
                    <Select value={formData.targetAudience} onValueChange={(value) => setFormData(prev => ({ ...prev, targetAudience: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione seu público principal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gen-z">Geração Z (18-24 anos)</SelectItem>
                        <SelectItem value="millennial">Millennials (25-40 anos)</SelectItem>
                        <SelectItem value="gen-x">Geração X (41-55 anos)</SelectItem>
                        <SelectItem value="mixed">Público Misto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="priceRange">Faixa de Preço *</Label>
                    <Select value={formData.priceRange} onValueChange={(value) => setFormData(prev => ({ ...prev, priceRange: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione sua faixa de preço" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="budget">Econômica (R$ 20-80)</SelectItem>
                        <SelectItem value="mid">Intermediária (R$ 80-200)</SelectItem>
                        <SelectItem value="premium">Premium (R$ 200-500)</SelectItem>
                        <SelectItem value="luxury">Luxo (R$ 500+)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="businessModel">Modelo de Negócio *</Label>
                    <Select value={formData.businessModel} onValueChange={(value) => setFormData(prev => ({ ...prev, businessModel: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Como você vende?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ecommerce">E-commerce Próprio</SelectItem>
                        <SelectItem value="marketplace">Marketplaces</SelectItem>
                        <SelectItem value="physical">Loja Física</SelectItem>
                        <SelectItem value="hybrid">Híbrido (Online + Física)</SelectItem>
                        <SelectItem value="wholesale">Atacado/Distribuição</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mainChallenges">Principais Desafios (Opcional)</Label>
                    <Textarea
                      id="mainChallenges"
                      placeholder="Conte-nos sobre os principais desafios da sua marca em relação a tendências..."
                      value={formData.mainChallenges}
                      onChange={(e) => setFormData(prev => ({ ...prev, mainChallenges: e.target.value }))}
                      rows={3}
                    />
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
                  Criar Conta e Acessar Dashboard
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