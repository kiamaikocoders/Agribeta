-- Fix users with NULL roles to prevent redirect loops
-- This migration addresses the issue where users get stuck in redirect loops due to NULL roles

-- Update any existing profiles that have NULL role to 'farmer' as a fallback
UPDATE public.profiles 
SET role = 'farmer' 
WHERE role IS NULL;

-- Add a check constraint to prevent NULL roles in the future
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_role_not_null 
CHECK (role IS NOT NULL);

-- Update the handle_new_user function to set a default role of 'farmer'
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, subscription_tier, ai_predictions_used, ai_predictions_limit, total_diagnoses, is_verified, created_at)
  VALUES (
    new.id,
    new.email,
    'farmer', -- Set default role to 'farmer' instead of NULL
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
