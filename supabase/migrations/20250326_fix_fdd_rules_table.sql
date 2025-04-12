-- Add 'enabled' column to fdd_rules table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'fdd_rules' 
        AND column_name = 'enabled'
    ) THEN
        ALTER TABLE public.fdd_rules ADD COLUMN enabled BOOLEAN NOT NULL DEFAULT true;
    END IF;
END $$;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_device_telemetry_device_id_created_at 
ON public.device_telemetry(device_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_fdd_rules_device_id_enabled 
ON public.fdd_rules(device_id, enabled);

-- Add constraints
ALTER TABLE public.device_telemetry 
ADD CONSTRAINT chk_value_positive 
CHECK (value >= 0);

-- Create the rpc_evaluate_fdd_rules function if it doesn't exist
CREATE OR REPLACE FUNCTION public.rpc_evaluate_fdd_rules()
RETURNS TABLE (
    rule_id UUID,
    device_id UUID,
    rule_name TEXT,
    triggered BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.id AS rule_id,
        r.device_id,
        r.name AS rule_name,
        COALESCE(e.triggered, false) AS triggered
    FROM 
        public.fdd_rules r
    LEFT JOIN LATERAL (
        SELECT 
            true AS triggered
        FROM 
            public.evaluate_fdd_expression(r.rule_expression, r.device_id) AS result
        WHERE 
            result.triggered = true
    ) e ON true
    WHERE 
        r.enabled = true;
END;
$$;

-- Grant execute permissions on the function
GRANT EXECUTE ON FUNCTION public.rpc_evaluate_fdd_rules() TO authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_evaluate_fdd_rules() TO service_role;

-- Create the evaluate_fdd_expression function if it doesn't exist
CREATE OR REPLACE FUNCTION public.evaluate_fdd_expression(
    expression TEXT,
    device_id UUID
)
RETURNS TABLE (
    triggered BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        CASE 
            WHEN expression ~ 'error|fault|alarm' THEN 
                EXISTS (
                    SELECT 1 FROM public.device_telemetry 
                    WHERE device_id = $2 
                    AND value > 0
                    AND created_at > NOW() - INTERVAL '1 hour'
                )
            ELSE false
        END AS triggered;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.evaluate_fdd_expression(TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.evaluate_fdd_expression(TEXT, UUID) TO service_role;

-- Create the system_status table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.system_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL,
    status TEXT NOT NULL,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create audit logging table
CREATE TABLE IF NOT EXISTS public.audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id UUID,
    old_data JSONB,
    new_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Set up RLS on system_status
ALTER TABLE public.system_status ENABLE ROW LEVEL SECURITY;

-- Set up RLS on audit_log
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view system status
CREATE POLICY IF NOT EXISTS "Allow authenticated users to view system status"
    ON public.system_status
    FOR SELECT
    TO authenticated
    USING (true);

-- Allow service role to manage system status
CREATE POLICY IF NOT EXISTS "Allow service role to manage system status"
    ON public.system_status
    FOR ALL
    TO service_role
    USING (true);

-- Allow service role to manage audit log
CREATE POLICY IF NOT EXISTS "Allow service role to manage audit log"
    ON public.audit_log
    FOR ALL
    TO service_role
    USING (true);

-- Create trigger for audit logging
CREATE OR REPLACE FUNCTION public.audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO public.audit_log (
            user_id,
            action,
            table_name,
            record_id,
            new_data
        ) VALUES (
            auth.uid(),
            'INSERT',
            TG_TABLE_NAME,
            NEW.id,
            to_jsonb(NEW)
        );
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO public.audit_log (
            user_id,
            action,
            table_name,
            record_id,
            old_data,
            new_data
        ) VALUES (
            auth.uid(),
            'UPDATE',
            TG_TABLE_NAME,
            NEW.id,
            to_jsonb(OLD),
            to_jsonb(NEW)
        );
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO public.audit_log (
            user_id,
            action,
            table_name,
            record_id,
            old_data
        ) VALUES (
            auth.uid(),
            'DELETE',
            TG_TABLE_NAME,
            OLD.id,
            to_jsonb(OLD)
        );
        RETURN OLD;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
