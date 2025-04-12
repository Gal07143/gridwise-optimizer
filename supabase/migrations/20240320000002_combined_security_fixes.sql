-- Step 1: Enable RLS on tables
ALTER TABLE public.energy_efficiency_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.energy_optimization_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.energy_schedules ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop all existing policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.energy_efficiency_metrics;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON public.energy_efficiency_metrics;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON public.energy_efficiency_metrics;
DROP POLICY IF EXISTS "Users can only see their own records" ON public.energy_efficiency_metrics;

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.energy_optimization_rules;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON public.energy_optimization_rules;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON public.energy_optimization_rules;
DROP POLICY IF EXISTS "Users can only see their own records" ON public.energy_optimization_rules;

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.energy_schedules;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON public.energy_schedules;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON public.energy_schedules;
DROP POLICY IF EXISTS "Users can only see their own records" ON public.energy_schedules;

-- Step 3: Add user_id column to tables
ALTER TABLE public.energy_efficiency_metrics 
    ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

ALTER TABLE public.energy_optimization_rules 
    ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

ALTER TABLE public.energy_schedules 
    ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Step 4: Create new RLS policies
-- Policies for energy_efficiency_metrics
CREATE POLICY "Enable read access for authenticated users" ON public.energy_efficiency_metrics
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert access for authenticated users" ON public.energy_efficiency_metrics
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Enable update access for authenticated users" ON public.energy_efficiency_metrics
    FOR UPDATE USING (auth.role() = 'authenticated' AND auth.uid() = user_id)
    WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- Policies for energy_optimization_rules
CREATE POLICY "Enable read access for authenticated users" ON public.energy_optimization_rules
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert access for authenticated users" ON public.energy_optimization_rules
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Enable update access for authenticated users" ON public.energy_optimization_rules
    FOR UPDATE USING (auth.role() = 'authenticated' AND auth.uid() = user_id)
    WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- Policies for energy_schedules
CREATE POLICY "Enable read access for authenticated users" ON public.energy_schedules
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert access for authenticated users" ON public.energy_schedules
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Enable update access for authenticated users" ON public.energy_schedules
    FOR UPDATE USING (auth.role() = 'authenticated' AND auth.uid() = user_id)
    WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- Step 5: Recreate views without SECURITY DEFINER
DROP VIEW IF EXISTS public.device_efficiency_overview;
CREATE VIEW public.device_efficiency_overview AS
SELECT 
    d.id as device_id,
    d.name as device_name,
    d.type as device_type,
    d.status as device_status,
    AVG(eem.efficiency_score) as avg_efficiency,
    MAX(eem.timestamp) as last_reading
FROM public.devices d
LEFT JOIN public.energy_efficiency_metrics eem ON d.id = eem.device_id
WHERE (auth.role() = 'authenticated')
GROUP BY d.id, d.name, d.type, d.status;

DROP VIEW IF EXISTS public.energy_consumption_patterns;
CREATE VIEW public.energy_consumption_patterns AS
SELECT 
    DATE_TRUNC('hour', eem.timestamp) as hour,
    AVG(eem.efficiency_score) as avg_efficiency_score,
    COUNT(*) as reading_count
FROM public.energy_efficiency_metrics eem
WHERE (auth.role() = 'authenticated')
GROUP BY DATE_TRUNC('hour', eem.timestamp)
ORDER BY hour; 