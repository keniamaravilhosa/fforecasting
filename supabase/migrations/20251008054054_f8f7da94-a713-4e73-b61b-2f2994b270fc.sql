-- Remove problematic RLS policy that references auth.users
DROP POLICY IF EXISTS "Authenticated users can view invites for their email" ON public.brand_invites;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_brand_invites_stylist ON public.brand_invites (stylist_id);
CREATE INDEX IF NOT EXISTS idx_brand_invites_stylist_created_at ON public.brand_invites (stylist_id, created_at DESC);