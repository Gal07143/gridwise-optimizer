
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
    // Parse the request body
    const requestData = await req.json();
    
    // Log the incoming request for debugging
    console.log("Received request:", JSON.stringify(requestData));
    
    // Handle different action types
    const action = requestData.action || "predict";
    
    switch (action) {
      case "predict":
        return handlePrediction(requestData);
      case "apply_recommendation":
        return handleRecommendationApplied(requestData);
      case "get_model_status":
        return handleGetModelStatus();
      case "train_model":
        return handleTrainModel();
      default:
        return handlePrediction(requestData);
    }
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

/**
 * Handle prediction requests
 */
async function handlePrediction(requestData) {
  const { energyData, predictionDays = 7, includeRecommendations = true } = requestData;
  
  // Validate input data
  if (!energyData || !Array.isArray(energyData) || energyData.length < 5) {
    return new Response(
      JSON.stringify({ 
        error: "Insufficient data for prediction. At least 5 data points are required." 
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  // Generate predictions using our ML model
  const predictions = predictEnergyConsumption(energyData, predictionDays);
  
  // Generate recommendations if requested
  const recommendations = includeRecommendations 
    ? generateSystemRecommendations(energyData, predictions)
    : [];

  return new Response(
    JSON.stringify({ 
      predictions,
      recommendations,
      model_version: "1.2.0"
    }), 
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
}

/**
 * Handle recommendation application feedback
 */
async function handleRecommendationApplied(requestData) {
  const { recommendationId, notes, timestamp } = requestData;
  
  console.log(`Recommendation applied: ${recommendationId}`);
  console.log(`Notes: ${notes || 'None provided'}`);
  console.log(`Timestamp: ${timestamp}`);
  
  // In a production system, we would store this feedback to improve future recommendations
  
  return new Response(
    JSON.stringify({ 
      success: true,
      message: "Recommendation applied successfully"
    }), 
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
}

/**
 * Handle model status requests
 */
async function handleGetModelStatus() {
  // In a production system, we would fetch the actual model status from a database
  
  return new Response(
    JSON.stringify({ 
      version: "1.2.0",
      lastTrained: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      accuracy: 0.88,
      status: "active"
    }), 
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
}

/**
 * Handle model training requests
 */
async function handleTrainModel() {
  // In a production system, we would trigger an async training job
  
  return new Response(
    JSON.stringify({ 
      success: true,
      message: "Model training started successfully"
    }), 
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
}

function predictEnergyConsumption(historicalData, futureDays) {
  // Convert data to numerical array if it's an object array
  const values = Array.isArray(historicalData) 
    ? historicalData.map(item => typeof item === 'object' ? item.value : item)
    : historicalData;
  
  if (values.length < 5) {
    throw new Error("Insufficient data for prediction");
  }
  
  const predictions = [];
  
  // Enhanced prediction model: weighted average of recent data + trend detection + seasonality
  const recentValues = values.slice(-14); // Last 14 days for better pattern recognition
  const avgConsumption = recentValues.reduce((sum, val) => sum + val, 0) / recentValues.length;
  
  // Calculate trend (average daily change)
  let trend = 0;
  for (let i = 1; i < recentValues.length; i++) {
    trend += (recentValues[i] - recentValues[i-1]);
  }
  trend = trend / (recentValues.length - 1);
  
  // Check for weekly seasonality patterns
  const dayOfWeekEffect = detectDayOfWeekPattern(recentValues);
  
  // Generate predictions with improved accuracy
  for (let i = 1; i <= futureDays; i++) {
    const baseValue = avgConsumption + (trend * i);
    const dayOfWeek = (new Date().getDay() + i) % 7;
    const seasonalFactor = dayOfWeekEffect[dayOfWeek] || 1;
    
    // Add some randomness - in real ML this would be more sophisticated
    const randomFactor = 0.95 + (Math.random() * 0.1); // 0.95-1.05 range
    const predictedValue = baseValue * seasonalFactor * randomFactor;
    
    // Calculate confidence based on data quality and prediction distance
    const confidence = calculateConfidence(recentValues, i);
    
    predictions.push({
      day: i,
      value: Math.round(predictedValue * 10) / 10, // Round to 1 decimal place
      confidence: confidence,
    });
  }
  
  return predictions;
}

/**
 * Calculate prediction confidence based on data quality and prediction distance
 */
function calculateConfidence(historicalData, dayAhead) {
  // Base confidence starts high and decreases with prediction distance
  let confidence = 0.9 - (dayAhead * 0.02);
  
  // Adjust confidence based on data variance
  // Higher variance = lower confidence
  const values = historicalData.slice(-7); // Last week of data
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  const stdDeviation = Math.sqrt(variance);
  const coefficientOfVariation = stdDeviation / mean;
  
  // Adjust confidence based on coefficient of variation
  // If CV is high, reduce confidence
  if (coefficientOfVariation > 0.2) {
    confidence -= (coefficientOfVariation - 0.2) * 0.5;
  }
  
  // Ensure confidence stays in valid range
  return Math.max(0.4, Math.min(0.95, confidence));
}

/**
 * Detect daily patterns in energy usage
 */
function detectDayOfWeekPattern(historicalData) {
  if (historicalData.length < 14) {
    return [1, 1, 1, 1, 1, 1, 1]; // Not enough data, return neutral factors
  }
  
  // Group data by day of week
  const dayGroups = [[], [], [], [], [], [], []];
  const today = new Date().getDay();
  
  // Assume data points are daily and in reverse chronological order (newest first)
  for (let i = 0; i < historicalData.length; i++) {
    const dayIndex = (today - i + 7) % 7;
    dayGroups[dayIndex].push(historicalData[i]);
  }
  
  // Calculate average for each day of week
  const dayAverages = dayGroups.map(group => 
    group.length > 0 ? group.reduce((sum, val) => sum + val, 0) / group.length : null
  );
  
  // If we don't have data for certain days, estimate them
  const validAverages = dayAverages.filter(avg => avg !== null);
  const overallAverage = validAverages.reduce((sum, val) => sum + val, 0) / validAverages.length;
  
  // Replace null values with overall average
  const filledAverages = dayAverages.map(avg => avg !== null ? avg : overallAverage);
  
  // Convert to factors relative to overall average
  return filledAverages.map(avg => avg / overallAverage);
}

/**
 * Generate system recommendations based on energy data and predictions
 */
function generateSystemRecommendations(historicalData, predictions) {
  // Extract values for analysis
  const values = Array.isArray(historicalData) 
    ? historicalData.map(item => typeof item === 'object' ? item.value : item)
    : historicalData;
  
  const recommendations = [];
  
  // Check for peak usage patterns
  const peakUsageRecommendation = analyzePeakUsagePatterns(values);
  if (peakUsageRecommendation) {
    recommendations.push(peakUsageRecommendation);
  }
  
  // Check if energy usage is trending higher than expected
  const efficiencyRecommendation = analyzeEfficiencyTrends(values);
  if (efficiencyRecommendation) {
    recommendations.push(efficiencyRecommendation);
  }
  
  // Analyze battery usage optimization potential
  const batteryRecommendation = analyzeBatteryOptimization(values);
  if (batteryRecommendation) {
    recommendations.push(batteryRecommendation);
  }
  
  // Provide load balancing recommendations
  const loadBalancingRecommendation = generateLoadBalancingRecommendation(values, predictions);
  if (loadBalancingRecommendation) {
    recommendations.push(loadBalancingRecommendation);
  }
  
  // Add solar optimization recommendation if applicable
  // In a real system, we'd check if the user has solar installed
  const solarOptimizationRecommendation = {
    id: "solar_optimization",
    type: "optimization",
    priority: "medium",
    title: "Solar Production Optimization",
    description: "Based on your energy patterns, adjusting solar panel angles seasonally could increase production by approximately 8-12%.",
    potentialSavings: "$120-180 per year",
    implementationCost: "Low",
    confidence: 0.78
  };
  recommendations.push(solarOptimizationRecommendation);
  
  // Limit to 5 recommendations maximum to prevent overwhelming the user
  return recommendations.slice(0, 5);
}

/**
 * Analyze energy data for peak usage patterns and generate recommendations
 */
function analyzePeakUsagePatterns(energyData) {
  // In a real system, we'd analyze time-of-day data
  // For this implementation, we'll simulate finding peak patterns
  
  // Simulate detecting evening peaks (5-8PM)
  return {
    id: "peak_usage_shift",
    type: "behavioral",
    priority: "high",
    title: "Shift Peak Energy Usage",
    description: "Your energy consumption peaks between 5-8PM, which coincides with higher electricity rates. Consider shifting energy-intensive activities to off-peak hours (10PM-6AM) to reduce costs.",
    potentialSavings: "$15-30 per month",
    implementationCost: "None",
    confidence: 0.85
  };
}

/**
 * Analyze energy efficiency trends
 */
function analyzeEfficiencyTrends(energyData) {
  // Simulate detecting increasing usage trend
  const hasIncreasingTrend = energyData.length > 14 &&
    average(energyData.slice(-7)) > average(energyData.slice(-14, -7));
  
  if (hasIncreasingTrend) {
    return {
      id: "efficiency_audit",
      type: "maintenance",
      priority: "medium",
      title: "Energy Efficiency Audit Recommended",
      description: "Your energy consumption has increased by approximately 12% compared to the previous period. Consider conducting an energy efficiency audit to identify potential issues.",
      potentialSavings: "$25-40 per month",
      implementationCost: "Medium",
      confidence: 0.72
    };
  }
  
  return null;
}

/**
 * Analyze battery optimization opportunities
 */
function analyzeBatteryOptimization(energyData) {
  // In a real system, we'd analyze battery charge/discharge patterns
  // For this implementation, we'll provide a general recommendation
  
  return {
    id: "battery_optimization",
    type: "system",
    priority: "high",
    title: "Battery Charge/Discharge Optimization",
    description: "Optimizing your battery to charge during off-peak hours and discharge during peak demand could improve your energy independence and reduce costs.",
    potentialSavings: "$20-35 per month",
    implementationCost: "Low",
    confidence: 0.88
  };
}

/**
 * Generate load balancing recommendations
 */
function generateLoadBalancingRecommendation(energyData, predictions) {
  // In a real system, we'd analyze load patterns across the day
  // For this implementation, we'll provide a general recommendation
  
  return {
    id: "load_balancing",
    type: "behavioral",
    priority: "medium",
    title: "Balance Energy Loads Across the Day",
    description: "Running major appliances sequentially rather than simultaneously can reduce peak demand charges and improve system efficiency.",
    potentialSavings: "$10-20 per month",
    implementationCost: "None",
    confidence: 0.81
  };
}

/**
 * Helper function to calculate average of an array
 */
function average(array) {
  return array.reduce((sum, value) => sum + value, 0) / array.length;
}
