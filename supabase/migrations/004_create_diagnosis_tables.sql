-- Create diagnosis_results table for storing plant disease diagnosis history
-- This table stores all diagnosis results with images, disease information, and treatment recommendations

CREATE TABLE IF NOT EXISTS public.diagnosis_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    image TEXT NOT NULL, -- Base64 encoded image or image URL
    disease VARCHAR(255) NOT NULL, -- Name of the diagnosed disease
    confidence DECIMAL(3,2) NOT NULL CHECK (confidence >= 0 AND confidence <= 1), -- Confidence score (0-1)
    description TEXT, -- Description of the disease
    treatment TEXT[], -- Array of treatment recommendations
    prevention_tips TEXT[], -- Array of prevention tips
    crop_type VARCHAR(100) DEFAULT 'Avocado', -- Type of crop (Avocado, Roses, etc.)
    severity VARCHAR(50), -- Disease severity (Low, Medium, High)
    location VARCHAR(255), -- Location where the plant was found
    weather_conditions JSONB, -- Weather data at time of diagnosis
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_diagnosis_results_user_id ON public.diagnosis_results(user_id);
CREATE INDEX IF NOT EXISTS idx_diagnosis_results_created_at ON public.diagnosis_results(created_at);
CREATE INDEX IF NOT EXISTS idx_diagnosis_results_disease ON public.diagnosis_results(disease);
CREATE INDEX IF NOT EXISTS idx_diagnosis_results_crop_type ON public.diagnosis_results(crop_type);

-- Enable RLS
ALTER TABLE public.diagnosis_results ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can view their own diagnosis results
CREATE POLICY "Users can view own diagnosis results" ON public.diagnosis_results
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own diagnosis results
CREATE POLICY "Users can insert own diagnosis results" ON public.diagnosis_results
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own diagnosis results
CREATE POLICY "Users can update own diagnosis results" ON public.diagnosis_results
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own diagnosis results
CREATE POLICY "Users can delete own diagnosis results" ON public.diagnosis_results
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_diagnosis_results_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_diagnosis_results_updated_at
    BEFORE UPDATE ON public.diagnosis_results
    FOR EACH ROW
    EXECUTE FUNCTION public.update_diagnosis_results_updated_at();

-- Grant necessary permissions
GRANT ALL ON public.diagnosis_results TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
