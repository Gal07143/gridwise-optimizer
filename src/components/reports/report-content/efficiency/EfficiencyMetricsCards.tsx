
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingDown, TrendingUp } from 'lucide-react';

interface EfficiencyMetricsCardsProps {
  data: {
    overall_efficiency?: number;
    efficiency_trend?: number;
    energy_used?: number;
    energy_lost?: number;
    period?: string;
    efficiency_percentage?: number;
  };
}

const EfficiencyMetricsCards: React.FC<EfficiencyMetricsCardsProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-sm font-medium">Overall Efficiency</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline">
            <div className="text-2xl font-bold">
              {data.overall_efficiency || 85}%
            </div>
            {data.efficiency_trend && (
              <Badge 
                className={`ml-2 ${data.efficiency_trend > 0 ? 'bg-green-500' : 'bg-red-500'}`}
              >
                {data.efficiency_trend > 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {Math.abs(data.efficiency_trend)}%
              </Badge>
            )}
          </div>
          <Progress 
            value={data.overall_efficiency || 85} 
            className="h-2 mt-2"
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-sm font-medium">Energy Used</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data.energy_used?.toLocaleString() || 3500} kWh
          </div>
          {data.period && (
            <p className="text-xs text-muted-foreground mt-1">
              Period: {data.period}
            </p>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-sm font-medium">Energy Lost</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data.energy_lost?.toLocaleString() || 450} kWh
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {data.efficiency_percentage || 85}% efficiency
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EfficiencyMetricsCards;
