import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface Profile {
  id: string;
  user_id: string;
  user_type: 'brand' | 'stylist';
  full_name: string;
  email: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const { data: profile, isLoading: loading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        throw error;
      }
      
      return data;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });

  const setProfile = (newProfile: Profile | null) => {
    queryClient.setQueryData(['profile', user?.id], newProfile);
  };
  
  return { profile: profile ?? null, loading, setProfile };
};