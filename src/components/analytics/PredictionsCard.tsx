
import React from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Lightbulb } from 'lucide-react';
import usePredictions from '@/hooks/usePredictions';
import { Skeleton } from '@/components/ui/skeleton';

interface PredictionsCardProps {
  timeframe: string;
  customData?: any[];
}

const PredictionsCard = ({ timeframe, customData }: PredictionsCardProps) => {
  const { 
    predictions, 
    isLoading, 
    error, 
    predictionDays, 
    setPredictionDays 
  } = usePredictions(timeframe, customData);

  const handlePredictionDaysChange = (value: number[]) => {
    setPredictionDays(value[0]);
  };

  // Transform predictions for chart display
  const chartData = predictions.map(pred => ({
    day: `Day ${pred.day}`,
    value: pred.value,
    confidence: pred.confidence
  }));

  // Calculate average confidence if we have predictions
  const avgConfidence = predictions.length 
    ? Math.round((predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length) * 100) 
    : 0;

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              Energy Consumption Forecast
            </CardTitle>
            <CardDescription>ML-powered energy usage predictions</CardDescription>
          </div>
          {!isLoading && !error && predictions.length > 0 && (
            <div className="bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {avgConfidence}% confidence
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : error ? (
          <div className="h-[240px] flex items-center justify-center text-muted-foreground">
            Unable to generate predictions. Please try again.
          </div>
        ) : predictions.length === 0 ? (
          <div className="h-[240px] flex items-center justify-center text-muted-foreground">
            Insufficient data for prediction
          </div>
        ) : (
          <>
            <div className="h-[200px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                  <defs>
                    <linearGradient id="colorPrediction" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="rgba(245, 158, 11, 0.8)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="rgba(245, 158, 11, 0.1)" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="day" 
                    tick={{ fontSize: 10 }} 
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 10 }} 
                    tickLine={false}
                    label={{ value: 'kWh', angle: -90, position: 'insideLeft', fontSize: 10, dy: 50 }}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`${value} kWh`, 'Predicted']}
                    labelFormatter={(label) => `Forecast: ${label}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="rgba(245, 158, 11, 1)" 
                    fillOpacity={1} 
                    fill="url(#colorPrediction)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Prediction period</span>
                <span>{predictionDays} days</span>
              </div>
              <Slider
                defaultValue={[predictionDays]}
                max={14}
                min={3}
                step={1}
                onValueChange={handlePredictionDaysChange}
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PredictionsCard;
