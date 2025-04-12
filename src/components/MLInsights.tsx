import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar
} from 'recharts';
import { 
  TrendingUp, AlertTriangle, Zap, Battery, 
  Sun, Cloud, Droplets, Wind
} from 'lucide-react';
import { TelemetryData } from '@/types/telemetry';
import { MLService } from '@/services/mlService';

interface MLInsightsProps {
  telemetryData: TelemetryData[];
}

interface Prediction {
  timestamp: string;
  actual: number;
  predicted: number;
  confidence: number;
}

interface Insight {
  type: 'energy' | 'battery' | 'weather' | 'cost';
  title: string;
  description: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  confidence: number;
  icon: React.ReactNode;
}

export function MLInsights({ telemetryData }: MLInsightsProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'1h' | '6h' | '24h' | '7d'>('24h');

  // Initialize ML service
  const [mlService] = useState(() => new MLService({
    modelPath: '/models/energy_prediction',
    inputShape: [24, 10],
    outputShape: [24],
    featureNames: ['consumption', 'temperature', 'time', 'day_of_week'],
    modelType: 'consumption'
  }));

  useEffect(() => {
    const loadInsights = async () => {
      try {
        setLoading(true);
        
        // Initialize ML service
        await mlService.initialize();
        
        // Generate predictions
        const generatedPredictions = await mlService.predict(telemetryData);
        setPredictions(generatedPredictions);
        
        // Generate insights
        const generatedInsights = await mlService.generateInsights(telemetryData);
        setInsights(generatedInsights);
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading ML insights:', err);
        setError(err instanceof Error ? err.message : 'Failed to load ML insights');
        setLoading(false);
      }
    };
    
    loadInsights();
    
    return () => {
      mlService.dispose();
    };
  }, [mlService, telemetryData, selectedTimeRange]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {insights.map((insight, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {insight.title}
              </CardTitle>
              <div className="h-4 w-4 text-muted-foreground">
                {insight.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {insight.value.toFixed(1)}{insight.unit}
              </div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <TrendingUp className={`h-4 w-4 ${
                  insight.trend === 'up' ? 'text-green-500' : 
                  insight.trend === 'down' ? 'text-red-500' : 
                  'text-yellow-500'
                }`} />
                <span>
                  {insight.trend === 'up' ? 'Increasing' : 
                   insight.trend === 'down' ? 'Decreasing' : 
                   'Stable'}
                </span>
                <Badge variant="outline" className="ml-2">
                  {(insight.confidence * 100).toFixed(0)}% confidence
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {insight.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Energy Consumption Prediction</CardTitle>
          <CardDescription>Actual vs. predicted energy consumption</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={predictions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#2563eb" 
                  name="Actual" 
                />
                <Line 
                  type="monotone" 
                  dataKey="predicted" 
                  stroke="#dc2626" 
                  name="Predicted" 
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weather Impact</CardTitle>
            <CardDescription>Weather conditions affecting energy consumption</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={telemetryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="temperature" 
                    stroke="#f59e0b" 
                    fill="#fef3c7" 
                    name="Temperature (°C)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="humidity" 
                    stroke="#3b82f6" 
                    fill="#dbeafe" 
                    name="Humidity (%)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cost Optimization</CardTitle>
            <CardDescription>Potential cost savings from optimization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={telemetryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="cost" 
                    fill="#2563eb" 
                    name="Current Cost ($)" 
                  />
                  <Bar 
                    dataKey="optimizedCost" 
                    fill="#059669" 
                    name="Optimized Cost ($)" 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 