
// Define required interfaces
export interface PredictionDataPoint {
  day: string;
  value: number;
  confidence: number;
}

export interface SystemRecommendation {
  id: string;
  title: string;
  description: string;
  type: 'efficiency' | 'cost' | 'maintenance' | 'operational';
  potential_savings: number; 
  implementation_effort: string;
  priority: 'high' | 'medium' | 'low';
  confidence: number;
  category: string;
  estimated_roi: number;
  applied?: boolean;
}

export interface ModelStatus {
  version: string;
  lastTrained: string;
  accuracy: number;
  status: 'active' | 'training' | 'error';
}

// Mock data for predictions
const generatePredictionData = (timeframe: 'day' | 'week' | 'month' | 'year', days: number = 7): PredictionDataPoint[] => {
  const data: PredictionDataPoint[] = [];
  const now = new Date();
  
  for (let i = 1; i <= days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() + i);
    
    let value = 0;
    // Different patterns for different timeframes
    switch(timeframe) {
      case 'day':
        value = 40 + Math.random() * 20;
        break;
      case 'week':
        value = 300 + Math.random() * 100;
        break;
      case 'month':
        value = 1200 + Math.random() * 400;
        break;
      case 'year':
        value = 15000 + Math.random() * 5000;
        break;
    }
    
    data.push({
      day: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: parseFloat(value.toFixed(1)),
      confidence: 0.7 + Math.random() * 0.3
    });
  }
  
  return data;
};

// Get recommendations for system optimization
const getSystemRecommendations = (): SystemRecommendation[] => {
  return [
    {
      id: 'rec-1',
      title: 'Optimize battery charging schedule',
      description: 'Adjust battery charging to utilize off-peak electricity rates, potentially saving 15% on energy costs.',
      type: 'efficiency',
      potential_savings: 120,
      implementation_effort: 'low',
      priority: 'high',
      confidence: 0.85,
      category: 'battery',
      estimated_roi: 240,
    },
    {
      id: 'rec-2',
      title: 'Increase solar panel cleaning frequency',
      description: 'Current dust accumulation is reducing efficiency by approximately 8%. Implementing bi-weekly cleaning can restore optimal performance.',
      type: 'maintenance',
      potential_savings: 85,
      implementation_effort: 'medium',
      priority: 'medium',
      confidence: 0.92,
      category: 'solar',
      estimated_roi: 170,
    },
    {
      id: 'rec-3',
      title: 'Adjust HVAC operating hours',
      description: 'Current operation shows 2.5 hours of unnecessary runtime daily. Adjusting schedules could reduce consumption.',
      type: 'operational',
      potential_savings: 210,
      implementation_effort: 'low',
      priority: 'high',
      confidence: 0.78,
      category: 'hvac',
      estimated_roi: 315,
    }
  ];
};

// Function to simulate applying a recommendation
const applyRecommendation = async (id: string): Promise<boolean> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  return true;
};

// Get model status 
const getModelStatus = async (): Promise<ModelStatus> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  return {
    version: '1.2.3',
    lastTrained: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    accuracy: 0.87,
    status: 'active'
  };
};

// Train model
const trainModel = async (): Promise<{success: boolean, message?: string}> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000));
  return {
    success: true,
    message: 'Model training completed successfully'
  };
};

export {
  generatePredictionData,
  getSystemRecommendations,
  applyRecommendation,
  getModelStatus,
  trainModel
};
