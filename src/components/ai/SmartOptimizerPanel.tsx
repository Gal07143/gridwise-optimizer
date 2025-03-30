// components/ai/SmartOptimizerPanel.tsx
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

const SmartOptimizerPanel = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchOptimization = async () => {
      try {
        const response = await axios.get('/api/optimize');
        setData(response.data);
      } catch (error) {
        toast({ title: 'Failed to fetch optimization data', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };

    fetchOptimization();
  }, []);

  if (loading) return <div className="p-4">Loading smart optimizer...</div>;
  if (!data) return <div className="p-4">No optimization data available.</div>;

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>AI Smart Optimization</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Dispatch Action</p>
            <p className="text-lg font-semibold">{data.action}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">ROI Score</p>
            <p className="text-lg font-semibold">{data.roi.toFixed(2)}%</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Battery Health</p>
            <p className="text-lg font-semibold">{data.battery_health}%</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Grid Export</p>
            <p className="text-lg font-semibold">{data.grid_export.toFixed(2)} kWh</p>
          </div>
        </div>
        <p className="text-xs mt-4 text-muted-foreground">AI Confidence: {data.confidence * 100}%</p>
      </CardContent>
    </Card>
  );
};

export default SmartOptimizerPanel;
