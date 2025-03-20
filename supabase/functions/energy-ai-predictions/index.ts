
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
 * Generate energy consumption predictions based on historical data
 * This is a simplified model for demo purposes; in production, more sophisticated ML models would be used
 */
const generateConsumptionPredictions = async (siteId: string | null, days: number = 7) => {
  try {
    console.log(`Generating consumption predictions for site ${siteId || 'all'} for ${days} days`);
    
    // Get historical energy readings
    let query = supabase.from('energy_readings');
    
    if (siteId) {
      query = query.eq('site_id', siteId);
    }
    
    const { data: historicalData, error } = await query
      .select('timestamp, energy')
      .order('timestamp', { ascending: false })
      .limit(days * 24); // Get data for the specified number of days
    
    if (error) {
      console.error("Error fetching historical data:", error.message);
      throw new Error(`Failed to fetch historical data: ${error.message}`);
    }
    
    // Generate predictions using a simple pattern
    const now = new Date();
    const predictions = [];
    
    for (let i = 1; i <= days; i++) {
      const forecastDate = new Date(now);
      forecastDate.setDate(now.getDate() + i);
      
      // Find historical data from same day of week for pattern matching
      const dayOfWeek = forecastDate.getDay();
      const similarDays = historicalData?.filter(reading => {
        const readingDate = new Date(reading.timestamp);
        return readingDate.getDay() === dayOfWeek;
      }) || [];
      
      // Calculate average consumption for similar days
      let baseConsumption = 10; // Default if no historical data
      if (similarDays.length > 0) {
        baseConsumption = similarDays.reduce((sum, day) => sum + (day.energy || 0), 0) / similarDays.length;
      }
      
      // Add some variance
      const variance = (Math.random() * 0.4) - 0.2; // +/- 20%
      const predictedConsumption = baseConsumption * (1 + variance);
      
      // Calculate a confidence score (simplified)
      const confidence = Math.min(0.95, 0.6 + (similarDays.length * 0.05));
      
      predictions.push({
        date: forecastDate.toISOString().split('T')[0],
        consumption: Number(predictedConsumption.toFixed(2)),
        confidence: Number(confidence.toFixed(2))
      });
    }
    
    return predictions;
  } catch (error) {
    console.error("Error generating consumption predictions:", error);
    throw error;
  }
};

/**
 * Generate energy production predictions based on weather forecasts
 * This is a simplified model for demo purposes
 */
const generateProductionPredictions = async (siteId: string | null, days: number = 7) => {
  try {
    console.log(`Generating production predictions for site ${siteId || 'all'} for ${days} days`);
    
    // In a real system, we would get actual weather forecasts here
    // For this demo, we'll simulate with random values
    
    // Get site details to determine generation capacity
    let totalSolarCapacity = 10; // Default in kW
    let totalWindCapacity = 5; // Default in kW
    
    if (siteId) {
      const { data: siteDevices, error } = await supabase
        .from('devices')
        .select('type, capacity')
        .eq('site_id', siteId);
      
      if (error) {
        console.error("Error fetching site devices:", error.message);
      } else if (siteDevices && siteDevices.length > 0) {
        totalSolarCapacity = siteDevices
          .filter(device => device.type === 'solar')
          .reduce((sum, device) => sum + (device.capacity || 0), 0);
        
        totalWindCapacity = siteDevices
          .filter(device => device.type === 'wind')
          .reduce((sum, device) => sum + (device.capacity || 0), 0);
      }
    }
    
    const now = new Date();
    const predictions = [];
    
    for (let i = 1; i <= days; i++) {
      const forecastDate = new Date(now);
      forecastDate.setDate(now.getDate() + i);
      
      // Simulate weather conditions (0-1 scale)
      const sunnyConditions = 0.3 + (Math.random() * 0.7); // 0.3-1.0
      const windyConditions = Math.random() * 0.8; // 0-0.8
      
      // Calculate production based on capacity and weather
      const solarProduction = totalSolarCapacity * sunnyConditions;
      const windProduction = totalWindCapacity * windyConditions;
      const totalProduction = solarProduction + windProduction;
      
      // Confidence decreases with days into the future
      const confidence = Math.max(0.5, 0.9 - (i * 0.05));
      
      predictions.push({
        date: forecastDate.toISOString().split('T')[0],
        production: Number(totalProduction.toFixed(2)),
        solarProduction: Number(solarProduction.toFixed(2)),
        windProduction: Number(windProduction.toFixed(2)),
        confidence: Number(confidence.toFixed(2)),
        weather: {
          sunnyConditions: Number(sunnyConditions.toFixed(2)),
          windyConditions: Number(windyConditions.toFixed(2))
        }
      });
    }
    
    return predictions;
  } catch (error) {
    console.error("Error generating production predictions:", error);
    throw error;
  }
};

/**
 * Generate energy cost and savings predictions
 */
const generateCostPredictions = async (
  consumptionPredictions: any[],
  productionPredictions: any[],
  siteId: string | null
) => {
  try {
    console.log("Generating cost predictions based on consumption and production");
    
    // In a real system, we would get actual energy tariffs here
    // For this demo, we'll use fixed values
    const importRate = 0.18; // $/kWh
    const exportRate = 0.08; // $/kWh
    
    const costPredictions = [];
    
    for (let i = 0; i < consumptionPredictions.length; i++) {
      const date = consumptionPredictions[i].date;
      const consumption = consumptionPredictions[i].consumption;
      const production = productionPredictions[i]?.production || 0;
      
      // Calculate grid import/export
      const netEnergy = production - consumption;
      const gridImport = netEnergy < 0 ? Math.abs(netEnergy) : 0;
      const gridExport = netEnergy > 0 ? netEnergy : 0;
      
      // Calculate costs and savings
      const importCost = gridImport * importRate;
      const exportRevenue = gridExport * exportRate;
      const netCost = importCost - exportRevenue;
      
      // Calculate savings compared to no solar/wind
      const noRenewablesCost = consumption * importRate;
      const savings = noRenewablesCost - netCost;
      
      costPredictions.push({
        date,
        importCost: Number(importCost.toFixed(2)),
        exportRevenue: Number(exportRevenue.toFixed(2)),
        netCost: Number(netCost.toFixed(2)),
        savings: Number(savings.toFixed(2)),
        selfConsumptionRate: consumption > 0 
          ? Number(Math.min(production, consumption) / consumption * 100).toFixed(1) 
          : "0"
      });
    }
    
    return costPredictions;
  } catch (error) {
    console.error("Error generating cost predictions:", error);
    throw error;
  }
};

/**
 * Generate AI-powered optimization recommendations
 */
const generateRecommendations = async (
  consumptionPredictions: any[],
  productionPredictions: any[],
  costPredictions: any[],
  siteId: string | null
) => {
  try {
    console.log("Generating AI recommendations");
    
    // Get device information
    let batteries = [];
    let hasBattery = false;
    let hasFlexibleLoads = false;
    
    if (siteId) {
      const { data: devices, error } = await supabase
        .from('devices')
        .select('*')
        .eq('site_id', siteId);
      
      if (error) {
        console.error("Error fetching devices:", error.message);
      } else if (devices) {
        batteries = devices.filter(device => device.type === 'battery');
        hasBattery = batteries.length > 0;
        
        // Check for controllable/flexible loads
        hasFlexibleLoads = devices.some(device => 
          device.type === 'load' && device.metrics?.controllable === true
        );
      }
    }
    
    const recommendations = [];
    
    // Analyze production/consumption patterns
    const totalConsumption = consumptionPredictions.reduce((sum, day) => sum + day.consumption, 0);
    const totalProduction = productionPredictions.reduce((sum, day) => sum + day.production, 0);
    const productionRatio = totalProduction / totalConsumption;
    
    // Battery recommendations
    if (hasBattery) {
      recommendations.push({
        id: "rec-battery-1",
        title: "Optimize Battery Charging Schedule",
        description: "Based on predicted solar production peaks, adjust battery charging to maximize self-consumption",
        type: "optimization",
        priority: productionRatio > 1 ? "high" : "medium",
        potentialSavings: "$28 - $42 per month",
        confidence: 0.85
      });
    } else if (productionRatio > 1.2) {
      recommendations.push({
        id: "rec-battery-2",
        title: "Consider Battery Storage",
        description: "You're generating significantly more energy than consuming. A battery system could increase self-consumption by up to 60%",
        type: "system",
        priority: "medium",
        potentialSavings: "$75 - $120 per month",
        confidence: 0.78
      });
    }
    
    // Load shifting recommendations
    if (hasFlexibleLoads) {
      recommendations.push({
        id: "rec-load-1",
        title: "Shift Flexible Loads",
        description: "Shift controllable loads to periods of high production to increase self-consumption",
        type: "behavioral",
        priority: "medium",
        potentialSavings: "$15 - $30 per month",
        confidence: 0.82
      });
    }
    
    // General recommendations
    const averageSelfConsumption = costPredictions.reduce(
      (sum, day) => sum + parseFloat(day.selfConsumptionRate), 0
    ) / costPredictions.length;
    
    if (averageSelfConsumption < 70) {
      recommendations.push({
        id: "rec-consumption-1",
        title: "Improve Self-Consumption",
        description: `Your predicted self-consumption rate is ${averageSelfConsumption.toFixed(1)}%. Consider scheduling energy-intensive activities during peak production hours.`,
        type: "behavioral",
        priority: "high",
        potentialSavings: "$20 - $50 per month",
        confidence: 0.9
      });
    }
    
    // Maintenance recommendations (simplified)
    recommendations.push({
      id: "rec-maintenance-1",
      title: "Schedule Preventive Maintenance",
      description: "Regular maintenance can increase system efficiency by 5-10%",
      type: "maintenance",
      priority: "low",
      potentialSavings: "$10 - $25 per month",
      confidence: 0.95
    });
    
    return recommendations;
  } catch (error) {
    console.error("Error generating recommendations:", error);
    throw error;
  }
};

/**
 * Store predictions in the database
 */
const storePredictions = async (
  siteId: string | null,
  consumptionPredictions: any[],
  productionPredictions: any[]
) => {
  try {
    if (!siteId) {
      console.log("No site ID provided, skipping database storage");
      return;
    }
    
    console.log(`Storing predictions for site ${siteId} in database`);
    
    const forecasts = [];
    
    // Combine consumption and production predictions
    for (let i = 0; i < consumptionPredictions.length; i++) {
      const forecastDate = new Date(consumptionPredictions[i].date);
      
      // Create a forecast for each hour of the day
      for (let hour = 0; hour < 24; hour++) {
        const forecastDateTime = new Date(forecastDate);
        forecastDateTime.setHours(hour, 0, 0, 0);
        
        // Scale values based on typical daily patterns
        const hourFactor = getHourlyFactor(hour);
        
        forecasts.push({
          site_id: siteId,
          forecast_time: forecastDateTime.toISOString(),
          consumption_forecast: consumptionPredictions[i].consumption * hourFactor.consumption / 24,
          generation_forecast: productionPredictions[i].production * hourFactor.production / 24,
          confidence: (consumptionPredictions[i].confidence + productionPredictions[i].confidence) / 2,
          source: 'ai_model',
          created_at: new Date().toISOString()
        });
      }
    }
    
    // Store in database
    if (forecasts.length > 0) {
      const { error } = await supabase
        .from('energy_forecasts')
        .upsert(forecasts, { 
          onConflict: 'site_id,forecast_time',
          ignoreDuplicates: false
        });
      
      if (error) {
        console.error("Error storing forecasts:", error.message);
        throw new Error(`Failed to store forecasts: ${error.message}`);
      }
      
      console.log(`Successfully stored ${forecasts.length} forecast data points`);
    }
  } catch (error) {
    console.error("Error storing predictions:", error);
    // Don't throw here, we don't want to fail the entire request
  }
};

/**
 * Get hourly factors for consumption and production patterns
 */
const getHourlyFactor = (hour: number) => {
  // These patterns represent typical daily variations
  // - Consumption typically peaks in morning and evening
  // - Production peaks around midday (solar)
  
  const consumptionPattern = [
    0.6, 0.5, 0.4, 0.4, 0.5, 0.7, // 0-5 (midnight to 5am)
    1.0, 1.5, 1.8, 1.5, 1.3, 1.2, // 6-11 (6am to 11am)
    1.1, 1.2, 1.3, 1.4, 1.6, 1.8, // 12-17 (noon to 5pm)
    2.0, 1.8, 1.5, 1.2, 0.9, 0.7  // 18-23 (6pm to 11pm)
  ];
  
  const productionPattern = [
    0.0, 0.0, 0.0, 0.0, 0.0, 0.1, // 0-5 (midnight to 5am)
    0.3, 0.7, 1.2, 1.8, 2.3, 2.7, // 6-11 (6am to 11am)
    3.0, 3.0, 2.8, 2.3, 1.7, 1.0, // 12-17 (noon to 5pm)
    0.4, 0.1, 0.0, 0.0, 0.0, 0.0  // 18-23 (6pm to 11pm)
  ];
  
  return {
    consumption: consumptionPattern[hour] || 1.0,
    production: productionPattern[hour] || 1.0
  };
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  // Get function parameters from request body
  try {
    // Get request parameters
    const { siteId, days = 7, storeInDatabase = true } = await req.json();
    
    console.log(`Processing AI predictions request: siteId=${siteId}, days=${days}, store=${storeInDatabase}`);
    
    // Generate predictions
    const consumptionPredictions = await generateConsumptionPredictions(siteId, days);
    const productionPredictions = await generateProductionPredictions(siteId, days);
    const costPredictions = await generateCostPredictions(
      consumptionPredictions, 
      productionPredictions, 
      siteId
    );
    const recommendations = await generateRecommendations(
      consumptionPredictions,
      productionPredictions,
      costPredictions,
      siteId
    );
    
    // Store predictions in database if requested
    if (storeInDatabase) {
      await storePredictions(siteId, consumptionPredictions, productionPredictions);
    }
    
    // Return predictions and recommendations
    return new Response(
      JSON.stringify({
        consumptionPredictions,
        productionPredictions,
        costPredictions,
        recommendations,
        metadata: {
          days,
          generated: new Date().toISOString(),
          model_version: "1.0.0"
        }
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
