// src/components/BrandRegistration.tsx
import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface BrandRegistrationProps {
  inviteCode: string;
  requiredEmail: string | null;
  onSuccess: () => void;
  onInviteUsed: (inviteCode: string, brandId: string) => void;
}

interface BrandFormData {
  brand_name: string;
  brand_email: string;
  business_model: 'b2b' | 'b2c' | 'marketplace' | 'atacado_varejo';
  price_range: 'popular_100' | 'medio_300' | 'alto_600' | 'luxo';
  target_audience: '15-19_anos' | '20-29_anos' | '30-45_anos' | '46-60_anos' | '60+_anos';
  main_challenges?: string;
}

export default function BrandRegistration({ 
  inviteCode, 
  requiredEmail, 
  onSuccess,
  onInviteUsed 
}: BrandRegistrationProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<BrandFormData>({
    brand_name: '',
    brand_email: requiredEmail || '',
    business_model: 'b2c',
    price_range: 'medio_300',
    target_audience: '20-29_anos',
    main_challenges: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleBrandCreation(formData);
  };

  const handleBrandCreation = async (brandData: BrandFormData) => {
    try {
      setLoading(true);
      setError(null);

      // 1. Verificar usuário atual
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('Usuário não autenticado');

      // 2. Verificar mismatch de email se houver requiredEmail
      if (requiredEmail && user.email !== requiredEmail) {
        throw new Error(`Este convite é específico para: ${requiredEmail}. Você está logado com: ${user.email}`);
      }

      // 3. Criar perfil de marca se não existir
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email!,
          full_name: brandData.brand_name,
          user_type: 'brand',
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        });

      if (profileError) {
        console.error('Erro no perfil:', profileError);
        // Pode ser que o perfil já exista, continuar...
      }

      // 4. Criar a marca com retorno do ID
      const { data: brand, error: brandError } = await supabase
        .from('brands')
        .insert({
          brand_name: brandData.brand_name,
          business_model: brandData.business_model,
          price_range: brandData.price_range,
          target_audience: brandData.target_audience,
          main_challenges: brandData.main_challenges,
          profile_id: user.id
        })
        .select()
        .single();

      if (brandError) {
        console.error('Erro na marca:', brandError);
        
        // Se for erro de duplicidade, tentar buscar a marca existente
        if (brandError.code === '23505') {
          const { data: existingBrand } = await supabase
            .from('brands')
            .select('id')
            .eq('profile_id', user.id)
            .single();
          
          if (existingBrand) {
            // Usar marca existente
            await completeInviteProcess(inviteCode, existingBrand.id);
            onSuccess();
            return;
          }
        }
        
        throw brandError;
      }

      // 5. Completar o processo do convite
      await completeInviteProcess(inviteCode, brand.id);

      // 6. Sucesso
      onSuccess();

    } catch (error: any) {
      console.error('Erro na criação da marca:', error);
      setError(error.message || 'Erro ao criar conta da marca');
    } finally {
      setLoading(false);
    }
  };

  const completeInviteProcess = async (inviteCode: string, brandId: string) => {
    // Atualizar o convite como usado
    const { error: inviteUpdateError } = await supabase
      .from('brand_invites')
      .update({
        status: 'used',
        brand_id: brandId,
        updated_at: new Date().toISOString()
      })
      .eq('invite_code', inviteCode);

    if (inviteUpdateError) {
      console.warn('Convite não pôde ser atualizado:', inviteUpdateError);
      // Não falhar o processo todo se apenas a atualização do convite falhar
    }

    // Chamar callback
    onInviteUsed(inviteCode, brandId);
  };

  const handleInputChange = (field: keyof BrandFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="bg-white rounded-lg p-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome da Marca *
          </label>
          <input
            type="text"
            required
            value={formData.brand_name}
            onChange={(e) => handleInputChange('brand_name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Digite o nome da sua marca"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email da Marca *
          </label>
          <input
            type="email"
            required
            value={formData.brand_email}
            onChange={(e) => handleInputChange('brand_email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="email@marca.com"
            disabled={!!requiredEmail}
          />
          {requiredEmail && (
            <p className="text-sm text-gray-500 mt-1">
              Email definido pelo convite
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Modelo de Negócio *
          </label>
          <select
            value={formData.business_model}
            onChange={(e) => handleInputChange('business_model', e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="b2c">B2C (Varejo)</option>
            <option value="b2b">B2B (Atacado)</option>
            <option value="marketplace">Marketplace</option>
            <option value="atacado_varejo">Atacado e Varejo</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Faixa de Preço *
          </label>
          <select
            value={formData.price_range}
            onChange={(e) => handleInputChange('price_range', e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="popular_100">Até R$ 100</option>
            <option value="medio_300">R$ 100 - R$ 300</option>
            <option value="alto_600">R$ 300 - R$ 600</option>
            <option value="luxo">Acima de R$ 600</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Público-Alvo *
          </label>
          <select
            value={formData.target_audience}
            onChange={(e) => handleInputChange('target_audience', e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="15-19_anos">15-19 anos</option>
            <option value="20-29_anos">20-29 anos</option>
            <option value="30-45_anos">30-45 anos</option>
            <option value="46-60_anos">46-60 anos</option>
            <option value="60+_anos">60+ anos</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Principais Desafios
          </label>
          <textarea
            value={formData.main_challenges}
            onChange={(e) => handleInputChange('main_challenges', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Quais são os principais desafios da sua marca?"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Criando conta...' : 'Criar Conta da Marca'}
        </button>
      </form>
    </div>
  );
}
