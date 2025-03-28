
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import AnalyticsHeader from '@/components/analytics/AnalyticsHeader';
import PredictionsCard from '@/components/analytics/PredictionsCard';
import TimeframeSelector from '@/components/analytics/TimeframeSelector';
import ComparisonToggle from '@/components/analytics/ComparisonToggle';
import SystemRecommendationsCard from '@/components/analytics/SystemRecommendationsCard';
import GenerationTab from '@/components/analytics/tabs/GenerationTab';
import ConsumptionTab from '@/components/analytics/tabs/ConsumptionTab';
import CostTab from '@/components/analytics/tabs/CostTab';
import InsightsTab from '@/components/analytics/tabs/InsightsTab';
import usePredictions from '@/hooks/usePredictions';

const Analytics = () => {
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const [dataComparisonEnabled, setDataComparisonEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState('generation');
  
  // Get prediction data using the hook
  const { predictions, recommendations, isLoading } = usePredictions(timeframe);
  
  // Sample data - in a real app, this would come from an API
  const monthlyGenerationData = [
    { day: 'Jan', value: 230 },
    { day: 'Feb', value: 250 },
    { day: 'Mar', value: 300 },
    { day: 'Apr', value: 350 },
    { day: 'May', value: 400 },
    { day: 'Jun', value: 450 },
    { day: 'Jul', value: 500 },
    { day: 'Aug', value: 480 },
    { day: 'Sep', value: 420 },
    { day: 'Oct', value: 380 },
    { day: 'Nov', value: 320 },
    { day: 'Dec', value: 270 }
  ];
  
  const weeklyEnergyData = [
    { day: 'Mon', value: 45 },
    { day: 'Tue', value: 52 },
    { day: 'Wed', value: 49 },
    { day: 'Thu', value: 47 },
    { day: 'Fri', value: 53 },
    { day: 'Sat', value: 56 },
    { day: 'Sun', value: 51 }
  ];
  
  const peakDemandData = [
    { time: '6am', value: 30 },
    { time: '9am', value: 75 },
    { time: '12pm', value: 85 },
    { time: '3pm', value: 70 },
    { time: '6pm', value: 90 },
    { time: '9pm', value: 60 },
    { time: '12am', value: 35 }
  ];
  
  const energySourcesData = [
    { name: 'Solar', value: 65 },
    { name: 'Grid', value: 25 },
    { name: 'Battery', value: 10 }
  ];
  
  const topConsumersData = [
    { name: 'HVAC', value: 35 },
    { name: 'Lighting', value: 20 },
    { name: 'Equipment', value: 30 },
    { name: 'Other', value: 15 }
  ];
  
  const costBreakdownData = [
    { name: 'Peak Hours', value: 65 },
    { name: 'Off-Peak', value: 35 }
  ];

  // Fixed setTimeframe handler to handle proper type
  const handleTimeframeChange = (value: 'day' | 'week' | 'month' | 'year') => {
    setTimeframe(value);
  };

  // Fixed setDataComparisonEnabled handler
  const handleComparisonToggle = (enabled: boolean) => {
    setDataComparisonEnabled(enabled);
  };

  return (
    <div className="container p-6 mx-auto">
      <AnalyticsHeader 
        timeframe={timeframe} 
        setTimeframe={handleTimeframeChange}
        dataComparisonEnabled={dataComparisonEnabled}
        setDataComparisonEnabled={handleComparisonToggle}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        <Card className="lg:col-span-8">
          <div className="p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="generation">Generation</TabsTrigger>
                  <TabsTrigger value="consumption">Consumption</TabsTrigger>
                  <TabsTrigger value="cost">Cost</TabsTrigger>
                  <TabsTrigger value="insights">Insights</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="flex items-center space-x-4">
                <TimeframeSelector timeframe={timeframe} setTimeframe={handleTimeframeChange} />
                <ComparisonToggle 
                  timeframe={timeframe}
                  dataComparisonEnabled={dataComparisonEnabled} 
                  setDataComparisonEnabled={handleComparisonToggle} 
                />
              </div>
            </div>
            
            <TabsContent value="generation" className="mt-0">
              <GenerationTab 
                monthlyGenerationData={monthlyGenerationData} 
                dataComparisonEnabled={dataComparisonEnabled} 
              />
            </TabsContent>
            
            <TabsContent value="consumption" className="mt-0">
              <ConsumptionTab 
                weeklyEnergyData={weeklyEnergyData}
                peakDemandData={peakDemandData}
                energySourcesData={energySourcesData}
                topConsumersData={topConsumersData}
                dataComparisonEnabled={dataComparisonEnabled}
              />
            </TabsContent>
            
            <TabsContent value="cost" className="mt-0">
              <CostTab 
                costBreakdownData={costBreakdownData} 
                monthlyGenerationData={monthlyGenerationData}
              />
            </TabsContent>
            
            <TabsContent value="insights" className="mt-0">
              <InsightsTab />
            </TabsContent>
          </div>
        </Card>
        
        <div className="lg:col-span-4 space-y-6">
          <PredictionsCard timeframe={timeframe} />
          
          <SystemRecommendationsCard 
            recommendations={recommendations} 
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
