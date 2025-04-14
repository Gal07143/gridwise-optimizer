
import React, { useState, useEffect } from 'react';
import { Insight, MLService, MLServiceConfig } from '../types/mlService';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge'; // Import the Badge component
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { Brain, TrendingUp, TrendingDown, Activity, AlertTriangle } from 'lucide-react';

const mlServiceConfig: MLServiceConfig = {
  modelPath: '/models/energy-insights-model',
  inputShape: [24, 5],
  outputShape: [24, 1],
  featureNames: ['consumption', 'temperature', 'time_of_day', 'day_of_week', 'is_holiday'],
  modelType: 'timeseries' // Adding required modelType property
};

// Sample data for demonstration
const performanceData = [
  { name: 'Monday', actual: 65, predicted: 71 },
  { name: 'Tuesday', actual: 59, predicted: 53 },
  { name: 'Wednesday', actual: 80, predicted: 85 },
  { name: 'Thursday', actual: 81, predicted: 78 },
  { name: 'Friday', actual: 56, predicted: 60 },
  { name: 'Saturday', actual: 40, predicted: 45 },
  { name: 'Sunday', actual: 35, predicted: 30 },
];

const MLInsights: React.FC = () => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [mlService, setMLService] = useState<MLService | null>(null);
  const [activeMetric, setActiveMetric] = useState('energy');
  const [performanceMetrics, setPerformanceMetrics] = useState({
    accuracy: 0,
    precision: 0,
    recall: 0,
    f1Score: 0,
    rmse: 0,
    mae: 0
  });

  useEffect(() => {
    const initializeMLService = async () => {
      try {
        const service = new MLService(mlServiceConfig);
        await service.initialize();
        setMLService(service);
        
        // Fetch insights
        const mockData: any[] = []; // Mock data array
        const fetchedInsights = await service.generateInsights(mockData);
        setInsights(fetchedInsights);
        
        // Get performance metrics
        const metrics = service.calculatePerformanceMetrics();
        setPerformanceMetrics(metrics);
        
        setLoading(false);
      } catch (error) {
        console.error('Failed to initialize ML service:', error);
        setLoading(false);
      }
    };
    
    initializeMLService();
    
    return () => {
      if (mlService) {
        mlService.dispose();
      }
    };
  }, []);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 ml-1" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 ml-1" />;
      default:
        return <Activity className="h-4 w-4 ml-1" />;
    }
  };

  const getInsightTypeIcon = (type: string) => {
    switch (type) {
      case 'energy':
        return <Activity className="h-5 w-5" />;
      case 'battery':
        return <Activity className="h-5 w-5" />;
      case 'weather':
        return <Activity className="h-5 w-5" />;
      case 'cost':
        return <Activity className="h-5 w-5" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };
  
  if (loading) {
    return (
      <div className="p-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center h-40">
              <div className="text-center">
                <Brain className="h-10 w-10 mb-2 mx-auto animate-pulse" />
                <p>Loading ML Insights...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>ML-Powered Energy Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {insights.map((insight, index) => (
              <Card key={index} className={`bg-card hover:shadow-md transition-shadow border-l-4 ${
                insight.trend === 'up' ? 'border-l-red-500' : 
                insight.trend === 'down' ? 'border-l-green-500' : 'border-l-amber-500'
              }`}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      {getInsightTypeIcon(insight.type)}
                      <h3 className="font-semibold ml-2">{insight.title}</h3>
                    </div>
                    <Badge variant={
                      insight.trend === 'up' ? 'danger' :
                      insight.trend === 'down' ? 'success' : 
                      'warning'
                    }>
                      {insight.trend === 'up' ? 'Increasing' : 
                       insight.trend === 'down' ? 'Decreasing' : 'Stable'}
                      {getTrendIcon(insight.trend)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{insight.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">{insight.value} {insight.unit}</span>
                    <span className="text-xs opacity-70">{Math.round(insight.confidence * 100)}% confidence</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Tabs defaultValue="predictions">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="predictions">Predictions</TabsTrigger>
              <TabsTrigger value="accuracy">Model Accuracy</TabsTrigger>
              <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
            </TabsList>
            <TabsContent value="predictions" className="pt-4">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="actual" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} name="Actual" />
                    <Area type="monotone" dataKey="predicted" stackId="2" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} name="Predicted" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="accuracy" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Accuracy</span>
                      <span className="text-sm">{(performanceMetrics.accuracy * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={performanceMetrics.accuracy * 100} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Precision</span>
                      <span className="text-sm">{(performanceMetrics.precision * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={performanceMetrics.precision * 100} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Recall</span>
                      <span className="text-sm">{(performanceMetrics.recall * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={performanceMetrics.recall * 100} />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">F1 Score</span>
                      <span className="text-sm">{(performanceMetrics.f1Score * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={performanceMetrics.f1Score * 100} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">RMSE</span>
                      <span className="text-sm">{performanceMetrics.rmse.toFixed(2)}</span>
                    </div>
                    <Progress value={Math.max(0, 100 - performanceMetrics.rmse * 5)} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">MAE</span>
                      <span className="text-sm">{performanceMetrics.mae.toFixed(2)}</span>
                    </div>
                    <Progress value={Math.max(0, 100 - performanceMetrics.mae * 7)} />
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="anomalies" className="pt-4">
              <div className="flex flex-col space-y-3">
                <div className="flex items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-md">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
                  <div>
                    <h4 className="font-medium">Abnormal Consumption Pattern</h4>
                    <p className="text-sm">Detected 35% higher consumption than expected yesterday at 2:00 PM</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3" />
                  <div>
                    <h4 className="font-medium">Possible Equipment Malfunction</h4>
                    <p className="text-sm">Heating system showing unusual patterns over the last 3 days</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                  <AlertTriangle className="h-5 w-5 text-blue-500 mr-3" />
                  <div>
                    <h4 className="font-medium">Weather Impact Detected</h4>
                    <p className="text-sm">Unexpected consumption increase correlates with temperature drop</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MLInsights;
