import React, { useState, useEffect } from 'react';
import { Device, TelemetryData } from '@/types/device';
import { DeviceFailurePredictionService, FailurePrediction, DeviceHealthMetrics } from '@/services/deviceFailurePredictionService';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { format } from 'date-fns';

interface DeviceHealthVisualizationProps {
  device: Device;
  telemetryData: TelemetryData[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const DeviceHealthVisualization: React.FC<DeviceHealthVisualizationProps> = ({ 
  device, 
  telemetryData 
}) => {
  const [failurePrediction, setFailurePrediction] = useState<FailurePrediction | null>(null);
  const [healthMetrics, setHealthMetrics] = useState<DeviceHealthMetrics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  const failurePredictionService = new DeviceFailurePredictionService();
  
  useEffect(() => {
    const initializeService = async () => {
      try {
        await failurePredictionService.initialize();
        await fetchPredictions();
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize service'));
        setIsLoading(false);
      }
    };
    
    initializeService();
    
    return () => {
      failurePredictionService.dispose();
    };
  }, []);
  
  useEffect(() => {
    if (telemetryData.length > 0) {
      fetchPredictions();
    }
  }, [telemetryData]);
  
  const fetchPredictions = async () => {
    try {
      setIsLoading(true);
      
      const [prediction, health] = await Promise.all([
        failurePredictionService.predictDeviceFailure(device, telemetryData),
        failurePredictionService.analyzeDeviceHealth(device, telemetryData)
      ]);
      
      setFailurePrediction(prediction);
      setHealthMetrics(health);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch predictions'));
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading device health data...</div>;
  }
  
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error.message}</span>
      </div>
    );
  }
  
  if (!failurePrediction || !healthMetrics) {
    return <div>No health data available</div>;
  }
  
  // Prepare data for component health chart
  const componentHealthData = Object.entries(healthMetrics.componentHealth).map(([name, value]) => ({
    name,
    value: typeof value === 'number' ? value * 100 : 0
  }));
  
  // Prepare data for contributing factors chart
  const contributingFactorsData = failurePrediction.contributingFactors.map(factor => ({
    name: factor.factor,
    value: typeof factor.impact === 'number' ? factor.impact * 100 : 0
  }));
  
  // Prepare data for health trend (simulated)
  const healthTrendData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: format(date, 'MM/dd'),
      health: Math.max(0, 100 - (i * 0.5) + (Math.random() * 5 - 2.5))
    };
  });
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Overall Health Score */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Overall Device Health</h3>
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32">
              <svg viewBox="0 0 36 36" className="w-full h-full">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#eee"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={healthMetrics.overallHealth > 0.7 ? '#00C49F' : healthMetrics.overallHealth > 0.4 ? '#FFBB28' : '#FF8042'}
                  strokeWidth="3"
                  strokeDasharray={`${healthMetrics.overallHealth * 100}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">{Math.round(healthMetrics.overallHealth * 100)}%</span>
              </div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              {healthMetrics.maintenanceNeeded 
                ? `Maintenance needed by ${healthMetrics.nextMaintenanceDate ? format(healthMetrics.nextMaintenanceDate, 'MMM dd, yyyy') : 'soon'}`
                : 'Device is healthy'}
            </p>
          </div>
        </div>
        
        {/* Failure Prediction */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Failure Risk Assessment</h3>
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32">
              <svg viewBox="0 0 36 36" className="w-full h-full">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#eee"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={failurePrediction.failureProbability < 0.3 ? '#00C49F' : failurePrediction.failureProbability < 0.6 ? '#FFBB28' : '#FF8042'}
                  strokeWidth="3"
                  strokeDasharray={`${failurePrediction.failureProbability * 100}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">{Math.round(failurePrediction.failureProbability * 100)}%</span>
              </div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              {failurePrediction.predictedFailureTime 
                ? `Predicted failure: ${format(failurePrediction.predictedFailureTime, 'MMM dd, yyyy')}`
                : 'Low failure risk'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Confidence: {Math.round(failurePrediction.confidence * 100)}%
            </p>
          </div>
        </div>
      </div>
      
      {/* Component Health Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Component Health</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={componentHealthData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Health %" fill="#8884d8">
                {componentHealthData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.value > 80 ? '#00C49F' : entry.value > 60 ? '#FFBB28' : '#FF8042'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Contributing Factors Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Failure Risk Factors</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={contributingFactorsData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {contributingFactorsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Health Trend Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Health Trend (Last 30 Days)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={healthTrendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="health" name="Health %" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Recommendations */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Recommendations</h3>
        <ul className="list-disc pl-5 space-y-1">
          {failurePrediction.recommendations.map((recommendation, index) => (
            <li key={index} className="text-gray-700">{recommendation}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}; 