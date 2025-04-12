
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, BarChart, PieChart, AreaChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EnergyFlowVisualization from '@/components/dashboard/EnergyFlowVisualization';
import EnergyForecastCard from '@/components/dashboard/EnergyForecastCard';

interface EnergyMonitoringDashboardProps {
  className?: string;
  siteId?: string;
}

const EnergyMonitoringDashboard: React.FC<EnergyMonitoringDashboardProps> = ({
  className,
  siteId
}) => {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('day');
  
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Energy Monitoring</h2>
        <div className="flex space-x-2">
          <Button
            variant={timeRange === 'day' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('day')}
          >
            Day
          </Button>
          <Button
            variant={timeRange === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('week')}
          >
            Week
          </Button>
          <Button
            variant={timeRange === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('month')}
          >
            Month
          </Button>
          <Button
            variant={timeRange === 'year' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('year')}
          >
            Year
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EnergyFlowVisualization />
        <EnergyForecastCard />
      </div>

      <Tabs defaultValue="consumption" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="consumption" className="flex items-center space-x-2">
            <LineChart className="w-4 h-4" />
            <span>Consumption</span>
          </TabsTrigger>
          <TabsTrigger value="generation" className="flex items-center space-x-2">
            <AreaChart className="w-4 h-4" />
            <span>Generation</span>
          </TabsTrigger>
          <TabsTrigger value="efficiency" className="flex items-center space-x-2">
            <PieChart className="w-4 h-4" />
            <span>Efficiency</span>
          </TabsTrigger>
          <TabsTrigger value="cost" className="flex items-center space-x-2">
            <BarChart className="w-4 h-4" />
            <span>Cost Analysis</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="consumption" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Energy Consumption Trends</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              {/* Placeholder for consumption chart */}
              <div className="h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-md">
                Energy consumption chart will be displayed here
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Peak Demand</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8.5 kW</div>
                <p className="text-xs text-muted-foreground">+5% from previous {timeRange}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Consumption</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">124 kWh</div>
                <p className="text-xs text-muted-foreground">-3% from previous {timeRange}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Load</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5.2 kW</div>
                <p className="text-xs text-muted-foreground">Stable from previous {timeRange}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="generation" className="space-y-6">
          {/* Generation content */}
          <Card>
            <CardHeader>
              <CardTitle>Energy Generation Analysis</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <div className="h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-md">
                Energy generation chart will be displayed here
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Peak Generation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7.2 kW</div>
                <p className="text-xs text-green-500">+8% from previous {timeRange}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Generation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">98 kWh</div>
                <p className="text-xs text-green-500">+12% from previous {timeRange}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Weather Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">High</div>
                <p className="text-xs text-muted-foreground">Clear skies improved output</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="efficiency" className="space-y-6">
          {/* Efficiency content */}
          <Card>
            <CardHeader>
              <CardTitle>System Efficiency Analysis</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <div className="h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-md">
                Efficiency chart will be displayed here
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Self-Consumption</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">76%</div>
                <p className="text-xs text-green-500">+5% from previous {timeRange}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">System Losses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4%</div>
                <p className="text-xs text-green-500">-1% from previous {timeRange}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Battery Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">92%</div>
                <p className="text-xs text-muted-foreground">Good cycling behavior</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="cost" className="space-y-6">
          {/* Cost Analysis content */}
          <Card>
            <CardHeader>
              <CardTitle>Cost Analysis</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <div className="h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-md">
                Cost analysis chart will be displayed here
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45.20</div>
                <p className="text-xs text-green-500">+15% from previous {timeRange}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Grid Import Cost</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$18.75</div>
                <p className="text-xs text-green-500">-8% from previous {timeRange}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">ROI Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.2 yrs</div>
                <p className="text-xs text-green-500">Improved by 0.3 years</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnergyMonitoringDashboard;
