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
import { MLService, Prediction, Insight } from '@/types/mlService';

interface MLInsightsProps {
  telemetryData: TelemetryData[];
}

export function MLInsights({ telemetryData }: MLInsightsProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'1h' | '6h' | '24h' | '7d'>('24h');

  // Initialize ML service
  const [mlService] = useState<MLService>(() => {
    // This is a mock implementation, in a real app you would import the actual service
    return {
      initialize: async () => {
        console.log("ML Service initialized");
      },
      predict: async (data) => {
        // Mock predictions
        return Array.from({ length: 24 }, (_, i) => ({
          timestamp: new Date(Date.now() + i * 3600000).toISOString(),
          actual: Math.random() * 100,
          predicted: Math.random() * 100,
          confidence: 0.7 + Math.random() * 0.3
        }));
      },
      generateInsights: async (data) => {
        // Mock insights
        return [
          {
            type: 'energy',
            title: 'Energy Consumption',
            description: 'Recent consumption trend is increasing',
            value: 125.4,
            unit: 'kWh',
            trend: 'up',
            confidence: 0.92,
            icon: <Zap className="h-4 w-4" />
          },
          {
            type: 'battery',
            title: 'Battery Performance',
            description: 'Battery efficiency is stable',
            value: 95,
            unit: '%',
            trend: 'stable',
            confidence: 0.87,
            icon: <Battery className="h-4 w-4" />
          },
          {
            type: 'weather',
            title: 'Weather Impact',
            description: 'Lower consumption due to good weather',
            value: -12.5,
            unit: '%',
            trend: 'down',
            confidence: 0.75,
            icon: <Sun className="h-4 w-4" />
          },
          {
            type: 'cost',
            title: 'Cost Optimization',
            description: 'Potential savings from battery usage',
            value: 32.40,
            unit: '$',
            trend: 'down',
            confidence: 0.83,
            icon: <TrendingUp className="h-4 w-4" />
          }
        ];
      },
      dispose: () => {
        console.log("ML Service disposed");
      }
    };
  });

  useEffect(() => {
    const loadInsights = async () => {
      try {
        setLoading(true);
        
        // Initialize ML service
        await mlService.initialize();
        
        // Use the telemetryData as is without type conversion
        // The mock implementations above handle this gracefully
        const generatedPredictions = await mlService.predict(telemetryData);
        setPredictions(generatedPredictions);
        
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
