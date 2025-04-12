
import React, { useState } from 'react';
import { Main } from '@/components/ui/main';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart, Battery, Bolt, Calendar, Download, LayoutGrid, 
  Maximize2, PanelLeft, RefreshCw, Settings, ZapOff 
} from 'lucide-react';
import SmartGridVisualization from '@/components/energy/SmartGridVisualization';

const SmartGridManagement: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  
  return (
    <Main>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Smart Grid Management</h1>
          <p className="text-muted-foreground">
            Comprehensive view and control of distributed energy resources
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setDarkMode(!darkMode)} 
            className="relative"
          >
            {darkMode ? (
              <span className="absolute inset-0 flex items-center justify-center">
                <Bolt className="h-4 w-4" />
              </span>
            ) : (
              <span className="absolute inset-0 flex items-center justify-center">
                <Bolt className="h-4 w-4" />
              </span>
            )}
          </Button>
          <Button variant="outline" size="icon">
            <PanelLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview" className="flex gap-1 items-center">
            <LayoutGrid className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="liveView" className="flex gap-1 items-center">
            <Battery className="h-4 w-4" />
            <span>Live View</span>
          </TabsTrigger>
          <TabsTrigger value="historical" className="flex gap-1 items-center">
            <BarChart className="h-4 w-4" />
            <span>Historical</span>
          </TabsTrigger>
          <TabsTrigger value="controls" className="flex gap-1 items-center">
            <Settings className="h-4 w-4" />
            <span>Controls</span>
          </TabsTrigger>
          <TabsTrigger value="events" className="flex gap-1 items-center">
            <Calendar className="h-4 w-4" />
            <span>Events</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex gap-1 items-center">
            <Download className="h-4 w-4" />
            <span>Reports</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <SmartGridVisualization />
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Grid Connection</span>
                      <span className="flex items-center text-green-500">
                        Connected
                        <span className="ml-2 w-2 h-2 bg-green-500 rounded-full"></span>
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Battery Status</span>
                      <span className="flex items-center text-amber-500">
                        Discharging
                        <span className="ml-2 w-2 h-2 bg-amber-500 rounded-full"></span>
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Solar Production</span>
                      <span className="flex items-center text-green-500">
                        Active
                        <span className="ml-2 w-2 h-2 bg-green-500 rounded-full"></span>
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">EV Charging</span>
                      <span className="flex items-center text-gray-400">
                        Inactive
                        <span className="ml-2 w-2 h-2 bg-gray-400 rounded-full"></span>
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Peak Demand</span>
                      <span className="font-medium">8.4 kW</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Grid Import</span>
                      <span className="font-medium">2.1 kW</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Grid Export</span>
                      <span className="font-medium">0.0 kW</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 border-t pt-4">
                    <div className="flex justify-between">
                      <Button variant="outline" size="sm">
                        <ZapOff className="h-4 w-4 mr-2" />
                        Disconnect Grid
                      </Button>
                      <Button size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Control Panel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Active Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-yellow-500/10 rounded-md border border-yellow-500/20">
                      <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Battery Level Below 30%</p>
                      <p className="text-xs text-muted-foreground mt-1">Consider charging before peak hours</p>
                    </div>
                    
                    <div className="p-3 bg-blue-500/10 rounded-md border border-blue-500/20">
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400">High Grid Tariff Active</p>
                      <p className="text-xs text-muted-foreground mt-1">System switched to battery power</p>
                    </div>
                    
                    <Button variant="outline" size="sm" className="w-full">
                      View All Alerts
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Grid Connection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">2.1 kW</div>
                <div className="text-sm text-muted-foreground">Current Import</div>
                
                <div className="mt-4 flex items-center justify-between text-xs">
                  <span>Daily Limit: 15 kWh</span>
                  <span className="font-medium">7.2 / 15 kWh</span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full mt-1 overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: '48%' }}></div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Solar Production</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">3.2 kW</div>
                <div className="text-sm text-muted-foreground">Current Output</div>
                
                <div className="mt-4 flex items-center justify-between text-xs">
                  <span>Efficiency: 92%</span>
                  <span className="font-medium text-green-500">+12% vs. yesterday</span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full mt-1 overflow-hidden">
                  <div className="bg-yellow-500 h-full rounded-full" style={{ width: '92%' }}></div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Battery Storage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">76%</div>
                <div className="text-sm text-muted-foreground">State of Charge</div>
                
                <div className="mt-4 flex items-center justify-between text-xs">
                  <span>Estimated Run Time: 5.2 hours</span>
                  <span className="font-medium">11.4 kWh remaining</span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full mt-1 overflow-hidden">
                  <div className="bg-green-500 h-full rounded-full" style={{ width: '76%' }}></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="liveView">
          <div className="h-[600px] flex items-center justify-center border rounded-lg p-4">
            <div className="text-center">
              <p className="text-muted-foreground">The live view of energy flow will be displayed here.</p>
              <p className="text-sm text-muted-foreground mt-2">
                This will include real-time power flow between grid, renewable sources, storage, and consumers.
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="historical">
          <div className="h-[600px] flex items-center justify-center border rounded-lg p-4">
            <div className="text-center">
              <p className="text-muted-foreground">Historical energy data and trends will be displayed here.</p>
              <p className="text-sm text-muted-foreground mt-2">
                This includes production, consumption, grid exchange, and efficiency metrics over time.
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="controls">
          <div className="h-[600px] flex items-center justify-center border rounded-lg p-4">
            <div className="text-center">
              <p className="text-muted-foreground">System controls and automation settings will be displayed here.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Manage devices, set thresholds, configure automation rules and demand response settings.
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="events">
          <div className="h-[600px] flex items-center justify-center border rounded-lg p-4">
            <div className="text-center">
              <p className="text-muted-foreground">System events and logs will be displayed here.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Track system activities, alerts, warnings, mode changes, and user interactions.
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="reports">
          <div className="h-[600px] flex items-center justify-center border rounded-lg p-4">
            <div className="text-center">
              <p className="text-muted-foreground">Generate and view system reports here.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Export data, create scheduled reports, and analyze historical performance.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Main>
  );
};

export default SmartGridManagement;
