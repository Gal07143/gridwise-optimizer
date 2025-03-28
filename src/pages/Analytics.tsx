
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AnalyticsHeader from '@/components/analytics/AnalyticsHeader';
import TimeframeSelector from '@/components/analytics/TimeframeSelector';
import ComparisonToggle from '@/components/analytics/ComparisonToggle';
import GenerationTab from '@/components/analytics/tabs/GenerationTab';
import ConsumptionTab from '@/components/analytics/tabs/ConsumptionTab';
import CostTab from '@/components/analytics/tabs/CostTab';
import InsightsTab from '@/components/analytics/tabs/InsightsTab';
import PredictionsCard from '@/components/analytics/PredictionsCard';
import SystemRecommendationsCard from '@/components/analytics/SystemRecommendationsCard';
import usePredictions from '@/hooks/usePredictions';

// Sample data for the analytics dashboard
const sampleWeeklyEnergyData = [
  { day: 'Mon', value: 45 },
  { day: 'Tue', value: 52 },
  { day: 'Wed', value: 49 },
  { day: 'Thu', value: 63 },
  { day: 'Fri', value: 59 },
  { day: 'Sat', value: 38 },
  { day: 'Sun', value: 35 },
];

const samplePeakDemandData = [
  { time: '6:00', value: 3.2 },
  { time: '9:00', value: 4.5 },
  { time: '12:00', value: 6.8 },
  { time: '15:00', value: 7.2 },
  { time: '18:00', value: 5.6 },
  { time: '21:00', value: 4.1 },
];

const sampleEnergySourcesData = [
  { name: 'Solar', value: 42 },
  { name: 'Grid', value: 35 },
  { name: 'Battery', value: 23 },
];

const sampleTopConsumersData = [
  { name: 'HVAC', value: 38 },
  { name: 'Lighting', value: 24 },
  { name: 'Appliances', value: 20 },
  { name: 'EV Charging', value: 18 },
];

const sampleMonthlyGenerationData = [
  { month: 'Jan', solar: 320, wind: 120 },
  { month: 'Feb', solar: 380, wind: 150 },
  { month: 'Mar', solar: 420, wind: 180 },
  { month: 'Apr', solar: 450, wind: 220 },
  { month: 'May', solar: 520, wind: 250 },
  { month: 'Jun', solar: 580, wind: 190 },
];

const sampleCostBreakdownData = [
  { category: 'Generation', value: 45 },
  { category: 'Transmission', value: 25 },
  { category: 'Distribution', value: 18 },
  { category: 'Taxes', value: 12 },
];

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('generation');
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const [dataComparisonEnabled, setDataComparisonEnabled] = useState(false);
  
  const { recommendations, isLoading } = usePredictions(timeframe);

  // Wrapper function to handle timeframe changes with proper typing
  const handleTimeframeChange = (value: 'day' | 'week' | 'month' | 'year') => {
    setTimeframe(value);
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <AnalyticsHeader 
          timeframe={timeframe} 
          setTimeframe={handleTimeframeChange}
          dataComparisonEnabled={dataComparisonEnabled}
          setDataComparisonEnabled={setDataComparisonEnabled}
        />
        
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <Tabs defaultValue="generation" value={activeTab} onValueChange={setActiveTab}>
              <div className="px-6 pt-6">
                <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                  <TabsList>
                    <TabsTrigger value="generation">Generation</TabsTrigger>
                    <TabsTrigger value="consumption">Consumption</TabsTrigger>
                    <TabsTrigger value="cost">Cost</TabsTrigger>
                    <TabsTrigger value="insights">Insights</TabsTrigger>
                  </TabsList>
                  <div className="flex gap-2">
                    <TimeframeSelector timeframe={timeframe} setTimeframe={handleTimeframeChange} />
                    <ComparisonToggle timeframe={timeframe} dataComparisonEnabled={dataComparisonEnabled} setDataComparisonEnabled={setDataComparisonEnabled} />
                  </div>
                </div>
              </div>
              
              <TabsContent value="generation">
                <GenerationTab monthlyGenerationData={sampleMonthlyGenerationData} dataComparisonEnabled={dataComparisonEnabled} />
              </TabsContent>
              
              <TabsContent value="consumption">
                <ConsumptionTab 
                  weeklyEnergyData={sampleWeeklyEnergyData}
                  peakDemandData={samplePeakDemandData}
                  energySourcesData={sampleEnergySourcesData}
                  topConsumersData={sampleTopConsumersData}
                  dataComparisonEnabled={dataComparisonEnabled}
                  costBreakdownData={sampleCostBreakdownData}
                />
              </TabsContent>
              
              <TabsContent value="cost">
                <CostTab 
                  costBreakdownData={sampleCostBreakdownData}
                  monthlyGenerationData={sampleMonthlyGenerationData}
                />
              </TabsContent>
              
              <TabsContent value="insights">
                <InsightsTab timeframe={timeframe} />
              </TabsContent>
            </Tabs>
          </Card>
          
          <div className="space-y-6">
            <PredictionsCard timeframe={timeframe} />
            <SystemRecommendationsCard recommendations={recommendations} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Analytics;
