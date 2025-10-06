// src/pages/TendenciasStylist.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ChevronLeft, 
  ChevronRight, 
  Search,
  Calendar,
  Download,
  Share2,
  Crown,
  Users,
  TrendingUp,
  Sparkles,
  BarChart3,
  DollarSign,
  Palette
} from "lucide-react";
import { Link } from "react-router-dom";
import { TendenciaDetalheModal } from "@/components/TendenciaDetalheModal";

// Mock data - Tendências ESPECÍFICAS para estilistas
const tendenciasStylist = [
  {
    id: 1,
    titulo: "Análise Técnica: Cottagecore para Coleções Premium",
    descricao: "Guia completo para estilistas: como adaptar o movimento cottagecore para marcas de luxo. Padrões de corte, tecidos recomendados e paleta de cores.",
    imagem: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&h=400&fit=crop",
    categoria: "Técnica",
    dificuldade: "Avançado",
    tempoLeitura: "12 min",
    score: 92,
    dataPublicacao: "2024-12-15",
    visualizacoes: 1247,
    tags: ["padrões", "tecidos", "paleta-cores", "luxo"],
    relevancia: 92,
    publico: 85,
    variacao: 12,
    direcao: '↑' as const,
    comercial: 78,
    timing: 88,
    conteudoDetalhado: `Este guia completo para estilistas explora como adaptar o movimento cottagecore para marcas de luxo.\n\n**Padrões de Corte:**\nO cottagecore premium exige uma abordagem refinada aos cortes tradicionais. Explore silhuetas amplas mas estruturadas, com ênfase em costura impecável e acabamentos de alta qualidade.\n\n**Tecidos Recomendados:**\n- Linho irlandês de alta gramatura\n- Algodão pima orgânico\n- Lã merino extrafina\n- Seda crepe artesanal\n\n**Paleta de Cores:**\nTrabalhe com tons naturais sofisticados: bege creme, verde musgo profundo, terracota suave e azul petróleo. Evite cores vibrantes que comprometam a estética atemporal.\n\n**Detalhes Técnicos:**\nIncorpore bordados à mão, botões de madrepérola genuína e rendas artesanais. A chave é equilibrar o rústico com o refinado.`
  },
  {
    id: 2,
    titulo: "Workshop: Desconstruindo a Moda Sem Gênero",
    descricao: "Tutorial prático para criação de peças unissex. Análise de silhuetas, caimentos e técnicas de modelagem inclusivas.",
    imagem: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&h=400&fit=crop",
    categoria: "Workshop",
    dificuldade: "Intermediário",
    tempoLeitura: "18 min",
    score: 78,
    dataPublicacao: "2024-12-14",
    visualizacoes: 987,
    tags: ["modelagem", "silhuetas", "unissex", "tutorial"],
    relevancia: 78,
    publico: 92,
    variacao: 18,
    direcao: '↑' as const,
    comercial: 65,
    timing: 85,
    conteudoDetalhado: `Workshop prático para criação de peças verdadeiramente inclusivas e sem gênero.\n\n**Análise de Silhuetas:**\nFoco em cortes oversized e estruturados que favorecem diversos biotipos sem depender de marcações de cintura ou quadril tradicionais.\n\n**Caimentos:**\nTrabalhe com caimentos retos e amplos, explorando volumes estratégicos que não sigam padrões binários de gênero.\n\n**Técnicas de Modelagem:**\n- Ombros estruturados mas confortáveis\n- Comprimentos versáteis\n- Sistemas de ajuste discretos\n- Fechamentos práticos e neutros\n\n**Materiais:**\nPriorize tecidos com boa recuperação e conforto, como malhas estruturadas e algodões com elastano.`
  },
  {
    id: 3,
    titulo: "Guia de Materiais Sustentáveis 2024",
    descricao: "Catálogo completo de tecidos eco-friendly para estilistas. Análise de custo-benefício, fornecedores e aplicações práticas.",
    imagem: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop",
    categoria: "Material",
    dificuldade: "Todos",
    tempoLeitura: "25 min",
    score: 65,
    dataPublicacao: "2024-12-13",
    visualizacoes: 856,
    tags: ["tecidos", "sustentabilidade", "fornecedores", "materiais"],
    relevancia: 65,
    publico: 78,
    variacao: 25,
    direcao: '↑' as const,
    comercial: 88,
    timing: 92,
    conteudoDetalhado: `Catálogo atualizado dos melhores materiais sustentáveis disponíveis no mercado.\n\n**Tecidos Eco-Friendly:**\n- Tencel™ Lyocell: Excelente caimento, produção sustentável\n- Linho orgânico: Durabilidade e baixo impacto ambiental\n- Algodão reciclado: Custo-benefício e versatilidade\n- Fibras de bambu: Maciez e propriedades antibacterianas\n\n**Análise de Custo-Benefício:**\nEmbora inicialmente mais caros, tecidos sustentáveis oferecem melhor durabilidade e apelo de marca.\n\n**Fornecedores Recomendados:**\nLista completa disponível no material completo com contatos diretos e volumes mínimos de pedido.`
  },
  {
    id: 4,
    titulo: "Masterclass: Revival Y2K em Coleções Contemporâneas",
    descricao: "Como resgatar elementos dos anos 2000 sem cair no kitsch. Análise de detalhes, acessórios e combinações modernas.",
    imagem: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=400&fit=crop",
    categoria: "Masterclass",
    dificuldade: "Avançado",
    tempoLeitura: "15 min",
    score: 120,
    dataPublicacao: "2024-12-12",
    visualizacoes: 1543,
    tags: ["y2k", "detalhes", "acessórios", "moderno"],
    relevancia: 120,
    publico: 95,
    variacao: 32,
    direcao: '↑' as const,
    comercial: 110,
    timing: 98,
    conteudoDetalhado: `Masterclass completa sobre como resgatar elementos Y2K com sofisticação contemporânea.\n\n**Elementos-Chave:**\n- Low-rise atualizado (mais confortável)\n- Metalizados estratégicos\n- Transparências modernas\n- Logos minimalistas\n\n**Detalhes que Funcionam:**\nFoco em acabamentos metálicos, zíperes expostos e recortes geométricos sem exageros.\n\n**Acessórios:**\nÓculos pequenos, bolsas micro estruturadas e joias chunky em versões atualizadas.\n\n**Armadilhas a Evitar:**\nNão caia no excesso de referências nostálgicas. O segredo é a edição cuidadosa de elementos icônicos.`
  },
  {
    id: 5,
    titulo: "Tecnologia Têxtil: Integrando Wearables",
    descricao: "Guia técnico para incorporar tecnologia em peças de moda. Circuitos, sensores e materiais inteligentes para estilistas.",
    imagem: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop",
    categoria: "Tecnologia",
    dificuldade: "Avançado",
    tempoLeitura: "20 min",
    score: 45,
    dataPublicacao: "2024-12-11",
    visualizacoes: 723,
    tags: ["tecnologia", "wearables", "circuitos", "inovação"],
    relevancia: 45,
    publico: 38,
    variacao: 8,
    direcao: '↑' as const,
    comercial: 42,
    timing: 55,
    conteudoDetalhado: `Guia técnico de introdução à moda tecnológica para estilistas visionários.\n\n**Circuitos Integrados:**\nAprenda a incorporar LEDs, sensores de temperatura e elementos condutivos em tecidos.\n\n**Sensores:**\n- Movimento e postura\n- Temperatura corporal\n- Frequência cardíaca\n\n**Materiais Inteligentes:**\nTecidos que mudam de cor, fibras condutivas e têxteis com memória de forma.\n\n**Fornecedores:**\nEmpresas especializadas em componentes miniaturizados e laváveis para moda.\n\n**Considerações Práticas:**\nDurabilidade, manutenção e conforto são fundamentais para aceitação do consumidor.`
  },
  {
    id: 6,
    titulo: "NOVA TENDÊNCIA - Semana 1",
    descricao: "Descrição atualizada...",
    imagem: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=400&fit=crop",
    categoria: "Inovação",
    dificuldade: "Intermediário",
    tempoLeitura: "10 min",
    score: 88,
    dataPublicacao: "2024-12-10",
    visualizacoes: 543,
    tags: ["inovação", "tendência", "semana"],
    relevancia: 88,
    publico: 82,
    variacao: 15,
    direcao: '↑' as const,
    comercial: 75,
    timing: 90,
    conteudoDetalhado: `Análise das tendências emergentes desta semana no mercado de moda.\n\n**Destaques:**\nMovimentos identificados nas principais passarelas e redes sociais.\n\n**Aplicação Prática:**\nComo adaptar essas tendências para diferentes segmentos de mercado.\n\n**Previsão:**\nEstimativa de durabilidade e potencial comercial de cada tendência identificada.`
  }
];

const ITENS_POR_PAGINA = 6;

// Função para converter score em classificação
const getClassificacao = (score: number) => {
  if (score >= 80) return { label: "Inovador", icon: Sparkles, color: "bg-purple-100 text-purple-800" };
  if (score >= 40) return { label: "Em Crescimento", icon: BarChart3, color: "bg-blue-100 text-blue-800" };
  return { label: "Comercial", icon: DollarSign, color: "bg-green-100 text-green-800" };
};

export default function TendenciasStylist() {
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [termoBusca, setTermoBusca] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("Todas");
  const [tendenciaSelecionada, setTendenciaSelecionada] = useState<typeof tendenciasStylist[0] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Filtrar tendências
  const tendenciasFiltradas = tendenciasStylist.filter(tendencia =>
    (filtroCategoria === "Todas" || tendencia.categoria === filtroCategoria) &&
    (tendencia.titulo.toLowerCase().includes(termoBusca.toLowerCase()) ||
     tendencia.descricao.toLowerCase().includes(termoBusca.toLowerCase()) ||
     tendencia.tags.some(tag => tag.toLowerCase().includes(termoBusca.toLowerCase())))
  );

  // Ordenar por data (mais recente primeiro)
  const tendenciasOrdenadas = tendenciasFiltradas.sort((a, b) => 
    new Date(b.dataPublicacao).getTime() - new Date(a.dataPublicacao).getTime()
  );

  // Calcular paginação
  const totalPaginas = Math.ceil(tendenciasOrdenadas.length / ITENS_POR_PAGINA);
  const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
  const fim = inicio + ITENS_POR_PAGINA;
  const tendenciasPagina = tendenciasOrdenadas.slice(inicio, fim);

  // Categorias únicas para filtro
  const categorias = ["Todas", ...new Set(tendenciasStylist.map(t => t.categoria))];

  const handleDownloadPDF = (tendencia: any) => {
    // Simular download de PDF - versão corrigida
    const link = document.createElement('a');
    link.href = `/pdfs/tendencia-${tendencia.id}.pdf`;
    link.download = `tendencia-${tendencia.id}.pdf`;
    link.click();
    
    console.log(`Baixando PDF para estilista: ${tendencia.titulo}`);
  };

  const handleVerDetalhes = (tendencia: typeof tendenciasStylist[0]) => {
    setTendenciaSelecionada(tendencia);
    setModalOpen(true);
  };

  const handleNextTendencia = () => {
    if (!tendenciaSelecionada) return;
    const currentIndex = tendenciasPagina.findIndex(t => t.id === tendenciaSelecionada.id);
    const nextIndex = (currentIndex + 1) % tendenciasPagina.length;
    setTendenciaSelecionada(tendenciasPagina[nextIndex]);
  };

  const handlePreviousTendencia = () => {
    if (!tendenciaSelecionada) return;
    const currentIndex = tendenciasPagina.findIndex(t => t.id === tendenciaSelecionada.id);
    const previousIndex = currentIndex === 0 ? tendenciasPagina.length - 1 : currentIndex - 1;
    setTendenciaSelecionada(tendenciasPagina[previousIndex]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container px-4 md:px-6 max-w-6xl mx-auto">
        {/* Header Específico para Estilistas */}
        <div className="mb-8">
          <Link to="/dashboard" className="inline-flex items-center text-terracotta hover:text-dark-terracotta mb-4">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Voltar ao Dashboard
          </Link>
          
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Crown className="h-6 w-6 text-terracotta" />
              <Badge variant="secondary" className="bg-peach text-dark-terracotta">
                Área do Estilista
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Biblioteca Técnica de Tendências
            </h1>
            <p className="text-lg text-muted-foreground">
              Conteúdo especializado em análise técnica, padrões e workshops
            </p>
          </div>

          {/* Filtros e Busca */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Buscar em workshops, técnicas..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                className="pl-10 pr-4 py-2 w-full"
              />
            </div>
            
            <select 
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-terracotta"
            >
              {categorias.map(categoria => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Estatísticas para Estilistas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-terracotta">{tendenciasStylist.length}</div>
              <p className="text-sm text-muted-foreground">Workshops</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-terracotta">
                {tendenciasStylist.filter(t => t.dificuldade === "Avançado").length}
              </div>
              <p className="text-sm text-muted-foreground">Masterclasses</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-terracotta">
                {new Set(tendenciasStylist.flatMap(t => t.tags)).size}
              </div>
              <p className="text-sm text-muted-foreground">Técnicas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-terracotta">
                {tendenciasStylist.filter(t => getClassificacao(t.score).label === "Inovador").length}
              </div>
              <p className="text-sm text-muted-foreground">Inovadores</p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Tendências Técnicas */}
        <div className="space-y-6">
          {tendenciasPagina.map((tendencia) => (
            <Card key={tendencia.id} className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-terracotta">
              <CardContent className="p-0">
                <div className="md:flex">
                  {/* Imagem */}
                  <div className="md:w-1/3">
                    <img
                      src={tendencia.imagem}
                      alt={tendencia.titulo}
                      className="w-full h-48 md:h-full object-cover"
                    />
                  </div>
                  
                  {/* Conteúdo Técnico */}
                  <div className="md:w-2/3 p-6">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <Badge variant="secondary" className="bg-peach/20 text-dark-terracotta">
                        {tendencia.categoria}
                      </Badge>
                      <Badge variant={tendencia.dificuldade === "Avançado" ? "default" : "outline"} 
                             className={tendencia.dificuldade === "Avançado" ? "bg-terracotta text-white" : ""}>
                        {tendencia.dificuldade}
                      </Badge>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">
                        ⏱️ {tendencia.tempoLeitura}
                      </Badge>
                      <div className="flex items-center text-sm text-muted-foreground ml-auto">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(tendencia.dataPublicacao).toLocaleDateString('pt-BR')}
                      </div>
                    </div>

                    <CardTitle className="text-xl mb-3">{tendencia.titulo}</CardTitle>
                    
                    <CardDescription className="text-base mb-4">
                      {tendencia.descricao}
                    </CardDescription>

                    {/* Tags Técnicas */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {tendencia.tags.map((tag, index) => (
                        <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Ações para Estilistas */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm">
                        <div className={`flex items-center px-2 py-1 rounded-full ${getClassificacao(tendencia.score).color}`}>
                          {(() => {
                            const classificacao = getClassificacao(tendencia.score);
                            const IconComponent = classificacao.icon;
                            return (
                              <>
                                <IconComponent className="h-4 w-4 mr-1" />
                                {classificacao.label}
                              </>
                            );
                          })()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          👁️ {tendencia.visualizacoes} visualizações
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDownloadPDF(tendencia)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Baixar Guia
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm"
                          className="bg-terracotta hover:bg-dark-terracotta text-white"
                          onClick={() => handleVerDetalhes(tendencia)}
                        >
                          <Users className="h-4 w-4 mr-1" />
                          Ver Detalhes
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Paginação */}
        {totalPaginas > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPaginaAtual(paginaAtual - 1)}
              disabled={paginaAtual === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pagina) => (
              <Button
                key={pagina}
                variant={pagina === paginaAtual ? "default" : "outline"}
                size="sm"
                onClick={() => setPaginaAtual(pagina)}
                className={pagina === paginaAtual ? "bg-terracotta text-white" : ""}
              >
                {pagina}
              </Button>
            ))}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPaginaAtual(paginaAtual + 1)}
              disabled={paginaAtual === totalPaginas}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {tendenciasPagina.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              Nenhum workshop encontrado para "{termoBusca}"
            </p>
          </div>
        )}

        {/* Modal de Detalhes */}
        {tendenciaSelecionada && (
          <TendenciaDetalheModal
            tendencia={{
              ...tendenciaSelecionada,
              categoria: 'Styles' as const,
              dataPublicacao: new Date(tendenciaSelecionada.dataPublicacao)
            }}
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onNext={handleNextTendencia}
            onPrevious={handlePreviousTendencia}
          />
        )}
      </div>
    </div>
  );
}
