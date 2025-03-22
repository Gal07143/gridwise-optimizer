// supabase/functions/aggregate-daily-energy/index.ts

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

  try {
    const supabaseUrl = Deno.env.get("PUBLIC_SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Set date window (last 2 days just in case of delay)
    const twoDaysAgo = new Date(Date.now() - 2 * 86400 * 1000).toISOString();

    // Step 1: Get energy readings
    const { data: readings, error } = await supabase
      .from("energy_readings")
      .select("device_id, timestamp, energy")
      .gte("timestamp", twoDaysAgo);

    if (error) throw new Error("Failed to fetch energy readings: " + error.message);

    // Step 2: Aggregate per device per day
    const dailyMap = new Map<string, number>();

    for (const reading of readings || []) {
      const date = new Date(reading.timestamp).toISOString().slice(0, 10); // yyyy-mm-dd
      const key = `${reading.device_id}_${date}`;
      const total = dailyMap.get(key) || 0;
      dailyMap.set(key, total + (reading.energy || 0));
    }

    // Step 3: Prepare rows
    const dailyAggregates = Array.from(dailyMap.entries()).map(([key, total]) => {
      const [device_id, date] = key.split("_");
      return {
        device_id,
        date,
        total_energy: parseFloat(total.toFixed(2)),
        granularity: "daily",
        created_at: new Date().toISOString(),
      };
    });

    // Step 4: Upsert into aggregated table
    const { error: insertError } = await supabase
      .from("energy_readings_daily")
      .upsert(dailyAggregates, { onConflict: "device_id,date" });

    if (insertError) throw new Error("Error inserting aggregates: " + insertError.message);

    return new Response(JSON.stringify({
      message: `Inserted ${dailyAggregates.length} daily energy aggregates.`,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
