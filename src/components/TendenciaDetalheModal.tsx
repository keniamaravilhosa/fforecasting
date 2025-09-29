import { X, Download, Share2, ChevronLeft, ChevronRight, Star, TrendingUp, Users, Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import html2pdf from "html2pdf.js";

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

interface TendenciaDetalheModalProps {
  tendencia: Tendencia;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function TendenciaDetalheModal({ 
  tendencia, 
  isOpen, 
  onClose, 
  onNext, 
  onPrevious 
}: TendenciaDetalheModalProps) {
  
  const getCategoryColor = (categoria: string) => {
    switch (categoria) {
      case 'Styles': return 'bg-primary/10 text-primary border-primary/20';
      case 'Values': return 'bg-secondary/10 text-secondary-foreground border-secondary/20';
      case 'Items': return 'bg-accent/10 text-accent-foreground border-accent/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-success-green';
    if (score >= 70) return 'text-warning-amber';
    return 'text-attention-coral';
  };

  const handleDownloadPDF = (tendencia: any) => {
    const element = document.getElementById('trend-content');
    const opt = {
      margin: 1,
      filename: `tendencia-${tendencia.titulo.toLowerCase().replace(/\s+/g, '-')}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' as const }
    };

    html2pdf().set(opt).from(element).save();
  };
        // Para PDF na pasta public do projeto
      const pdfUrl = `${window.location.origin}/tendencia.pdf`;

    const link = document.createElement('a');
  link.href = pdfUrl;
  link.download = `tendencia-${tendencia.id}-${tendencia.titulo.toLowerCase().replace(/\s+/g, '-')}.pdf`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: tendencia.titulo,
          text: tendencia.descricao,
          url: window.location.href
        });
      } catch (error) {
        console.log('Sharing cancelled');
      }
    } else {
      // Fallback para copiar URL
      navigator.clipboard.writeText(window.location.href);
      // Aqui você pode adicionar um toast de confirmação
    }
  };

    document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  console.log(`Baixando PDF: ${tendencia.titulo}`);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 gap-0">
        {/* Header fixo */}
        <DialogHeader className="sticky top-0 z-10 bg-background border-b border-border p-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={onPrevious}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div>
                <DialogTitle className="text-xl mb-1">{tendencia.titulo}</DialogTitle>
                <div className="flex items-center space-x-2">
                  <Badge className={getCategoryColor(tendencia.categoria)}>
                    {tendencia.categoria}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {tendencia.dataPublicacao.toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Compartilhar
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="ghost" size="sm" onClick={onNext}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Conteúdo scrollável */}
        <ScrollArea className="flex-1">
          <div id="trend-content" className="p-6 space-y-6">
            {/* Score destacado */}
            <div className="text-center py-6 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-border/50">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Star className="h-6 w-6 fill-current text-yellow-500" />
                <span className={`text-3xl font-bold ${getScoreColor(tendencia.score)}`}>
                  {tendencia.score}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Score de Relevância</p>
            </div>

            {/* Métricas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-card rounded-lg border border-border">
                <TrendingUp className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-semibold">{tendencia.relevancia}%</div>
                <div className="text-sm text-muted-foreground">Relevância</div>
              </div>
              
              <div className="text-center p-4 bg-card rounded-lg border border-border">
                <Users className="h-6 w-6 mx-auto mb-2 text-secondary" />
                <div className="text-2xl font-semibold">{tendencia.publico}%</div>
                <div className="text-sm text-muted-foreground">Público</div>
              </div>
              
              <div className="text-center p-4 bg-card rounded-lg border border-border">
                <DollarSign className="h-6 w-6 mx-auto mb-2 text-success-green" />
                <div className="text-2xl font-semibold">{tendencia.comercial}%</div>
                <div className="text-sm text-muted-foreground">Comercial</div>
              </div>
              
              <div className="text-center p-4 bg-card rounded-lg border border-border">
                <Clock className="h-6 w-6 mx-auto mb-2 text-warning-amber" />
                <div className="text-2xl font-semibold">{tendencia.timing}%</div>
                <div className="text-sm text-muted-foreground">Timing</div>
              </div>
            </div>

            {/* Variação */}
            <div className="flex items-center justify-center space-x-2 p-4 bg-card rounded-lg border border-border">
              <span className="text-sm text-muted-foreground">Variação:</span>
              <span className={`text-lg font-semibold ${tendencia.direcao === '↑' ? 'text-success-green' : 'text-attention-coral'}`}>
                {tendencia.direcao} {tendencia.variacao}%
              </span>
            </div>

            <Separator />

            {/* Descrição */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Resumo</h3>
              <p className="text-muted-foreground leading-relaxed">
                {tendencia.descricao}
              </p>
            </div>

            <Separator />

            {/* Conteúdo detalhado */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Análise Detalhada</h3>
              <div className="prose prose-sm max-w-none">
                <p className="text-foreground leading-relaxed whitespace-pre-line">
                  {tendencia.conteudoDetalhado}
                </p>
              </div>
            </div>

            <Separator />

            {/* Tags */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Tags Relacionadas</h3>
              <div className="flex flex-wrap gap-2">
                {tendencia.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Footer com informações adicionais */}
            <div className="border-t border-border pt-6 mt-8">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div>
                  <p>Publicado em {tendencia.dataPublicacao.toLocaleDateString('pt-BR')}</p>
                </div>
                <div className="text-right">
                  <p>ID: {tendencia.id}</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
