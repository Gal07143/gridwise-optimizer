
// Mock data and interfaces for energy predictions
export interface PredictionDataPoint {
  day: string;
  value: number;
  confidence: number;
}

export interface SystemRecommendation {
  id: string;
  title: string;
  description: string;
  type: string;
  priority: string;
  potential_savings: string;
  implementation_effort: string;
  confidence: number;
  applied: boolean;
  applied_at?: string;
  applied_by?: string;
}

export const generatePredictionData = async (
  timeframe: 'day' | 'week' | 'month' | 'year' = 'day',
  dataType: string = 'energy_consumption'
): Promise<PredictionDataPoint[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate sample data based on timeframe
  const days = timeframe === 'day' ? 1 : 
              timeframe === 'week' ? 7 : 
              timeframe === 'month' ? 30 : 365;
  
  return Array.from({ length: days }, (_, i) => ({
    day: `Day ${i + 1}`,
    value: Math.round(Math.random() * 100 + 50),
    confidence: Math.random() * 0.3 + 0.7 // Between 70% and 100%
  }));
};

export const getSystemRecommendations = async (): Promise<SystemRecommendation[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Sample recommendations
  return [
    {
      id: '1',
      title: 'Optimize Battery Charging Schedule',
      description: 'Shifting battery charging to off-peak hours could reduce energy costs by approximately 15%.',
      type: 'optimization',
      priority: 'high',
      potential_savings: '$120-150/month',
      implementation_effort: 'Low',
      confidence: 0.89,
      applied: false
    },
    {
      id: '2',
      title: 'Increase Solar Panel Cleaning Frequency',
      description: 'Current dust accumulation is reducing efficiency by an estimated 8%. Increasing cleaning frequency to monthly would improve output.',
      type: 'maintenance',
      priority: 'medium',
      potential_savings: '$80-100/month',
      implementation_effort: 'Medium',
      confidence: 0.76,
      applied: false
    },
    {
      id: '3',
      title: 'Adjust HVAC Operating Hours',
      description: 'Analysis shows the HVAC system runs 2 hours longer than necessary on weekends. Adjusting the schedule could save energy.',
      type: 'behavioral',
      priority: 'medium',
      potential_savings: '$50-70/month',
      implementation_effort: 'Low',
      confidence: 0.92,
      applied: false
    }
  ];
};

export const applyRecommendation = async (
  recommendationId: string,
  notes: string
): Promise<boolean> => {
  // Simulate API call
  console.log('Applying recommendation:', recommendationId, 'with notes:', notes);
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return success
  return true;
};
