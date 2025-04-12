-- Drop existing tables in reverse order to avoid dependency issues
DROP TABLE IF EXISTS regulatory_compliance;
DROP TABLE IF EXISTS safety_monitoring;
DROP TABLE IF EXISTS market_integration;
DROP TABLE IF EXISTS flexibility_management;
DROP TABLE IF EXISTS energy_forecasts;
DROP TABLE IF EXISTS grid_signals;
DROP TABLE IF EXISTS energy_assets;
DROP TABLE IF EXISTS dashboard_data;
DROP TABLE IF EXISTS security_audit_logs;
DROP TABLE IF EXISTS ip_whitelist;
DROP TABLE IF EXISTS api_keys;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS two_factor_settings;
DROP TABLE IF EXISTS security_settings;
DROP TABLE IF EXISTS settings;

-- Drop existing functions
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Create base tables first
CREATE TABLE IF NOT EXISTS settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    category_id TEXT NOT NULL,
    category_name TEXT NOT NULL,
    category_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT fk_user
        FOREIGN KEY(user_id) 
        REFERENCES auth.users(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS security_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT fk_user
        FOREIGN KEY(user_id) 
        REFERENCES auth.users(id)
        ON DELETE CASCADE
);

-- Create security-related tables
CREATE TABLE IF NOT EXISTS two_factor_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    is_enabled BOOLEAN DEFAULT false,
    secret TEXT,
    backup_codes TEXT[],
    last_used_backup_code TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT fk_user
        FOREIGN KEY(user_id) 
        REFERENCES auth.users(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    device TEXT,
    ip_address TEXT,
    last_active TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    current BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT fk_user
        FOREIGN KEY(user_id) 
        REFERENCES auth.users(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS api_keys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    key TEXT NOT NULL,
    permissions TEXT[],
    is_active BOOLEAN DEFAULT true,
    last_used TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT fk_user
        FOREIGN KEY(user_id) 
        REFERENCES auth.users(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ip_whitelist (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    ip_address TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT fk_user
        FOREIGN KEY(user_id) 
        REFERENCES auth.users(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS security_audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    action TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    metadata JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT fk_user
        FOREIGN KEY(user_id) 
        REFERENCES auth.users(id)
        ON DELETE CASCADE
);

-- Create energy-related tables
CREATE TABLE IF NOT EXISTS energy_assets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    asset_type TEXT NOT NULL,
    name TEXT NOT NULL,
    capacity_kw DECIMAL(10,2),
    status TEXT DEFAULT 'active',
    location JSONB,
    specifications JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT fk_user
        FOREIGN KEY(user_id) 
        REFERENCES auth.users(id)
        ON DELETE CASCADE,
    CONSTRAINT check_asset_type
        CHECK (asset_type IN ('PV', 'BATTERY', 'EV', 'HEAT_PUMP'))
);

CREATE TABLE IF NOT EXISTS grid_signals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    signal_type TEXT NOT NULL,
    value DECIMAL(10,2),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT fk_user
        FOREIGN KEY(user_id) 
        REFERENCES auth.users(id)
        ON DELETE CASCADE,
    CONSTRAINT check_signal_type
        CHECK (signal_type IN ('PRICING', 'CAPACITY', 'CURTAILMENT'))
);

CREATE TABLE IF NOT EXISTS energy_forecasts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    forecast_type TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    value DECIMAL(10,2),
    confidence_interval JSONB,
    weather_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT fk_user
        FOREIGN KEY(user_id) 
        REFERENCES auth.users(id)
        ON DELETE CASCADE,
    CONSTRAINT check_forecast_type
        CHECK (forecast_type IN ('SOLAR', 'CONSUMPTION', 'GRID'))
);

CREATE TABLE IF NOT EXISTS flexibility_management (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    asset_id UUID NOT NULL,
    flexibility_type TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    parameters JSONB,
    constraints JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT fk_user
        FOREIGN KEY(user_id) 
        REFERENCES auth.users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_asset
        FOREIGN KEY(asset_id)
        REFERENCES energy_assets(id)
        ON DELETE CASCADE,
    CONSTRAINT check_flexibility_type
        CHECK (flexibility_type IN ('VPP', 'INTRADAY', 'CAPACITY'))
);

CREATE TABLE IF NOT EXISTS market_integration (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    market_type TEXT NOT NULL,
    integration_status TEXT DEFAULT 'active',
    credentials JSONB,
    settings JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT fk_user
        FOREIGN KEY(user_id) 
        REFERENCES auth.users(id)
        ON DELETE CASCADE,
    CONSTRAINT check_market_type
        CHECK (market_type IN ('DSO', 'UTILITY', 'VPP'))
);

CREATE TABLE IF NOT EXISTS safety_monitoring (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    asset_id UUID NOT NULL,
    monitoring_type TEXT NOT NULL,
    status TEXT DEFAULT 'normal',
    alerts JSONB,
    metrics JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT fk_user
        FOREIGN KEY(user_id) 
        REFERENCES auth.users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_asset
        FOREIGN KEY(asset_id)
        REFERENCES energy_assets(id)
        ON DELETE CASCADE,
    CONSTRAINT check_monitoring_type
        CHECK (monitoring_type IN ('FUSE', 'GRID_CONNECTION', 'GENERAL'))
);

CREATE TABLE IF NOT EXISTS regulatory_compliance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    regulation_type TEXT NOT NULL,
    status TEXT DEFAULT 'compliant',
    documentation JSONB,
    audit_log JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT fk_user
        FOREIGN KEY(user_id) 
        REFERENCES auth.users(id)
        ON DELETE CASCADE
);

-- Create updated_at function
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

CREATE TRIGGER update_two_factor_settings_updated_at
    BEFORE UPDATE ON two_factor_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at
    BEFORE UPDATE ON sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_api_keys_updated_at
    BEFORE UPDATE ON api_keys
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_energy_assets_updated_at
    BEFORE UPDATE ON energy_assets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_flexibility_management_updated_at
    BEFORE UPDATE ON flexibility_management
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_market_integration_updated_at
    BEFORE UPDATE ON market_integration
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_safety_monitoring_updated_at
    BEFORE UPDATE ON safety_monitoring
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_regulatory_compliance_updated_at
    BEFORE UPDATE ON regulatory_compliance
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_settings_user_id ON settings(user_id);
CREATE INDEX IF NOT EXISTS idx_security_settings_user_id ON security_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_two_factor_settings_user_id ON two_factor_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_ip_whitelist_user_id ON ip_whitelist(user_id);
CREATE INDEX IF NOT EXISTS idx_security_audit_logs_user_id ON security_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_energy_assets_user_id ON energy_assets(user_id);
CREATE INDEX IF NOT EXISTS idx_grid_signals_user_id ON grid_signals(user_id);
CREATE INDEX IF NOT EXISTS idx_energy_forecasts_user_id ON energy_forecasts(user_id);
CREATE INDEX IF NOT EXISTS idx_flexibility_management_user_id ON flexibility_management(user_id);
CREATE INDEX IF NOT EXISTS idx_market_integration_user_id ON market_integration(user_id);
CREATE INDEX IF NOT EXISTS idx_safety_monitoring_user_id ON safety_monitoring(user_id);
CREATE INDEX IF NOT EXISTS idx_regulatory_compliance_user_id ON regulatory_compliance(user_id);

-- Enable RLS on all tables
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE two_factor_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE ip_whitelist ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE energy_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE grid_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE energy_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE flexibility_management ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_integration ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_monitoring ENABLE ROW LEVEL SECURITY;
ALTER TABLE regulatory_compliance ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DO $$ 
BEGIN
    -- Settings policies
    EXECUTE 'CREATE POLICY "Users can view their own settings" ON settings FOR SELECT USING (auth.uid() = user_id)';
    EXECUTE 'CREATE POLICY "Users can update their own settings" ON settings FOR UPDATE USING (auth.uid() = user_id)';
    EXECUTE 'CREATE POLICY "Users can insert their own settings" ON settings FOR INSERT WITH CHECK (auth.uid() = user_id)';

    -- Security settings policies
    EXECUTE 'CREATE POLICY "Users can view their own security settings" ON security_settings FOR SELECT USING (auth.uid() = user_id)';
    EXECUTE 'CREATE POLICY "Users can update their own security settings" ON security_settings FOR UPDATE USING (auth.uid() = user_id)';
    EXECUTE 'CREATE POLICY "Users can insert their own security settings" ON security_settings FOR INSERT WITH CHECK (auth.uid() = user_id)';

    -- Two factor settings policies
    EXECUTE 'CREATE POLICY "Users can view their own two factor settings" ON two_factor_settings FOR SELECT USING (auth.uid() = user_id)';
    EXECUTE 'CREATE POLICY "Users can update their own two factor settings" ON two_factor_settings FOR UPDATE USING (auth.uid() = user_id)';
    EXECUTE 'CREATE POLICY "Users can insert their own two factor settings" ON two_factor_settings FOR INSERT WITH CHECK (auth.uid() = user_id)';

    -- Sessions policies
    EXECUTE 'CREATE POLICY "Users can view their own sessions" ON sessions FOR SELECT USING (auth.uid() = user_id)';
    EXECUTE 'CREATE POLICY "Users can update their own sessions" ON sessions FOR UPDATE USING (auth.uid() = user_id)';
    EXECUTE 'CREATE POLICY "Users can insert their own sessions" ON sessions FOR INSERT WITH CHECK (auth.uid() = user_id)';

    -- API keys policies
    EXECUTE 'CREATE POLICY "Users can view their own API keys" ON api_keys FOR SELECT USING (auth.uid() = user_id)';
    EXECUTE 'CREATE POLICY "Users can update their own API keys" ON api_keys FOR UPDATE USING (auth.uid() = user_id)';
    EXECUTE 'CREATE POLICY "Users can insert their own API keys" ON api_keys FOR INSERT WITH CHECK (auth.uid() = user_id)';

    -- IP whitelist policies
    EXECUTE 'CREATE POLICY "Users can view their own IP whitelist" ON ip_whitelist FOR SELECT USING (auth.uid() = user_id)';
    EXECUTE 'CREATE POLICY "Users can manage their own IP whitelist" ON ip_whitelist FOR ALL USING (auth.uid() = user_id)';

    -- Security audit logs policies
    EXECUTE 'CREATE POLICY "Users can view their own audit logs" ON security_audit_logs FOR SELECT USING (auth.uid() = user_id)';
    EXECUTE 'CREATE POLICY "System can insert audit logs" ON security_audit_logs FOR INSERT WITH CHECK (true)';

    -- Energy assets policies
    EXECUTE 'CREATE POLICY "Users can view their own energy assets" ON energy_assets FOR SELECT USING (auth.uid() = user_id)';
    EXECUTE 'CREATE POLICY "Users can update their own energy assets" ON energy_assets FOR UPDATE USING (auth.uid() = user_id)';
    EXECUTE 'CREATE POLICY "Users can insert their own energy assets" ON energy_assets FOR INSERT WITH CHECK (auth.uid() = user_id)';

    -- Grid signals policies
    EXECUTE 'CREATE POLICY "Users can view their own grid signals" ON grid_signals FOR SELECT USING (auth.uid() = user_id)';
    EXECUTE 'CREATE POLICY "Users can insert their own grid signals" ON grid_signals FOR INSERT WITH CHECK (auth.uid() = user_id)';

    -- Energy forecasts policies
    EXECUTE 'CREATE POLICY "Users can view their own energy forecasts" ON energy_forecasts FOR SELECT USING (auth.uid() = user_id)';
    EXECUTE 'CREATE POLICY "Users can insert their own energy forecasts" ON energy_forecasts FOR INSERT WITH CHECK (auth.uid() = user_id)';

    -- Flexibility management policies
    EXECUTE 'CREATE POLICY "Users can view their own flexibility management" ON flexibility_management FOR SELECT USING (auth.uid() = user_id)';
    EXECUTE 'CREATE POLICY "Users can update their own flexibility management" ON flexibility_management FOR UPDATE USING (auth.uid() = user_id)';
    EXECUTE 'CREATE POLICY "Users can insert their own flexibility management" ON flexibility_management FOR INSERT WITH CHECK (auth.uid() = user_id)';

    -- Market integration policies
    EXECUTE 'CREATE POLICY "Users can view their own market integration" ON market_integration FOR SELECT USING (auth.uid() = user_id)';
    EXECUTE 'CREATE POLICY "Users can update their own market integration" ON market_integration FOR UPDATE USING (auth.uid() = user_id)';
    EXECUTE 'CREATE POLICY "Users can insert their own market integration" ON market_integration FOR INSERT WITH CHECK (auth.uid() = user_id)';

    -- Safety monitoring policies
    EXECUTE 'CREATE POLICY "Users can view their own safety monitoring" ON safety_monitoring FOR SELECT USING (auth.uid() = user_id)';
    EXECUTE 'CREATE POLICY "Users can update their own safety monitoring" ON safety_monitoring FOR UPDATE USING (auth.uid() = user_id)';
    EXECUTE 'CREATE POLICY "Users can insert their own safety monitoring" ON safety_monitoring FOR INSERT WITH CHECK (auth.uid() = user_id)';

    -- Regulatory compliance policies
    EXECUTE 'CREATE POLICY "Users can view their own regulatory compliance" ON regulatory_compliance FOR SELECT USING (auth.uid() = user_id)';
    EXECUTE 'CREATE POLICY "Users can update their own regulatory compliance" ON regulatory_compliance FOR UPDATE USING (auth.uid() = user_id)';
    EXECUTE 'CREATE POLICY "Users can insert their own regulatory compliance" ON regulatory_compliance FOR INSERT WITH CHECK (auth.uid() = user_id)';
END $$; 