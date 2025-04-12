-- Create energy management tables

-- Energy consumption table
CREATE TABLE IF NOT EXISTS energy_consumption (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    value NUMERIC NOT NULL,
    unit TEXT DEFAULT 'kWh',
    source TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Energy generation table
CREATE TABLE IF NOT EXISTS energy_generation (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    value NUMERIC NOT NULL,
    unit TEXT DEFAULT 'kWh',
    source TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Battery status table
CREATE TABLE IF NOT EXISTS battery_status (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    level NUMERIC NOT NULL,
    power NUMERIC NOT NULL,
    status TEXT NOT NULL,
    temperature NUMERIC,
    cycle_count INTEGER,
    health NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Energy optimization actions table
CREATE TABLE IF NOT EXISTS energy_optimization_actions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    action_type TEXT NOT NULL,
    power NUMERIC NOT NULL,
    duration INTEGER NOT NULL,
    priority INTEGER NOT NULL,
    reason TEXT,
    estimated_savings NUMERIC,
    executed BOOLEAN DEFAULT false,
    execution_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Energy predictions table
CREATE TABLE IF NOT EXISTS energy_predictions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    prediction_time TIMESTAMP WITH TIME ZONE NOT NULL,
    demand NUMERIC NOT NULL,
    generation NUMERIC NOT NULL,
    battery_level NUMERIC NOT NULL,
    grid_import NUMERIC NOT NULL,
    grid_export NUMERIC NOT NULL,
    confidence NUMERIC NOT NULL,
    model_version TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_energy_consumption_user_id ON energy_consumption(user_id);
CREATE INDEX IF NOT EXISTS idx_energy_consumption_device_id ON energy_consumption(device_id);
CREATE INDEX IF NOT EXISTS idx_energy_consumption_timestamp ON energy_consumption(timestamp);

CREATE INDEX IF NOT EXISTS idx_energy_generation_user_id ON energy_generation(user_id);
CREATE INDEX IF NOT EXISTS idx_energy_generation_device_id ON energy_generation(device_id);
CREATE INDEX IF NOT EXISTS idx_energy_generation_timestamp ON energy_generation(timestamp);

CREATE INDEX IF NOT EXISTS idx_battery_status_user_id ON battery_status(user_id);
CREATE INDEX IF NOT EXISTS idx_battery_status_device_id ON battery_status(device_id);
CREATE INDEX IF NOT EXISTS idx_battery_status_timestamp ON battery_status(timestamp);

CREATE INDEX IF NOT EXISTS idx_energy_optimization_actions_user_id ON energy_optimization_actions(user_id);
CREATE INDEX IF NOT EXISTS idx_energy_optimization_actions_device_id ON energy_optimization_actions(device_id);
CREATE INDEX IF NOT EXISTS idx_energy_optimization_actions_timestamp ON energy_optimization_actions(timestamp);

CREATE INDEX IF NOT EXISTS idx_energy_predictions_user_id ON energy_predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_energy_predictions_timestamp ON energy_predictions(timestamp);
CREATE INDEX IF NOT EXISTS idx_energy_predictions_prediction_time ON energy_predictions(prediction_time);

-- Enable Row Level Security
ALTER TABLE energy_consumption ENABLE ROW LEVEL SECURITY;
ALTER TABLE energy_generation ENABLE ROW LEVEL SECURITY;
ALTER TABLE battery_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE energy_optimization_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE energy_predictions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own energy consumption data"
    ON energy_consumption FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own energy consumption data"
    ON energy_consumption FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own energy generation data"
    ON energy_generation FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own energy generation data"
    ON energy_generation FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own battery status data"
    ON battery_status FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own battery status data"
    ON battery_status FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own energy optimization actions"
    ON energy_optimization_actions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own energy optimization actions"
    ON energy_optimization_actions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own energy optimization actions"
    ON energy_optimization_actions FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own energy predictions"
    ON energy_predictions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own energy predictions"
    ON energy_predictions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create triggers to update the updated_at timestamp
CREATE TRIGGER update_energy_consumption_updated_at
    BEFORE UPDATE ON energy_consumption
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_energy_generation_updated_at
    BEFORE UPDATE ON energy_generation
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_battery_status_updated_at
    BEFORE UPDATE ON battery_status
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_energy_optimization_actions_updated_at
    BEFORE UPDATE ON energy_optimization_actions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_energy_predictions_updated_at
    BEFORE UPDATE ON energy_predictions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 