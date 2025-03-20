
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { siteId, days = 7 } = await req.json();
    
    console.log(`Fetching weather data for site ${siteId} for ${days} days`);
    
    // In a real implementation, this would connect to a weather API
    // For now, we'll generate realistic sample data
    const forecast = generateSampleWeatherData(days);
    
    return new Response(
      JSON.stringify({ 
        success: true,
        forecast: forecast 
      }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      { 
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  }
});

function generateSampleWeatherData(days: number) {
  const forecast = [];
  const now = new Date();
  
  // Base weather patterns
  const temperaturePattern = [
    14, 13, 12, 12, 13, 14,      // 12am-6am
    15, 17, 19, 20, 22, 23,      // 6am-12pm
    24, 25, 24, 23, 21, 19,      // 12pm-6pm
    18, 17, 16, 15, 14, 14       // 6pm-12am
  ];
  
  // Generate weather for requested number of days
  for (let day = 0; day < days; day++) {
    // Temperature trend adjusts slightly each day (+/- 2 degrees)
    const dailyTempAdjustment = Math.random() * 4 - 2;
    
    // Weather condition for the day
    const weatherTypes = ["sunny", "partly cloudy", "cloudy", "light rain", "rain"];
    const dayWeatherIndex = Math.floor(Math.random() * weatherTypes.length);
    let dayWeather = weatherTypes[dayWeatherIndex];
    
    // Wind speed for the day (base value)
    const baseWindSpeed = 2 + (Math.random() * 18); // 2-20 km/h
    
    // For each hour of the day
    for (let hour = 0; hour < 24; hour++) {
      const date = new Date(now);
      date.setDate(date.getDate() + day);
      date.setHours(hour, 0, 0, 0);
      
      // Get base temperature from pattern
      let temperature = temperaturePattern[hour] + dailyTempAdjustment;
      
      // Add hourly randomness to temperature
      temperature += (Math.random() * 2 - 1); // +/- 1 degree
      
      // Cloud cover based on weather type
      let cloudCover;
      switch (dayWeather) {
        case "sunny": cloudCover = Math.random() * 0.2; break;  // 0-20%
        case "partly cloudy": cloudCover = 0.3 + Math.random() * 0.3; break; // 30-60%
        case "cloudy": cloudCover = 0.7 + Math.random() * 0.3; break; // 70-100%
        case "light rain": cloudCover = 0.6 + Math.random() * 0.4; break; // 60-100%
        case "rain": cloudCover = 0.8 + Math.random() * 0.2; break; // 80-100%
        default: cloudCover = 0.5;
      }
      
      // Wind speed varies through the day
      const hourWindVariance = 0.7 + (Math.random() * 0.6); // 70-130%
      const windSpeed = baseWindSpeed * hourWindVariance;
      
      // Precipitation probability based on weather type
      let precipitation = 0;
      if (dayWeather === "light rain") {
        precipitation = Math.random() * 2; // 0-2mm
      } else if (dayWeather === "rain") {
        precipitation = 2 + Math.random() * 8; // 2-10mm
      }
      
      // Weather can change slightly through the day
      if (hour % 6 === 0 && Math.random() > 0.7) {
        // 30% chance of weather changing every 6 hours
        const newWeatherIndex = Math.max(0, Math.min(
          dayWeatherIndex + (Math.floor(Math.random() * 3) - 1),
          weatherTypes.length - 1
        ));
        dayWeather = weatherTypes[newWeatherIndex];
      }
      
      forecast.push({
        time: date.toISOString(),
        temperature: parseFloat(temperature.toFixed(1)),
        condition: dayWeather,
        cloudCover: parseFloat(cloudCover.toFixed(2)),
        windSpeed: parseFloat(windSpeed.toFixed(1)),
        precipitation: parseFloat(precipitation.toFixed(1))
      });
    }
  }
  
  return forecast;
}
