-- Create agent_decisions table
CREATE TABLE IF NOT EXISTS agent_decisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  action TEXT NOT NULL,
  device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  confidence FLOAT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected', 'executed', 'failed')),
  details TEXT NOT NULL,
  impact JSONB NOT NULL,
  requires_approval BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_agent_decisions_device_id ON agent_decisions(device_id);
CREATE INDEX IF NOT EXISTS idx_agent_decisions_status ON agent_decisions(status);
CREATE INDEX IF NOT EXISTS idx_agent_decisions_timestamp ON agent_decisions(timestamp);

-- Enable Row Level Security
ALTER TABLE agent_decisions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own agent decisions"
  ON agent_decisions
  FOR SELECT
  USING (
    device_id IN (
      SELECT id FROM devices WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own agent decisions"
  ON agent_decisions
  FOR INSERT
  WITH CHECK (
    device_id IN (
      SELECT id FROM devices WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own agent decisions"
  ON agent_decisions
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

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_agent_decisions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_agent_decisions_updated_at
  BEFORE UPDATE ON agent_decisions
  FOR EACH ROW
  EXECUTE FUNCTION update_agent_decisions_updated_at(); 