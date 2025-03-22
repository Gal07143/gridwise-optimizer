// supabase/functions/aggregate-daily-energy/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("PUBLIC_SUPABASE_URL")!,
    Deno.env.get("SERVICE_ROLE_KEY")!
  );

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const dateStr = yesterday.toISOString().split("T")[0];

  const { data: readings, error } = await supabase
    .from("energy_readings")
    .select("*")
    .gte("timestamp", `${dateStr}T00:00:00Z`)
    .lt("timestamp", `${dateStr}T23:59:59Z`);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }

  const grouped = new Map<string, number[]>();

  readings.forEach((r: any) => {
    if (!grouped.has(r.device_id)) {
      grouped.set(r.device_id, []);
    }
    grouped.get(r.device_id)!.push(r.power || 0);
  });

  const inserts = Array.from(grouped.entries()).map(([device_id, values]) => {
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const total = values.reduce((a, b) => a + b, 0);
    return {
      device_id,
      date: dateStr,
      avg_power_kw: parseFloat(avg.toFixed(2)),
      total_energy_kwh: parseFloat(total.toFixed(2)),
      min_power_kw: Math.min(...values),
      max_power_kw: Math.max(...values),
    };
  });

  const { error: insertError } = await supabase
    .from("energy_baselines")
    .upsert(inserts, { onConflict: "device_id,date,baseline_type" });

  if (insertError) {
    return new Response(JSON.stringify({ error: insertError.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }

  return new Response(
    JSON.stringify({ message: `Inserted ${inserts.length} baselines for ${dateStr}` }),
    { status: 200, headers: corsHeaders }
  );
});
