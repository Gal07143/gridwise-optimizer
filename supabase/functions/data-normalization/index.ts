import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("PUBLIC_SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

    // Get cleaned data
    const { data: cleanedData, error } = await supabase
      .from("modbus_cleaned")
      .select("*")
      .gte("timestamp", fiveMinutesAgo);

    if (error) throw new Error(error.message);

    const normalized = (cleanedData || []).map((reading: any) => {
      const norm = {
        device_id: reading.device_id,
        timestamp: reading.timestamp,
        voltage: parseFloat(reading.voltage.toFixed(2)),
        current: parseFloat(reading.current.toFixed(2)),
        power_kw: parseFloat(reading.power_kw.toFixed(2)),
        energy_kwh: parseFloat(reading.energy_kwh.toFixed(2)),
        temperature: reading.temperature ? parseFloat(reading.temperature.toFixed(1)) : null,
        normalized_at: new Date().toISOString(),
      };
      return norm;
    });

    if (normalized.length) {
      const { error: insertError } = await supabase.from("modbus_normalized").insert(normalized);
      if (insertError) throw new Error(insertError.message);
    }

    return new Response(JSON.stringify({ message: `Normalized ${normalized.length} records.` }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
