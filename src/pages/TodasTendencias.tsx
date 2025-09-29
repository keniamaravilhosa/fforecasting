import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Download, Search, Filter, TrendingUp, Users, Star, Palette, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TendenciaDetalheModal } from "@/components/TendenciaDetalheModal";
import HeaderComponent from "@/components/Header";

interface Tendencia {
  id: number;
  titulo: string;
  relevancia: number;
  categoria: 'Styles' | 'Values' | 'Items';
  publico: number;
  variacao: number;
  direcao: '↑' | '↓';
  comercial: number;
  timing: number;
  score: number;
  descricao: string;
  imagem: string;
  tags: string[];
  dataPublicacao: Date;
  conteudoDetalhado: string;
}

const mockTendencias: Tendencia[] = [
  {
    id: 1,
    titulo: "Sustainable Fashion Revolution",
    relevancia: 94,
    categoria: "Values",
    publico: 85,
    variacao: 12,
    direcao: "↑",
    comercial: 78,
    timing: 88,
    score: 86,
    descricao: "A revolução da moda sustentável está transformando a indústria",
    imagem: "/placeholder.svg",
    tags: ["sustentabilidade", "eco-friendly", "organic"],
    dataPublicacao: new Date("2024-01-15"),
    conteudoDetalhado: "A moda sustentável não é mais uma tendência de nicho, mas uma revolução que está redefinindo toda a indústria. Consumidores conscientes estão demandando transparência na cadeia produtiva, materiais eco-friendly e práticas éticas de trabalho. Marcas que abraçam essa mudança não apenas contribuem para um futuro mais verde, mas também conquistam a lealdade de uma nova geração de consumidores que valorizam propósito sobre preço."
  },
  {
    id: 2,
    titulo: "Gender-Neutral Fashion",
    relevancia: 89,
    categoria: "Styles",
    publico: 76,
    variacao: 18,
    direcao: "↑",
    comercial: 82,
    timing: 91,
    score: 84,
    descricao: "Moda sem gênero ganha força entre consumidores jovens",
    imagem: "/placeholder.svg",
    tags: ["unisex", "inclusão", "diversidade"],
    dataPublicacao: new Date("2024-01-20"),
    conteudoDetalhado: "A moda sem gênero representa uma quebra de paradigmas históricos na indústria fashion. Jovens consumidores, especialmente da Geração Z, estão redefinindo o que significa se vestir, rejeitando categorias binárias tradicionais em favor de uma expressão mais fluida e inclusiva. Esta tendência não apenas reflete mudanças sociais profundas, mas também apresenta oportunidades comerciais significativas para marcas que conseguem criar peças verdadeiramente universais."
  },
  {
    id: 3,
    titulo: "Tendência da Semana",
    relevancia: 92,
    categoria: "Styles",
    publico: 88,
    variacao: 15,
    direcao: "↑",
    comercial: 85,
    timing: 90,
    score: 89,
    descricao: "Nova análise da tendência da semana",
    imagem: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=400&fit=crop",
    tags: ["inovação", "tendência", "semana"],
    dataPublicacao: new Date("2024-01-25"),
    conteudoDetalhado: "Esta é a tendência da semana com análise detalhada e insights exclusivos para sua marca."
  },
  {
    id: 4,
    titulo: "Techwear Evolution",
    relevancia: 87,
    categoria: "Items",
    publico: 72,
    variacao: 8,
    direcao: "↑",
    comercial: 79,
    timing: 85,
    score: 81,
    descricao: "Tecnologia e moda se fundem em peças funcionais",
    imagem: "/placeholder.svg",
    tags: ["tecnologia", "funcional", "urban"],
    dataPublicacao: new Date("2024-01-18"),
    conteudoDetalhado: "O techwear continua evoluindo, combinando alta tecnologia com design fashion para criar peças que são tanto funcionais quanto esteticamente impressionantes."
  },
  {
    id: 5,
    titulo: "Vintage Revival",
    relevancia: 85,
    categoria: "Styles",
    publico: 81,
    variacao: 10,
    direcao: "↑",
    comercial: 83,
    timing: 87,
    score: 84,
    descricao: "Retorno das peças vintage com toque contemporâneo",
    imagem: "/placeholder.svg",
    tags: ["vintage", "retrô", "sustentabilidade"],
    dataPublicacao: new Date("2024-01-22"),
    conteudoDetalhado: "O movimento vintage ganha nova vida com reinterpretações modernas que mantêm a autenticidade das peças originais enquanto as atualizam para o consumidor contemporâneo."
  },
  {
    id: 6,
    titulo: "NOVA TENDÊNCIA - Semana 1",
    relevancia: 95,
    categoria: "Styles",
    publico: 90,
    variacao: 20,
    direcao: "↑",
    comercial: 88,
    timing: 92,
    score: 91,
    descricao: "Descrição atualizada da nova tendência",
    imagem: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=400&fit=crop",
    tags: ["nova", "tendência", "exclusiva"],
    dataPublicacao: new Date("2024-01-27"),
    conteudoDetalhado: "Esta é uma nova tendência exclusiva com alto potencial de crescimento e aplicação prática para estilistas e marcas."
  }
];

export default function TodasTendencias() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTrend, setSelectedTrend] = useState<Tendencia | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredTrends = mockTendencias.filter((trend) => {
    const matchesSearch = trend.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trend.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || trend.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleTrendClick = (trend: Tendencia) => {
    setSelectedTrend(trend);
    setIsModalOpen(true);
  };

  const getCategoryColor = (categoria: string) => {
    switch (categoria) {
      case 'Styles': return 'bg-primary/10 text-primary hover:bg-primary/20';
      case 'Values': return 'bg-secondary/10 text-secondary-foreground hover:bg-secondary/20';
      case 'Items': return 'bg-accent/10 text-accent-foreground hover:bg-accent/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-background">
      <HeaderComponent />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link to="/dashboard" className="hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">Todas as Tendências</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Todas as Tendências</h1>
          <p className="text-muted-foreground">
            Explore insights completos sobre as tendências mais relevantes para sua marca
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar tendências..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Categorias</SelectItem>
              <SelectItem value="Styles">Styles</SelectItem>
              <SelectItem value="Values">Values</SelectItem>
              <SelectItem value="Items">Items</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            {filteredTrends.length} tendência{filteredTrends.length !== 1 ? 's' : ''} encontrada{filteredTrends.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Trends Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredTrends.map((trend) => (
            <Card 
              key={trend.id} 
              className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 bg-card border-border"
              onClick={() => handleTrendClick(trend)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-3">
                  <Badge className={getCategoryColor(trend.categoria)}>
                    {trend.categoria}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-current text-yellow-500" />
                    <span className={`font-semibold ${getScoreColor(trend.score)}`}>
                      {trend.score}
                    </span>
                  </div>
                </div>
                <CardTitle className="text-lg leading-tight mb-2">
                  {trend.titulo}
                </CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {trend.descricao}
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {trend.relevancia}%
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {trend.publico}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className={`font-semibold ${trend.direcao === '↑' ? 'text-green-600' : 'text-red-600'}`}>
                      {trend.direcao} {trend.variacao}%
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-3">
                  {trend.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {trend.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{trend.tags.length - 3}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredTrends.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Nenhuma tendência encontrada</h3>
            <p className="text-muted-foreground">
              Tente ajustar seus filtros ou termo de busca
            </p>
          </div>
        )}
      </main>

      {/* Modal */}
      {selectedTrend && (
        <TendenciaDetalheModal
          tendencia={selectedTrend}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onNext={() => {
            const currentIndex = mockTendencias.findIndex(t => t.id === selectedTrend.id);
            const nextIndex = (currentIndex + 1) % mockTendencias.length;
            setSelectedTrend(mockTendencias[nextIndex]);
          }}
          onPrevious={() => {
            const currentIndex = mockTendencias.findIndex(t => t.id === selectedTrend.id);
            const prevIndex = currentIndex === 0 ? mockTendencias.length - 1 : currentIndex - 1;
            setSelectedTrend(mockTendencias[prevIndex]);
          }}
        />
      )}
    </div>
  );
}
