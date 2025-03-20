
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import AnalyticsHeader from '@/components/analytics/AnalyticsHeader';
import TimeframeSelector from '@/components/analytics/TimeframeSelector';
import GenerationTab from '@/components/analytics/tabs/GenerationTab';
import ConsumptionTab from '@/components/analytics/tabs/ConsumptionTab';
import CostTab from '@/components/analytics/tabs/CostTab';
import InsightsTab from '@/components/analytics/tabs/InsightsTab';
import { useSite } from '@/contexts/SiteContext';
import ComparisonToggle from '@/components/analytics/ComparisonToggle';
import { LineChart, BarChart, DollarSign, Lightbulb, FileBarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

// Sample data for charts
const monthlyGenerationData = [
  { time: 'Jan', value: 420, comparison: 380 },
  { time: 'Feb', value: 380, comparison: 350 },
  { time: 'Mar', value: 450, comparison: 410 },
  { time: 'Apr', value: 520, comparison: 470 },
  { time: 'May', value: 580, comparison: 500 },
  { time: 'Jun', value: 620, comparison: 540 },
  { time: 'Jul', value: 650, comparison: 570 },
  { time: 'Aug', value: 630, comparison: 560 },
  { time: 'Sep', value: 580, comparison: 510 },
  { time: 'Oct', value: 510, comparison: 470 },
  { time: 'Nov', value: 460, comparison: 420 },
  { time: 'Dec', value: 430, comparison: 390 }
];

const weeklyEnergyData = [
  { time: 'Mon', value: 42, comparison: 38 },
  { time: 'Tue', value: 38, comparison: 35 },
  { time: 'Wed', value: 45, comparison: 41 },
  { time: 'Thu', value: 52, comparison: 47 },
  { time: 'Fri', value: 58, comparison: 50 },
  { time: 'Sat', value: 62, comparison: 54 },
  { time: 'Sun', value: 65, comparison: 57 }
];

const peakDemandData = [
  { time: '6am', value: 12, comparison: 10 },
  { time: '9am', value: 38, comparison: 35 },
  { time: '12pm', value: 45, comparison: 41 },
  { time: '3pm', value: 52, comparison: 47 },
  { time: '6pm', value: 58, comparison: 50 },
  { time: '9pm', value: 42, comparison: 38 },
  { time: '12am', value: 25, comparison: 23 }
];

const energySourcesData = [
  { name: 'Solar', value: 65 },
  { name: 'Wind', value: 15 },
  { name: 'Grid Import', value: 10 },
  { name: 'Battery', value: 10 }
];

const topConsumersData = [
  { device: 'HVAC System', consumption: 245, change: '-5%' },
  { device: 'EV Charger', consumption: 180, change: '+12%' },
  { device: 'Kitchen Appliances', consumption: 120, change: '-2%' },
  { device: 'Lighting', consumption: 95, change: '-8%' },
  { device: 'Electronics', consumption: 75, change: '+3%' }
];

const costBreakdownData = [
  { category: 'Peak Hours', cost: 180 },
  { category: 'Off-Peak', cost: 90 },
  { category: 'Demand Charges', cost: 70 },
  { category: 'Fixed Costs', cost: 45 },
  { category: 'Taxes & Fees', cost: 35 }
];

const Analytics = () => {
  const { currentSite } = useSite();
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState('week');
  const [dataComparisonEnabled, setDataComparisonEnabled] = useState(false);
  
  const handleCreateReport = () => {
    navigate('/reports');
    setTimeout(() => {
      toast.info('Create a new custom report to analyze your energy data in detail.');
    }, 300);
  };
  
  return (
    <AppLayout>
      <div className="animate-in fade-in duration-500 p-6">
        <AnalyticsHeader 
          timeframe={timeframe}
          setTimeframe={setTimeframe}
          dataComparisonEnabled={dataComparisonEnabled}
          setDataComparisonEnabled={setDataComparisonEnabled}
        />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
          <TimeframeSelector 
            timeframe={timeframe}
            setTimeframe={setTimeframe}
          />
          
          <div className="flex items-center gap-2">
            <ComparisonToggle 
              timeframe={timeframe}
              dataComparisonEnabled={dataComparisonEnabled}
              setDataComparisonEnabled={setDataComparisonEnabled}
            />
            
            <Button
              variant="outline"
              size="sm"
              className="ml-2"
              onClick={handleCreateReport}
            >
              <FileBarChart className="h-4 w-4 mr-2" />
              Create Report
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="generation" className="space-y-4">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="generation">
              <LineChart className="h-4 w-4 mr-2" />
              Generation
            </TabsTrigger>
            <TabsTrigger value="consumption">
              <BarChart className="h-4 w-4 mr-2" />
              Consumption
            </TabsTrigger>
            <TabsTrigger value="cost">
              <DollarSign className="h-4 w-4 mr-2" />
              Cost
            </TabsTrigger>
            <TabsTrigger value="insights">
              <Lightbulb className="h-4 w-4 mr-2" />
              Insights
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="generation" className="space-y-4">
            <GenerationTab
              monthlyGenerationData={monthlyGenerationData}
              dataComparisonEnabled={dataComparisonEnabled}
            />
          </TabsContent>
          
          <TabsContent value="consumption" className="space-y-4">
            <ConsumptionTab
              weeklyEnergyData={weeklyEnergyData}
              peakDemandData={peakDemandData}
              energySourcesData={energySourcesData}
              topConsumersData={topConsumersData}
              costBreakdownData={costBreakdownData}
              dataComparisonEnabled={dataComparisonEnabled}
            />
          </TabsContent>
          
          <TabsContent value="cost" className="space-y-4">
            <CostTab
              costBreakdownData={costBreakdownData}
              monthlyGenerationData={monthlyGenerationData}
            />
          </TabsContent>
          
          <TabsContent value="insights" className="space-y-4">
            <InsightsTab
              timeframe={timeframe}
              customData={monthlyGenerationData}
            />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Analytics;
