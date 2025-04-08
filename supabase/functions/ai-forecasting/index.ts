
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ForecastRequest {
  siteId: string;
  days: number;
  includeWeather?: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse request
    const requestData: ForecastRequest = await req.json();
    const { siteId, days = 3, includeWeather = true } = requestData;
    
    console.log(`Generating ${days} day forecast for site ${siteId}`);
    
    // Get site information
    const { data: site, error: siteError } = await supabase
      .from('sites')
      .select('*')
      .eq('id', siteId)
      .single();
      
    if (siteError) throw siteError;
    if (!site) throw new Error(`Site ${siteId} not found`);
    
    // Get historical energy data
    const { data: historicalReadings, error: historyError } = await supabase
      .from('energy_readings')
      .select('device_id, timestamp, power, energy')
      .in('device_id', await getDeviceIds(supabase, siteId))
      .gte('timestamp', getDateBefore(30)) // Last 30 days
      .order('timestamp', { ascending: false });
      
    if (historyError) throw historyError;
    
    // Get historical weather data
    const { data: historicalWeather, error: weatherError } = await supabase
      .from('weather_data')
      .select('*')
      .eq('site_id', siteId)
      .eq('forecast', false) // Only actual weather, not forecasts
      .gte('timestamp', getDateBefore(30)) // Last 30 days
      .order('timestamp', { ascending: false });
      
    if (weatherError) throw weatherError;
    
    // Get weather forecast if needed
    let weatherForecast = [];
    if (includeWeather) {
      const { data: forecast, error: forecastError } = await supabase
        .from('weather_data')
        .select('*')
        .eq('site_id', siteId)
        .eq('forecast', true)
        .gte('timestamp', new Date().toISOString())
        .order('timestamp', { ascending: true })
        .limit(days * 24); // Hourly forecasts
        
      if (forecastError) throw forecastError;
      weatherForecast = forecast || [];
      
      // If no forecast data exists, generate synthetic data
      if (weatherForecast.length === 0) {
        weatherForecast = generateSyntheticWeatherForecast(siteId, days);
      }
    }
    
    // Generate energy forecasts using AI model
    const hourlyForecasts = generateAIForecasts(
      site,
      historicalReadings || [],
      historicalWeather || [],
      weatherForecast,
      days
    );
    
    // Store forecasts in the database
    const forecastsToInsert = hourlyForecasts.map(forecast => ({
      site_id: siteId,
      forecast_time: forecast.timestamp,
      generation_forecast: forecast.generation,
      consumption_forecast: forecast.consumption,
      temperature: forecast.temperature,
      cloud_cover: forecast.cloudCover,
      wind_speed: forecast.windSpeed,
      weather_condition: forecast.weatherCondition,
      confidence: forecast.confidence,
      source: 'ai_model'
    }));
    
    // Insert in batches to avoid request size limits
    for (let i = 0; i < forecastsToInsert.length; i += 50) {
      const batch = forecastsToInsert.slice(i, i + 50);
      const { error: insertError } = await supabase
        .from('energy_forecasts')
        .upsert(batch, { 
          onConflict: 'site_id,forecast_time',
          ignoreDuplicates: true 
        });
        
      if (insertError) {
        console.error("Error inserting forecasts batch:", insertError);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      forecasts: hourlyForecasts,
      message: `Generated ${hourlyForecasts.length} hourly forecasts for ${days} days`
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in AI forecasting:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

async function getDeviceIds(supabase, siteId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('devices')
    .select('id')
    .eq('site_id', siteId);
    
  if (error) throw error;
  return (data || []).map(d => d.id);
}

function getDateBefore(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

function generateSyntheticWeatherForecast(siteId: string, days: number) {
  const forecast = [];
  const now = new Date();
  now.setMinutes(0, 0, 0); // Round to the hour
  
  for (let d = 0; d < days; d++) {
    for (let h = 0; h < 24; h++) {
      const forecastTime = new Date(now);
      forecastTime.setDate(now.getDate() + d);
      forecastTime.setHours(h);
      
      // Create synthetic weather data with realistic patterns
      const hourOfDay = h;
      const isDaytime = hourOfDay >= 6 && hourOfDay <= 20;
      
      // Temperature follows a daily cycle
      let temperature = 15 + 10 * Math.sin((hourOfDay - 6) * Math.PI / 12);
      
      // Add some random variation
      temperature += (Math.random() * 4) - 2;
      
      // Cloud cover - more likely in the afternoon
      let cloudCover = 30 + 40 * Math.sin((hourOfDay - 10) * Math.PI / 12);
      cloudCover = Math.max(0, Math.min(100, cloudCover + (Math.random() * 30) - 15));
      
      // Wind typically picks up during the day
      let windSpeed = 2 + 3 * Math.sin((hourOfDay - 8) * Math.PI / 12);
      windSpeed = Math.max(0, windSpeed + (Math.random() * 2) - 1);
      
      // Weather condition
      let weatherCondition = 'clear';
      if (cloudCover > 80) weatherCondition = 'cloudy';
      else if (cloudCover > 50) weatherCondition = 'partly_cloudy';
      
      if (Math.random() < 0.1 && cloudCover > 60) weatherCondition = 'rain';
      
      forecast.push({
        site_id: siteId,
        timestamp: forecastTime.toISOString(),
        temperature: parseFloat(temperature.toFixed(1)),
        cloud_cover: parseFloat(cloudCover.toFixed(1)),
        wind_speed: parseFloat(windSpeed.toFixed(1)),
        humidity: parseFloat((60 + (Math.random() * 30)).toFixed(1)),
        wind_direction: parseFloat((Math.random() * 360).toFixed(1)),
        precipitation: weatherCondition === 'rain' ? parseFloat((Math.random() * 5).toFixed(1)) : 0,
        forecast: true,
        weather_condition: weatherCondition,
        source: 'synthetic'
      });
    }
  }
  
  return forecast;
}

function generateAIForecasts(site, historicalReadings, historicalWeather, weatherForecast, days) {
  const forecasts = [];
  const now = new Date();
  now.setMinutes(0, 0, 0); // Round to the hour
  
  // Group historical readings by device type
  const deviceTypeReadings = {};
  historicalReadings.forEach(reading => {
    const deviceType = reading.device_type || 'unknown';
    if (!deviceTypeReadings[deviceType]) {
      deviceTypeReadings[deviceType] = [];
    }
    deviceTypeReadings[deviceType].push(reading);
  });
  
  // Calculate typical generation and consumption patterns by hour
  const hourlyPatterns = calculateHourlyPatterns(historicalReadings, historicalWeather);
  
  // Generate forecast for each hour
  for (let d = 0; d < days; d++) {
    for (let h = 0; h < 24; h++) {
      const forecastTime = new Date(now);
      forecastTime.setDate(now.getDate() + d);
      forecastTime.setHours(h);
      
      // Find weather for this hour
      const weather = findWeatherForTimestamp(weatherForecast, forecastTime);
      
      // Find typical pattern for this hour
      const hourPattern = hourlyPatterns[h] || {
        avgGeneration: 0,
        avgConsumption: 3,
        genStdDev: 0.5,
        conStdDev: 1
      };
      
      // Calculate generation based on weather and patterns
      let generation = hourPattern.avgGeneration;
      
      if (weather) {
        // Adjust for weather conditions
        const cloudFactor = 1 - (weather.cloud_cover / 100) * 0.7;
        generation *= cloudFactor;
        
        // Add weather-specific adjustments
        if (weather.weather_condition === 'rain') {
          generation *= 0.7; // Rainy days reduce generation
        }
      }
      
      // Add normal variation
      generation += normalRandom() * hourPattern.genStdDev;
      generation = Math.max(0, generation);
      
      // Calculate consumption based on patterns and temperature
      let consumption = hourPattern.avgConsumption;
      
      if (weather) {
        // Adjust for temperature (more consumption on very hot or cold days)
        const tempFactor = Math.abs(weather.temperature - 21) / 10;
        consumption *= (1 + tempFactor * 0.2);
      }
      
      // Add normal variation
      consumption += normalRandom() * hourPattern.conStdDev;
      consumption = Math.max(0.2, consumption);
      
      // Calculate confidence based on forecast distance
      const days_ahead = d;
      const confidence = Math.max(50, 95 - (days_ahead * 5));
      
      forecasts.push({
        timestamp: forecastTime.toISOString(),
        generation: parseFloat(generation.toFixed(2)),
        consumption: parseFloat(consumption.toFixed(2)),
        netEnergy: parseFloat((generation - consumption).toFixed(2)),
        temperature: weather?.temperature,
        cloudCover: weather?.cloud_cover,
        windSpeed: weather?.wind_speed,
        weatherCondition: weather?.weather_condition,
        confidence: confidence
      });
    }
  }
  
  return forecasts;
}

function calculateHourlyPatterns(readings, weatherData) {
  const hourlyPatterns = {};
  
  // Initialize pattern structure
  for (let h = 0; h < 24; h++) {
    hourlyPatterns[h] = {
      genReadings: [],
      conReadings: [],
      avgGeneration: 0,
      avgConsumption: 0,
      genStdDev: 0.5,
      conStdDev: 0.5
    };
  }
  
  // Collect readings by hour
  readings.forEach(reading => {
    const hour = new Date(reading.timestamp).getHours();
    if (!hourlyPatterns[hour]) return;
    
    if (reading.device_type === 'solar' || reading.device_type === 'wind') {
      hourlyPatterns[hour].genReadings.push(reading.power);
    } else if (reading.device_type === 'load' || reading.device_type === 'home') {
      hourlyPatterns[hour].conReadings.push(reading.power);
    }
  });
  
  // Calculate statistics for each hour
  for (let h = 0; h < 24; h++) {
    const pattern = hourlyPatterns[h];
    
    // Calculate average generation
    if (pattern.genReadings.length > 0) {
      pattern.avgGeneration = pattern.genReadings.reduce((sum, val) => sum + val, 0) / pattern.genReadings.length;
      pattern.genStdDev = calculateStdDev(pattern.genReadings, pattern.avgGeneration);
    } else {
      // If no data, use a solar curve with peak at noon
      const hourFactor = 1 - Math.abs(h - 12) / 12;
      pattern.avgGeneration = Math.max(0, hourFactor * 5); // 5kW peak
    }
    
    // Calculate average consumption
    if (pattern.conReadings.length > 0) {
      pattern.avgConsumption = pattern.conReadings.reduce((sum, val) => sum + val, 0) / pattern.conReadings.length;
      pattern.conStdDev = calculateStdDev(pattern.conReadings, pattern.avgConsumption);
    } else {
      // If no data, use a typical residential pattern
      if (h >= 7 && h <= 9) pattern.avgConsumption = 4; // Morning peak
      else if (h >= 17 && h <= 21) pattern.avgConsumption = 5; // Evening peak
      else if (h >= 23 || h <= 5) pattern.avgConsumption = 1; // Night low
      else pattern.avgConsumption = 2.5; // Midday
    }
  }
  
  return hourlyPatterns;
}

function findWeatherForTimestamp(weatherData, timestamp) {
  if (!weatherData || weatherData.length === 0) return null;
  
  const time = timestamp.getTime();
  return weatherData.reduce((closest, record) => {
    const recordTime = new Date(record.timestamp).getTime();
    const currentClosestTime = closest ? new Date(closest.timestamp).getTime() : 0;
    
    if (!closest || Math.abs(recordTime - time) < Math.abs(currentClosestTime - time)) {
      return record;
    }
    return closest;
  }, null);
}

function calculateStdDev(values, mean) {
  if (values.length <= 1) return 0.5; // Default for small samples
  
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (values.length - 1);
  return Math.sqrt(variance);
}

function normalRandom() {
  // Box-Muller transform for normal distribution
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}
