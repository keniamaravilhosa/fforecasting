-- Fix Function Search Path Mutable security warning
-- Update the validate_invite_code function to set search_path properly

CREATE OR REPLACE FUNCTION validate_invite_code()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Ensure invite code is at least 12 characters and contains alphanumeric characters
  IF length(NEW.invite_code) < 12 OR NEW.invite_code !~ '^[A-Za-z0-9]+$' THEN
    RAISE EXCEPTION 'Invite code must be at least 12 alphanumeric characters';
  END IF;
  RETURN NEW;
END;
$$;