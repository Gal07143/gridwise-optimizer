
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WeatherRequest {
  siteId: string;
  lat?: number;
  lng?: number;
  days?: number;
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  // Initialize Supabase client
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Parse the request
    const { siteId, lat, lng, days = 7 } = await req.json() as WeatherRequest;
    
    console.log(`Fetching weather data for site ${siteId}, days: ${days}`);

    if (!siteId) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    let siteCoordinates;
    
    // Get coordinates from the site if not provided
    if (!lat || !lng) {
      const { data: siteData, error: siteError } = await supabase
        .from('sites')
        .select('lat, lng')
        .eq('id', siteId)
        .single();
      
      if (siteError || !siteData || !siteData.lat || !siteData.lng) {
        return new Response(
          JSON.stringify({ error: "Site coordinates not found" }),
          {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      siteCoordinates = { lat: siteData.lat, lng: siteData.lng };
    } else {
      siteCoordinates = { lat, lng };
    }

    // In a real app, this would call a weather API
    // For demo purposes, we'll generate synthetic weather data
    const weatherData = generateWeatherForecast(siteCoordinates.lat, siteCoordinates.lng, days);
    
    // Store the weather data in the database
    const now = new Date();
    const weatherEntries = weatherData.map(weather => ({
      site_id: siteId,
      timestamp: now.toISOString(),
      forecast: true,
      temperature: weather.temperature,
      humidity: weather.humidity,
      precipitation: weather.precipitation,
      wind_speed: weather.windSpeed,
      wind_direction: weather.windDirection,
      cloud_cover: weather.cloudCover,
      source: 'weather-api'
    }));
    
    // Insert weather forecast
    const { error: insertError } = await supabase
      .from('weather_data')
      .insert(weatherEntries);
    
    if (insertError) {
      console.warn(`Warning: Failed to store weather data: ${insertError.message}`);
    }
    
    return new Response(
      JSON.stringify({ 
        forecast: weatherData,
        message: "Weather forecast retrieved successfully" 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
    
  } catch (error) {
    console.error("Error fetching weather data:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Failed to fetch weather data" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

function generateWeatherForecast(lat: number, lng: number, days: number) {
  const forecast = [];
  const startDate = new Date();
  
  // Use location to influence forecast (very simplistic)
  const isNorthern = lat > 0;
  const isTropical = Math.abs(lat) < 23.5;
  const isCoastal = Math.abs(lng) < 10 || Math.abs(lng) > 170; // Simplistic assumption
  
  // Base temperature for the location
  const baseTemp = isTropical ? 28 : (isNorthern ? 15 : 18);
  
  // Generate a weather pattern for the next N days
  for (let i = 0; i < days; i++) {
    const forecastDate = new Date(startDate);
    forecastDate.setDate(startDate.getDate() + i);
    
    // Create weather variations
    const dayVariation = Math.sin((i / days) * Math.PI) * 3; // Temperature variation over forecast period
    const randomVariation = (Math.random() - 0.5) * 5; // Random daily variation
    
    // Calculate temperature
    const temperature = baseTemp + dayVariation + randomVariation;
    
    // Humidity tends to be higher in coastal and tropical areas
    const humidity = (isTropical ? 70 : 50) + (isCoastal ? 15 : 0) + (Math.random() * 20);
    
    // Cloud cover and precipitation are related
    const cloudCover = Math.random() * 0.8;
    let precipitation = 0;
    if (cloudCover > 0.5) {
      precipitation = (cloudCover - 0.5) * 2 * 10 * Math.random(); // 0-10mm if cloudy
    }
    
    // Wind speed and direction
    const windSpeed = 2 + Math.random() * 10; // 2-12 m/s
    const windDirection = Math.floor(Math.random() * 360); // 0-359 degrees
    
    forecast.push({
      date: forecastDate.toISOString(),
      temperature: Math.round(temperature * 10) / 10,
      humidity: Math.round(humidity),
      precipitation: Math.round(precipitation * 10) / 10,
      windSpeed: Math.round(windSpeed * 10) / 10,
      windDirection,
      cloudCover: Math.round(cloudCover * 100) / 100,
    });
  }
  
  return forecast;
}
