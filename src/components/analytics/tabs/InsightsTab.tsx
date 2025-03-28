
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import PredictionsCard from '@/components/analytics/PredictionsCard';
import SystemRecommendationsCard from '@/components/analytics/SystemRecommendationsCard';
import usePredictions from '@/hooks/usePredictions';

interface InsightsTabProps {
  timeframe: 'day' | 'week' | 'month' | 'year';
}

const InsightsTab: React.FC<InsightsTabProps> = ({ timeframe }) => {
  const { 
    recommendations, 
    isLoading, 
    error, 
    refetch
  } = usePredictions(timeframe);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={refetch}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Insights
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PredictionsCard timeframe={timeframe} />
        <SystemRecommendationsCard 
          recommendations={recommendations}
          isLoading={isLoading}
        />
      </div>
      
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-2">
            Understanding Your Energy Insights
          </h3>
          <p className="text-muted-foreground">
            Our AI-powered prediction engine analyzes your historical data to provide 
            accurate forecasts and actionable recommendations. These insights can help 
            you optimize energy consumption, reduce costs, and increase efficiency.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default InsightsTab;
