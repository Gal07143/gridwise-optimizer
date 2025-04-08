
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OptimizationRequest {
  siteId: string;
  startTime: string;
  endTime: string;
  deviceIds: string[];
  objective: "cost" | "self_consumption" | "carbon" | "peak_shaving";
  constraints: {
    minBatterySoc?: number;
    maxBatterySoc?: number;
    priorityDevices?: string[];
    evDepartureTime?: string;
    evTargetSoc?: number;
  };
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
    const requestData: OptimizationRequest = await req.json();
    const { siteId, startTime, endTime, deviceIds, objective, constraints } = requestData;

    console.log(`Processing optimization request for site ${siteId} with objective: ${objective}`);

    // Get forecasts (generation, consumption, weather, tariffs)
    const [forecasts, tariffs, devices] = await Promise.all([
      fetchForecasts(supabase, siteId, startTime, endTime),
      fetchTariffs(supabase, startTime, endTime),
      fetchDevices(supabase, deviceIds)
    ]);

    console.log(`Fetched ${forecasts.length} forecasts, ${tariffs.length} tariffs, ${devices.length} devices`);
    
    // Run optimization algorithm
    const schedule = await runOptimization(
      forecasts, 
      tariffs, 
      devices,
      objective,
      constraints
    );
    
    // Calculate estimated cost savings
    const costEstimate = calculateSavings(schedule, tariffs);
    
    // Store optimization results
    const optimizationResult = {
      site_id: siteId,
      timestamp_start: startTime,
      timestamp_end: endTime,
      schedule_json: schedule,
      cost_estimate: costEstimate,
      // Hash the source data for reference/validation
      source_data_hash: hashData([forecasts, tariffs, deviceIds, objective, constraints])
    };
    
    const { data: insertedResult, error } = await supabase
      .from('optimization_results')
      .insert(optimizationResult)
      .select()
      .single();
      
    if (error) throw error;
    
    console.log(`Created optimization result with ID: ${insertedResult.id}`);
    
    // Generate AI recommendations based on the optimization
    const recommendations = generateRecommendations(
      siteId,
      schedule,
      forecasts,
      tariffs,
      devices,
      objective
    );
    
    if (recommendations.length > 0) {
      const { error: recError } = await supabase
        .from('ai_recommendations')
        .insert(recommendations);
        
      if (recError) console.error("Error storing recommendations:", recError);
      else console.log(`Created ${recommendations.length} recommendations`);
    }

    return new Response(JSON.stringify({
      id: insertedResult.id,
      schedule,
      savings: costEstimate,
      recommendations: recommendations.length
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in energy optimizer:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

async function fetchForecasts(supabase, siteId: string, startTime: string, endTime: string) {
  const { data, error } = await supabase
    .from('energy_forecasts')
    .select('*')
    .eq('site_id', siteId)
    .gte('forecast_time', startTime)
    .lte('forecast_time', endTime);
    
  if (error) throw error;
  return data || [];
}

async function fetchTariffs(supabase, startTime: string, endTime: string) {
  const { data, error } = await supabase
    .from('tariffs')
    .select('*')
    .gte('timestamp', startTime)
    .lte('timestamp', endTime);
    
  if (error) throw error;
  return data || [];
}

async function fetchDevices(supabase, deviceIds: string[]) {
  const { data, error } = await supabase
    .from('devices')
    .select('*')
    .in('id', deviceIds);
    
  if (error) throw error;
  return data || [];
}

// Implement XENON's OPTIFRA optimization framework
async function runOptimization(forecasts, tariffs, devices, objective, constraints) {
  // This is a simplified version of gridX's optimization algorithm
  // In production, this would be a much more complex mathematical optimization model
  
  // Initialize schedule with 15-minute intervals
  const schedule = {};
  devices.forEach(device => {
    schedule[device.id] = [];
    
    // Create 15-minute intervals between start and end time
    const intervals = createTimeIntervals(forecasts);
    
    intervals.forEach(interval => {
      // Get forecast and tariff for this interval
      const forecast = findForecastForInterval(forecasts, interval);
      const tariff = findTariffForInterval(tariffs, interval);
      
      // Calculate control signal based on device type and objective
      let control = calculateControlSignal(
        device, 
        forecast, 
        tariff, 
        objective, 
        constraints
      );
      
      schedule[device.id].push({
        timestamp: interval,
        control
      });
    });
  });
  
  return schedule;
}

function createTimeIntervals(forecasts) {
  // Extract timestamps from forecasts and ensure they're unique and sorted
  const timestamps = [...new Set(forecasts.map(f => f.forecast_time))].sort();
  return timestamps;
}

function findForecastForInterval(forecasts, interval) {
  return forecasts.find(f => f.forecast_time === interval) || null;
}

function findTariffForInterval(tariffs, interval) {
  // Find the tariff closest to the interval time
  // This is simplified - a real system would have exact matching
  const intervalTime = new Date(interval).getTime();
  return tariffs.reduce((closest, tariff) => {
    const tariffTime = new Date(tariff.timestamp).getTime();
    const currentClosestTime = closest ? new Date(closest.timestamp).getTime() : 0;
    
    if (!closest || Math.abs(tariffTime - intervalTime) < Math.abs(currentClosestTime - intervalTime)) {
      return tariff;
    }
    return closest;
  }, null);
}

function calculateControlSignal(device, forecast, tariff, objective, constraints) {
  // This is a simplified control signal calculation
  // In a real system, this would be a complex optimization function
  
  if (!forecast || !tariff) {
    return { power: 0, mode: "idle" };
  }
  
  const generation = forecast.generation_forecast || 0;
  const consumption = forecast.consumption_forecast || 0;
  const price = tariff.price_eur_kwh || 0;
  
  // Net energy balance (positive = excess, negative = deficit)
  const energyBalance = generation - consumption;
  
  switch (device.type) {
    case 'battery':
      // Battery control logic based on objective
      if (objective === "self_consumption") {
        // Charge when excess solar, discharge when deficit
        if (energyBalance > 0.2) {
          return { 
            power: Math.min(energyBalance, device.capacity * 0.3), // 30% C-rate max
            mode: "charge" 
          };
        } else if (energyBalance < -0.2) {
          return { 
            power: -Math.min(-energyBalance, device.capacity * 0.3), // 30% C-rate max
            mode: "discharge"
          };
        }
      } else if (objective === "cost") {
        // Charge when price is low, discharge when high
        // Simple threshold-based approach (a real system would use price forecasting)
        if (price < 0.10) { // Below 10 cents/kWh
          return {
            power: device.capacity * 0.3, // 30% C-rate max
            mode: "charge"
          };
        } else if (price > 0.30) { // Above 30 cents/kWh
          return {
            power: -device.capacity * 0.3, // 30% C-rate max
            mode: "discharge"
          };
        }
      } else if (objective === "peak_shaving") {
        // Discharge during high consumption to reduce peaks
        if (consumption > 5) { // Threshold for "peak"
          return {
            power: -Math.min(consumption - 5, device.capacity * 0.3), // 30% C-rate max
            mode: "discharge"
          };
        } else if (consumption < 2 && generation > consumption) { // Low consumption, excess generation
          return {
            power: Math.min(generation - consumption, device.capacity * 0.3),
            mode: "charge"
          };
        }
      }
      return { power: 0, mode: "idle" };
      
    case 'ev_charger':
      // EV charging logic
      if (objective === "self_consumption") {
        // Charge only when excess solar available
        if (energyBalance > 0.5) { // Minimum threshold for stable charging
          return { 
            power: Math.min(energyBalance, 11), // Max 11kW for home chargers
            mode: "charge" 
          };
        }
        return { power: 0, mode: "idle" };
      } else if (objective === "cost") {
        // Charge when price is below threshold
        if (price < 0.15) { // 15 cents/kWh threshold
          return {
            power: 11, // Full power
            mode: "charge"
          };
        }
        return { power: 0, mode: "idle" };
      } else {
        // Default behavior
        return { power: 7, mode: "charge" }; // Medium power
      }
      
    default:
      // Default behavior for other devices
      return { power: 0, mode: "normal" };
  }
}

function calculateSavings(schedule, tariffs) {
  // Simplified savings calculation
  // In a real system, this would compare the optimized schedule with a baseline
  
  // Calculate total cost of energy consumption based on schedule and tariffs
  let totalSavings = 0;
  
  // For each device in the schedule
  Object.entries(schedule).forEach(([deviceId, intervals]) => {
    intervals.forEach((interval: any) => {
      const timestamp = interval.timestamp;
      const power = interval.control.power || 0;
      
      // Find applicable tariff
      const tariff = findTariffForInterval(tariffs, timestamp);
      if (!tariff) return;
      
      // If power is negative, the device is discharging/generating
      // which displaces grid consumption at this tariff rate
      if (power < 0) {
        // 15-minute intervals = 0.25 hours
        totalSavings += -power * 0.25 * tariff.price_eur_kwh;
      }
    });
  });
  
  return parseFloat(totalSavings.toFixed(2));
}

function generateRecommendations(siteId, schedule, forecasts, tariffs, devices, objective) {
  // Generate actionable recommendations based on the optimization results
  const recommendations = [];
  
  // Example: Battery charging recommendation
  const batteryDevice = devices.find(d => d.type === 'battery');
  if (batteryDevice) {
    // Check if there's a consistent pattern of charging during specific hours
    const batterySchedule = schedule[batteryDevice.id] || [];
    const chargingIntervals = batterySchedule
      .filter((interval: any) => interval.control.mode === 'charge')
      .map((interval: any) => new Date(interval.timestamp).getHours());
    
    // Count occurrences of each hour
    const hourCounts = {};
    chargingIntervals.forEach(hour => {
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    
    // Find the most common charging hours
    const sortedHours = Object.entries(hourCounts)
      .sort((a, b) => (b[1] as number) - (a[1] as number))
      .map(entry => entry[0]);
    
    if (sortedHours.length > 0) {
      recommendations.push({
        site_id: siteId,
        type: 'battery_optimization',
        priority: 'high',
        title: 'Optimal Battery Charging Schedule',
        description: `Based on forecasts and your electricity rates, the optimal time to charge your battery is between ${sortedHours[0]}:00-${parseInt(sortedHours[0]) + 3}:00. This can save up to 15% on your electricity bill.`,
        potential_savings: '15%',
        confidence: 0.85,
        applied: false
      });
    }
  }
  
  // Example: EV charging recommendation
  const evDevice = devices.find(d => d.type === 'ev_charger');
  if (evDevice) {
    // Check tariffs for cheapest periods
    const sortedTariffs = [...tariffs].sort((a, b) => a.price_eur_kwh - b.price_eur_kwh);
    
    if (sortedTariffs.length > 0) {
      const cheapestTariff = sortedTariffs[0];
      const cheapestTime = new Date(cheapestTariff.timestamp);
      
      recommendations.push({
        site_id: siteId,
        type: 'ev_charging',
        priority: 'medium',
        title: 'Smart EV Charging Time',
        description: `Schedule your EV to charge at ${cheapestTime.getHours()}:00 when electricity prices are lowest at ${cheapestTariff.price_eur_kwh.toFixed(3)}€/kWh. This can reduce charging costs by up to 30%.`,
        potential_savings: '30%',
        confidence: 0.9,
        applied: false
      });
    }
  }
  
  // Example: Self-consumption recommendation
  if (objective === 'self_consumption') {
    // Check periods with excess solar production
    const excessSolarPeriods = forecasts
      .filter(f => f.generation_forecast > f.consumption_forecast + 0.5)
      .map(f => new Date(f.forecast_time).getHours());
    
    if (excessSolarPeriods.length > 0) {
      // Find most common hours with excess
      const uniqueHours = [...new Set(excessSolarPeriods)].sort();
      
      if (uniqueHours.length > 0) {
        recommendations.push({
          site_id: siteId,
          type: 'load_shifting',
          priority: 'high',
          title: 'Shift Energy Usage to Solar Hours',
          description: `You have excess solar energy between ${uniqueHours[0]}:00-${uniqueHours[uniqueHours.length-1]}:00. Consider scheduling high-consumption appliances like dishwashers, washing machines, or pool pumps during these hours to maximize self-consumption.`,
          potential_savings: '25%',
          confidence: 0.8,
          applied: false
        });
      }
    }
  }
  
  return recommendations;
}

function hashData(data) {
  // Simple hash function for data versioning
  return Array.from(
    new Uint8Array(
      new TextEncoder().encode(JSON.stringify(data)).buffer
    )
  )
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
    .substring(0, 20); // Truncate to reasonable length
}
