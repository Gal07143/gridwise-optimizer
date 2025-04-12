-- Enable RLS on tables
ALTER TABLE public.energy_efficiency_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.energy_optimization_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.energy_schedules ENABLE ROW LEVEL SECURITY;

-- Recreate views without SECURITY DEFINER
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
GROUP BY d.id, d.name, d.type, d.status;

DROP VIEW IF EXISTS public.energy_consumption_patterns;
CREATE VIEW public.energy_consumption_patterns AS
SELECT 
    DATE_TRUNC('hour', eem.timestamp) as hour,
    AVG(eem.efficiency_score) as avg_efficiency_score,
    COUNT(*) as reading_count
FROM public.energy_efficiency_metrics eem
GROUP BY DATE_TRUNC('hour', eem.timestamp)
ORDER BY hour; 