
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Create a Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Fetch current weather data from Google Weather API
 * This is a simulated service for demonstration
 */
async function getCurrentWeather(lat: number, lng: number) {
  // In a real implementation, this would call the Google Weather API
  console.log(`Fetching current weather for location (${lat}, ${lng})`);
  
  // For demo, generate realistic weather based on location and time
  const now = new Date();
  const hour = now.getHours();
  
  // Temperature varies by time of day and latitude
  // Higher latitudes are cooler, lower latitudes are warmer
  const latFactor = (90 - Math.abs(lat)) / 90; // 0 at poles, 1 at equator
  
  let baseTemp = 15 + (latFactor * 15); // 15°C at poles, 30°C at equator
  
  if (hour >= 5 && hour <= 12) {
    // Morning warming up
    baseTemp = baseTemp - 5 + (hour - 5) * 1.5;
  } else if (hour > 12 && hour <= 18) {
    // Afternoon cooling down
    baseTemp = baseTemp + 5 - (hour - 12) * 0.5;
  } else {
    // Night
    baseTemp = baseTemp - 5;
  }
  
  // Add some randomness
  const temp = baseTemp + (Math.random() * 6 - 3);
  
  // Clouds and precipitation (simplistic model)
  const cloudCover = Math.random() * 100;
  const precipitation = cloudCover > 70 ? Math.random() * 10 : 0;
  
  // Wind
  const windSpeed = 5 + Math.random() * 15;
  const windDirection = Math.random() * 360;
  
  // Humidity (higher when raining or at night)
  const humidity = precipitation > 0 
    ? 70 + Math.random() * 20 
    : (hour >= 10 && hour <= 17) 
      ? 40 + Math.random() * 30 
      : 60 + Math.random() * 20;
  
  return {
    timestamp: now.toISOString(),
    temperature: Number(temp.toFixed(1)),
    humidity: Number(humidity.toFixed(1)),
    precipitation: Number(precipitation.toFixed(1)),
    wind_speed: Number(windSpeed.toFixed(1)),
    wind_direction: Number(windDirection.toFixed(1)),
    cloud_cover: Number(cloudCover.toFixed(1)),
    source: 'google_weather_api',
    conditions: getConditionsDescription(cloudCover, precipitation)
  };
}

/**
 * Fetch weather forecast from Google Weather API
 * This is a simulated service for demonstration
 */
async function getWeatherForecast(lat: number, lng: number, days: number) {
  console.log(`Fetching ${days}-day forecast for location (${lat}, ${lng})`);
  
  // In a real implementation, this would call the Google Weather API
  
  const hourly = [];
  const daily = [];
  
  const now = new Date();
  
  // Temperature base depends on latitude
  const latFactor = (90 - Math.abs(lat)) / 90; // 0 at poles, 1 at equator
  const baseLatTemp = 15 + (latFactor * 15); // 15°C at poles, 30°C at equator
  
  // Generate forecast for each day
  for (let d = 0; d < days; d++) {
    const date = new Date(now);
    date.setDate(date.getDate() + d);
    const dateStr = date.toISOString().split('T')[0];
    
    // Base temperature for the day (more variation as we go further out)
    const variance = d * 1.5;
    const baseDayTemp = baseLatTemp + (Math.random() * 10 - 5) + (Math.random() * variance - variance/2);
    
    // Weather pattern for the day (more uncertainty as we go further out)
    const pattern = Math.random() * 4;
    let dayClouds = 20 + (Math.random() * 60);
    let dayPrecip = dayClouds > 60 ? (Math.random() * 8) : 0;
    
    // Add randomness based on forecast day
    dayClouds += (Math.random() * variance * 10 - variance * 5);
    dayClouds = Math.max(0, Math.min(100, dayClouds));
    
    // Generate hourly forecasts
    for (let h = 0; h < 24; h++) {
      const hourDate = new Date(date);
      hourDate.setHours(h, 0, 0, 0);
      
      // Temperature varies through the day
      let hourTemp = baseDayTemp;
      if (h >= 0 && h < 6) {
        // Early morning (coolest)
        hourTemp -= 5 - (h * 0.5);
      } else if (h >= 6 && h < 14) {
        // Morning to afternoon (warming)
        hourTemp += (h - 6) * 0.7;
      } else if (h >= 14 && h < 19) {
        // Late afternoon to evening (cooling)
        hourTemp += 5 - ((h - 14) * 1);
      } else {
        // Night (cooling)
        hourTemp -= (h - 19) * 0.5;
      }
      
      // Cloud cover varies through the day
      let hourClouds = dayClouds;
      if (pattern < 1) {
        // Clear morning, cloudy afternoon
        hourClouds = h < 12 ? dayClouds * 0.6 : dayClouds * 1.4;
      } else if (pattern < 2) {
        // Cloudy morning, clear afternoon
        hourClouds = h < 12 ? dayClouds * 1.4 : dayClouds * 0.6;
      } else if (pattern < 3) {
        // Cloudier at dawn and dusk
        hourClouds = (h < 6 || h > 18) ? dayClouds * 1.3 : dayClouds;
      }
      
      hourClouds = Math.max(0, Math.min(100, hourClouds));
      
      // Precipitation (more likely in afternoon if clouds are high)
      let hourPrecip = 0;
      if (hourClouds > 70) {
        // Afternoon rain more likely
        if (h >= 12 && h <= 18) {
          hourPrecip = dayPrecip * (1 + (Math.random() * 0.5));
        } else {
          hourPrecip = dayPrecip * (Math.random() * 0.5);
        }
      }
      
      // Wind tends to pick up in the afternoon
      const hourWind = 5 + (Math.random() * 10) + (h >= 10 && h <= 16 ? 5 : 0);
      
      // Humidity (higher when raining or at night)
      const hourHumidity = hourPrecip > 0 
        ? 70 + Math.random() * 20 
        : (h >= 10 && h <= 17) 
          ? 40 + Math.random() * 30 
          : 60 + Math.random() * 20;
      
      // Add to hourly forecast
      hourly.push({
        timestamp: hourDate.toISOString(),
        temperature: Number(hourTemp.toFixed(1)),
        humidity: Number(hourHumidity.toFixed(1)),
        precipitation: Number(hourPrecip.toFixed(1)),
        wind_speed: Number(hourWind.toFixed(1)),
        wind_direction: Number((Math.random() * 360).toFixed(1)),
        cloud_cover: Number(hourClouds.toFixed(1)),
        source: 'google_weather_api',
        conditions: getConditionsDescription(hourClouds, hourPrecip)
      });
    }
    
    // Calculate day summary (min/max/avg)
    const dayHours = hourly.filter(h => h.timestamp.startsWith(dateStr));
    const maxTemp = Math.max(...dayHours.map(h => h.temperature || 0));
    const minTemp = Math.min(...dayHours.map(h => h.temperature || 0));
    const avgTemp = dayHours.reduce((sum, h) => sum + (h.temperature || 0), 0) / dayHours.length;
    const maxPrecip = Math.max(...dayHours.map(h => h.precipitation || 0));
    const avgClouds = dayHours.reduce((sum, h) => sum + (h.cloud_cover || 0), 0) / dayHours.length;
    
    // Add to daily forecast
    daily.push({
      timestamp: `${dateStr}T12:00:00Z`,
      temperature: Number(avgTemp.toFixed(1)),
      precipitation: Number(maxPrecip.toFixed(1)),
      cloud_cover: Number(avgClouds.toFixed(1)),
      high_temp: Number(maxTemp.toFixed(1)),
      low_temp: Number(minTemp.toFixed(1)),
      source: 'google_weather_api',
      conditions: getConditionsDescription(avgClouds, maxPrecip) + 
        ` (High: ${maxTemp.toFixed(1)}°C, Low: ${minTemp.toFixed(1)}°C)`
    });
  }
  
  return {
    hourly,
    daily
  };
}

/**
 * Generate a weather conditions description
 */
function getConditionsDescription(cloudCover?: number, precipitation?: number) {
  if (precipitation && precipitation > 5) {
    return 'Heavy Rain';
  } else if (precipitation && precipitation > 1) {
    return 'Light Rain';
  } else if (cloudCover && cloudCover > 80) {
    return 'Overcast';
  } else if (cloudCover && cloudCover > 50) {
    return 'Partly Cloudy';
  } else if (cloudCover && cloudCover > 20) {
    return 'Mostly Clear';
  } else {
    return 'Clear Sky';
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { action, siteId, lat, lng, days } = await req.json();
    
    // Get site data if siteId is provided
    let siteLocation = { lat, lng };
    
    if (siteId && (!lat || !lng)) {
      const { data: site, error } = await supabase
        .from('sites')
        .select('lat, lng')
        .eq('id', siteId)
        .single();
      
      if (error) {
        throw new Error(`Failed to fetch site data: ${error.message}`);
      }
      
      siteLocation = {
        lat: site.lat,
        lng: site.lng
      };
    }
    
    // Validate location data
    if (!siteLocation.lat || !siteLocation.lng) {
      throw new Error('Location data is required (either siteId or lat/lng)');
    }
    
    let responseData;
    
    // Perform the requested action
    switch (action) {
      case 'current':
        responseData = await getCurrentWeather(siteLocation.lat, siteLocation.lng);
        break;
      case 'forecast':
        responseData = await getWeatherForecast(siteLocation.lat, siteLocation.lng, days || 5);
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        data: responseData
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "An unexpected error occurred",
        status: 500
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );
  }
});
