-- Drop the insecure public policy
DROP POLICY IF EXISTS "Public can view invites by code" ON public.brand_invites;

-- Create a secure function to validate invite codes without exposing sensitive data
CREATE OR REPLACE FUNCTION public.validate_invite_code(invite_code_param text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  invite_record record;
  result jsonb;
BEGIN
  -- Fetch invite without exposing it publicly
  SELECT 
    expires_at < now() as is_expired,
    status = 'used' as is_used,
    status = 'accepted' as is_accepted,
    brand_email,
    expires_at > now() AND status = 'pending' as is_valid
  INTO invite_record
  FROM public.brand_invites
  WHERE invite_code = invite_code_param
  LIMIT 1;

  -- If no invite found, return invalid
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'valid', false,
      'error', 'invite_not_found'
    );
  END IF;

  -- Return validation result without exposing sensitive data
  IF invite_record.is_expired THEN
    RETURN jsonb_build_object(
      'valid', false,
      'error', 'expired'
    );
  END IF;

  IF invite_record.is_used OR invite_record.is_accepted THEN
    RETURN jsonb_build_object(
      'valid', false,
      'error', 'already_used'
    );
  END IF;

  -- Only return that it's valid and the required email
  RETURN jsonb_build_object(
    'valid', true,
    'required_email', invite_record.brand_email
  );
END;
$$;

-- Add policy for authenticated users to view invites matching their email
CREATE POLICY "Authenticated users can view invites for their email"
ON public.brand_invites
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email = brand_invites.brand_email
  )
);

-- Add explicit deny policy for unauthenticated users
CREATE POLICY "Deny public access to brand invites"
ON public.brand_invites
FOR SELECT
TO anon
USING (false);