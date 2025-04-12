-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    category_id TEXT NOT NULL,
    category_name TEXT NOT NULL,
    category_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create security settings table
CREATE TABLE IF NOT EXISTS security_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    two_factor_enabled BOOLEAN DEFAULT false,
    session_timeout INTEGER DEFAULT 3600,
    password_policy JSONB DEFAULT '{
        "minLength": 8,
        "requireSpecialChars": true,
        "requireNumbers": true
    }'::jsonb,
    encryption_enabled BOOLEAN DEFAULT true,
    encryption_algorithm TEXT DEFAULT 'AES-256',
    key_rotation INTEGER DEFAULT 30,
    rate_limiting BOOLEAN DEFAULT true,
    allowed_origins TEXT[] DEFAULT ARRAY[]::text[],
    token_expiration INTEGER DEFAULT 3600,
    audit_logging_enabled BOOLEAN DEFAULT true,
    retention_period INTEGER DEFAULT 90,
    log_level TEXT DEFAULT 'info',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create dashboard data table
CREATE TABLE IF NOT EXISTS dashboard_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    grid_supply JSONB DEFAULT '{
        "power": 0,
        "status": "neutral"
    }'::jsonb,
    pv_production JSONB DEFAULT '{
        "power": 0,
        "capacity": 0
    }'::jsonb,
    battery JSONB DEFAULT '{
        "level": 0,
        "status": "idle",
        "power": 0
    }'::jsonb,
    household JSONB DEFAULT '{
        "consumption": 0
    }'::jsonb,
    energy_flow JSONB DEFAULT '{
        "totalEnergy": 0,
        "selfConsumption": 0,
        "peakDemand": 0
    }'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create RLS policies
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_data ENABLE ROW LEVEL SECURITY;

-- Settings policies
CREATE POLICY "Users can view their own settings"
    ON settings FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
    ON settings FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings"
    ON settings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Security settings policies
CREATE POLICY "Users can view their own security settings"
    ON security_settings FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own security settings"
    ON security_settings FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own security settings"
    ON security_settings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Dashboard data policies
CREATE POLICY "Users can view their own dashboard data"
    ON dashboard_data FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own dashboard data"
    ON dashboard_data FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own dashboard data"
    ON dashboard_data FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create functions to handle updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_settings_updated_at
    BEFORE UPDATE ON settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_security_settings_updated_at
    BEFORE UPDATE ON security_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dashboard_data_updated_at
    BEFORE UPDATE ON dashboard_data
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 