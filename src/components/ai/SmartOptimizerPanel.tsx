
// components/ai/SmartOptimizerPanel.tsx
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { Zap, Battery, TrendingUp, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface OptimizationData {
  action: string;
  roi: number;
  battery_health: number;
  grid_export: number;
  confidence: number;
  timestamp?: string;
}

const SmartOptimizerPanel = () => {
  const [data, setData] = useState<OptimizationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchOptimization = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/optimize');
      setData(response.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch optimization data';
      setError(errorMessage);
      toast({ 
        title: 'Optimization Error', 
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOptimization();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchOptimization, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    toast({ 
      title: 'Refreshing Optimization', 
      description: 'Fetching latest AI recommendations...'
    });
    fetchOptimization();
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2 text-amber-500" />
            AI Smart Optimization
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRefresh} 
            disabled={loading}
            className="h-8 px-2 text-xs"
          >
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              "Refresh"
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading && !data ? (
          <div className="py-8 flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary/70" />
          </div>
        ) : error && !data ? (
          <div className="py-6 text-center">
            <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Unable to load optimization data</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2" 
              onClick={fetchOptimization}
            >
              Try Again
            </Button>
          </div>
        ) : data ? (
          <>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className={cn(
                "flex flex-col justify-between p-3 rounded-md",
                "bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/20"
              )}>
                <span className="text-xs font-medium text-muted-foreground">Dispatch Action</span>
                <div className="mt-2 flex items-center">
                  <TrendingUp className="h-4 w-4 text-amber-500 mr-1.5" />
                  <span className="font-semibold">{data.action}</span>
                </div>
              </div>
              <div className={cn(
                "flex flex-col justify-between p-3 rounded-md",
                "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20"
              )}>
                <span className="text-xs font-medium text-muted-foreground">ROI Score</span>
                <div className="mt-2 flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1.5" />
                  <span className="font-semibold">{data.roi.toFixed(2)}%</span>
                </div>
              </div>
              <div className={cn(
                "flex flex-col justify-between p-3 rounded-md",
                "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20"
              )}>
                <span className="text-xs font-medium text-muted-foreground">Battery Health</span>
                <div className="mt-2 flex items-center">
                  <Battery className="h-4 w-4 text-blue-500 mr-1.5" />
                  <span className="font-semibold">{data.battery_health}%</span>
                </div>
              </div>
              <div className={cn(
                "flex flex-col justify-between p-3 rounded-md",
                "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20"
              )}>
                <span className="text-xs font-medium text-muted-foreground">Grid Export</span>
                <div className="mt-2 flex items-center">
                  <Zap className="h-4 w-4 text-purple-500 mr-1.5" />
                  <span className="font-semibold">{data.grid_export.toFixed(2)} kWh</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-2">
              <span>AI Confidence: {(data.confidence * 100).toFixed(0)}%</span>
              {data.timestamp && (
                <span>Updated: {new Date(data.timestamp).toLocaleTimeString()}</span>
              )}
            </div>
          </>
        ) : (
          <div className="py-6 text-center text-muted-foreground">
            <p>No optimization data available.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartOptimizerPanel;
