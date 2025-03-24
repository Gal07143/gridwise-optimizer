
import { supabase } from "@/lib/supabase";

export interface EnergyPrediction {
  id: string;
  site_id: string;
  prediction_time: string;
  predicted_consumption: number;
  predicted_generation: number;
  confidence: number;
  created_at: string;
  model_version?: string;
}

export interface SystemRecommendation {
  id: string;
  title: string;
  description: string;
  type: 'optimization' | 'maintenance' | 'behavioral' | 'system';
  priority: 'low' | 'medium' | 'high';
  confidence: number;
  potentialSavings: string;
  implementationCost: string;
  applied: boolean;
  applied_at?: string;
  applied_by?: string;
}

// Get energy predictions for a site
export async function getEnergyPredictions(
  siteId: string,
  days: number = 7
): Promise<EnergyPrediction[]> {
  try {
    // In a real app, we'd fetch from Supabase
    // For demo, we'll create sample predictions
    const predictions: EnergyPrediction[] = [];
    
    const now = new Date();
    for (let i = 0; i < days; i++) {
      const predictionDate = new Date(now);
      predictionDate.setDate(now.getDate() + i);
      
      predictions.push({
        id: `pred-${i}`,
        site_id: siteId,
        prediction_time: predictionDate.toISOString(),
        predicted_consumption: 30 + (Math.random() * 20), // 30-50 kWh
        predicted_generation: i < 5 ? 25 + (Math.random() * 15) : 0, // 25-40 kWh, zero for far future
        confidence: 95 - (i * 5), // Confidence decreases with time
        created_at: new Date().toISOString(),
        model_version: "v1.0.2"
      });
    }
    
    return predictions;
  } catch (error) {
    console.error('Error fetching energy predictions:', error);
    throw error;
  }
}

// Get system recommendations
export async function getSystemRecommendations(
  siteId?: string
): Promise<SystemRecommendation[]> {
  try {
    // In a real app, fetch from Supabase
    // For demo, return sample recommendations
    const recommendations: SystemRecommendation[] = [
      {
        id: "rec-1",
        title: "Optimize Battery Charging Schedule",
        description: "Shift battery charging to off-peak hours (10 PM - 6 AM) to reduce energy costs by utilizing lower electricity rates.",
        type: "optimization",
        priority: "high",
        confidence: 0.92,
        potentialSavings: "$75/month",
        implementationCost: "No cost",
        applied: false
      },
      {
        id: "rec-2",
        title: "Solar Panel Cleaning Recommended",
        description: "Solar panels are showing a 12% decrease in efficiency. A cleaning is recommended to restore optimal performance.",
        type: "maintenance",
        priority: "medium",
        confidence: 0.85,
        potentialSavings: "$45/month",
        implementationCost: "$120 one-time",
        applied: false
      },
      {
        id: "rec-3",
        title: "Reduce HVAC Usage During Peak Hours",
        description: "Pre-cool your building before peak hours (2 PM - 6 PM) and raise the temperature setting by 2°F during those hours.",
        type: "behavioral",
        priority: "medium",
        confidence: 0.78,
        potentialSavings: "$60/month",
        implementationCost: "No cost",
        applied: false
      }
    ];
    
    return recommendations;
  } catch (error) {
    console.error('Error fetching system recommendations:', error);
    throw error;
  }
}

// Apply a recommendation
export async function applyRecommendation(
  recommendationId: string,
  notes?: string
): Promise<boolean> {
  try {
    // In a real app, we'd update the database
    console.log(`Applied recommendation ${recommendationId} with notes: ${notes || 'None'}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return true;
  } catch (error) {
    console.error('Error applying recommendation:', error);
    throw error;
  }
}

// Calculate prediction data for charts
export interface PredictionDataPoint {
  day: string;
  value: number;
  confidence: number;
}

export function generatePredictionData(daysToPredict: number = 7): PredictionDataPoint[] {
  const data: PredictionDataPoint[] = [];
  const baseValue = 30 + Math.random() * 10; // 30-40 base value
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const today = new Date();
  const dayOfWeek = today.getDay();
  
  for (let i = 0; i < daysToPredict; i++) {
    const dayIndex = (dayOfWeek + i) % 7;
    const dayName = dayNames[dayIndex];
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateStr = `${dayName} ${date.getDate()}`;
    
    // Weekend modifier
    const weekendModifier = (dayIndex === 0 || dayIndex === 6) ? 0.8 : 1;
    
    // Value increases slightly each day with a random factor
    // Confidence decreases as we look further into the future
    data.push({
      day: dateStr,
      value: Math.round((baseValue + (i * 2) + (Math.random() * 5 - 2.5)) * weekendModifier * 10) / 10,
      confidence: Math.round(95 - (i * 5))
    });
  }
  
  return data;
}
