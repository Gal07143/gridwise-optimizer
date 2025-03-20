
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
    const { siteId, days = 7, includeWeather = true } = await req.json();
    
    console.log(`Generating energy predictions for site ${siteId} for ${days} days`);
    
    // In a real implementation, this would connect to a trained ML model
    // For now, we'll generate realistic sample data
    const predictions = generateSamplePredictions(days, includeWeather);
    
    return new Response(
      JSON.stringify({ 
        success: true,
        predictions: predictions 
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

function generateSamplePredictions(days: number, includeWeather: boolean) {
  const predictions = [];
  const now = new Date();
  
  // Base pattern for generation (kW) - adjusted for time of day
  const generationPattern = [
    0, 0, 0, 0, 0, 0.5,           // 12am-6am
    2, 5, 10, 15, 20, 22,         // 6am-12pm
    25, 23, 20, 15, 8, 3,         // 12pm-6pm
    1, 0.5, 0, 0, 0, 0            // 6pm-12am
  ];
  
  // Base pattern for consumption (kW) - adjusted for time of day
  const consumptionPattern = [
    3, 2.5, 2, 2, 2.5, 3,         // 12am-6am
    5, 8, 10, 9, 8, 7,           // 6am-12pm
    8, 10, 9, 10, 12, 15,        // 12pm-6pm
    14, 12, 9, 7, 5, 4           // 6pm-12am
  ];
  
  // Generate forecasts for requested number of days
  for (let day = 0; day < days; day++) {
    // Generate for each hour of the day
    for (let hour = 0; hour < 24; hour++) {
      const date = new Date(now);
      date.setDate(date.getDate() + day);
      date.setHours(hour, 0, 0, 0);
      
      // Get base values from patterns
      let generation = generationPattern[hour];
      let consumption = consumptionPattern[hour];
      
      // Add some randomness
      const generationVariance = 0.8 + (Math.random() * 0.4); // 80-120%
      const consumptionVariance = 0.9 + (Math.random() * 0.2); // 90-110%
      
      generation *= generationVariance;
      consumption *= consumptionVariance;
      
      // Weather factors (only if requested)
      let weatherData = {};
      if (includeWeather) {
        // Generate realistic weather data
        const isDay = hour >= 6 && hour <= 18;
        const temperature = isDay ? 
          15 + (Math.random() * 15) : // 15-30°C during day
          10 + (Math.random() * 10);  // 10-20°C during night
          
        const cloudCover = Math.random();
        const windSpeed = 2 + (Math.random() * 18); // 2-20 km/h
        
        let weatherCondition;
        if (cloudCover < 0.3) weatherCondition = "clear";
        else if (cloudCover < 0.7) weatherCondition = "partly cloudy";
        else weatherCondition = "cloudy";
        
        // Apply weather effects to generation
        if (isDay) {
          // Cloud cover significantly affects solar generation
          generation *= (1 - (cloudCover * 0.7));
        }
        
        weatherData = {
          temperature,
          cloudCover,
          windSpeed,
          weatherCondition
        };
      }
      
      predictions.push({
        date: date.toISOString(),
        generation: parseFloat(generation.toFixed(2)),
        consumption: parseFloat(consumption.toFixed(2)),
        ...weatherData
      });
    }
  }
  
  return predictions;
}
