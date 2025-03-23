import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("PUBLIC_SUPABASE_URL")!,
    Deno.env.get("SERVICE_ROLE_KEY")!
  );

  try {
    const { data: forecasts } = await supabase
      .from('energy_forecasts')
      .select('*')
      .gte('timestamp', new Date().toISOString());

    const { data: tariffs } = await supabase.from('tariffs').select('*');

    if (!forecasts || !tariffs) throw new Error('Missing data');

    const results = forecasts.map(forecast => {
      const tariff = tariffs.find(t => t.site_id === forecast.site_id) || { rate: 0.4 };
      const optimized = forecast.forecast_kwh * 0.9; // Simple reduction model
      return {
        site_id: forecast.site_id,
        device_id: forecast.device_id,
        timestamp: forecast.timestamp,
        forecast_kwh: forecast.forecast_kwh,
        optimized_kwh: optimized,
        cost_saving: (forecast.forecast_kwh - optimized) * tariff.rate,
        carbon_saving: (forecast.forecast_kwh - optimized) * 0.5,
        recommendation: 'Reduce peak usage by 10%',
      };
    });

    const { error } = await supabase.from('optimization_results').insert(results);
    if (error) throw error;

    return new Response(JSON.stringify({ inserted: results.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});
