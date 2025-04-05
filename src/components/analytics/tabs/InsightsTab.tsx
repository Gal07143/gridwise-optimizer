
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { generateEnergyPredictions, getEnergyRecommendations } from '@/services/energyAIPredictionService';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useSiteContext } from '@/contexts/SiteContext';
import { Loader2 } from 'lucide-react';

// Define valid timeframe types
type TimeframeType = 'day' | 'week' | 'month' | 'year';

const InsightsTab = () => {
  const [timeframe, setTimeframe] = useState<TimeframeType>('week');
  const [predictions, setPredictions] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { activeSite } = useSiteContext();

  useEffect(() => {
    if (!activeSite?.id) return;

    setLoading(true);
    const fetchData = async () => {
      try {
        // Use Promise.all to fetch both predictions and recommendations in parallel
        const [predictionData, recommendationData] = await Promise.all([
          generateEnergyPredictions(activeSite.id, timeframeToNumber(timeframe)),
          getEnergyRecommendations(activeSite.id)
        ]);
        
        setPredictions(predictionData);
        setRecommendations(recommendationData);
      } catch (error) {
        console.error('Error fetching insight data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeSite, timeframe]);

  // Convert timeframe to number of days
  const timeframeToNumber = (frame: TimeframeType): number => {
    switch (frame) {
      case 'day': return 1;
      case 'week': return 7;
      case 'month': return 30;
      case 'year': return 365;
      default: return 7;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Energy Insights & Recommendations</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="timeframe">Timeframe</Label>
            <Select 
              value={timeframe} 
              onValueChange={(value) => setTimeframe(value as TimeframeType)}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Daily</SelectItem>
                <SelectItem value="week">Weekly</SelectItem>
                <SelectItem value="month">Monthly</SelectItem>
                <SelectItem value="year">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading insights...</span>
        </div>
      ) : (
        <div className="grid md:grid-cols-5 gap-4">
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Energy Predictions</CardTitle>
              <CardDescription>Forecast for your energy generation and consumption</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {predictions.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={predictions}>
                    <XAxis 
                      dataKey="date"
                      tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="generation" 
                      stroke="#10b981" 
                      name="Generation (kWh)" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="consumption" 
                      stroke="#3b82f6" 
                      name="Consumption (kWh)" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <p className="text-muted-foreground">No prediction data available</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>AI Recommendations</CardTitle>
              <CardDescription>Smart suggestions to optimize your energy usage</CardDescription>
            </CardHeader>
            <CardContent className="h-80 overflow-auto">
              {recommendations.length > 0 ? (
                <ul className="space-y-3">
                  {recommendations.map((rec: any, index: number) => (
                    <li key={index} className="bg-accent/50 p-3 rounded-md">
                      <h4 className="font-medium">{rec.title}</h4>
                      <p className="text-sm text-muted-foreground">{rec.description}</p>
                      {rec.potential_savings && (
                        <p className="text-xs mt-1 text-green-600 font-medium">
                          Potential savings: {rec.potential_savings}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <p className="text-muted-foreground">No recommendations available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default InsightsTab;
