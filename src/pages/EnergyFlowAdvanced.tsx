
import React from 'react';
import { Main } from '@/components/ui/main';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSiteContext } from '@/contexts/SiteContext';
import EnhancedEnergyFlow from '@/components/energy/EnhancedEnergyFlow';
import { Battery, Zap, Wind, Home, BarChart2, Settings2 } from 'lucide-react';

const EnergyFlowAdvanced: React.FC = () => {
  const { activeSite } = useSiteContext();

  return (
    <Main title="Advanced Energy Flow">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gridx-navy dark:text-white mb-2">Advanced Energy Flow</h1>
        <p className="text-gridx-gray dark:text-gray-400 text-sm">
          Interactive visualization of energy flow through your system with detailed component insights
        </p>
      </div>
      
      <Tabs defaultValue="visualization" className="w-full space-y-6">
        <TabsList className="bg-white dark:bg-gridx-dark-gray/80 border border-gray-100 dark:border-gray-700/20">
          <TabsTrigger 
            value="visualization" 
            className="data-[state=active]:bg-gridx-blue data-[state=active]:text-white"
          >
            <Zap className="h-4 w-4 mr-2" />
            Visualization
          </TabsTrigger>
          <TabsTrigger 
            value="components" 
            className="data-[state=active]:bg-gridx-blue data-[state=active]:text-white"
          >
            <Battery className="h-4 w-4 mr-2" />
            Components
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            className="data-[state=active]:bg-gridx-blue data-[state=active]:text-white"
          >
            <BarChart2 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger 
            value="settings" 
            className="data-[state=active]:bg-gridx-blue data-[state=active]:text-white"
          >
            <Settings2 className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="visualization" className="space-y-4 mt-4">
          {activeSite ? (
            <EnhancedEnergyFlow siteId={activeSite.id} />
          ) : (
            <Card className="bg-white dark:bg-gridx-dark-gray/90 border border-gray-100 dark:border-gray-700/30 shadow-sm">
              <CardContent className="py-6">
                <p className="text-gridx-gray dark:text-gray-400">No active site selected.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="components" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="bg-white dark:bg-gridx-dark-gray/90 border border-gray-100 dark:border-gray-700/30 shadow-sm">
              <CardContent className="py-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Battery className="h-5 w-5 text-green-500" />
                      <h3 className="font-medium">Battery</h3>
                    </div>
                    <p className="text-xs text-muted-foreground mb-4">Battery storage system status and details</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Online</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">State of Charge</span>
                    <span className="font-medium">62%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Power Output</span>
                    <span className="font-medium">2.4 kW</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Temperature</span>
                    <span className="font-medium">28°C</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white dark:bg-gridx-dark-gray/90 border border-gray-100 dark:border-gray-700/30 shadow-sm">
              <CardContent className="py-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-5 w-5 text-yellow-500" />
                      <h3 className="font-medium">Solar</h3>
                    </div>
                    <p className="text-xs text-muted-foreground mb-4">Solar generation system status and details</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Online</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Current Production</span>
                    <span className="font-medium">4.2 kW</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Today's Production</span>
                    <span className="font-medium">28.5 kWh</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Efficiency</span>
                    <span className="font-medium">92%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white dark:bg-gridx-dark-gray/90 border border-gray-100 dark:border-gray-700/30 shadow-sm">
              <CardContent className="py-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Home className="h-5 w-5 text-blue-500" />
                      <h3 className="font-medium">Home</h3>
                    </div>
                    <p className="text-xs text-muted-foreground mb-4">Home consumption system status and details</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Online</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Current Consumption</span>
                    <span className="font-medium">1.8 kW</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Today's Consumption</span>
                    <span className="font-medium">15.2 kWh</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Peak Demand</span>
                    <span className="font-medium">3.2 kW</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-4">
          <Card className="bg-white dark:bg-gridx-dark-gray/90 border border-gray-100 dark:border-gray-700/30 shadow-sm">
            <CardContent className="py-6">
              <div className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <BarChart2 className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Energy flow analytics will be displayed here</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Detailed analytics on energy patterns, self-consumption rates, and system efficiency
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-4">
          <Card className="bg-white dark:bg-gridx-dark-gray/90 border border-gray-100 dark:border-gray-700/30 shadow-sm">
            <CardContent className="py-6">
              <div className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <Settings2 className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Energy flow visualization settings will be displayed here</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Customize the visualization, component display, and update frequency
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Main>
  );
};

export default EnergyFlowAdvanced;
