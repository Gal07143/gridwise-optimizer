
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { equipmentService } from '@/services/equipmentService';
import { LoadForecast } from '@/types/equipment';

const LoadForecastComponent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [forecasts, setForecasts] = useState<LoadForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForecasts = async () => {
      try {
        if (!id) return;
        const data = await equipmentService.getLoadForecasts(id, 'daily', 7);
        setForecasts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch load forecasts');
      } finally {
        setLoading(false);
      }
    };

    fetchForecasts();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Load Forecasting</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {forecasts.map((forecast) => (
              <Card key={forecast.id}>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Forecast Type</Label>
                      <div className="text-sm font-medium">{forecast.forecastType || forecast.forecastPeriod}</div>
                    </div>
                    <div>
                      <Label>Value</Label>
                      <div className="text-sm font-medium">
                        {forecast.value || forecast.predicted_load || forecast.predictedLoad} {forecast.unit || 'kWh'}
                      </div>
                    </div>
                    <div>
                      <Label>Start Time</Label>
                      <div className="text-sm font-medium">
                        {new Date(forecast.startTime || forecast.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <Label>End Time</Label>
                      <div className="text-sm font-medium">
                        {forecast.endTime ? 
                          new Date(forecast.endTime).toLocaleString() : 
                          new Date(new Date(forecast.timestamp).getTime() + 24*60*60*1000).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <Label>Confidence</Label>
                      <div className="text-sm font-medium">
                        {forecast.confidence || 
                          (forecast.confidenceInterval?.upper ? 
                            Math.round((1 - forecast.confidenceInterval.upper/
                              (forecast.predicted_load || forecast.predictedLoad || 0)) * 100) : 0
                          )
                        }%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoadForecastComponent;
