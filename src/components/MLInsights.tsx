
import React, { useEffect, useState } from 'react';
import { MLService } from '@/services/mlService';
import { Insight } from '@/types/mlService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Battery,
  BatteryCharging,
  Brain,
  Lightbulb,
  Minus,
  MousePointerClick,
  Thermometer,
  TrendingDown,
  TrendingUp,
  Zap,
} from 'lucide-react';

interface MLInsightsProps {
  telemetryData: any[];
}

export const MLInsights: React.FC<MLInsightsProps> = ({ telemetryData }) => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateInsights = async () => {
      try {
        setIsLoading(true);
        
        // Initialize ML service
        const mlService = new MLService({
          modelPath: '/models/energy_prediction',
          inputShape: [24, 10],
          outputShape: [24],
          featureNames: ['consumption', 'temperature', 'time', 'day_of_week'],
          modelType: 'regression'
        });
        
        await mlService.initialize();
        
        // Generate insights from telemetry data
        const generatedInsights = await mlService.generateInsights(telemetryData);
        
        // Add icons to insights based on type
        const insightsWithIcons = generatedInsights.map(insight => {
          let icon = null;
          
          switch (insight.type) {
            case 'energy':
              icon = <Lightbulb />;
              break;
            case 'battery':
              icon = insight.trend === 'up' ? <BatteryCharging /> : <Battery />;
              break;
            case 'weather':
              icon = <Thermometer />;
              break;
            case 'cost':
              icon = <Zap />;
              break;
            default:
              icon = <Brain />;
          }
          
          return {
            ...insight,
            icon,
          };
        });
        
        setInsights(insightsWithIcons);
        setError(null);
      } catch (err) {
        console.error('Error generating ML insights:', err);
        setError(err instanceof Error ? err.message : 'Failed to generate insights');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (telemetryData.length > 0) {
      generateInsights();
    }
  }, [telemetryData]);

  const renderTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'stable':
      default:
        return <Minus className="h-4 w-4 text-amber-500" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-40 text-red-500">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>Error: {error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sample prediction data for the chart
  const predictionData = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    actual: 20 + Math.random() * 10 + (i < 12 ? i : 24 - i),
    predicted: 22 + Math.random() * 8 + (i < 12 ? i : 24 - i),
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {insights.map((insight, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <div className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/20">
                  {React.cloneElement(insight.icon as React.ReactElement, { className: "h-4 w-4 text-blue-500" })}
                </div>
                {insight.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-2xl font-bold flex items-center gap-1">
                    {insight.value}
                    <span className="text-sm font-normal text-muted-foreground">{insight.unit}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                </div>
                <Badge
                  variant={insight.trend === 'up' ? 'success' : 
                          insight.trend === 'down' ? 'danger' : 
                          'warning'}
                  className="flex items-center gap-1"
                >
                  {renderTrendIcon(insight.trend)}
                  {insight.trend}
                </Badge>
              </div>
              <div className="text-xs mt-2 text-muted-foreground">
                Confidence: {(insight.confidence * 100).toFixed(0)}%
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Energy Consumption Forecast</CardTitle>
            <CardDescription>Predicted vs. Actual Energy Consumption</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-72 pt-4 px-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={predictionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="hour"
                    label={{ value: 'Hour', position: 'insideBottomRight', offset: -10 }}
                    tickFormatter={(hour) => `${hour}:00`}
                  />
                  <YAxis label={{ value: 'kWh', angle: -90, position: 'insideLeft' }} />
                  <Tooltip
                    formatter={(value) => [`${value} kWh`, 'Consumption']}
                    labelFormatter={(hour) => `${hour}:00`}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="actual"
                    name="Actual"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorActual)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="predicted"
                    name="Predicted"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#colorPredicted)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ML Recommendations</CardTitle>
            <CardDescription>AI-powered energy optimization suggestions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 pb-3 border-b">
                <div className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/20 flex-shrink-0 mt-1">
                  <BatteryCharging className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <div className="font-medium">Adjust Battery Charging Schedule</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Shifting battery charging to 01:00-05:00 could save 12% on energy costs based on your time-of-use tariff pattern.
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="success">High Impact</Badge>
                    <span className="text-xs text-muted-foreground">Estimated savings: €18.50/month</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 pb-3 border-b">
                <div className="p-2 rounded-full bg-amber-50 dark:bg-amber-900/20 flex-shrink-0 mt-1">
                  <MousePointerClick className="h-4 w-4 text-amber-500" />
                </div>
                <div>
                  <div className="font-medium">Optimize EV Charging Time</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Based on your driving patterns, scheduling EV charging during solar peak hours could increase self-consumption by 15%.
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="warning">Medium Impact</Badge>
                    <span className="text-xs text-muted-foreground">Estimated savings: €12.30/month</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-green-50 dark:bg-green-900/20 flex-shrink-0 mt-1">
                  <Lightbulb className="h-4 w-4 text-green-500" />
                </div>
                <div>
                  <div className="font-medium">Load Shifting Opportunity</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Moving dishwasher and washing machine usage to periods of excess solar generation could reduce grid imports.
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="info">Low Impact</Badge>
                    <span className="text-xs text-muted-foreground">Estimated savings: €7.80/month</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
