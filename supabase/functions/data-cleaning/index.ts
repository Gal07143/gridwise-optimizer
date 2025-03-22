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

    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

    // Fetch recent raw readings
    const { data: rawReadings, error: rawError } = await supabase
      .from("modbus_raw")
      .select("*")
      .gte("timestamp", fiveMinutesAgo);

    if (rawError) {
      throw new Error(`Error fetching raw readings: ${rawError.message}`);
    }

    if (!rawReadings?.length) {
      return new Response(
        JSON.stringify({ message: "No new raw readings found." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    // Enhanced Data Cleaning Logic
    const cleanedReadings = rawReadings.filter((reading: any) => {
      const voltageValid = reading.voltage >= 100 && reading.voltage <= 500;
      const currentValid = reading.current >= 0 && reading.current <= 200;
      const powerValid = reading.power_kw >= 0 && reading.power_kw <= 1000;
      const energyValid = reading.energy_kwh >= 0;
      const timestampValid = new Date(reading.timestamp).getTime() <= Date.now();

      return voltageValid && currentValid && powerValid && energyValid && timestampValid;
    });

    if (!cleanedReadings.length) {
      return new Response(
        JSON.stringify({ message: "No valid readings after cleaning." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    // Check for duplicates before insertion
    const insertedReadings: any[] = [];
    for (const reading of cleanedReadings) {
      const { data: exists } = await supabase
        .from("modbus_cleaned")
        .select("id")
        .eq("device_id", reading.device_id)
        .eq("timestamp", reading.timestamp)
        .single();

      if (!exists) {
        const { error: insertError } = await supabase
          .from("modbus_cleaned")
          .insert(reading);

        if (insertError) {
          console.error(`Failed to insert reading for device ${reading.device_id}: ${insertError.message}`);
        } else {
          insertedReadings.push(reading);
        }
      }
    }

    return new Response(
      JSON.stringify({ message: `Cleaned and inserted ${insertedReadings.length} new readings.` }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );

  } catch (error) {
    console.error("Data cleaning error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
