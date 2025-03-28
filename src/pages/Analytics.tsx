
import React, { useState } from 'react';
import { Main } from '@/components/ui/main';
import AnalyticsHeader from '@/components/analytics/AnalyticsHeader';
import TimeframeSelector from '@/components/analytics/TimeframeSelector';
import ComparisonToggle from '@/components/analytics/ComparisonToggle';
import PredictionsCard from '@/components/analytics/PredictionsCard';
import SystemRecommendationsCard from '@/components/analytics/SystemRecommendationsCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useSiteContext } from '@/contexts/SiteContext';
import usePredictions from '@/hooks/usePredictions';

// Analytics tab components
import GenerationTab from '@/components/analytics/tabs/GenerationTab';
import ConsumptionTab from '@/components/analytics/tabs/ConsumptionTab';
import CostTab from '@/components/analytics/tabs/CostTab';
import InsightsTab from '@/components/analytics/tabs/InsightsTab';

const Analytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState('generation');
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const [dataComparisonEnabled, setDataComparisonEnabled] = useState(false);
  const { activeSite, loading, error } = useSiteContext();
  const predictionData = usePredictions(timeframe);

  // Sample data for tabs
  const monthlyGenerationData = [
    { month: 'Jan', value: 120 },
    { month: 'Feb', value: 140 },
    { month: 'Mar', value: 160 },
    { month: 'Apr', value: 180 },
    { month: 'May', value: 220 },
    { month: 'Jun', value: 240 },
  ];

  const costBreakdownData = [
    { name: 'Solar', value: 35 },
    { name: 'Grid', value: 45 },
    { name: 'Battery', value: 20 },
  ];

  const weeklyEnergyData = [
    { day: 'Mon', value: 30 },
    { day: 'Tue', value: 40 },
    { day: 'Wed', value: 45 },
    { day: 'Thu', value: 35 },
    { day: 'Fri', value: 50 },
    { day: 'Sat', value: 35 },
    { day: 'Sun', value: 25 },
  ];

  const peakDemandData = [
    { time: '00:00', value: 20 },
    { time: '04:00', value: 15 },
    { time: '08:00', value: 35 },
    { time: '12:00', value: 45 },
    { time: '16:00', value: 60 },
    { time: '20:00', value: 50 },
  ];

  const energySourcesData = [
    { name: 'Solar', value: 45 },
    { name: 'Grid', value: 35 },
    { name: 'Battery', value: 20 },
  ];

  const topConsumersData = [
    { name: 'HVAC', value: 35 },
    { name: 'Appliances', value: 25 },
    { name: 'Lighting', value: 15 },
    { name: 'Electronics', value: 15 },
    { name: 'Other', value: 10 },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <Main>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error.message}
          </AlertDescription>
        </Alert>
      </Main>
    );
  }

  return (
    <Main>
      <AnalyticsHeader 
        timeframe={timeframe}
        setTimeframe={setTimeframe}
        dataComparisonEnabled={dataComparisonEnabled}
        setDataComparisonEnabled={setDataComparisonEnabled}
      />
      <div className="flex flex-col gap-4">
        <Card>
          <CardContent className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">Energy Analysis</h2>
              <p className="text-muted-foreground">
                Explore energy generation, consumption, and cost trends.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <TimeframeSelector 
                timeframe={timeframe}
                setTimeframe={setTimeframe}
              />
              <ComparisonToggle 
                timeframe={timeframe}
                dataComparisonEnabled={dataComparisonEnabled}
                setDataComparisonEnabled={setDataComparisonEnabled}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PredictionsCard timeframe={timeframe} />
          <SystemRecommendationsCard 
            recommendations={predictionData.recommendations}
            isLoading={predictionData.isLoading}
            onRefresh={predictionData.refetch}
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="generation">Generation</TabsTrigger>
            <TabsTrigger value="consumption">Consumption</TabsTrigger>
            <TabsTrigger value="cost">Cost</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>
          <TabsContent value="generation" className="space-y-6">
            <GenerationTab 
              monthlyGenerationData={monthlyGenerationData}
              dataComparisonEnabled={dataComparisonEnabled}
            />
          </TabsContent>
          <TabsContent value="consumption" className="space-y-6">
            <ConsumptionTab 
              weeklyEnergyData={weeklyEnergyData}
              peakDemandData={peakDemandData}
              energySourcesData={energySourcesData}
              topConsumersData={topConsumersData}
              dataComparisonEnabled={dataComparisonEnabled}
              timeframe={timeframe}
            />
          </TabsContent>
          <TabsContent value="cost" className="space-y-6">
            <CostTab 
              costBreakdownData={costBreakdownData}
              monthlyGenerationData={monthlyGenerationData}
            />
          </TabsContent>
          <TabsContent value="insights" className="space-y-6">
            <InsightsTab timeframe={timeframe} />
          </TabsContent>
        </Tabs>
      </div>
    </Main>
  );
};

export default Analytics;
