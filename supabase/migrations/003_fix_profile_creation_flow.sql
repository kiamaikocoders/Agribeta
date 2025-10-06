-- Fix profile creation flow to properly handle role assignment and data persistence
-- This migration addresses the issue where users are assigned wrong roles and lose signup data

-- Update the handle_new_user function to not set a default role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, subscription_tier, ai_predictions_used, ai_predictions_limit, total_diagnoses, is_verified, created_at)
  VALUES (
    new.id,
    new.email,
    NULL, -- No default role - will be set during profile completion
    'free',
    0,
    5,
    0,
    false,
    now()
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger is properly set up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Update existing profiles that have NULL role to 'farmer' as a fallback
-- This handles any existing users who might be stuck with NULL roles
UPDATE public.profiles 
SET role = 'farmer' 
WHERE role IS NULL;
