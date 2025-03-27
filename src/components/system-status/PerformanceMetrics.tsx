
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PerformanceMetric } from '@/services/systemStatusService';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import LiveChart from '@/components/dashboard/LiveChart';

interface PerformanceMetricsProps {
  metrics: PerformanceMetric[];
  isLoading?: boolean;
}

export const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({
  metrics = [],
  isLoading = false,
}) => {
  const formatMetricData = (metric: PerformanceMetric) => {
    if (!metric.history) return [];
    
    return metric.history.map(point => ({
      time: new Date(point.timestamp).toLocaleTimeString(),
      value: point.value,
    }));
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };
  
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'stable': return <Minus className="h-4 w-4 text-muted-foreground" />;
      default: return null;
    }
  };
  
  const getChartColor = (status: string) => {
    switch (status) {
      case 'good': return 'rgba(34, 197, 94, 0.7)';
      case 'warning': return 'rgba(234, 179, 8, 0.7)';
      case 'critical': return 'rgba(239, 68, 68, 0.7)';
      default: return 'rgba(147, 147, 147, 0.7)';
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-44 w-full" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.map((metric) => (
              <Card key={metric.id} className="overflow-hidden">
                <CardHeader className="p-4 pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <CardTitle className="text-sm">{metric.name}</CardTitle>
                      <div className="flex items-baseline mt-1 gap-2">
                        <span className="text-2xl font-bold">{metric.value}</span>
                        <span className="text-sm">{metric.unit}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      {getTrendIcon(metric.trend)}
                      <span 
                        className={`${
                          metric.trend === 'up' && metric.change && metric.change > 0 ? 'text-green-500' : 
                          metric.trend === 'down' && metric.change && metric.change < 0 ? 'text-red-500' : 
                          'text-muted-foreground'
                        }`}
                      >
                        {metric.change ? (metric.change > 0 ? `+${metric.change}` : metric.change) : '0'}
                        {metric.unit === '%' ? '%' : ''}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-28">
                    <LiveChart
                      data={formatMetricData(metric)}
                      height={100}
                      color={getChartColor(metric.status)}
                      type="area"
                      showAxis={false}
                      showGrid={false}
                      gradientFrom={getChartColor(metric.status)}
                      gradientTo={`${getChartColor(metric.status).slice(0, -4)}0.05)`}
                    />
                  </div>
                  <div className="px-4 pb-3 pt-1 flex justify-between items-center border-t">
                    <div className="text-xs text-muted-foreground">
                      {metric.threshold ? `Threshold: ${metric.threshold}${metric.unit}` : 'No threshold set'}
                    </div>
                    <div className={`text-xs font-medium ${getStatusColor(metric.status)}`}>
                      {metric.status.charAt(0).toUpperCase() + metric.status.slice(1)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PerformanceMetrics;
