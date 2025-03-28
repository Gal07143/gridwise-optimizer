
// Prediction data types
export interface PredictionDataPoint {
  timestamp: string;
  value: number;
  prediction: number;
  lowerBound?: number;
  upperBound?: number;
}

export interface SystemRecommendation {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: 'efficiency' | 'cost' | 'maintenance' | 'operations';
  potential_savings?: number;
  implementation_effort?: 'easy' | 'medium' | 'complex';
  created_at: string;
  applied: boolean;
  applied_at?: string;
  applied_by?: string;
  notes?: string;
}

// Mock prediction data generation
export const generatePredictionData = async (
  timeframe: 'day' | 'week' | 'month' | 'year',
  dataType: 'energy_consumption' | 'energy_production' | 'cost_analysis' | 'device_performance' | 'efficiency_analysis' = 'energy_consumption'
): Promise<PredictionDataPoint[]> => {
  const now = new Date();
  const data: PredictionDataPoint[] = [];
  
  // Generate appropriate number of data points based on timeframe
  const points = timeframe === 'day' ? 24 : 
                timeframe === 'week' ? 7 : 
                timeframe === 'month' ? 30 : 365;
  
  // Scale for different data types
  const scale = dataType === 'energy_consumption' ? 100 : 
               dataType === 'energy_production' ? 80 : 
               dataType === 'cost_analysis' ? 200 : 50;
  
  for (let i = 0; i < points; i++) {
    const timestamp = new Date();
    
    if (timeframe === 'day') {
      timestamp.setHours(now.getHours() - (points - i));
    } else if (timeframe === 'week') {
      timestamp.setDate(now.getDate() - (points - i));
    } else if (timeframe === 'month') {
      timestamp.setDate(now.getDate() - (points - i));
    } else {
      timestamp.setDate(now.getDate() - (points - i));
    }
    
    const baseValue = Math.random() * scale;
    const variance = baseValue * 0.2; // 20% variance
    
    data.push({
      timestamp: timestamp.toISOString(),
      value: baseValue,
      prediction: baseValue + (Math.random() - 0.5) * variance,
      lowerBound: baseValue - variance,
      upperBound: baseValue + variance
    });
  }
  
  return data;
};

export const getSystemRecommendations = async (): Promise<SystemRecommendation[]> => {
  // Mock data for system recommendations
  return [
    {
      id: '1',
      title: 'Shift Battery Charging to Off-Peak Hours',
      description: 'Shifting battery charging to off-peak electricity rate hours could save approximately 15% on electricity costs.',
      impact: 'high',
      category: 'cost',
      potential_savings: 125.45,
      implementation_effort: 'easy',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      applied: false
    },
    {
      id: '2',
      title: 'Optimize Solar Panel Tilt Angle',
      description: 'Current solar panel angle is sub-optimal for this season. Adjusting to 32° would increase production by approximately 8%.',
      impact: 'medium',
      category: 'efficiency',
      potential_savings: 78.20,
      implementation_effort: 'medium',
      created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      applied: false
    },
    {
      id: '3',
      title: 'Schedule Inverter Maintenance',
      description: 'Inverter efficiency has decreased by 3% over the past month. Scheduling maintenance could prevent further degradation.',
      impact: 'medium',
      category: 'maintenance',
      implementation_effort: 'medium',
      created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
      applied: false
    }
  ];
};

export const applyRecommendation = async (
  recommendationId: string,
  notes: string
): Promise<boolean> => {
  // In a real implementation, this would update the database
  console.log(`Applied recommendation ${recommendationId} with notes: ${notes}`);
  return true;
};

export const getModelStatus = async () => {
  return {
    status: 'active',
    lastTrained: new Date(Date.now() - 7 * 86400000).toISOString(),
    accuracy: 0.92,
    version: '1.2.3'
  };
};

export const trainModel = async () => {
  // Mock implementation - would trigger model training in real app
  return {
    success: true,
    message: 'Model training initiated'
  };
};
