
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Create a Supabase client with the Auth context of the function
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseServiceRole);

interface WeatherRequest {
  siteId: string;
  lat?: number;
  lng?: number;
  days?: number;
  storeInDatabase?: boolean;
}

interface WeatherResponse {
  current: {
    temperature: number;
    humidity: number;
    condition: string;
    wind_speed: number;
    wind_direction: number;
    cloud_cover: number;
    precipitation: number;
    timestamp: string;
  };
  forecast: {
    date: string;
    temperature_min: number;
    temperature_max: number;
    condition: string;
    wind_speed: number;
    cloud_cover: number;
    precipitation_chance: number;
    humidity: number;
  }[];
  location: {
    name: string;
    lat: number;
    lng: number;
    timezone: string;
  };
}

// Helper function to generate realistic weather data
function generateWeatherData(lat: number, lng: number, days = 5): WeatherResponse {
  const currentDate = new Date();
  
  // Generate current weather
  const current = {
    temperature: 15 + Math.random() * 20, // 15-35°C
    humidity: 30 + Math.random() * 60, // 30-90%
    condition: ["sunny", "partly_cloudy", "cloudy", "rain", "thunderstorm"][Math.floor(Math.random() * 5)],
    wind_speed: Math.random() * 30, // 0-30 km/h
    wind_direction: Math.random() * 360, // 0-360 degrees
    cloud_cover: Math.random() * 100, // 0-100%
    precipitation: Math.random() * 5, // 0-5 mm
    timestamp: currentDate.toISOString()
  };
  
  // Generate forecast for the requested number of days
  const forecast = [];
  
  for (let i = 0; i < days; i++) {
    const forecastDate = new Date(currentDate);
    forecastDate.setDate(forecastDate.getDate() + i);
    
    // Base values on the current weather with some variation
    const condition = ["sunny", "partly_cloudy", "cloudy", "rain", "thunderstorm"][Math.floor(Math.random() * 5)];
    const cloudCover = condition === "sunny" ? Math.random() * 20 : 
                      condition === "partly_cloudy" ? 20 + Math.random() * 30 : 
                      condition === "cloudy" ? 50 + Math.random() * 30 : 
                      70 + Math.random() * 30;
    
    forecast.push({
      date: forecastDate.toISOString().split('T')[0],
      temperature_min: 10 + Math.random() * 15,
      temperature_max: 20 + Math.random() * 15,
      condition,
      wind_speed: Math.random() * 30,
      cloud_cover: cloudCover,
      precipitation_chance: condition === "rain" || condition === "thunderstorm" ? 50 + Math.random() * 50 : Math.random() * 30,
      humidity: 30 + Math.random() * 60
    });
  }
  
  // Use the provided coordinates for the location
  const location = {
    name: "Weather Station",
    lat,
    lng,
    timezone: "UTC" // In a real implementation, this would be determined from the coordinates
  };
  
  return {
    current,
    forecast,
    location
  };
}

// Store weather data in the database
async function storeWeatherData(siteId: string, data: WeatherResponse): Promise<void> {
  try {
    console.log(`Storing weather data for site: ${siteId}`);
    
    // Store current weather
    const currentWeatherData = {
      site_id: siteId,
      timestamp: new Date(data.current.timestamp),
      forecast: false,
      temperature: data.current.temperature,
      humidity: data.current.humidity,
      precipitation: data.current.precipitation,
      wind_speed: data.current.wind_speed,
      wind_direction: data.current.wind_direction,
      cloud_cover: data.current.cloud_cover,
      source: "weather-api"
    };
    
    const { error: currentError } = await supabase
      .from('weather_data')
      .upsert(currentWeatherData, { 
        onConflict: 'site_id,timestamp,forecast' 
      });
    
    if (currentError) {
      console.error("Error storing current weather:", currentError);
    }
    
    // Store forecast data
    for (const day of data.forecast) {
      const forecastData = {
        site_id: siteId,
        timestamp: new Date(day.date),
        forecast: true,
        temperature: (day.temperature_min + day.temperature_max) / 2, // Average temp
        humidity: day.humidity,
        precipitation: day.precipitation_chance / 100 * 5, // Estimate based on chance
        wind_speed: day.wind_speed,
        wind_direction: Math.random() * 360, // Random direction
        cloud_cover: day.cloud_cover,
        source: "weather-api"
      };
      
      const { error: forecastError } = await supabase
        .from('weather_data')
        .upsert(forecastData, { 
          onConflict: 'site_id,timestamp,forecast' 
        });
      
      if (forecastError) {
        console.error(`Error storing forecast for ${day.date}:`, forecastError);
      }
    }
    
    console.log("Weather data storage completed");
  } catch (error) {
    console.error("Error in storeWeatherData:", error);
  }
}

// Get site coordinates if not provided
async function getSiteCoordinates(siteId: string): Promise<{ lat: number, lng: number } | null> {
  try {
    const { data, error } = await supabase
      .from('sites')
      .select('lat, lng')
      .eq('id', siteId)
      .single();
    
    if (error) {
      console.error("Error fetching site coordinates:", error);
      return null;
    }
    
    if (!data.lat || !data.lng) {
      console.error("Site has no coordinates:", siteId);
      return null;
    }
    
    return { lat: data.lat, lng: data.lng };
  } catch (error) {
    console.error("Error in getSiteCoordinates:", error);
    return null;
  }
}

// Main server handler
serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Parse request body
    const requestData: WeatherRequest = await req.json();
    console.log("Received weather request:", requestData);
    
    const { siteId, lat, lng, days = 5, storeInDatabase = true } = requestData;
    
    if (!siteId) {
      throw new Error("Missing required parameter: siteId");
    }
    
    let coordinates;
    
    // Use provided coordinates or fetch from database
    if (lat !== undefined && lng !== undefined) {
      coordinates = { lat, lng };
    } else {
      coordinates = await getSiteCoordinates(siteId);
      
      if (!coordinates) {
        throw new Error(`Unable to get coordinates for site ${siteId}`);
      }
    }
    
    // Generate weather data
    const weatherData = generateWeatherData(coordinates.lat, coordinates.lng, days);
    
    // Store data if requested
    if (storeInDatabase) {
      await storeWeatherData(siteId, weatherData);
    }
    
    // Return weather data
    return new Response(JSON.stringify(weatherData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    console.error("Error processing weather request:", error);
    
    return new Response(JSON.stringify({
      error: error.message || "An error occurred while processing your request"
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    });
  }
});
