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
    const supabaseUrl = Deno.env.get("PUBLIC_SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Calculate yesterday’s date
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yDateStr = yesterday.toISOString().split("T")[0]; // e.g., "2025-03-21"

    const { data: readings, error } = await supabase
      .from("modbus_cleaned")
      .select("*")
      .gte("timestamp", `${yDateStr}T00:00:00.000Z`)
      .lt("timestamp", `${today.toISOString().split("T")[0]}T00:00:00.000Z`);

    if (error) throw new Error("Failed to fetch cleaned readings");

    const grouped: Record<string, number> = {};

    for (const row of readings) {
      const deviceId = row.device_id;
      const key = `${deviceId}_${yDateStr}`;
      if (!grouped[key]) grouped[key] = 0;
      grouped[key] += row.energy_kwh || 0;
    }

    const inserts = Object.entries(grouped).map(([key, total]) => {
      const [device_id, date] = key.split("_");
      return {
        device_id,
        date,
        total_energy_kwh: parseFloat(total.toFixed(2)),
        created_at: new Date().toISOString(),
      };
    });

    const { error: insertError } = await supabase
      .from("energy_baselines") // Change to the correct table name
      .upsert(inserts, { onConflict: "device_id,date" });

    if (insertError) throw insertError;

    return new Response(JSON.stringify({ message: `Inserted ${inserts.length} daily records.` }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Aggregation Error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
