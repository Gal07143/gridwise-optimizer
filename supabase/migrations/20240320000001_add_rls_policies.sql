-- RLS Policies for energy_efficiency_metrics
CREATE POLICY "Enable read access for authenticated users" ON public.energy_efficiency_metrics
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert access for authenticated users" ON public.energy_efficiency_metrics
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update access for authenticated users" ON public.energy_efficiency_metrics
    FOR UPDATE USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- RLS Policies for energy_optimization_rules
CREATE POLICY "Enable read access for authenticated users" ON public.energy_optimization_rules
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert access for authenticated users" ON public.energy_optimization_rules
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update access for authenticated users" ON public.energy_optimization_rules
    FOR UPDATE USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- RLS Policies for energy_schedules
CREATE POLICY "Enable read access for authenticated users" ON public.energy_schedules
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert access for authenticated users" ON public.energy_schedules
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update access for authenticated users" ON public.energy_schedules
    FOR UPDATE USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Add user_id column to tables for better RLS control
ALTER TABLE public.energy_efficiency_metrics 
    ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

ALTER TABLE public.energy_optimization_rules 
    ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

ALTER TABLE public.energy_schedules 
    ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Update policies to include user_id checks
CREATE POLICY "Users can only see their own records" ON public.energy_efficiency_metrics
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can only see their own records" ON public.energy_optimization_rules
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can only see their own records" ON public.energy_schedules
    FOR SELECT USING (auth.uid() = user_id); 