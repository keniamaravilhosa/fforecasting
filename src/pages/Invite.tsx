// src/pages/Invite.tsx - Correções principais

const validateInvite = async (code: string) => {
  try {
    setIsLoading(true);
    
    // SEMPRE usar a RPC para validar convites
    const { data: inviteData, error: inviteError } = await supabase
      .rpc('validate_invite_code', { invite_code_param: code });

    if (inviteError) throw inviteError;

    if (!inviteData || !inviteData.valid) {
      setError('Convite inválido, expirado ou já utilizado');
      return;
    }

    // Se chegou aqui, o convite é válido
    setInviteData({
      code: code,
      required_email: inviteData.required_email,
      stylist_id: inviteData.stylist_id
    });

    // Verificar se usuário já está logado e tem perfil
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, email, user_type')
        .eq('id', user.id)
        .single();

      if (profile) {
        // Verificar mismatch de email
        if (inviteData.required_email && profile.email !== inviteData.required_email) {
          setError(`Este convite é específico para: ${inviteData.required_email}`);
          return;
        }

        // Se já tem perfil de marca, redirecionar
        if (profile.user_type === 'brand') {
          navigate('/brand-dashboard');
          return;
        }
      }
    }

  } catch (error: any) {
    console.error('Erro na validação:', error);
    setError(error.message || 'Erro ao validar convite');
  } finally {
    setIsLoading(false);
  }
};

// No componente de renderização:
{inviteData && (
  <BrandRegistration
    inviteCode={inviteData.code}
    requiredEmail={inviteData.required_email}
    onSuccess={() => {
      // Navegar para dashboard da marca
      navigate('/brand-dashboard');
    }}
    onInviteUsed={updateInviteStatus} // Callback para atualizar status
  />
)}
