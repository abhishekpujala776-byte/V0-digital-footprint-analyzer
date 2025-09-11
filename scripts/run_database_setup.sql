-- Digital Footprint Risk Analyzer Database Schema
-- Run this script in your Supabase SQL editor

-- Enable Row Level Security
ALTER DATABASE postgres SET row_security = on;

-- Create users table extension
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create footprint_scans table
CREATE TABLE IF NOT EXISTS public.footprint_scans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    scan_type TEXT NOT NULL CHECK (scan_type IN ('email', 'social_media', 'comprehensive')),
    target_identifier TEXT NOT NULL,
    risk_score INTEGER CHECK (risk_score >= 0 AND risk_score <= 100),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    results JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Create breach_data table
CREATE TABLE IF NOT EXISTS public.breach_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    scan_id UUID REFERENCES public.footprint_scans(id) NOT NULL,
    breach_name TEXT NOT NULL,
    breach_date DATE,
    compromised_data TEXT[],
    severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create social_exposure table
CREATE TABLE IF NOT EXISTS public.social_exposure (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    scan_id UUID REFERENCES public.footprint_scans(id) NOT NULL,
    platform TEXT NOT NULL,
    exposure_type TEXT NOT NULL,
    risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high')),
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ai_analysis table for advanced AI features
CREATE TABLE IF NOT EXISTS public.ai_analysis (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    scan_id UUID REFERENCES public.footprint_scans(id) NOT NULL,
    analysis_type TEXT NOT NULL,
    model_used TEXT,
    confidence_score DECIMAL(3,2),
    findings JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.footprint_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.breach_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_exposure ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_analysis ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can view own scans" ON public.footprint_scans
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own breach data" ON public.breach_data
    FOR ALL USING (auth.uid() = (SELECT user_id FROM public.footprint_scans WHERE id = scan_id));

CREATE POLICY "Users can view own social exposure" ON public.social_exposure
    FOR ALL USING (auth.uid() = (SELECT user_id FROM public.footprint_scans WHERE id = scan_id));

CREATE POLICY "Users can view own AI analysis" ON public.ai_analysis
    FOR ALL USING (auth.uid() = (SELECT user_id FROM public.footprint_scans WHERE id = scan_id));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_footprint_scans_user_id ON public.footprint_scans(user_id);
CREATE INDEX IF NOT EXISTS idx_footprint_scans_created_at ON public.footprint_scans(created_at);
CREATE INDEX IF NOT EXISTS idx_breach_data_scan_id ON public.breach_data(scan_id);
CREATE INDEX IF NOT EXISTS idx_social_exposure_scan_id ON public.social_exposure(scan_id);
CREATE INDEX IF NOT EXISTS idx_ai_analysis_scan_id ON public.ai_analysis(scan_id);
