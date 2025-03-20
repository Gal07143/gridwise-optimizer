
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PredictionRequest {
  siteId: string;
  days: number;
  includeWeather?: boolean;
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
    const { siteId, days = 7, includeWeather = true } = await req.json() as PredictionRequest;
    
    console.log(`Generating energy predictions for site ${siteId}, days: ${days}, includeWeather: ${includeWeather}`);

    if (!siteId) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // In a real app, we would call an AI model here
    // For demo purposes, we'll generate synthetic data
    
    // 1. Get historical data for the site to base predictions on
    const { data: historicalReadings, error: readingsError } = await supabase
      .from('energy_readings')
      .select('device_id, timestamp, power, energy')
      .order('timestamp', { ascending: false })
      .limit(100);
    
    if (readingsError) {
      throw new Error(`Error fetching historical data: ${readingsError.message}`);
    }
    
    // 2. Get device information
    const { data: devices, error: devicesError } = await supabase
      .from('devices')
      .select('id, type, capacity')
      .eq('site_id', siteId);
    
    if (devicesError) {
      throw new Error(`Error fetching devices: ${devicesError.message}`);
    }
    
    // 3. Get weather data if requested
    let weatherData = null;
    if (includeWeather) {
      const { data: weather, error: weatherError } = await supabase
        .from('weather_data')
        .select('*')
        .eq('site_id', siteId)
        .eq('forecast', true)
        .order('timestamp', { ascending: true })
        .limit(days);
      
      if (!weatherError) {
        weatherData = weather;
      }
    }
    
    // 4. Generate predictions
    const predictions = generateEnergyPredictions(devices, days, weatherData);
    
    // 5. Store predictions in the database
    const now = new Date();
    const predictionEntries = predictions.map(pred => ({
      site_id: siteId,
      timestamp: now.toISOString(),
      forecast_time: pred.date,
      generation_forecast: pred.generation,
      consumption_forecast: pred.consumption,
      temperature: pred.temperature,
      cloud_cover: pred.cloudCover,
      wind_speed: pred.windSpeed,
      weather_condition: pred.weatherCondition,
      confidence: 0.85 + (Math.random() * 0.1),
      source: 'model'
    }));
    
    // Insert predictions
    const { error: insertError } = await supabase
      .from('energy_forecasts')
      .insert(predictionEntries);
    
    if (insertError) {
      console.warn(`Warning: Failed to store predictions: ${insertError.message}`);
    }
    
    // 6. Return predictions
    return new Response(
      JSON.stringify({ 
        predictions,
        message: "AI predictions generated successfully" 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
    
  } catch (error) {
    console.error("Error generating predictions:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Failed to generate predictions" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

function generateEnergyPredictions(devices: any[], days: number, weatherData: any[] | null) {
  const startDate = new Date();
  const predictions = [];
  
  // Calculate device capacities by type
  const solarCapacity = devices
    .filter(d => d.type === 'solar')
    .reduce((sum, d) => sum + (d.capacity || 0), 0);
  
  const windCapacity = devices
    .filter(d => d.type === 'wind')
    .reduce((sum, d) => sum + (d.capacity || 0), 0);
  
  const totalConsumptionCapacity = devices
    .filter(d => d.type === 'load')
    .reduce((sum, d) => sum + (d.capacity || 0), 0);
  
  // Generate predictions for each day
  for (let i = 0; i < days; i++) {
    const predictionDate = new Date(startDate);
    predictionDate.setDate(startDate.getDate() + i);
    
    // Use weather data if available, otherwise generate random
    let temperature = 10 + Math.random() * 20; // 10-30°C
    let cloudCover = Math.random();
    let windSpeed = 2 + Math.random() * 8; // 2-10 m/s
    let weatherCondition = "Partly Cloudy";
    
    if (weatherData && weatherData[i]) {
      temperature = weatherData[i].temperature || temperature;
      cloudCover = weatherData[i].cloud_cover || cloudCover;
      windSpeed = weatherData[i].wind_speed || windSpeed;
      
      // Determine weather condition based on cloud cover
      if (cloudCover < 0.3) weatherCondition = "Clear";
      else if (cloudCover < 0.7) weatherCondition = "Partly Cloudy";
      else weatherCondition = "Cloudy";
      
      if (weatherData[i].precipitation > 1) {
        weatherCondition = "Rain";
      }
    }
    
    // Calculate solar generation based on cloud cover and capacity
    const dayOfYear = getDayOfYear(predictionDate);
    const seasonalFactor = getSeasonalFactor(dayOfYear);
    
    const effectiveSolarCapacity = solarCapacity * seasonalFactor * (1 - (cloudCover * 0.7));
    
    // Calculate wind generation based on wind speed and capacity
    // Wind power is proportional to the cube of wind speed, but with cutoffs
    let windEfficiency = 0;
    if (windSpeed < 3) {
      windEfficiency = windSpeed / 3; // Low wind
    } else if (windSpeed < 12) {
      windEfficiency = 0.3 + (windSpeed - 3) * 0.07; // Normal operation range
    } else {
      windEfficiency = 0.9; // Maximum efficiency
    }
    
    const effectiveWindCapacity = windCapacity * windEfficiency;
    
    // Calculate consumption based on temperature (higher in extreme temperatures)
    const temperatureFactor = Math.abs(temperature - 20) / 10; // Deviation from comfortable temp
    const timeOfYear = dayOfYear / 365;
    const seasonalConsumptionFactor = 1 + (Math.sin(timeOfYear * 2 * Math.PI) * 0.15); // ±15% seasonal variation
    
    const consumption = totalConsumptionCapacity * (0.7 + temperatureFactor * 0.3) * seasonalConsumptionFactor;
    
    // Add some randomness for realism
    const randomFactor = 0.9 + Math.random() * 0.2; // 0.9-1.1
    
    predictions.push({
      date: predictionDate.toISOString(),
      generation: Math.round((effectiveSolarCapacity + effectiveWindCapacity) * randomFactor * 100) / 100,
      consumption: Math.round(consumption * randomFactor * 100) / 100,
      temperature: Math.round(temperature * 10) / 10,
      cloudCover: Math.round(cloudCover * 100) / 100,
      windSpeed: Math.round(windSpeed * 10) / 10,
      weatherCondition
    });
  }
  
  return predictions;
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

function getSeasonalFactor(dayOfYear: number): number {
  // Simplified seasonal factor: peaks in summer, lowest in winter
  // This assumes northern hemisphere
  const normalizedDay = dayOfYear / 365; // 0-1 range
  return 0.6 + Math.sin((normalizedDay - 0.25) * 2 * Math.PI) * 0.4; // 0.2-1.0 range
}
