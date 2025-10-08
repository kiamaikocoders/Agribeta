-- Create consultations table for agronomist booking system
-- This table stores all consultation bookings between farmers and agronomists

CREATE TABLE IF NOT EXISTS public.consultations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    farmer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    agronomist_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    consultation_type TEXT NOT NULL CHECK (consultation_type IN ('video', 'phone', 'farm_visit')),
    duration_minutes INTEGER NOT NULL DEFAULT 60 CHECK (duration_minutes > 0),
    message TEXT,
    cost DECIMAL(10,2) NOT NULL DEFAULT 0,
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'cancelled')),
    payment_transaction_id TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
    meeting_link TEXT, -- For video calls (Calendly or custom link)
    calendly_event_id TEXT, -- Calendly integration
    farmer_timezone TEXT DEFAULT 'Africa/Nairobi',
    agronomist_timezone TEXT DEFAULT 'Africa/Nairobi',
    notes TEXT, -- Agronomist notes after consultation
    rating INTEGER CHECK (rating >= 1 AND rating <= 5), -- Post-consultation rating
    review_text TEXT, -- Post-consultation review
    cancelled_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    cancelled_at TIMESTAMPTZ,
    cancellation_reason TEXT,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_consultations_farmer_id ON public.consultations(farmer_id);
CREATE INDEX IF NOT EXISTS idx_consultations_agronomist_id ON public.consultations(agronomist_id);
CREATE INDEX IF NOT EXISTS idx_consultations_scheduled_date ON public.consultations(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON public.consultations(status);
CREATE INDEX IF NOT EXISTS idx_consultations_payment_status ON public.consultations(payment_status);
CREATE INDEX IF NOT EXISTS idx_consultations_created_at ON public.consultations(created_at);

-- Create index for upcoming consultations (composite index)
CREATE INDEX IF NOT EXISTS idx_consultations_upcoming 
ON public.consultations(scheduled_date, scheduled_time, status) 
WHERE status IN ('pending', 'confirmed');

-- Enable RLS
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Farmers can view their own consultations
CREATE POLICY "Farmers can view own consultations" ON public.consultations
    FOR SELECT 
    USING (auth.uid() = farmer_id);

-- Agronomists can view consultations assigned to them
CREATE POLICY "Agronomists can view assigned consultations" ON public.consultations
    FOR SELECT 
    USING (auth.uid() = agronomist_id);

-- Farmers can insert consultations (booking)
CREATE POLICY "Farmers can insert consultations" ON public.consultations
    FOR INSERT 
    WITH CHECK (auth.uid() = farmer_id);

-- Both farmers and agronomists can update consultations (status changes, notes, etc.)
CREATE POLICY "Farmers can update own consultations" ON public.consultations
    FOR UPDATE 
    USING (auth.uid() = farmer_id);

CREATE POLICY "Agronomists can update assigned consultations" ON public.consultations
    FOR UPDATE 
    USING (auth.uid() = agronomist_id);

-- Only farmers can delete their own pending consultations
CREATE POLICY "Farmers can delete own pending consultations" ON public.consultations
    FOR DELETE 
    USING (auth.uid() = farmer_id AND status = 'pending');

-- Grant necessary permissions
GRANT ALL ON public.consultations TO authenticated;

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_consultations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER trigger_consultations_updated_at
    BEFORE UPDATE ON public.consultations
    FOR EACH ROW
    EXECUTE FUNCTION update_consultations_updated_at();

-- Create function to update agronomist total_consultations count
CREATE OR REPLACE FUNCTION update_agronomist_consultation_count()
RETURNS TRIGGER AS $$
BEGIN
    -- When consultation is marked as completed, increment agronomist's total
    IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
        UPDATE agronomist_profiles 
        SET total_consultations = COALESCE(total_consultations, 0) + 1
        WHERE id = NEW.agronomist_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for consultation count
CREATE TRIGGER trigger_update_consultation_count
    AFTER INSERT OR UPDATE ON public.consultations
    FOR EACH ROW
    EXECUTE FUNCTION update_agronomist_consultation_count();

