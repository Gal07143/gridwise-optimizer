
import React, { useState } from 'react';
import { toast } from 'sonner';
import BarChart from '@/components/charts/BarChart';
import { Bar } from 'recharts';

const BatteryManagement: React.FC = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<any>(null);
  
  // Mock optimization result
  const mockOptimizationResult = {
    savings: {
      cost: 5.25,
      energy: 7.8,
      carbon: 3.2
    },
    schedule: [
      { time: '00:00', charge: 0.5, discharge: 0 },
      { time: '03:00', charge: 1.2, discharge: 0 },
      { time: '06:00', charge: 0.8, discharge: 0 },
      { time: '09:00', charge: 0, discharge: 0.5 },
      { time: '12:00', charge: 0, discharge: 1.0 },
      { time: '15:00', charge: 0, discharge: 0.8 },
      { time: '18:00', charge: 0, discharge: 1.2 },
      { time: '21:00', charge: 0.3, discharge: 0 }
    ]
  };
  
  const handleOptimize = async () => {
    try {
      setIsOptimizing(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setOptimizationResult(mockOptimizationResult);
      toast.success('Battery optimization complete');
    } catch (error) {
      toast.error('Failed to optimize battery');
      console.error(error);
    } finally {
      setIsOptimizing(false);
    }
  };

  // Mock capacity degradation data
  const capacityData = [
    { month: 'Jan', capacity: 98 },
    { month: 'Feb', capacity: 97.5 },
    { month: 'Mar', capacity: 97.2 },
    { month: 'Apr', capacity: 96.8 },
    { month: 'May', capacity: 96.3 },
    { month: 'Jun', capacity: 95.9 },
    { month: 'Jul', capacity: 95.4 },
    { month: 'Aug', capacity: 94.8 },
    { month: 'Sep', capacity: 94.3 },
    { month: 'Oct', capacity: 93.7 },
    { month: 'Nov', capacity: 93.1 },
    { month: 'Dec', capacity: 92.6 },
  ];

  return (
    <div>
      <h1>Battery Management</h1>
      
      {/* Battery Control Section */}
      <div>
        <button onClick={handleOptimize} disabled={isOptimizing}>
          {isOptimizing ? 'Optimizing...' : 'Optimize Battery Usage'}
        </button>
        
        {optimizationResult && (
          <div>
            <h3>Optimization Results</h3>
            <p>Cost Savings: ${optimizationResult.savings.cost}</p>
            <p>Energy Savings: {optimizationResult.savings.energy} kWh</p>
            <p>Carbon Reduction: {optimizationResult.savings.carbon} kg</p>
          </div>
        )}
      </div>
      
      {/* Battery Health Section */}
      <div>
        <h3>Battery Capacity Degradation</h3>
        <BarChart data={capacityData}>
          <Bar dataKey="capacity" fill="#8884d8" />
        </BarChart>
      </div>
    </div>
  );
};

export default BatteryManagement;
