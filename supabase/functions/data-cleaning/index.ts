import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Load environment variables (make sure these are set in Supabase Studio)
    const supabaseUrl = Deno.env.get("PUBLIC_SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Define the time window for new raw readings (last 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

    // Fetch raw readings from the "modbus_raw" table
    const { data: rawReadings, error: rawError } = await supabase
      .from("modbus_raw")
      .select("*")
      .gte("timestamp", fiveMinutesAgo);

    if (rawError) {
      throw new Error("Error fetching raw readings: " + rawError.message);
    }

    // Apply cleaning rules: for example, filter out invalid voltage readings
    const cleanedReadings = (rawReadings || []).filter((reading: any) => {
      // Example rule: voltage should be between 0 and 1000
      return reading.voltage >= 0 && reading.voltage <= 1000;
      // You can add additional rules here as needed
    });

    // If there are any cleaned readings, insert them into the "modbus_cleaned" table
    if (cleanedReadings.length > 0) {
      const { error: insertError } = await supabase
        .from("modbus_cleaned")
        .insert(cleanedReadings);
      if (insertError) {
        throw new Error("Error inserting cleaned readings: " + insertError.message);
      }
      return new Response(
        JSON.stringify({ message: `Cleaned and inserted ${cleanedReadings.length} readings` }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    return new Response(
      JSON.stringify({ message: "No new valid readings found" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Error in data-cleaning function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
