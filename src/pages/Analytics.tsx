
import React, { useState } from 'react';
import { Zap, Activity, BarChart } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import MetricsCard from '@/components/dashboard/MetricsCard';
import AnalyticsHeader from '@/components/analytics/AnalyticsHeader';
import ConsumptionTab from '@/components/analytics/tabs/ConsumptionTab';
import GenerationTab from '@/components/analytics/tabs/GenerationTab';
import CostTab from '@/components/analytics/tabs/CostTab';
import InsightsTab from '@/components/analytics/tabs/InsightsTab';
import {
  weeklyEnergyData,
  monthlyGenerationData,
  peakDemandData,
  energySourcesData,
  topConsumersData,
  costBreakdownData
} from '@/components/analytics/data/sampleData';

const Analytics = () => {
  const [timeframe, setTimeframe] = useState('week');
  const [dataComparisonEnabled, setDataComparisonEnabled] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-900 animate-fade-in">
          <AnalyticsHeader 
            timeframe={timeframe}
            setTimeframe={setTimeframe}
            dataComparisonEnabled={dataComparisonEnabled}
            setDataComparisonEnabled={setDataComparisonEnabled}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <MetricsCard 
              title="Total Energy Consumption" 
              value={2483} 
              unit="kWh"
              changeValue={8.2}
              changeType="increase"
              description="Last 30 days"
              icon={<Zap className="h-5 w-5" />}
            />
            <MetricsCard 
              title="Energy Cost" 
              value={403} 
              unit="$"
              changeValue={5.7}
              changeType="increase"
              description="Last 30 days"
              icon={<Activity className="h-5 w-5" />}
            />
            <MetricsCard 
              title="Carbon Footprint" 
              value={628} 
              unit="kg"
              changeValue={12.4}
              changeType="decrease"
              description="Last 30 days"
              icon={<BarChart className="h-5 w-5" />}
            />
          </div>
          
          <Tabs defaultValue="consumption" className="mb-6">
            <TabsList className="mb-4">
              <TabsTrigger value="consumption">Consumption</TabsTrigger>
              <TabsTrigger value="generation">Generation</TabsTrigger>
              <TabsTrigger value="cost">Cost Analysis</TabsTrigger>
              <TabsTrigger value="insights">Key Insights</TabsTrigger>
            </TabsList>
            
            <TabsContent value="consumption">
              <ConsumptionTab 
                weeklyEnergyData={weeklyEnergyData}
                peakDemandData={peakDemandData}
                energySourcesData={energySourcesData}
                topConsumersData={topConsumersData}
                costBreakdownData={costBreakdownData}
                dataComparisonEnabled={dataComparisonEnabled}
              />
            </TabsContent>
            
            <TabsContent value="generation">
              <GenerationTab 
                monthlyGenerationData={monthlyGenerationData}
                dataComparisonEnabled={dataComparisonEnabled}
              />
            </TabsContent>
            
            <TabsContent value="cost">
              <CostTab 
                costBreakdownData={costBreakdownData}
                monthlyGenerationData={monthlyGenerationData}
              />
            </TabsContent>
            
            <TabsContent value="insights">
              <InsightsTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
