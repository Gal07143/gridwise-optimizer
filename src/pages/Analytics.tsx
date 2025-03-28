import React, { useState } from 'react';
import { Main } from '@/components/ui/main';
import AnalyticsHeader from '@/components/analytics/AnalyticsHeader';
import TimeframeSelector from '@/components/analytics/TimeframeSelector';
import ComparisonToggle from '@/components/analytics/ComparisonToggle';
import PredictionsCard from '@/components/analytics/PredictionsCard';
import SystemRecommendationsCard from '@/components/analytics/SystemRecommendationsCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useSiteContext } from '@/contexts/SiteContext';

// Analytics tab components
import GenerationTab from '@/components/analytics/tabs/GenerationTab';
import ConsumptionTab from '@/components/analytics/tabs/ConsumptionTab';
import CostTab from '@/components/analytics/tabs/CostTab';
import InsightsTab from '@/components/analytics/tabs/InsightsTab';

const Analytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState('generation');
  const { activeSite, loading, error } = useSiteContext();

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
      <AnalyticsHeader />
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
              <TimeframeSelector />
              <ComparisonToggle />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PredictionsCard />
          <SystemRecommendationsCard />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="generation">Generation</TabsTrigger>
            <TabsTrigger value="consumption">Consumption</TabsTrigger>
            <TabsTrigger value="cost">Cost</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>
          <TabsContent value="generation" className="space-y-6">
            <GenerationTab />
          </TabsContent>
          <TabsContent value="consumption" className="space-y-6">
            <ConsumptionTab />
          </TabsContent>
          <TabsContent value="cost" className="space-y-6">
            <CostTab />
          </TabsContent>
          <TabsContent value="insights" className="space-y-6">
            <InsightsTab />
          </TabsContent>
        </Tabs>
      </div>
    </Main>
  );
};

export default Analytics;
