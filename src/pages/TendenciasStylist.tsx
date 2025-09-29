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
    tags: ["padrões", "tecidos", "paleta-cores", "luxo"]
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
    tags: ["modelagem", "silhuetas", "unissex", "tutorial"]
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
    tags: ["tecidos", "sustentabilidade", "fornecedores", "materiais"]
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
    tags: ["y2k", "detalhes", "acessórios", "moderno"]
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
    tags: ["tecnologia", "wearables", "circuitos", "inovação"]
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
    tags: ["inovação", "tendência", "semana"]
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
      </div>
    </div>
  );
}
