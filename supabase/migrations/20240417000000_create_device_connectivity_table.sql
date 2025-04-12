-- Create device_connectivity table
CREATE TABLE IF NOT EXISTS device_connectivity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  is_connected BOOLEAN NOT NULL DEFAULT false,
  latency FLOAT NOT NULL DEFAULT 0,
  signal_strength FLOAT NOT NULL DEFAULT 0,
  last_ping TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  protocol TEXT NOT NULL,
  error_count INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  status TEXT NOT NULL CHECK (status IN ('healthy', 'degraded', 'critical', 'offline')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create connectivity_metrics table for historical data
CREATE TABLE IF NOT EXISTS connectivity_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  uptime FLOAT NOT NULL,
  average_latency FLOAT NOT NULL,
  packet_loss FLOAT NOT NULL,
  reconnect_attempts INTEGER NOT NULL DEFAULT 0,
  last_reconnect_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create connectivity_issues table for tracking detected issues
CREATE TABLE IF NOT EXISTS connectivity_issues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  issue_type TEXT NOT NULL CHECK (issue_type IN ('latency', 'signal', 'protocol', 'hardware', 'network')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
  description TEXT NOT NULL,
  possible_causes JSONB NOT NULL DEFAULT '[]',
  recommended_actions JSONB NOT NULL DEFAULT '[]',
  auto_fix_available BOOLEAN NOT NULL DEFAULT false,
  resolved BOOLEAN NOT NULL DEFAULT false,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_device_connectivity_device_id ON device_connectivity(device_id);
CREATE INDEX IF NOT EXISTS idx_device_connectivity_status ON device_connectivity(status);
CREATE INDEX IF NOT EXISTS idx_device_connectivity_last_ping ON device_connectivity(last_ping);

CREATE INDEX IF NOT EXISTS idx_connectivity_metrics_device_id ON connectivity_metrics(device_id);
CREATE INDEX IF NOT EXISTS idx_connectivity_metrics_timestamp ON connectivity_metrics(timestamp);

CREATE INDEX IF NOT EXISTS idx_connectivity_issues_device_id ON connectivity_issues(device_id);
CREATE INDEX IF NOT EXISTS idx_connectivity_issues_type ON connectivity_issues(issue_type);
CREATE INDEX IF NOT EXISTS idx_connectivity_issues_severity ON connectivity_issues(severity);
CREATE INDEX IF NOT EXISTS idx_connectivity_issues_resolved ON connectivity_issues(resolved);

-- Enable Row Level Security
ALTER TABLE device_connectivity ENABLE ROW LEVEL SECURITY;
ALTER TABLE connectivity_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE connectivity_issues ENABLE ROW LEVEL SECURITY;

-- Create policies for device_connectivity
CREATE POLICY "Users can view their own device connectivity"
  ON device_connectivity
  FOR SELECT
  USING (
    device_id IN (
      SELECT id FROM devices WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own device connectivity"
  ON device_connectivity
  FOR UPDATE
  USING (
    device_id IN (
      SELECT id FROM devices WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    device_id IN (
      SELECT id FROM devices WHERE user_id = auth.uid()
    )
  );

-- Create policies for connectivity_metrics
CREATE POLICY "Users can view their own connectivity metrics"
  ON connectivity_metrics
  FOR SELECT
  USING (
    device_id IN (
      SELECT id FROM devices WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own connectivity metrics"
  ON connectivity_metrics
  FOR INSERT
  WITH CHECK (
    device_id IN (
      SELECT id FROM devices WHERE user_id = auth.uid()
    )
  );

-- Create policies for connectivity_issues
CREATE POLICY "Users can view their own connectivity issues"
  ON connectivity_issues
  FOR SELECT
  USING (
    device_id IN (
      SELECT id FROM devices WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own connectivity issues"
  ON connectivity_issues
  FOR UPDATE
  USING (
    device_id IN (
      SELECT id FROM devices WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    device_id IN (
      SELECT id FROM devices WHERE user_id = auth.uid()
    )
  );

-- Create triggers to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_device_connectivity_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_device_connectivity_updated_at
  BEFORE UPDATE ON device_connectivity
  FOR EACH ROW
  EXECUTE FUNCTION update_device_connectivity_updated_at();

CREATE TRIGGER update_connectivity_issues_updated_at
  BEFORE UPDATE ON connectivity_issues
  FOR EACH ROW
  EXECUTE FUNCTION update_device_connectivity_updated_at(); 