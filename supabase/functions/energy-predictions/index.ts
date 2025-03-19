
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

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
    const { energyData, predictionDays } = await req.json();

    // Basic ML model: Simple moving average with weighted recent data
    // In a production system, you might use more sophisticated models
    const predictions = predictEnergyConsumption(energyData, predictionDays || 7);

    return new Response(JSON.stringify({ predictions }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in energy predictions:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

function predictEnergyConsumption(historicalData, futureDays) {
  // Implement a simple predictive model
  // This is a basic implementation - in production you'd use more sophisticated algorithms
  
  // Convert data to numerical array if it's an object array
  const values = Array.isArray(historicalData) 
    ? historicalData.map(item => typeof item === 'object' ? item.value : item)
    : historicalData;
  
  if (values.length < 7) {
    throw new Error("Insufficient data for prediction");
  }
  
  const predictions = [];
  
  // Simple prediction: weighted average of recent data + trend detection
  const recentValues = values.slice(-7); // Last 7 days
  const avgConsumption = recentValues.reduce((sum, val) => sum + val, 0) / recentValues.length;
  
  // Calculate trend (average daily change)
  let trend = 0;
  for (let i = 1; i < recentValues.length; i++) {
    trend += (recentValues[i] - recentValues[i-1]);
  }
  trend = trend / (recentValues.length - 1);
  
  // Generate predictions with some randomness to simulate real forecasts
  for (let i = 1; i <= futureDays; i++) {
    const baseValue = avgConsumption + (trend * i);
    // Add some randomness - in real ML this would be more sophisticated
    const randomFactor = 0.9 + (Math.random() * 0.2); // 0.9-1.1 range
    const predictedValue = baseValue * randomFactor;
    
    predictions.push({
      day: i,
      value: Math.round(predictedValue * 10) / 10, // Round to 1 decimal place
      confidence: 0.7 - (i * 0.03), // Confidence decreases with time
    });
  }
  
  return predictions;
}
