-- Create table for storing NER (Named Entity Recognition) analysis results
CREATE TABLE IF NOT EXISTS ner_analyses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    input_text TEXT NOT NULL,
    entities_found JSONB DEFAULT '[]'::jsonb,
    risk_score INTEGER DEFAULT 0,
    risk_level TEXT DEFAULT 'Low',
    sensitive_categories TEXT[] DEFAULT '{}',
    recommendations TEXT[] DEFAULT '{}',
    raw_ner_output JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ner_analyses_user_id ON ner_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_ner_analyses_created_at ON ner_analyses(created_at);
CREATE INDEX IF NOT EXISTS idx_ner_analyses_risk_level ON ner_analyses(risk_level);

-- Enable Row Level Security
ALTER TABLE ner_analyses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own NER analyses" ON ner_analyses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own NER analyses" ON ner_analyses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own NER analyses" ON ner_analyses
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own NER analyses" ON ner_analyses
    FOR DELETE USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_ner_analyses_updated_at 
    BEFORE UPDATE ON ner_analyses 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
