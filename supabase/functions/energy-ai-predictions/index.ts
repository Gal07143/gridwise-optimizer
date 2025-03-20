
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

interface AIPredictionRequest {
  siteId?: string | null;
  days?: number;
  storeInDatabase?: boolean;
}

interface ConsumptionPrediction {
  date: string;
  consumption: number;
  confidence: number;
}

interface ProductionPrediction {
  date: string;
  production: number;
  solarProduction: number;
  windProduction: number;
  confidence: number;
  weather: {
    sunnyConditions: number;
    windyConditions: number;
  };
}

interface CostPrediction {
  date: string;
  importCost: number;
  exportRevenue: number;
  netCost: number;
  savings: number;
  selfConsumptionRate: string;
}

interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  type: string;
  priority: string;
  potentialSavings: string;
  confidence: number;
}

interface AIPredictionResponse {
  consumptionPredictions: ConsumptionPrediction[];
  productionPredictions: ProductionPrediction[];
  costPredictions: CostPrediction[];
  recommendations: AIRecommendation[];
  metadata: {
    days: number;
    generated: string;
    model_version: string;
  };
}

// Get site information
async function getSiteInfo(siteId: string): Promise<any> {
  try {
    if (!siteId) {
      // Get default site if no site ID provided
      const { data, error } = await supabase
        .rpc('get_default_site_id');
        
      if (error) throw error;
      siteId = data;
    }
    
    const { data, error } = await supabase
      .from('sites')
      .select('*')
      .eq('id', siteId)
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error getting site info:", error);
    return null;
  }
}

// Get previous consumption data to base predictions on
async function getPreviousConsumption(siteId: string): Promise<any[]> {
  try {
    // Get energy readings for devices in the site
    const { data: devices, error: devicesError } = await supabase
      .from('devices')
      .select('id')
      .eq('site_id', siteId);
      
    if (devicesError) throw devicesError;
    
    if (!devices || devices.length === 0) {
      console.log("No devices found for site:", siteId);
      return [];
    }
    
    const deviceIds = devices.map(d => d.id);
    
    // Get energy readings for these devices
    const { data: readings, error: readingsError } = await supabase
      .from('energy_readings')
      .select('*')
      .in('device_id', deviceIds)
      .order('timestamp', { ascending: false })
      .limit(100);
      
    if (readingsError) throw readingsError;
    
    return readings || [];
  } catch (error) {
    console.error("Error getting previous consumption:", error);
    return [];
  }
}

// Store AI predictions in the database
async function storePredictions(siteId: string, predictions: AIPredictionResponse): Promise<void> {
  try {
    console.log("Storing predictions for site:", siteId);
    
    // Store forecasts in energy_forecasts table
    for (const prediction of predictions.consumptionPredictions) {
      const forecastData = {
        site_id: siteId,
        forecast_time: new Date(prediction.date),
        consumption_forecast: prediction.consumption,
        generation_forecast: predictions.productionPredictions.find(p => p.date === prediction.date)?.production || 0,
        confidence: prediction.confidence,
        source: 'ai-prediction',
        timestamp: new Date()
      };
      
      const { error } = await supabase
        .from('energy_forecasts')
        .upsert(forecastData, { 
          onConflict: 'site_id,forecast_time' 
        });
        
      if (error) {
        console.error("Error storing forecast:", error);
      }
    }
    
    // Store recommendations in ai_recommendations table
    for (const recommendation of predictions.recommendations) {
      const recommendationData = {
        site_id: siteId,
        title: recommendation.title,
        description: recommendation.description,
        type: recommendation.type,
        priority: recommendation.priority,
        potential_savings: recommendation.potentialSavings,
        confidence: recommendation.confidence,
        created_at: new Date()
      };
      
      const { error } = await supabase
        .from('ai_recommendations')
        .insert(recommendationData);
        
      if (error) {
        console.error("Error storing recommendation:", error);
      }
    }
    
    console.log("Predictions storage completed");
  } catch (error) {
    console.error("Error in storePredictions:", error);
  }
}

// Generate realistic AI predictions
function generateAIPredictions(days: number, siteId: string, previousConsumption: any[]): AIPredictionResponse {
  console.log(`Generating ${days} days of predictions for site ${siteId}`);
  
  const startDate = new Date();
  const consumptionPredictions: ConsumptionPrediction[] = [];
  const productionPredictions: ProductionPrediction[] = [];
  const costPredictions: CostPrediction[] = [];
  
  // Use previous consumption data if available to make "smarter" predictions
  const hasHistoricalData = previousConsumption.length > 0;
  let avgConsumption = 15; // Default daily consumption in kWh
  
  if (hasHistoricalData) {
    // Calculate average consumption from historical data
    const totalConsumption = previousConsumption.reduce((sum, reading) => sum + reading.energy, 0);
    avgConsumption = totalConsumption / previousConsumption.length;
    console.log("Using average consumption from historical data:", avgConsumption);
  }
  
  // Generate day-by-day predictions
  for (let i = 0; i < days; i++) {
    const predictionDate = new Date(startDate);
    predictionDate.setDate(predictionDate.getDate() + i);
    const dateStr = predictionDate.toISOString().split('T')[0];
    
    // Weekend adjustment: weekend consumption is typically different
    const isWeekend = predictionDate.getDay() === 0 || predictionDate.getDay() === 6;
    const weekendFactor = isWeekend ? 0.8 : 1.1;
    
    // Time of year adjustment
    const month = predictionDate.getMonth();
    const seasonalFactor = month >= 5 && month <= 8 ? 1.2 : // Summer
                          month >= 9 && month <= 10 ? 0.9 : // Fall
                          month >= 11 || month <= 1 ? 1.3 : // Winter
                          1.0; // Spring
    
    // Add some randomness
    const randomFactor = 0.85 + Math.random() * 0.3;
    
    // Calculate daily consumption prediction
    const dailyConsumption = avgConsumption * weekendFactor * seasonalFactor * randomFactor;
    
    // Consumption prediction
    consumptionPredictions.push({
      date: dateStr,
      consumption: parseFloat(dailyConsumption.toFixed(2)),
      confidence: parseFloat((0.85 + Math.random() * 0.1).toFixed(2))
    });
    
    // Weather-based factors for production
    const sunnyConditions = parseFloat((0.4 + Math.random() * 0.6).toFixed(2));
    const windyConditions = parseFloat((0.2 + Math.random() * 0.7).toFixed(2));
    
    // Solar production is higher in summer, lower in winter
    const solarSeasonalFactor = month >= 5 && month <= 8 ? 1.4 : // Summer
                              month >= 9 && month <= 10 ? 0.8 : // Fall
                              month >= 11 || month <= 1 ? 0.5 : // Winter
                              1.1; // Spring
    
    // Calculate production components
    const solarProduction = 6.0 * sunnyConditions * solarSeasonalFactor;
    const windProduction = 3.5 * windyConditions;
    const totalProduction = solarProduction + windProduction;
    
    // Production prediction
    productionPredictions.push({
      date: dateStr,
      production: parseFloat(totalProduction.toFixed(2)),
      solarProduction: parseFloat(solarProduction.toFixed(2)),
      windProduction: parseFloat(windProduction.toFixed(2)),
      confidence: parseFloat((0.8 + Math.random() * 0.15).toFixed(2)),
      weather: {
        sunnyConditions,
        windyConditions
      }
    });
    
    // Calculate costs based on consumption, production, and typical energy prices
    const importRate = 0.25; // $/kWh for grid import
    const exportRate = 0.10; // $/kWh for grid export
    
    // Calculate cost components
    const netConsumption = Math.max(0, dailyConsumption - totalProduction);
    const netProduction = Math.max(0, totalProduction - dailyConsumption);
    const importCost = netConsumption * importRate;
    const exportRevenue = netProduction * exportRate;
    const netCost = importCost - exportRevenue;
    
    // Calculate what the cost would have been without own production
    const noProductionCost = dailyConsumption * importRate;
    const savings = noProductionCost - netCost;
    
    // Calculate self-consumption rate
    const selfConsumption = totalProduction > 0 
      ? Math.min(dailyConsumption, totalProduction) / totalProduction 
      : 0;
    
    // Cost prediction
    costPredictions.push({
      date: dateStr,
      importCost: parseFloat(importCost.toFixed(2)),
      exportRevenue: parseFloat(exportRevenue.toFixed(2)),
      netCost: parseFloat(netCost.toFixed(2)),
      savings: parseFloat(savings.toFixed(2)),
      selfConsumptionRate: `${(selfConsumption * 100).toFixed(1)}%`
    });
  }
  
  // Generate AI recommendations based on the prediction patterns
  const recommendations: AIRecommendation[] = [];
  
  // Calculate average self-consumption rate
  const avgSelfConsumption = costPredictions.reduce(
    (sum, cost) => sum + parseFloat(cost.selfConsumptionRate.replace('%', '')), 
    0
  ) / costPredictions.length;
  
  // Calculate average net cost
  const avgNetCost = costPredictions.reduce((sum, cost) => sum + cost.netCost, 0) / costPredictions.length;
  
  // Only add recommendations if there's enough data to analyze
  if (consumptionPredictions.length > 0) {
    // Add recommendation about self-consumption if it's low
    if (avgSelfConsumption < 70) {
      recommendations.push({
        id: crypto.randomUUID(),
        title: "Improve Self-Consumption Rate",
        description: "Your system is exporting a significant amount of energy back to the grid. " +
                    "Consider shifting some consumption to times of high production.",
        type: "optimization",
        priority: avgSelfConsumption < 50 ? "high" : "medium",
        potentialSavings: `$${(avgNetCost * 0.2 * 30).toFixed(2)}/month`,
        confidence: 0.85
      });
    }
    
    // Add recommendation about battery if consumption and production patterns suggest it would help
    const hasEveningConsumption = Math.random() > 0.5; // Simplified for demo
    if (hasEveningConsumption) {
      recommendations.push({
        id: crypto.randomUUID(),
        title: "Battery Storage Opportunity",
        description: "Your consumption pattern shows significant evening usage when solar production is low. " +
                    "A battery system could store excess daytime production for evening use.",
        type: "system",
        priority: "medium",
        potentialSavings: `$${(avgNetCost * 0.4 * 30).toFixed(2)}/month`,
        confidence: 0.78
      });
    }
    
    // Always add an energy efficiency recommendation (common for all patterns)
    recommendations.push({
      id: crypto.randomUUID(),
      title: "Schedule High-Consumption Activities",
      description: "Schedule your high-energy activities like laundry and dishwashing during peak solar hours " +
                  "to maximize direct use of your renewable energy.",
      type: "behavioral",
      priority: "low",
      potentialSavings: `$${(avgNetCost * 0.1 * 30).toFixed(2)}/month`,
      confidence: 0.92
    });
    
    // Add a maintenance recommendation if applicable
    if (Math.random() > 0.7) { // 30% chance to suggest maintenance
      recommendations.push({
        id: crypto.randomUUID(),
        title: "Solar Panel Cleaning",
        description: "Your solar production appears to be lower than expected. " +
                    "Consider cleaning your solar panels to improve efficiency.",
        type: "maintenance",
        priority: "medium",
        potentialSavings: `$${(avgNetCost * 0.15 * 30).toFixed(2)}/month`,
        confidence: 0.75
      });
    }
  }
  
  return {
    consumptionPredictions,
    productionPredictions,
    costPredictions,
    recommendations,
    metadata: {
      days,
      generated: new Date().toISOString(),
      model_version: "1.0.0-beta"
    }
  };
}

// Main server handler
serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Parse request parameters
    const { siteId, days = 7, storeInDatabase = true } = await req.json() as AIPredictionRequest;
    console.log("Request params:", { siteId, days, storeInDatabase });
    
    // Get site information
    const site = await getSiteInfo(siteId);
    
    if (!site) {
      throw new Error("Site not found");
    }
    
    // Get previous consumption data to make more accurate predictions
    const previousConsumption = await getPreviousConsumption(site.id);
    
    // Generate AI predictions
    const predictions = generateAIPredictions(days, site.id, previousConsumption);
    
    // Store predictions in database if requested
    if (storeInDatabase) {
      await storePredictions(site.id, predictions);
    }
    
    // Return predictions
    return new Response(JSON.stringify(predictions), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    console.error("Error generating AI predictions:", error);
    
    return new Response(JSON.stringify({
      error: error.message || "An error occurred while generating predictions"
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    });
  }
});
