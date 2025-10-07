const handleSubmit = async (data: BrandFormData) => {
  if (!user) {
    toast.error("Você precisa estar logado para continuar");
    return;
  }

  setLoading(true);
  
  try {
    // Verificar se tem convite válido (se veio de /invite)
    if (inviteCode && inviteData) {
      // Verificar se o email do usuário corresponde ao email do convite
      if (user.email !== inviteData.brand_email) {
        throw new Error("Email não corresponde ao convite. Use o email: " + inviteData.brand_email);
      }
    }

    console.log("👤 Criando perfil com user_type: 'brand'");

    // Create profile first - GARANTINDO que user_type é 'brand'
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        user_id: user.id,
        user_type: 'brand', // ← ISSO É CRÍTICO
        full_name: data.brandName,
        email: user.email || '',
      })
      .select()
      .single();

    if (profileError) {
      console.error("❌ Erro ao criar perfil:", profileError);
      throw profileError;
    }

    console.log("✅ Perfil criado:", profile);

    // Create brand data
    const { error: brandError } = await supabase
      .from('brands')
      .insert({
        profile_id: profile.id,
        brand_name: data.brandName,
        target_audience: data.targetAudience,
        price_range: data.priceRange,
        business_model: data.businessModel,
        main_challenges: data.mainChallenges || null,
      });

    if (brandError) {
      console.error("❌ Erro ao criar marca:", brandError);
      throw brandError;
    }

    // Se tiver convite, atualizar status para 'used'
    if (inviteCode) {
      const { error: updateError } = await supabase
        .from('brand_invites')
        .update({ 
          status: 'used',
          brand_id: profile.id,
          used_at: new Date().toISOString()
        })
        .eq('invite_code', inviteCode);

      if (updateError) {
        console.error("⚠️ Erro ao atualizar convite:", updateError);
        // Não interrompe o fluxo principal
      }
    }

    console.log("🎉 Cadastro concluído, chamando onRegistrationSuccess");
    
    // Chamar o callback de sucesso se existir
    if (onRegistrationSuccess) {
      onRegistrationSuccess();
    }

    toast.success("Cadastro realizado com sucesso!");
    
    // Redirecionar para dashboard - DEVE identificar como marca
    console.log("🔄 Redirecionando para /dashboard");
    navigate("/dashboard");
    
  } catch (error: any) {
    console.error('💥 Erro completo:', error);
    toast.error(error.message || "Erro ao criar conta. Tente novamente.");
  } finally {
    setLoading(false);
  }
};
