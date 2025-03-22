import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("PUBLIC_SUPABASE_URL") ?? "",
    Deno.env.get("SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    const { data: readings, error } = await supabase
      .from("modbus_normalized")
      .select("*")
      .gte("timestamp", oneHourAgo);

    if (error) throw new Error("Failed to fetch normalized readings");

    // Group by device
    const grouped = readings.reduce((acc: any, r: any) => {
      if (!acc[r.device_id]) acc[r.device_id] = [];
      acc[r.device_id].push(r);
      return acc;
    }, {});

    const aggregates = Object.entries(grouped).map(([device_id, records]: [string, any[]]) => {
      const avg = (key: string) =>
        parseFloat((records.reduce((sum, r) => sum + (r[key] || 0), 0) / records.length).toFixed(2));

      return {
        id: crypto.randomUUID(),
        device_id,
        timestamp: new Date().toISOString(),
        voltage: avg("voltage"),
        current: avg("current"),
        power: avg("power_kw"),
        energy: avg("energy_kwh"),
        frequency: avg("frequency"),
        temperature: avg("temperature"),
        created_at: new Date().toISOString(),
        reading_type: "aggregated",
        unit: "kWh",
        quality: 100
      };
    });

    if (aggregates.length > 0) {
      const { error: insertError } = await supabase
        .from("energy_readings")
        .upsert(aggregates);

      if (insertError) throw new Error("Insert failed: " + insertError.message);
    }

    return new Response(JSON.stringify({
      message: `Aggregated ${aggregates.length} device(s) successfully`,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("Aggregation failed", e);
    return new Response(
      JSON.stringify({ error: e.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
