-- Create devices table
CREATE TABLE IF NOT EXISTS devices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    protocol TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('online', 'offline')),
    last_seen TIMESTAMP WITH TIME ZONE,
    mqtt_topic TEXT,
    http_endpoint TEXT,
    ip_address TEXT,
    port INTEGER,
    slave_id INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create telemetry_log table
CREATE TABLE IF NOT EXISTS telemetry_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_devices_user_id ON devices(user_id);
CREATE INDEX IF NOT EXISTS idx_devices_type ON devices(type);
CREATE INDEX IF NOT EXISTS idx_devices_status ON devices(status);
CREATE INDEX IF NOT EXISTS idx_telemetry_log_device_id ON telemetry_log(device_id);
CREATE INDEX IF NOT EXISTS idx_telemetry_log_timestamp ON telemetry_log(timestamp);

-- Enable RLS
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE telemetry_log ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own devices"
    ON devices FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own devices"
    ON devices FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own devices"
    ON devices FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own devices"
    ON devices FOR DELETE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view telemetry for their devices"
    ON telemetry_log FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM devices
            WHERE devices.id = telemetry_log.device_id
            AND devices.user_id = auth.uid()
        )
    );

CREATE POLICY "System can insert telemetry"
    ON telemetry_log FOR INSERT
    WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_devices_updated_at
    BEFORE UPDATE ON devices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 