import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users2, GitCompare, Mail, Crown, Check, X } from "lucide-react";

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4 sm:text-4xl">
            Como Funciona o FForecasting
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Uma plataforma inteligente que conecta estilistas e marcas de moda, 
            oferecendo tendências personalizadas e insights valiosos para impulsionar o crescimento do mercado fashion.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
          {/* Card 1: Dois Tipos de Usuários */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-terracotta/10 rounded-lg">
                  <Users2 className="h-6 w-6 text-terracotta" />
                </div>
                <CardTitle>Dois Tipos de Usuários</CardTitle>
              </div>
              <CardDescription>
                A plataforma atende dois perfis distintos com necessidades específicas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg bg-card">
                <h4 className="font-semibold text-terracotta mb-2">Estilistas</h4>
                <p className="text-sm text-muted-foreground">
                  Profissionais da moda com acesso a tendências periódicas de diversos segmentos. 
                  Recebem atualizações constantes do mercado fashion e podem convidar marcas para a plataforma.
                </p>
              </div>
              <div className="p-4 border rounded-lg bg-card">
                <h4 className="font-semibold text-terracotta mb-2">Marcas de Moda</h4>
                <p className="text-sm text-muted-foreground">
                  Empresas que recebem tendências ranqueadas e personalizadas baseadas no perfil da marca. 
                  Acesso a scores customizados e análises detalhadas do público-alvo.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Diferenças dos Perfis */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-peach/20 rounded-lg">
                  <GitCompare className="h-6 w-6 text-terracotta" />
                </div>
                <CardTitle>Diferenças dos Perfis</CardTitle>
              </div>
              <CardDescription>
                Cada perfil oferece recursos exclusivos para suas necessidades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 font-semibold">Recurso</th>
                      <th className="text-center py-3 px-2 font-semibold text-terracotta">Estilista</th>
                      <th className="text-center py-3 px-2 font-semibold text-terracotta">Marca</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="py-3 px-2">Acesso</td>
                      <td className="text-center py-3 px-2">
                        <span className="text-green-600 font-semibold">Gratuito</span>
                      </td>
                      <td className="text-center py-3 px-2">
                        <span className="text-terracotta font-semibold">R$ 99,90/mês</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2">Tendências</td>
                      <td className="text-center py-3 px-2 text-muted-foreground">Gerais</td>
                      <td className="text-center py-3 px-2 text-terracotta font-medium">Personalizadas</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2">Sistema de Convites</td>
                      <td className="text-center py-3 px-2">
                        <Check className="h-5 w-5 text-green-600 mx-auto" />
                      </td>
                      <td className="text-center py-3 px-2">
                        <X className="h-5 w-5 text-muted-foreground mx-auto" />
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2">Programa de Bônus</td>
                      <td className="text-center py-3 px-2">
                        <Check className="h-5 w-5 text-green-600 mx-auto" />
                      </td>
                      <td className="text-center py-3 px-2">
                        <X className="h-5 w-5 text-muted-foreground mx-auto" />
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2">Scores Customizados</td>
                      <td className="text-center py-3 px-2">
                        <X className="h-5 w-5 text-muted-foreground mx-auto" />
                      </td>
                      <td className="text-center py-3 px-2">
                        <Check className="h-5 w-5 text-green-600 mx-auto" />
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2">Análise de Público</td>
                      <td className="text-center py-3 px-2">
                        <X className="h-5 w-5 text-muted-foreground mx-auto" />
                      </td>
                      <td className="text-center py-3 px-2">
                        <Check className="h-5 w-5 text-green-600 mx-auto" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Sistema de Convites */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-terracotta/10 rounded-lg">
                  <Mail className="h-6 w-6 text-terracotta" />
                </div>
                <CardTitle>Sistema de Convites</CardTitle>
              </div>
              <CardDescription>
                Acesso exclusivo através de convites de estilistas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-terracotta text-white rounded-full flex items-center justify-center font-semibold text-sm">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Estilistas criam convites</h4>
                    <p className="text-sm text-muted-foreground">
                      Cada estilista pode gerar links de convite exclusivos para marcas de moda
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-terracotta text-white rounded-full flex items-center justify-center font-semibold text-sm">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Marcas recebem acesso</h4>
                    <p className="text-sm text-muted-foreground">
                      Apenas marcas convidadas podem se cadastrar na plataforma usando o link do estilista
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-terracotta text-white rounded-full flex items-center justify-center font-semibold text-sm">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Conexão estabelecida</h4>
                    <p className="text-sm text-muted-foreground">
                      Sistema rastreável que garante segurança e controle total sobre quem acessa
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Programa de Bônus */}
          <Card className="hover:shadow-lg transition-shadow border-terracotta/50">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-terracotta/10 rounded-lg">
                  <Crown className="h-6 w-6 text-terracotta" />
                </div>
                <CardTitle>Programa de Bônus</CardTitle>
              </div>
              <CardDescription>
                Recompensas para estilistas que indicam marcas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-terracotta/5 border border-terracotta/20 rounded-lg">
                <h4 className="font-semibold text-terracotta mb-2 flex items-center gap-2">
                  <Crown className="h-5 w-5" />
                  Benefícios por Indicação
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Cada marca que se cadastra através do seu convite gera um bônus</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Acesso premium automático conforme número de indicações</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Benefícios exclusivos e prioridade em novos recursos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Sistema de recompensas escalável - quanto mais indicações, maiores os benefícios</span>
                  </li>
                </ul>
              </div>
              <p className="text-sm text-muted-foreground italic">
                Quanto mais marcas você indicar, mais benefícios exclusivos você desbloqueia na plataforma!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
