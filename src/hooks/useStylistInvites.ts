import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Invite {
  id: string;
  brand_name: string;
  brand_email: string;
  invite_code: string;
  status: 'pending' | 'accepted' | 'expired';
  created_at: string;
  expires_at: string;
}

export const useStylistInvites = (stylistId: string | null) => {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvites = async () => {
      if (!stylistId) {
        setInvites([]);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('brand_invites')
          .select('*')
          .eq('stylist_id', stylistId)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching invites:', error);
        } else {
          setInvites(data || []);
        }
      } catch (error) {
        console.error('Error fetching invites:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvites();
  }, [stylistId]);

  const refreshInvites = async () => {
    if (!stylistId) return;

    try {
      const { data, error } = await supabase
        .from('brand_invites')
        .select('*')
        .eq('stylist_id', stylistId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error refreshing invites:', error);
      } else {
        setInvites(data || []);
      }
    } catch (error) {
      console.error('Error refreshing invites:', error);
    }
  };

  return { invites, loading, refreshInvites };
};
