
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, BrainCircuit, TrendingUp, ArrowRight } from 'lucide-react';
import PredictionsCard from '@/components/analytics/PredictionsCard';
import SystemRecommendationsCard from '@/components/analytics/SystemRecommendationsCard';
import usePredictions from '@/hooks/usePredictions';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface InsightsTabProps {
  timeframe: string;
}

const InsightsTab: React.FC<InsightsTabProps> = ({ timeframe }) => {
  // Convert timeframe string to the expected type
  const timeframeConverted = timeframe === 'day' || timeframe === 'week' || 
                        timeframe === 'month' || timeframe === 'year' 
                        ? timeframe : 'week';
  
  const navigate = useNavigate();
  
  const { 
    recommendations, 
    isLoading, 
    error, 
    refetch
  } = usePredictions(timeframeConverted);

  const handleRefetch = () => {
    toast.promise(refetch(), {
      loading: 'Refreshing energy insights...',
      success: 'Energy insights updated successfully',
      error: 'Failed to refresh energy insights',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefetch}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Insights
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PredictionsCard timeframe={timeframeConverted} />
        <SystemRecommendationsCard 
          recommendations={recommendations}
          isLoading={isLoading}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BrainCircuit className="h-5 w-5 mr-2 text-purple-500" />
              AI-Powered Energy Optimization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Our advanced AI algorithms can help optimize your energy usage patterns and save on costs while reducing your carbon footprint.
            </p>
            <Button 
              className="w-full" 
              onClick={() => navigate('/energy-optimization')}
            >
              Go to Optimization
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-2">
              Understanding Your Energy Insights
            </h3>
            <p className="text-muted-foreground mb-4">
              Our AI-powered prediction engine analyzes your historical data to provide 
              accurate forecasts and actionable recommendations. These insights can help 
              you optimize energy consumption, reduce costs, and increase efficiency.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="flex items-start">
                <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-md mr-3">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Predictive Analysis</h4>
                  <p className="text-xs text-muted-foreground">Forecasts based on historical patterns and weather data</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-md mr-3">
                  <BrainCircuit className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Smart Recommendations</h4>
                  <p className="text-xs text-muted-foreground">Personalized suggestions to improve energy efficiency</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InsightsTab;
