-- Fix RLS policies for authentication and profile creation
-- This migration ensures users can create their own role-specific profiles

-- Enable RLS on farmer_profiles if not already enabled
ALTER TABLE farmer_profiles ENABLE ROW LEVEL SECURITY;

-- Enable RLS on agronomist_profiles if not already enabled  
ALTER TABLE agronomist_profiles ENABLE ROW LEVEL SECURITY;

-- Enable RLS on profiles if not already enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to recreate them properly
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

DROP POLICY IF EXISTS "Users can view all farmer profiles" ON farmer_profiles;
DROP POLICY IF EXISTS "Users can insert own farmer profile" ON farmer_profiles;
DROP POLICY IF EXISTS "Users can update own farmer profile" ON farmer_profiles;

DROP POLICY IF EXISTS "Users can view all agronomist profiles" ON agronomist_profiles;
DROP POLICY IF EXISTS "Users can insert own agronomist profile" ON agronomist_profiles;
DROP POLICY IF EXISTS "Users can update own agronomist profile" ON agronomist_profiles;

-- PROFILES TABLE POLICIES
-- Allow all authenticated users to view all profiles
CREATE POLICY "Users can view all profiles" ON profiles
    FOR SELECT USING (true);

-- Allow users to insert their own profile (when id matches auth.uid())
CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- FARMER_PROFILES TABLE POLICIES
-- Allow all authenticated users to view all farmer profiles
CREATE POLICY "Users can view all farmer profiles" ON farmer_profiles
    FOR SELECT USING (true);

-- Allow users to insert their own farmer profile
CREATE POLICY "Users can insert own farmer profile" ON farmer_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow users to update their own farmer profile
CREATE POLICY "Users can update own farmer profile" ON farmer_profiles
    FOR UPDATE USING (auth.uid() = id);

-- AGRONOMIST_PROFILES TABLE POLICIES  
-- Allow all authenticated users to view all agronomist profiles
CREATE POLICY "Users can view all agronomist profiles" ON agronomist_profiles
    FOR SELECT USING (true);

-- Allow users to insert their own agronomist profile
CREATE POLICY "Users can insert own agronomist profile" ON agronomist_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow users to update their own agronomist profile  
CREATE POLICY "Users can update own agronomist profile" ON agronomist_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Create function to automatically create basic profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, subscription_tier, ai_predictions_used, ai_predictions_limit, total_diagnoses, is_verified, created_at)
  VALUES (
    new.id,
    new.email,
    'farmer', -- Default role, will be updated during profile setup
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

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.farmer_profiles TO authenticated;  
GRANT ALL ON public.agronomist_profiles TO authenticated;