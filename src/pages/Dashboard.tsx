
import React, { useState } from 'react';
import { DashboardLayout, DashboardGrid, DashboardCard } from '@/components/ui/dashboard/DashboardLayout';
import { useMicrogrid } from '@/components/microgrid/MicrogridProvider';
import { EnhancedEnergyFlow } from '@/components/energy';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronRight, Activity, Zap, BarChart3, Calendar, Battery, Sun, PlugZap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { state } = useMicrogrid();
  const [activeTab, setActiveTab] = useState("overview");

  // Format numbers with appropriate units
  const formatEnergy = (value: number) => `${value.toFixed(1)} kWh`;
  const formatPower = (value: number) => `${value.toFixed(1)} kW`;
  const formatPercent = (value: number) => `${value.toFixed(0)}%`;

  return (
    <div className="w-full">
      <DashboardHeader />
      
      <Tabs 
        defaultValue="overview" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-6 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
            Overview
          </TabsTrigger>
          <TabsTrigger value="consumption" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
            Consumption
          </TabsTrigger>
          <TabsTrigger value="production" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
            Production
          </TabsTrigger>
          <TabsTrigger value="forecast" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
            Forecast
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="m-0">
          <DashboardLayout>
            {/* Energy Flow Visualization */}
            <DashboardCard className="mb-6 col-span-full">
              <h3 className="text-lg font-semibold mb-4">Live Energy Flow</h3>
              <div className="h-[300px] w-full">
                <EnhancedEnergyFlow />
              </div>
            </DashboardCard>
            
            {/* Key Metrics */}
            <DashboardGrid columns={4}>
              <DashboardCard gradient className="flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <Battery className="h-5 w-5 text-blue-500" />
                  </div>
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Battery</span>
                </div>
                <div className="mt-auto">
                  <h3 className="text-2xl font-semibold mb-1">{formatPercent(state.batteryLevel)}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <Progress value={state.batteryLevel} className="h-2" />
                    <span className="text-xs text-slate-500">
                      {state.batteryCharging ? 'Charging' : 'Discharging'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{formatEnergy(state.batteryCapacity)}</p>
                </div>
              </DashboardCard>
              
              <DashboardCard gradient className="flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-yellow-500/10 rounded-lg">
                    <Sun className="h-5 w-5 text-yellow-500" />
                  </div>
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Solar</span>
                </div>
                <div className="mt-auto">
                  <h3 className="text-2xl font-semibold mb-1">{formatPower(state.solarProduction)}</h3>
                  <p className="text-xs text-slate-500 mb-2">{formatPercent(state.solarEfficiency)} efficiency</p>
                  <div className="inline-flex items-center text-xs text-green-500">
                    <Activity className="h-3 w-3 mr-1" />
                    Active
                  </div>
                </div>
              </DashboardCard>
              
              <DashboardCard gradient className="flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-red-500/10 rounded-lg">
                    <Zap className="h-5 w-5 text-red-500" />
                  </div>
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Load</span>
                </div>
                <div className="mt-auto">
                  <h3 className="text-2xl font-semibold mb-1">{formatPower(state.loadConsumption)}</h3>
                  <p className="text-xs text-slate-500 mb-2">Home Consumption</p>
                  <div className="inline-flex items-center text-xs text-slate-500">
                    <Activity className="h-3 w-3 mr-1" />
                    {state.loadConsumption > 5 ? 'High Usage' : 'Normal'}
                  </div>
                </div>
              </DashboardCard>
              
              <DashboardCard gradient className="flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-purple-500/10 rounded-lg">
                    <PlugZap className="h-5 w-5 text-purple-500" />
                  </div>
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Grid</span>
                </div>
                <div className="mt-auto">
                  <h3 className="text-2xl font-semibold mb-1">
                    {state.gridImport > 0 ? formatPower(state.gridImport) : formatPower(state.gridExport)}
                  </h3>
                  <p className="text-xs text-slate-500 mb-2">
                    {state.gridImport > 0 ? 'Importing' : 'Exporting'}
                  </p>
                  <div className="inline-flex items-center text-xs text-slate-500">
                    <Activity className="h-3 w-3 mr-1" />
                    Connected
                  </div>
                </div>
              </DashboardCard>
            </DashboardGrid>
            
            {/* Analytics and Schedule */}
            <DashboardGrid columns={2} className="mt-6">
              <DashboardCard>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Energy Analytics</h3>
                  <Button variant="outline" size="sm" className="text-xs">
                    View More <ChevronRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
                <div className="h-64 flex items-center justify-center bg-slate-50 dark:bg-slate-800/30 rounded-lg">
                  <BarChart3 className="h-10 w-10 text-slate-300 dark:text-slate-600" />
                </div>
              </DashboardCard>
              
              <DashboardCard>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Upcoming Events</h3>
                  <Button variant="outline" size="sm" className="text-xs">
                    View All <ChevronRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-slate-50 dark:bg-slate-800/30 rounded-lg">
                    <div className="p-2 mr-3 bg-blue-500/10 rounded">
                      <Calendar className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Battery Charge</p>
                      <p className="text-xs text-slate-500">Today, 2:00 PM - 4:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-slate-50 dark:bg-slate-800/30 rounded-lg">
                    <div className="p-2 mr-3 bg-yellow-500/10 rounded">
                      <Calendar className="h-4 w-4 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Peak Shaving</p>
                      <p className="text-xs text-slate-500">Today, 6:00 PM - 8:00 PM</p>
                    </div>
                  </div>
                </div>
              </DashboardCard>
            </DashboardGrid>
          </DashboardLayout>
        </TabsContent>
        
        <TabsContent value="consumption">
          <div className="p-8 text-center">
            <h3 className="text-xl font-semibold">Consumption Analytics</h3>
            <p className="text-slate-500">Detailed consumption data will be displayed here</p>
          </div>
        </TabsContent>
        
        <TabsContent value="production">
          <div className="p-8 text-center">
            <h3 className="text-xl font-semibold">Production Analytics</h3>
            <p className="text-slate-500">Solar and other generation data will be displayed here</p>
          </div>
        </TabsContent>
        
        <TabsContent value="forecast">
          <div className="p-8 text-center">
            <h3 className="text-xl font-semibold">Energy Forecast</h3>
            <p className="text-slate-500">AI-powered forecasts will be displayed here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
