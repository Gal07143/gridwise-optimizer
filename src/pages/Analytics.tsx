
import React, { useState } from 'react';
import { Main } from '@/components/ui/main';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart2, LineChart, Activity, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSiteContext } from '@/contexts/SiteContext';

import TimeframeSelector from '@/components/analytics/TimeframeSelector';
import AnalyticsHeader from '@/components/analytics/AnalyticsHeader';
import ComparisonToggle from '@/components/analytics/ComparisonToggle';
import ConsumptionTab from '@/components/analytics/tabs/ConsumptionTab';
import GenerationTab from '@/components/analytics/tabs/GenerationTab';
import CostTab from '@/components/analytics/tabs/CostTab';
import InsightsTab from '@/components/analytics/tabs/InsightsTab';
import LoadingScreen from '@/components/LoadingScreen';

// Analytics tabs
const tabs = [
  {
    id: 'consumption',
    label: 'Consumption',
    icon: <BarChart2 className="h-4 w-4 mr-2" />,
  },
  {
    id: 'generation',
    label: 'Generation',
    icon: <Zap className="h-4 w-4 mr-2" />,
  },
  {
    id: 'cost',
    label: 'Cost',
    icon: <LineChart className="h-4 w-4 mr-2" />,
  },
  {
    id: 'insights',
    label: 'Insights',
    icon: <Activity className="h-4 w-4 mr-2" />,
  },
];

const timeframeOptions = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
];

const Analytics: React.FC = () => {
  const { activeSite, loading } = useSiteContext();
  const [activeTab, setActiveTab] = useState('consumption');
  const [timeframe, setTimeframe] = useState('week');
  const [showComparison, setShowComparison] = useState(false);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Main containerSize="default" className="max-w-[1600px] mx-auto pt-0">
      <AnalyticsHeader 
        timeframe={timeframe}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <TimeframeSelector
            timeframe={timeframe}
            onChange={setTimeframe}
            options={timeframeOptions}
          />
          <ComparisonToggle 
            checked={showComparison} 
            onCheckedChange={setShowComparison}
            timeframe={timeframe}
          />
        </div>
        <Button variant="outline" size="sm">Export Data</Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm mb-6 -mx-4 px-4 pt-2 pb-2">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-gray-100/50 dark:bg-gray-900/50 backdrop-blur-md p-1 rounded-lg">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-md transition-all duration-200"
              >
                {tab.icon}
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="consumption" className="space-y-6 animate-in fade-in">
          <ConsumptionTab 
            timeframe={timeframe} 
            showComparison={showComparison} 
          />
        </TabsContent>

        <TabsContent value="generation" className="space-y-6 animate-in fade-in">
          <GenerationTab 
            timeframe={timeframe} 
            showComparison={showComparison} 
          />
        </TabsContent>

        <TabsContent value="cost" className="space-y-6 animate-in fade-in">
          <CostTab 
            timeframe={timeframe} 
            showComparison={showComparison} 
          />
        </TabsContent>

        <TabsContent value="insights" className="space-y-6 animate-in fade-in">
          <InsightsTab timeframe={timeframe} />
        </TabsContent>
      </Tabs>
    </Main>
  );
};

export default Analytics;
