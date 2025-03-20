
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

const Analytics = () => {
  const { currentSite } = useSite();
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState('week');
  const [showComparison, setShowComparison] = useState(false);
  
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
          siteName={currentSite?.name || 'Loading...'}
          siteLastUpdated={new Date().toISOString()}
        />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
          <TimeframeSelector value={timeframe} onChange={setTimeframe} />
          
          <div className="flex items-center gap-2">
            <ComparisonToggle
              checked={showComparison}
              onCheckedChange={setShowComparison}
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
              timeframe={timeframe}
              showComparison={showComparison}
              siteId={currentSite?.id || ''}
            />
          </TabsContent>
          
          <TabsContent value="consumption" className="space-y-4">
            <ConsumptionTab 
              timeframe={timeframe}
              showComparison={showComparison}
              siteId={currentSite?.id || ''}
            />
          </TabsContent>
          
          <TabsContent value="cost" className="space-y-4">
            <CostTab 
              timeframe={timeframe}
              showComparison={showComparison}
              siteId={currentSite?.id || ''}
            />
          </TabsContent>
          
          <TabsContent value="insights" className="space-y-4">
            <InsightsTab 
              timeframe={timeframe}
              siteId={currentSite?.id || ''}
            />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Analytics;
