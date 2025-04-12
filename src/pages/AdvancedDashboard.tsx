
import React, { useState } from 'react';
import { Main } from '@/components/ui/main';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, ArrowRight, BatteryCharging, Building, Calendar, 
  Download, FlaskConical, Gauge, Home, LineChart, Maximize2, 
  PanelLeft, Receipt, RefreshCw, Search, Settings, Sun, Zap
} from 'lucide-react';
import { useTheme } from 'next-themes';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

const AdvancedDashboard: React.FC = () => {
  const { setTheme } = useTheme();
  const [activeView, setActiveView] = useState('overview');
  
  // Force dark theme for this page to match the black theme inspiration
  React.useEffect(() => {
    setTheme('dark');
    return () => {
      // Restore previous theme when leaving this page
      // In a real app, we'd store the previous theme and restore it
    };
  }, []);

  return (
    <Main className="bg-black text-white">
      <DashboardHeader title="System Details - Berlin 1" hideControls />
      
      <div className="flex items-center justify-between mb-6">
        <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
          <TabsList className="bg-gray-900 p-0">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-6 py-3"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="liveView" 
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-6 py-3"
            >
              Live View
            </TabsTrigger>
            <TabsTrigger 
              value="historical" 
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-6 py-3"
            >
              Historical View
            </TabsTrigger>
            <TabsTrigger 
              value="customer" 
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-6 py-3"
            >
              Customer
            </TabsTrigger>
            <TabsTrigger 
              value="appliances" 
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-6 py-3"
            >
              Appliances
            </TabsTrigger>
            <TabsTrigger 
              value="scada" 
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-6 py-3"
            >
              Scada
            </TabsTrigger>
            <TabsTrigger 
              value="journal" 
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-6 py-3"
            >
              System Journal
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <TabsContent value="overview" className="m-0">
        <div className="flex justify-center h-[600px] relative">
          {/* Grid visualization with live data */}
          <div className="w-full max-w-4xl">
            <div className="flex flex-col items-center">
              {/* Grid supply */}
              <div className="mb-16">
                <div className="text-center">
                  <div className="text-orange-500 text-3xl font-bold">3720 W</div>
                  <div className="text-orange-500 mb-2">Supply</div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="text-white">Grid</div>
                  <div className="w-32 h-1 bg-gray-800 mx-4 relative">
                    <div className="absolute w-3 h-3 bg-gray-600 rounded-full -top-1 left-1/2 transform -translate-x-1/2"></div>
                  </div>
                </div>
              </div>
              
              {/* Battery discharging */}
              <div className="mb-16">
                <div className="text-center">
                  <div className="text-yellow-500 text-3xl font-bold">3211 W</div>
                  <div className="text-yellow-500 mb-2">Discharging</div>
                  <div className="text-gray-400">Status: 70%</div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="text-white">Battery</div>
                  <div className="w-32 h-1 bg-gray-800 mx-4 relative">
                    <div className="absolute w-3 h-3 bg-gray-600 rounded-full -top-1 left-1/2 transform -translate-x-1/2"></div>
                  </div>
                </div>
              </div>
              
              {/* Solar production */}
              <div className="mb-16">
                <div className="text-center">
                  <div className="text-green-500 text-3xl font-bold">123 W</div>
                  <div className="text-green-500 mb-2">Production</div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="text-white">PV</div>
                  <div className="w-32 h-1 bg-gray-800 mx-4 relative">
                    <div className="absolute w-3 h-3 bg-gray-600 rounded-full -top-1 left-1/2 transform -translate-x-1/2"></div>
                  </div>
                </div>
              </div>
              
              {/* Fuel cell */}
              <div className="mb-16">
                <div className="text-center">
                  <div className="text-gray-400 text-3xl font-bold">0 W</div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="text-white">Fuelcell</div>
                  <div className="w-32 h-1 bg-gray-800 mx-4 relative">
                    <div className="absolute w-3 h-3 bg-gray-600 rounded-full -top-1 left-1/2 transform -translate-x-1/2"></div>
                  </div>
                </div>
              </div>
              
              {/* Central junction point */}
              <div className="w-4 h-4 bg-gray-600 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
              
              {/* Right side - consumption points */}
              <div className="absolute top-12 right-0 sm:right-40">
                <div className="text-right">
                  <div className="text-red-500 text-3xl font-bold">760 W</div>
                  <div className="text-red-500">Consumption</div>
                  <div className="flex items-center justify-end mt-2">
                    <div className="w-32 h-1 bg-gray-800 mr-4 relative">
                      <div className="absolute w-3 h-3 bg-gray-600 rounded-full -top-1 left-1/2 transform -translate-x-1/2"></div>
                    </div>
                    <div className="text-white">Heating</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-1/3 right-0 sm:right-40">
                <div className="text-right">
                  <div className="text-gray-400 text-3xl font-bold">0 W</div>
                  <div className="flex items-center justify-end mt-2">
                    <div className="w-32 h-1 bg-gray-800 mr-4 relative">
                      <div className="absolute w-3 h-3 bg-gray-600 rounded-full -top-1 left-1/2 transform -translate-x-1/2"></div>
                    </div>
                    <div className="text-white">Heat Pump</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-1/2 right-0 sm:right-40">
                <div className="text-right">
                  <div className="text-red-500 text-3xl font-bold">714 W</div>
                  <div className="text-red-500">Consumption</div>
                  <div className="flex items-center justify-end mt-2">
                    <div className="w-32 h-1 bg-gray-800 mr-4 relative">
                      <div className="absolute w-3 h-3 bg-gray-600 rounded-full -top-1 left-1/2 transform -translate-x-1/2"></div>
                    </div>
                    <div className="text-white">Household</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-3/4 right-0 sm:right-40">
                <div className="text-right">
                  <div className="text-red-500 text-3xl font-bold">5580 W</div>
                  <div className="text-red-500">Consumption</div>
                  <div className="flex items-center justify-end mt-2">
                    <div className="w-32 h-1 bg-gray-800 mr-4 relative">
                      <div className="absolute w-3 h-3 bg-gray-600 rounded-full -top-1 left-1/2 transform -translate-x-1/2"></div>
                    </div>
                    <div className="text-white">EV</div>
                  </div>
                </div>
              </div>
              
              {/* Horizontal connection lines */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-[500px] h-1 bg-gray-800"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer with branding */}
        <div className="mt-10 flex items-center">
          <div>
            <div className="text-xl font-medium tracking-wider text-gray-300">XENON</div>
            <div className="text-xs text-gray-500">by gridX</div>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="liveView" className="m-0">
        <div className="h-[600px] flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-400">Live view of energy flow will be displayed here.</p>
            <Button variant="outline" className="mt-4">View Live Data</Button>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="historical" className="m-0">
        <div className="h-[600px] flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-400">Historical data view will be displayed here.</p>
            <Button variant="outline" className="mt-4">Load Historical Data</Button>
          </div>
        </div>
      </TabsContent>
    </Main>
  );
};

export default AdvancedDashboard;
