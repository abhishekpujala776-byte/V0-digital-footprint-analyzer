-- Create users profile table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create digital footprint scans table
CREATE TABLE IF NOT EXISTS public.footprint_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scan_type TEXT NOT NULL, -- 'email', 'social_media', 'full'
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  risk_score INTEGER DEFAULT 0, -- 0-100 scale
  breach_count INTEGER DEFAULT 0,
  social_exposure_score INTEGER DEFAULT 0,
  privacy_score INTEGER DEFAULT 0,
  recommendations JSONB DEFAULT '[]',
  scan_results JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create breach data table
CREATE TABLE IF NOT EXISTS public.breach_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id UUID NOT NULL REFERENCES public.footprint_scans(id) ON DELETE CASCADE,
  breach_name TEXT NOT NULL,
  breach_date DATE,
  data_types TEXT[] DEFAULT '{}', -- ['email', 'password', 'phone', etc.]
  severity TEXT NOT NULL, -- 'low', 'medium', 'high', 'critical'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create social media exposure table
CREATE TABLE IF NOT EXISTS public.social_exposure (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id UUID NOT NULL REFERENCES public.footprint_scans(id) ON DELETE CASCADE,
  platform TEXT NOT NULL, -- 'twitter', 'facebook', 'linkedin', etc.
  exposure_type TEXT NOT NULL, -- 'public_profile', 'personal_info', 'location', etc.
  risk_level TEXT NOT NULL, -- 'low', 'medium', 'high'
  details JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.footprint_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.breach_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_exposure ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Create RLS policies for footprint_scans
CREATE POLICY "scans_select_own" ON public.footprint_scans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "scans_insert_own" ON public.footprint_scans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "scans_update_own" ON public.footprint_scans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "scans_delete_own" ON public.footprint_scans FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for breach_data (via scan ownership)
CREATE POLICY "breach_data_select_own" ON public.breach_data FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.footprint_scans 
    WHERE footprint_scans.id = breach_data.scan_id 
    AND footprint_scans.user_id = auth.uid()
  ));

CREATE POLICY "breach_data_insert_own" ON public.breach_data FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.footprint_scans 
    WHERE footprint_scans.id = breach_data.scan_id 
    AND footprint_scans.user_id = auth.uid()
  ));

-- Create RLS policies for social_exposure (via scan ownership)
CREATE POLICY "social_exposure_select_own" ON public.social_exposure FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.footprint_scans 
    WHERE footprint_scans.id = social_exposure.scan_id 
    AND footprint_scans.user_id = auth.uid()
  ));

CREATE POLICY "social_exposure_insert_own" ON public.social_exposure FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.footprint_scans 
    WHERE footprint_scans.id = social_exposure.scan_id 
    AND footprint_scans.user_id = auth.uid()
  ));

-- Create function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NULL)
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Create trigger for auto-profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Running the existing comprehensive database schema
