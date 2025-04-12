import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Leaf, ThermometerSnowflake, Cloud, Wind, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface CarbonFootprintDashboardProps {
  className?: string;
  siteId?: string;
}

const CarbonFootprintDashboard: React.FC<CarbonFootprintDashboardProps> = ({
  className,
  siteId
}) => {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('month');
  
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Carbon & Environmental Impact</h2>
          <p className="text-muted-foreground">Track and optimize your environmental footprint</p>
        </div>
        
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
      
      {/* CO2 Savings Overview Card */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-100 dark:from-green-950/30 dark:to-emerald-900/30 border-green-100 dark:border-green-800/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-xl">
              <Leaf className="mr-2 h-5 w-5 text-green-600" />
              Carbon Footprint Reduction
            </CardTitle>
            <Button variant="outline" size="sm" className="bg-white/80 border-green-200 hover:bg-white">
              View Details
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>CO₂ Emissions Avoided</span>
                <span className="text-green-600">857 kg</span>
              </div>
              <Progress value={65} className="h-2 bg-green-100" indicatorClassName="bg-green-600" />
              <p className="text-xs text-green-700">
                +12% increase from previous {timeRange}
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Trees Equivalent</span>
                <span className="text-green-600">38 trees</span>
              </div>
              <Progress value={75} className="h-2 bg-green-100" indicatorClassName="bg-green-600" />
              <p className="text-xs text-green-700">
                Based on average CO₂ absorption
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Carbon Reduction Target</span>
                <span className="text-green-600">78% complete</span>
              </div>
              <Progress value={78} className="h-2 bg-green-100" indicatorClassName="bg-green-600" />
              <p className="text-xs text-green-700">
                On track to reach annual goal
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Environmental Impact Tabs */}
      <Tabs defaultValue="carbon" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="carbon" className="flex items-center space-x-2">
            <Leaf className="w-4 h-4" />
            <span>Carbon Impact</span>
          </TabsTrigger>
          <TabsTrigger value="energy" className="flex items-center space-x-2">
            <ThermometerSnowflake className="w-4 h-4" />
            <span>Energy Efficiency</span>
          </TabsTrigger>
          <TabsTrigger value="emissions" className="flex items-center space-x-2">
            <Cloud className="w-4 h-4" />
            <span>Emissions</span>
          </TabsTrigger>
          <TabsTrigger value="renewables" className="flex items-center space-x-2">
            <Wind className="w-4 h-4" />
            <span>Renewable %</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="carbon" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Carbon Impact Analysis</CardTitle>
              <CardDescription>
                Track your carbon footprint reduction over time
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <div className="h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-md">
                Carbon impact chart will be displayed here
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">CO₂ Reduction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">857 kg</div>
                <p className="text-xs text-green-500">Equals to 5,100 miles not driven</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Carbon Intensity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">82 g/kWh</div>
                <p className="text-xs text-green-500">-18% from grid average</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Annual Projection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.4 tons</div>
                <p className="text-xs text-green-500">Of CO₂ savings per year</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Other tabs content would follow similar structure */}
        <TabsContent value="energy" className="space-y-6">
          {/* Energy Efficiency Content */}
        </TabsContent>
        
        <TabsContent value="emissions" className="space-y-6">
          {/* Emissions Content */}
        </TabsContent>
        
        <TabsContent value="renewables" className="space-y-6">
          {/* Renewables Content */}
        </TabsContent>
      </Tabs>
      
      {/* Sustainability Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="mr-2 h-5 w-5 text-blue-500" />
            Sustainability Optimization Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-md border border-blue-100 dark:border-blue-800/30">
              <h4 className="font-medium text-blue-700 dark:text-blue-400">Shift EV Charging to Midday</h4>
              <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                Charging your EV between 10am-2pm would utilize 35% more solar energy and reduce carbon footprint by approximately 120kg per month.
              </p>
            </div>
            
            <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-md border border-amber-100 dark:border-amber-800/30">
              <h4 className="font-medium text-amber-700 dark:text-amber-400">Optimize Heating Schedule</h4>
              <p className="text-sm text-amber-600 dark:text-amber-300 mt-1">
                Pre-heating your home 30 minutes earlier would utilize battery stored solar energy rather than grid power during peak evening hours.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-md border border-green-100 dark:border-green-800/30">
              <h4 className="font-medium text-green-700 dark:text-green-400">Increase Battery Capacity</h4>
              <p className="text-sm text-green-600 dark:text-green-300 mt-1">
                Adding 5kWh more storage would increase your self-consumption rate by approximately 15% and avoid 230kg of CO₂ emissions annually.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CarbonFootprintDashboard;
