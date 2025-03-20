
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
    // Get the request params
    const url = new URL(req.url);
    const siteId = url.searchParams.get("siteId") || "default";
    const days = parseInt(url.searchParams.get("days") || "1");

    // Log the request params
    console.log(`Fetching weather data for site: ${siteId}, days: ${days}`);

    // Create a Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if we have weather data in the database
    const { data: weatherData, error: weatherError } = await supabase
      .from("weather_data")
      .select("*")
      .eq("site_id", siteId)
      .order("timestamp", { ascending: true })
      .limit(24 * days);

    // Generate mock data if no data found
    if (weatherError || !weatherData || weatherData.length === 0) {
      console.log("No weather data found, generating mock data");
      
      const mockData = generateMockWeatherData(days);
      
      return new Response(JSON.stringify(mockData), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Return the weather data
    console.log(`Found ${weatherData.length} weather data records`);
    return new Response(JSON.stringify(weatherData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in weather API:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});

function generateMockWeatherData(days: number) {
  const weatherConditions = ["sunny", "partly-cloudy", "cloudy", "rainy", "stormy"];
  const data = [];
  
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  for (let d = 0; d < days; d++) {
    for (let h = 0; h < 24; h++) {
      const timestamp = new Date(now);
      timestamp.setDate(now.getDate() + d);
      timestamp.setHours(h);
      
      // Generate more realistic temperature based on time of day
      const baseTemp = 15 + Math.sin((h - 6) * Math.PI / 12) * 10;
      const temperature = baseTemp + (Math.random() * 4 - 2);
      
      // Generate more realistic cloud cover based on time of day
      const baseClouds = (Math.sin((h - 12) * Math.PI / 12) + 1) * 30;
      const cloudCover = Math.max(0, Math.min(100, baseClouds + (Math.random() * 30)));
      
      // Generate more realistic wind speed
      const windSpeed = 2 + Math.random() * 8;
      
      // Select weather condition based on cloud cover
      let conditionIndex;
      if (cloudCover < 20) conditionIndex = 0; // sunny
      else if (cloudCover < 40) conditionIndex = 1; // partly-cloudy
      else if (cloudCover < 70) conditionIndex = 2; // cloudy
      else if (cloudCover < 90) conditionIndex = 3; // rainy
      else conditionIndex = 4; // stormy
      
      data.push({
        id: crypto.randomUUID(),
        timestamp: timestamp.toISOString(),
        temperature: parseFloat(temperature.toFixed(1)),
        cloud_cover: parseFloat(cloudCover.toFixed(1)),
        wind_speed: parseFloat(windSpeed.toFixed(1)),
        wind_direction: Math.floor(Math.random() * 360),
        humidity: Math.floor(40 + Math.random() * 40),
        precipitation: cloudCover > 70 ? parseFloat((Math.random() * 5).toFixed(1)) : 0,
        weather_condition: weatherConditions[conditionIndex],
        forecast: true
      });
    }
  }
  
  return data;
}
