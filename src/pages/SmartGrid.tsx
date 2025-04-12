
import React from 'react';
import { Main } from '@/components/ui/main';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, Filter, Settings, Share2, Zap } from 'lucide-react';
import GridSignalProcessor from '@/components/smart-grid/GridSignalProcessor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SmartGrid: React.FC = () => {
  return (
    <Main>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Smart Grid Management</h1>
          <p className="text-muted-foreground">
            Monitor and control grid interactions, §14a compliance, and energy flexibility
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button size="sm">
            <Zap className="h-4 w-4 mr-2" />
            Signals
          </Button>
        </div>
      </div>

      <Tabs defaultValue="signals" className="space-y-6">
        <TabsList>
          <TabsTrigger value="signals">Grid Signals</TabsTrigger>
          <TabsTrigger value="flexibility">Energy Flexibility</TabsTrigger>
          <TabsTrigger value="vpp">Virtual Power Plant</TabsTrigger>
          <TabsTrigger value="analytics">Grid Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="signals" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <GridSignalProcessor />
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full justify-start" variant="outline">
                    <Share2 className="mr-2 h-4 w-4" />
                    Test Signal Response
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download Signal History
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Settings className="mr-2 h-4 w-4" />
                    Configure Response Rules
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">§14a EnWG Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-3">
                        <p className="text-xs text-green-700 dark:text-green-300">Asset Registration</p>
                        <p className="font-medium text-green-700 dark:text-green-300">Complete</p>
                      </div>
                      <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-3">
                        <p className="text-xs text-green-700 dark:text-green-300">Device Control</p>
                        <p className="font-medium text-green-700 dark:text-green-300">Operational</p>
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Your system is fully §14a compliant. All assets are properly registered and can be controlled by the grid operator if necessary.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="flexibility">
          <div className="h-[400px] flex items-center justify-center border rounded-lg p-4">
            <div className="text-center">
              <p className="text-muted-foreground">Energy flexibility management interface.</p>
              <p className="text-xs text-muted-foreground mt-2">
                This section will allow you to configure and manage your energy flexibility offerings.
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="vpp">
          <div className="h-[400px] flex items-center justify-center border rounded-lg p-4">
            <div className="text-center">
              <p className="text-muted-foreground">Virtual Power Plant (VPP) integration.</p>
              <p className="text-xs text-muted-foreground mt-2">
                Connect your energy assets to virtual power plant networks and monetize your flexibility.
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="h-[400px] flex items-center justify-center border rounded-lg p-4">
            <div className="text-center">
              <p className="text-muted-foreground">Grid analytics will be displayed here.</p>
              <p className="text-xs text-muted-foreground mt-2">
                Analyze your interaction with the grid and optimize your energy strategy.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Main>
  );
};

export default SmartGrid;
