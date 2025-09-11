-- Add tables for AI-powered features
CREATE TABLE IF NOT EXISTS ai_scans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  scan_type TEXT NOT NULL DEFAULT 'comprehensive',
  input_text TEXT,
  pii_entities JSONB DEFAULT '[]'::jsonb,
  sensitive_categories JSONB DEFAULT '[]'::jsonb,
  risk_score INTEGER DEFAULT 0,
  recommendations JSONB DEFAULT '[]'::jsonb,
  leak_matches JSONB DEFAULT '[]'::jsonb,
  ocr_results JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pii_detections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  scan_id UUID REFERENCES ai_scans(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL,
  entity_value TEXT NOT NULL,
  confidence_score FLOAT DEFAULT 0.0,
  start_position INTEGER,
  end_position INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS leak_database (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source_name TEXT NOT NULL,
  leaked_data JSONB NOT NULL,
  embedding VECTOR(384), -- For semantic search
  breach_date DATE,
  severity_level TEXT DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for new tables
ALTER TABLE ai_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE pii_detections ENABLE ROW LEVEL SECURITY;
ALTER TABLE leak_database ENABLE ROW LEVEL SECURITY;

-- RLS policies for AI scan data
CREATE POLICY "Users can view own AI scans" ON ai_scans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own AI scans" ON ai_scans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own PII detections" ON pii_detections
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM ai_scans 
      WHERE ai_scans.id = pii_detections.scan_id 
      AND ai_scans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own PII detections" ON pii_detections
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM ai_scans 
      WHERE ai_scans.id = pii_detections.scan_id 
      AND ai_scans.user_id = auth.uid()
    )
  );

-- Public read access to leak database for matching
CREATE POLICY "Public read access to leak database" ON leak_database
  FOR SELECT USING (true);

-- Create indexes for performance
CREATE INDEX idx_ai_scans_user_id ON ai_scans(user_id);
CREATE INDEX idx_ai_scans_created_at ON ai_scans(created_at DESC);
CREATE INDEX idx_pii_detections_scan_id ON pii_detections(scan_id);
CREATE INDEX idx_leak_database_embedding ON leak_database USING ivfflat (embedding vector_cosine_ops);
