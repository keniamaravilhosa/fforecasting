import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import BrandRegistration from "@/components/BrandRegistration";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Invite = () => {
  const { code } = useParams<{ code: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [validating, setValidating] = useState(true);
  const [inviteValid, setInviteValid] = useState(false);
  const [inviteData, setInviteData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const validateInvite = async () => {
      if (!code) {
        setError("Código de convite inválido");
        setValidating(false);
        return;
      }

      try {
        console.log("🔍 Iniciando validação do convite...");
        console.log("📝 Código do convite na URL:", code);
        console.log("📝 Tipo do código:", typeof code);
        console.log("📝 Comprimento do código:", code.length);

        // Primeiro, vamos verificar se conseguimos acessar a tabela
        console.log("🔄 Testando conexão com a tabela...");
        const { count, error: countError } = await supabase
          .from('brand_invites')
          .select('*', { count: 'exact', head: true });

        console.log("📊 Total de convites na tabela:", count);
        console.log("❌ Erro no count:", countError);

        // Buscar TODOS os convites para debug
        const { data: allInvites, error: allError } = await supabase
          .from('brand_invites')
          .select('invite_code, status, created_at')
          .limit(10);

        console.log("📋 Últimos 10 convites na tabela:", allInvites);
        console.log("❌ Erro ao buscar todos:", allError);

        // Agora buscar o convite específico
        console.log(`🔎 Buscando convite específico: ${code}`);
        const { data, error: fetchError } = await supabase
          .from('brand_invites')
          .select('*')
          .eq('invite_code', code)
          .single();

        console.log("📋 Dados retornados:", data);
        console.log("❌ Erro específico:", fetchError);
        console.log("🔢 Código do erro:", fetchError?.code);
        console.log("📄 Mensagem do erro:", fetchError?.message);

        if (fetchError) {
          if (fetchError.code === 'PGRST116') {
            console.log("❌ Convite não encontrado - PGRST116");
            // Vamos tentar uma busca mais flexível
            const { data: flexibleData, error: flexibleError } = await supabase
              .from('brand_invites')
              .select('*')
              .ilike('invite_code', `%${code}%`);

            console.log("🔄 Busca flexível resultou em:", flexibleData);
            console.log("❌ Erro na busca flexível:", flexibleError);

            if (flexibleData && flexibleData.length > 0) {
              console.log("✅ Encontrado na busca flexível!");
              const foundInvite = flexibleData[0];
              console.log("📝 Convite encontrado:", foundInvite.invite_code);
              console.log("📝 Nosso código de busca:", code);
              console.log("🔍 Comparação exata:", foundInvite.invite_code === code);
              
              // Verificar diferenças de case
              console.log("🔠 Comparação case-insensitive:", foundInvite.invite_code.toLowerCase() === code.toLowerCase());
              
              data = foundInvite;
              fetchError = null;
            } else {
              setError(`Convite não encontrado. Código: "${code}"`);
              setValidating(false);
              return;
            }
          } else {
            setError("Erro ao buscar convite: " + fetchError.message);
            setValidating(false);
            return;
          }
        }

        if (!data) {
          setError("Convite não encontrado");
          setValidating(false);
          return;
        }

        console.log("✅ Convite encontrado! Verificando validade...");
        console.log("📅 Data de expiração:", data.expires_at);
        console.log("🎯 Status:", data.status);

        // Verificar se já foi utilizado
        if (data.status === 'used' || data.status === 'redeemed') {
          setError("Este convite já foi utilizado");
          setValidating(false);
          return;
        }

        // Verificar se expirou
        const expiresAt = new Date(data.expires_at);
        const now = new Date();
        console.log("⏰ Data atual:", now);
        console.log("⏰ Data de expiração:", expiresAt);
        console.log("⏰ Convite expirado?", expiresAt < now);
        
        if (expiresAt < now) {
          setError("Este convite expirou. Solicite um novo convite ao estilista.");
          setValidating(false);
          return;
        }

        console.log("🎉 Convite válido!");
        setInviteData(data);
        setInviteValid(true);
        
      } catch (err) {
        console.error("💥 Erro inesperado:", err);
        setError("Erro interno ao validar convite. Tente novamente.");
      } finally {
        setValidating(false);
      }
    };

    validateInvite();
  }, [code]);

  // ... (restante do componente permanece igual)
