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
    // ✅ LOGGING - Function Start
    console.log("⚡️ energy-ai-predictions function STARTED");

    // Parse the request parameters
    const url = new URL(req.url);
    const siteId = url.searchParams.get("siteId") || "default";
    const days = parseInt(url.searchParams.get("days") || "1");
    const detailed = url.searchParams.get("detailed") === "true";

    // ✅ LOGGING - Request Parameters
    console.log(`📦 Params → siteId: ${siteId}, days: ${days}, detailed: ${detailed}`);

    // Load environment variables
    const supabaseUrl = Deno.env.get("PUBLIC_SUPABASE_URL");
    const supabaseKey = Deno.env.get("SERVICE_ROLE_KEY");

    // ✅ LOGGING - Environment Check
    console.log("🌐 PUBLIC_SUPABASE_URL:", supabaseUrl || "❌ MISSING");
    console.log("🔑 SERVICE_ROLE_KEY:", supabaseKey ? "✅ PRESENT" : "❌ MISSING");

    const supabase = createClient(supabaseUrl || "", supabaseKey || "");

    // Check if we already have forecasts in the database
    const { data: existingForecasts, error: forecastError } = await supabase
      .from("energy_forecasts")
      .select("*")
      .eq("site_id", siteId)
      .gte("forecast_time", new Date().toISOString())
      .order("forecast_time", { ascending: true })
      .limit(24 * days);

    if (!forecastError && existingForecasts && existingForecasts.length > 0) {
      console.log(`✅ Found ${existingForecasts.length} existing forecasts`);

      if (detailed) {
        const transformedForecasts = existingForecasts.map(forecast => ({
          date: forecast.forecast_time,
          generation: forecast.generation_forecast,
          consumption: forecast.consumption_forecast,
          temperature: forecast.temperature,
          cloudCover: forecast.cloud_cover,
          windSpeed: forecast.wind_speed,
          weatherCondition: forecast.weather_condition,
          confidence: forecast.confidence || 85
        }));

        return new Response(JSON.stringify(transformedForecasts), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify(existingForecasts), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get weather data for AI prediction input
    const { data: weatherData, error: weatherError } = await supabase
      .from("weather_data")
      .select("*")
      .eq("site_id", siteId)
      .order("timestamp", { ascending: true })
      .limit(24 * days);

    console.log("🌦️ Retrieved weather data:", weatherData?.length || 0);

    // Generate mock forecasts
    console.log("🤖 Generating mock forecasts...");
    const forecasts = generateMockForecasts(siteId, days, weatherData);

    // Store the forecasts in the database
    if (forecasts.length > 0) {
      const { error: insertError } = await supabase
        .from("energy_forecasts")
        .upsert(forecasts.map(f => ({
          site_id: siteId,
          forecast_time: f.forecast_time,
          generation_forecast: f.generation_forecast,
          consumption_forecast: f.consumption_forecast,
          temperature: f.temperature,
          cloud_cover: f.cloud_cover,
          wind_speed: f.wind_speed,
          weather_condition: f.weather_condition,
          confidence: f.confidence
        })));

      if (insertError) {
        console.error("❌ Error inserting forecasts:", insertError);
      } else {
        console.log(`✅ Successfully stored ${forecasts.length} forecasts`);
      }
    }

    if (detailed) {
      const transformedForecasts = forecasts.map(forecast => ({
        date: forecast.forecast_time,
        generation: forecast.generation_forecast,
        consumption: forecast.consumption_forecast,
        temperature: forecast.temperature,
        cloudCover: forecast.cloud_cover,
        windSpeed: forecast.wind_speed,
        weatherCondition: forecast.weather_condition,
        confidence: forecast.confidence
      }));

      return new Response(JSON.stringify(transformedForecasts), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(forecasts), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Error in energy-ai-predictions:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    );
  }
});

// ✅ Helper Function
function generateMockForecasts(siteId: string, days: number, weatherData: any[] = []) {
  const forecasts = [];
  const now = new Date();
  now.setMinutes(0, 0, 0);

  for (let d = 0; d < days; d++) {
    for (let h = 0; h < 24; h++) {
      const forecastTime = new Date(now);
      forecastTime.setDate(now.getDate() + d);
      forecastTime.setHours(h);

      let temperature = 20 + (Math.sin((h - 6) * Math.PI / 12) * 5);
      let cloudCover = Math.max(0, Math.min(100, 50 + Math.sin((h - 12) * Math.PI / 12) * 30));
      let windSpeed = 2 + Math.random() * 5;
      let weatherCondition = "sunny";

      const matchingWeather = weatherData.find(w => {
        const wDate = new Date(w.timestamp);
        return wDate.getDate() === forecastTime.getDate() && wDate.getHours() === forecastTime.getHours();
      });

      if (matchingWeather) {
        temperature = matchingWeather.temperature;
        cloudCover = matchingWeather.cloud_cover;
        windSpeed = matchingWeather.wind_speed;
        weatherCondition = matchingWeather.weather_condition;
      }

      const baseGeneration = Math.sin((h - 6) * Math.PI / 12) * 8;
      let generation = Math.max(0, baseGeneration * (1 - cloudCover / 100));
      generation = parseFloat(generation.toFixed(2));

      let consumption;
      if (h >= 6 && h <= 9) {
        consumption = 2 + Math.random() * 3;
      } else if (h >= 17 && h <= 22) {
        consumption = 3 + Math.random() * 4;
      } else if (h >= 23 || h <= 5) {
        consumption = 0.5 + Math.random() * 1;
      } else {
        consumption = 1 + Math.random() * 2;
      }
      consumption = parseFloat(consumption.toFixed(2));

      const confidence = Math.floor(75 + Math.random() * 20);

      forecasts.push({
        id: crypto.randomUUID(),
        site_id: siteId,
        forecast_time: forecastTime.toISOString(),
        generation_forecast: generation,
        consumption_forecast: consumption,
        temperature: temperature,
        cloud_cover: cloudCover,
        wind_speed: windSpeed,
        weather_condition: weatherCondition,
        confidence: confidence,
        source: "model",
        created_at: new Date().toISOString()
      });
    }
  }

  return forecasts;
}
