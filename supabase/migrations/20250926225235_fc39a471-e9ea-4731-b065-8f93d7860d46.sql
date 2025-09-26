-- Fix Brand Invitation Access Control (HIGH PRIORITY)
-- Add RLS policies to allow brands to view and manage invitations sent to them

-- Allow brands to view invitations where brand_email matches their profile email
CREATE POLICY "Brands can view invitations sent to them" 
ON public.brand_invites 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM profiles p 
    JOIN brands b ON b.profile_id = p.id 
    WHERE p.user_id = auth.uid() 
    AND p.email = brand_invites.brand_email
  )
);

-- Allow brands to update invitation status (accept/decline)
CREATE POLICY "Brands can update invitations sent to them" 
ON public.brand_invites 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 
    FROM profiles p 
    JOIN brands b ON b.profile_id = p.id 
    WHERE p.user_id = auth.uid() 
    AND p.email = brand_invites.brand_email
  )
);

-- Add unique constraint to prevent invite code reuse (security enhancement)
ALTER TABLE public.brand_invites 
ADD CONSTRAINT unique_invite_code UNIQUE (invite_code);

-- Add index for better performance on brand_email lookups
CREATE INDEX idx_brand_invites_brand_email ON public.brand_invites (brand_email);

-- Add validation trigger to ensure invite codes are sufficiently random
CREATE OR REPLACE FUNCTION validate_invite_code()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure invite code is at least 12 characters and contains alphanumeric characters
  IF length(NEW.invite_code) < 12 OR NEW.invite_code !~ '^[A-Za-z0-9]+$' THEN
    RAISE EXCEPTION 'Invite code must be at least 12 alphanumeric characters';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_invite_code_trigger
  BEFORE INSERT OR UPDATE ON public.brand_invites
  FOR EACH ROW
  EXECUTE FUNCTION validate_invite_code();