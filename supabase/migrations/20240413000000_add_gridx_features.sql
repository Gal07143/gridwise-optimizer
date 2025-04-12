-- Create energy assets table
CREATE TABLE IF NOT EXISTS energy_assets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    asset_type TEXT NOT NULL CHECK (asset_type IN ('PV', 'BATTERY', 'EV', 'HEAT_PUMP')),
    name TEXT NOT NULL,
    capacity_kw DECIMAL(10,2),
    status TEXT DEFAULT 'active',
    location JSONB,
    specifications JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create grid signals table
CREATE TABLE IF NOT EXISTS grid_signals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    signal_type TEXT NOT NULL CHECK (signal_type IN ('PRICING', 'CAPACITY', 'CURTAILMENT')),
    value DECIMAL(10,2),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create energy forecasts table
CREATE TABLE IF NOT EXISTS energy_forecasts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    forecast_type TEXT NOT NULL CHECK (forecast_type IN ('SOLAR', 'CONSUMPTION', 'GRID')),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    value DECIMAL(10,2),
    confidence_interval JSONB,
    weather_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create flexibility management table
CREATE TABLE IF NOT EXISTS flexibility_management (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    asset_id UUID REFERENCES energy_assets(id) ON DELETE CASCADE,
    flexibility_type TEXT NOT NULL CHECK (flexibility_type IN ('VPP', 'INTRADAY', 'CAPACITY')),
    status TEXT DEFAULT 'active',
    parameters JSONB,
    constraints JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create market integration table
CREATE TABLE IF NOT EXISTS market_integration (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    market_type TEXT NOT NULL CHECK (market_type IN ('DSO', 'UTILITY', 'VPP')),
    integration_status TEXT DEFAULT 'active',
    credentials JSONB,
    settings JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create safety monitoring table
CREATE TABLE IF NOT EXISTS safety_monitoring (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    asset_id UUID REFERENCES energy_assets(id) ON DELETE CASCADE,
    monitoring_type TEXT NOT NULL CHECK (monitoring_type IN ('FUSE', 'GRID_CONNECTION', 'GENERAL')),
    status TEXT DEFAULT 'normal',
    alerts JSONB,
    metrics JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create regulatory compliance table
CREATE TABLE IF NOT EXISTS regulatory_compliance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    regulation_type TEXT NOT NULL,
    status TEXT DEFAULT 'compliant',
    documentation JSONB,
    audit_log JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on all new tables
ALTER TABLE energy_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE grid_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE energy_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE flexibility_management ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_integration ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_monitoring ENABLE ROW LEVEL SECURITY;
ALTER TABLE regulatory_compliance ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for all new tables
CREATE POLICY "Users can view their own energy assets"
    ON energy_assets FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own energy assets"
    ON energy_assets FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own energy assets"
    ON energy_assets FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Similar policies for other tables...
CREATE POLICY "Users can view their own grid signals"
    ON grid_signals FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own energy forecasts"
    ON energy_forecasts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own flexibility management"
    ON flexibility_management FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own flexibility management"
    ON flexibility_management FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own flexibility management"
    ON flexibility_management FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own market integration"
    ON market_integration FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own market integration"
    ON market_integration FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own market integration"
    ON market_integration FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own safety monitoring"
    ON safety_monitoring FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own safety monitoring"
    ON safety_monitoring FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own safety monitoring"
    ON safety_monitoring FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own regulatory compliance"
    ON regulatory_compliance FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own regulatory compliance"
    ON regulatory_compliance FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own regulatory compliance"
    ON regulatory_compliance FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create triggers for updated_at on new tables
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