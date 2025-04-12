import React, { useState, useEffect } from 'react';
import { Device, TelemetryData } from '@/types/device';
import { EnergyManagementService, EnergyPrediction, EnergyAction } from '@/services/energyManagementService';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, AreaChart, Area, ComposedChart, Cell
} from 'recharts';
import { format } from 'date-fns';

interface EnergyOptimizationVisualizationProps {
  device: Device;
  telemetryData: TelemetryData[];
}

export const EnergyOptimizationVisualization: React.FC<EnergyOptimizationVisualizationProps> = ({ 
  device, 
  telemetryData 
}) => {
  const [predictions, setPredictions] = useState<EnergyPrediction[]>([]);
  const [optimizedActions, setOptimizedActions] = useState<EnergyAction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  const energyManagementService = new EnergyManagementService();
  
  useEffect(() => {
    const initializeService = async () => {
      try {
        await energyManagementService.initialize();
        await fetchOptimizationData();
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize service'));
        setIsLoading(false);
      }
    };
    
    initializeService();
    
    return () => {
      energyManagementService.dispose();
    };
  }, []);
  
  useEffect(() => {
    if (telemetryData.length > 0) {
      fetchOptimizationData();
    }
  }, [telemetryData]);
  
  const fetchOptimizationData = async () => {
    try {
      setIsLoading(true);
      
      // Simulate battery status
      const batteryStatus = {
        currentLevel: 0.65,
        capacity: 10, // kWh
        maxChargeRate: 5, // kW
        maxDischargeRate: 5, // kW
        efficiency: 0.95
      };
      
      // Get energy predictions
      const energyPredictions = await energyManagementService.predictEnergyProfile(
        telemetryData,
        {}, // Weather data would be passed here
        batteryStatus
      );
      
      // Get optimized actions
      const actions = await energyManagementService.optimizeEnergyStorage(
        energyPredictions,
        {
          ...batteryStatus,
          initialLevel: batteryStatus.currentLevel,
          minLevel: 0.1,
          maxLevel: 0.9,
          maxCyclesPerDay: 2
        }
      );
      
      setPredictions(energyPredictions);
      setOptimizedActions(actions);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch optimization data'));
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading energy optimization data...</div>;
  }
  
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error.message}</span>
      </div>
    );
  }
  
  if (predictions.length === 0 || optimizedActions.length === 0) {
    return <div>No optimization data available</div>;
  }
  
  // Prepare data for consumption vs generation chart
  const consumptionVsGenerationData = predictions.map(prediction => ({
    time: format(prediction.timestamp, 'HH:mm'),
    consumption: prediction.consumption,
    generation: prediction.generation,
    netDemand: prediction.consumption - prediction.generation
  }));
  
  // Prepare data for battery level chart
  const batteryLevelData = predictions.map((prediction, index) => {
    const action = optimizedActions[index];
    let batteryLevel = prediction.batteryLevel;
    
    if (action.type === 'CHARGE') {
      batteryLevel += action.amount / 10; // Assuming 10 kWh capacity
    } else if (action.type === 'DISCHARGE') {
      batteryLevel -= action.amount / 10;
    }
    
    return {
      time: format(prediction.timestamp, 'HH:mm'),
      batteryLevel: Math.max(0, Math.min(1, batteryLevel)) * 100
    };
  });
  
  // Prepare data for cost savings chart
  const costSavingsData = optimizedActions.map((action, index) => ({
    time: format(predictions[index].timestamp, 'HH:mm'),
    savings: action.estimatedSavings
  }));
  
  // Calculate total savings
  const totalSavings = costSavingsData.reduce((sum, item) => sum + item.savings, 0);
  
  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Energy Consumption vs Generation</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={consumptionVsGenerationData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="consumption" name="Consumption (kWh)" fill="#8884d8" />
              <Bar dataKey="generation" name="Generation (kWh)" fill="#82ca9d" />
              <Line type="monotone" dataKey="netDemand" name="Net Demand (kWh)" stroke="#ff7300" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Battery Level</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={batteryLevelData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="batteryLevel" name="Battery Level (%)" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Cost Savings</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={costSavingsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="savings" name="Savings ($)" fill="#82ca9d">
                {costSavingsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.savings > 0 ? '#82ca9d' : '#ff8042'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-center">
          <p className="text-lg font-semibold">
            Total Savings: <span className="text-green-600">${totalSavings.toFixed(2)}</span>
          </p>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Optimization Actions</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (kWh)</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Savings ($)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {optimizedActions.map((action, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(predictions[index].timestamp, 'HH:mm')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      action.type === 'CHARGE' ? 'bg-green-100 text-green-800' :
                      action.type === 'DISCHARGE' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {action.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {action.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {action.reason}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${action.estimatedSavings.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}; 