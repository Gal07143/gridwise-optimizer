
import React, { useState, useEffect } from 'react';
import { Main } from '@/components/ui/main';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Eye, Download, RefreshCw, Settings } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { EnhancedEnergyFlow } from '@/components/energy';
import { fetchEnergyFlowData } from '@/services/energyFlowService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const EnergyFlow = () => {
  const { currentSite } = useAppStore();
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const [refreshInterval, setRefreshInterval] = useState<string>('10s');
  
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['energyFlow', currentSite?.id],
    queryFn: () => fetchEnergyFlowData(currentSite?.id),
    refetchInterval: getRefreshIntervalMs(refreshInterval),
  });
  
  function getRefreshIntervalMs(interval: string): number {
    switch (interval) {
      case '5s': return 5000;
      case '10s': return 10000;
      case '30s': return 30000;
      case '1m': return 60000;
      case '5m': return 300000;
      default: return 10000;
    }
  }

  // Get date for snapshot
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  const formattedTime = currentDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  return (
    <Main title="Energy Flow Visualization">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Energy Flow</h1>
          <p className="text-muted-foreground">
            Visualize real-time energy flows between components
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select
            value={refreshInterval}
            onValueChange={setRefreshInterval}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Refresh rate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5s">5 seconds</SelectItem>
              <SelectItem value="10s">10 seconds</SelectItem>
              <SelectItem value="30s">30 seconds</SelectItem>
              <SelectItem value="1m">1 minute</SelectItem>
              <SelectItem value="5m">5 minutes</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">
                Energy Flow Visualization
              </CardTitle>
              <div className="flex gap-2">
                <Button 
                  variant={viewMode === '2d' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setViewMode('2d')}
                >
                  2D View
                </Button>
                <Button 
                  variant={viewMode === '3d' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setViewMode('3d')}
                >
                  3D View
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {viewMode === '3d' ? (
              <div className="h-[600px] flex items-center justify-center bg-muted/20 rounded-lg">
                <div className="text-center">
                  <p className="mb-2 text-lg">3D View Coming Soon</p>
                  <p className="text-sm text-muted-foreground">3D visualization is under development</p>
                  <Button 
                    className="mt-4" 
                    onClick={() => setViewMode('2d')}
                    variant="outline"
                  >
                    Switch to 2D View
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-[600px] relative">
                <EnhancedEnergyFlow 
                  siteId={currentSite?.id} 
                  hideHeader 
                  className="h-full border-0 shadow-none" 
                />
                <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm p-2 rounded-md text-xs">
                  <div className="font-medium">{currentSite?.name || 'All Sites'}</div>
                  <div className="text-muted-foreground">
                    {formattedDate} at {formattedTime}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Generation Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span>Solar</span>
                  </div>
                  <span className="font-medium">{data?.nodes.find(n => n.deviceType === 'solar')?.power.toFixed(1) || '0.0'} kW</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span>Grid</span>
                  </div>
                  <span className="font-medium">{data?.nodes.find(n => n.deviceType === 'grid')?.power.toFixed(1) || '0.0'} kW</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-teal-500 rounded-full mr-2"></div>
                    <span>Wind</span>
                  </div>
                  <span className="font-medium">{data?.nodes.find(n => n.deviceType === 'wind')?.power.toFixed(1) || '0.0'} kW</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
                    <span>Battery (Discharging)</span>
                  </div>
                  <span className="font-medium">{data?.nodes.find(n => n.id === 'battery')?.power.toFixed(1) || '0.0'} kW</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Consumption Points</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                    <span>Home / Building</span>
                  </div>
                  <span className="font-medium">{data?.nodes.find(n => n.id === 'home')?.power.toFixed(1) || '0.0'} kW</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                    <span>EV Charger</span>
                  </div>
                  <span className="font-medium">{data?.nodes.find(n => n.id === 'ev')?.power.toFixed(1) || '0.0'} kW</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-rose-500 rounded-full mr-2"></div>
                    <span>Heat Pump</span>
                  </div>
                  <span className="font-medium">{data?.nodes.find(n => n.id === 'heatpump')?.power.toFixed(1) || '0.0'} kW</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
                    <span>Battery (Charging)</span>
                  </div>
                  <span className="font-medium">0.0 kW</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Energy Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-muted-foreground">Total Generation</span>
                  <span className="font-medium">{data?.totalGeneration.toFixed(1) || '0.0'} kW</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-muted-foreground">Total Consumption</span>
                  <span className="font-medium">{data?.totalConsumption.toFixed(1) || '0.0'} kW</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-muted-foreground">Self-Consumption Rate</span>
                  <span className="font-medium">{data?.selfConsumptionRate || 0}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Grid Dependency</span>
                  <span className="font-medium">{data?.gridDependencyRate || 0}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Main>
  );
};

export default EnergyFlow;
