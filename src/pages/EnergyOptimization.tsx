
import React, { useState } from 'react';
import { Main } from '@/components/ui/main';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Settings, Share2, ThermometerSun } from 'lucide-react';
import DynamicTariffChart from '@/components/tariffs/DynamicTariffChart';
import SelfSufficiencyCard from '@/components/energy/SelfSufficiencyCard';
import HeatPumpControl from '@/components/heat-pump/HeatPumpControl';
import EVChargingControl from '@/components/ev-charging/EVChargingControl';
import RealtimeDispatchAdvice from '@/components/ai/RealtimeDispatchAdvice';

const EnergyOptimization: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <Main>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Energy Optimization</h1>
          <p className="text-muted-foreground">
            Optimize your energy usage, reduce costs, and maximize self-consumption
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tariffs">Tariffs & Pricing</TabsTrigger>
          <TabsTrigger value="heatpump">Heat Pump</TabsTrigger>
          <TabsTrigger value="ev">EV Charging</TabsTrigger>
          <TabsTrigger value="battery">Battery Control</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <RealtimeDispatchAdvice />
            
            <SelfSufficiencyCard className="lg:col-span-1" />
            
            <Card className="lg:col-span-3">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Energy Optimization Overview</CardTitle>
                <CardDescription>Current status of all energy optimization systems</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base flex items-center">
                          <ThermometerSun className="h-4 w-4 mr-2 text-amber-500" />
                          Heat Pump
                        </CardTitle>
                        <Button variant="ghost" size="sm" className="h-8 gap-1" 
                                onClick={() => setActiveTab('heatpump')}>
                          Configure
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p className="font-medium">Current mode: Heating</p>
                      <p>Target temperature: 21°C</p>
                      <p>Smart features: Active</p>
                    </CardContent>
                  </Card>
                  
                  {/* Similar summary cards for EV Charging and Battery Control would go here */}
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base flex items-center">
                          <ThermometerSun className="h-4 w-4 mr-2 text-blue-500" />
                          EV Charging
                        </CardTitle>
                        <Button variant="ghost" size="sm" className="h-8 gap-1" 
                                onClick={() => setActiveTab('ev')}>
                          Configure
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p className="font-medium">Status: Charging at 7.4 kW</p>
                      <p>Strategy: Smart Optimization</p>
                      <p>Current SOC: 42% of 80%</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base flex items-center">
                          <ThermometerSun className="h-4 w-4 mr-2 text-purple-500" />
                          Battery Control
                        </CardTitle>
                        <Button variant="ghost" size="sm" className="h-8 gap-1" 
                                onClick={() => setActiveTab('battery')}>
                          Configure
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p className="font-medium">Current SOC: 76%</p>
                      <p>Mode: Self-consumption</p>
                      <p>Today's cycles: 1.2</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="tariffs">
          <DynamicTariffChart />
        </TabsContent>
        
        <TabsContent value="heatpump">
          <HeatPumpControl />
        </TabsContent>
        
        <TabsContent value="ev">
          <EVChargingControl />
        </TabsContent>
        
        <TabsContent value="battery">
          <div className="h-[600px] flex items-center justify-center border rounded-lg p-4">
            <div className="text-center">
              <p className="text-muted-foreground">Battery control interface will be displayed here.</p>
              <p className="text-sm text-muted-foreground mt-2">
                This section will allow you to configure and manage your home battery system.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Main>
  );
};

export default EnergyOptimization;
