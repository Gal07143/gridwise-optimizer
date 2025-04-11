
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { toast } from 'sonner';

interface Prediction {
  time: string;
  consumption: number;
  consumptionPredicted: number;
  production: number;
  productionPredicted: number;
  savings: number;
  savingsPredicted: number;
}

// Custom hook for predictions
const usePredictions = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchPredictions = async (siteId?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, fetch from API using siteId
      // For now, generate sample data
      const sampleData: Prediction[] = Array.from({ length: 24 }, (_, i) => {
        const hour = i;
        const baseConsumption = 2 + Math.sin(hour / 4) * 1.5;
        const baseProduction = hour > 6 && hour < 20 
          ? 4 * Math.sin((hour - 6) / 14 * Math.PI) 
          : 0;
        
        return {
          time: `${hour}:00`,
          consumption: baseConsumption + Math.random(),
          consumptionPredicted: baseConsumption + Math.random() * 0.5,
          production: baseProduction + Math.random() * (baseProduction > 0 ? 1 : 0),
          productionPredicted: baseProduction + Math.random() * (baseProduction > 0 ? 0.8 : 0),
          savings: (baseProduction * 0.1) + Math.random() * 0.3,
          savingsPredicted: (baseProduction * 0.11) + Math.random() * 0.2,
        };
      });
      
      setPredictions(sampleData);
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch predictions'));
      toast.error('Failed to load prediction data');
      setIsLoading(false);
    }
  };

  return { predictions, isLoading, error, fetchPredictions };
};

const PredictionsCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('consumption');
  const { predictions, isLoading, error, fetchPredictions } = usePredictions();

  useEffect(() => {
    fetchPredictions('default-site');
  }, []);

  const renderChart = (dataKey: string) => {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={predictions} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey={dataKey} stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey={`${dataKey}Predicted`} stroke="#82ca9d" strokeDasharray="5 5" />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Energy Predictions</CardTitle>
        <CardDescription>AI-powered forecasts for your energy usage patterns</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="text-center p-4 bg-destructive/10 rounded-md">
            <p className="text-destructive font-medium">Failed to load predictions</p>
            <Button size="sm" variant="outline" className="mt-2" onClick={() => fetchPredictions('default-site')}>
              Try Again
            </Button>
          </div>
        ) : (
          <>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="consumption">Consumption</TabsTrigger>
                <TabsTrigger value="production">Production</TabsTrigger>
                <TabsTrigger value="savings">Cost Savings</TabsTrigger>
              </TabsList>
              <TabsContent value="consumption" className="space-y-4">
                <h3 className="font-medium">Consumption Forecast (kWh)</h3>
                {renderChart('consumption')}
              </TabsContent>
              <TabsContent value="production" className="space-y-4">
                <h3 className="font-medium">Production Forecast (kWh)</h3>
                {renderChart('production')}
              </TabsContent>
              <TabsContent value="savings" className="space-y-4">
                <h3 className="font-medium">Cost Savings Forecast ($)</h3>
                {renderChart('savings')}
              </TabsContent>
            </Tabs>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PredictionsCard;
