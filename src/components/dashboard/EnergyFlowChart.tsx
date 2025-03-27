
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { EnergyFlowProvider, useEnergyFlow } from './energy-flow/EnergyFlowContext';
import EnergyNodeGroup from './energy-flow/EnergyNodeGroup';
import EnergyFlowConnections from './energy-flow/EnergyFlowConnections';
import { EnergyFlowChartProps } from './energy-flow/types';
import { 
  ArrowDownUp, 
  Battery, 
  Bolt, 
  Cloud, 
  Home, 
  Zap, 
  RefreshCw,
  SunMedium,
  Wind,
  PlugZap,
  BatteryCharging,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const EnergyFlowChartContent: React.FC<EnergyFlowChartProps> = ({ className, animationDelay }) => {
  const { 
    nodes, 
    connections, 
    totalGeneration, 
    totalConsumption, 
    batteryPercentage, 
    selfConsumptionRate, 
    gridDependencyRate,
    refreshData,
    isLoading
  } = useEnergyFlow();
  
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const selectedNode = selectedNodeId ? nodes.find(n => n.id === selectedNodeId) : null;
  
  const handleRefresh = () => {
    refreshData();
    setLastRefreshed(new Date());
  };

  const handleNodeClick = (nodeId: string) => {
    setSelectedNodeId(prevId => prevId === nodeId ? null : nodeId);
  };
  
  // Energy balance calculation
  const energyBalance = totalGeneration - totalConsumption;
  const isEnergyPositive = energyBalance >= 0;
  
  return (
    <div className={cn("w-full h-full", className)} style={animationDelay ? { animationDelay } : undefined}>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Energy Flow</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Real-time visualization of energy distribution
          </p>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleRefresh}
                disabled={isLoading}
                className="relative overflow-hidden"
              >
                <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
                {isLoading && (
                  <span className="absolute inset-0 bg-primary/10 rounded-md animate-pulse" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Refresh energy flow data</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-2/3">
          <div className="relative w-full h-[380px] overflow-hidden rounded-xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-800/50 p-4 shadow-lg">
            {/* System status indicators */}
            <div className="absolute top-4 left-0 right-0 flex justify-center gap-3 px-4 z-10">
              <div className="bg-black/40 backdrop-blur-lg px-4 py-2 rounded-full flex items-center gap-2 text-sm shadow-md border border-slate-700/30">
                <div className="flex items-center">
                  <SunMedium className="h-4 w-4 text-yellow-400 mr-1.5" />
                  <span className="font-medium text-yellow-100">{totalGeneration.toFixed(1)} kW</span>
                </div>
                <span className="text-slate-400 mx-1">•</span>
                <div className="flex items-center">
                  <Battery className="h-4 w-4 text-purple-400 mr-1.5" />
                  <span className="font-medium text-purple-100">{batteryPercentage}%</span>
                </div>
                <span className="text-slate-400 mx-1">•</span>
                <div className="flex items-center">
                  <Home className="h-4 w-4 text-green-400 mr-1.5" />
                  <span className="font-medium text-green-100">{totalConsumption.toFixed(1)} kW</span>
                </div>
              </div>
              
              <div className={cn(
                "backdrop-blur-lg px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs shadow-md border",
                isEnergyPositive 
                  ? "bg-green-950/40 text-green-200 border-green-800/30" 
                  : "bg-red-950/40 text-red-200 border-red-800/30"
              )}>
                <ArrowDownUp className={cn(
                  "h-3 w-3",
                  isEnergyPositive ? "text-green-400" : "text-red-400"
                )} />
                <span>
                  {isEnergyPositive ? "Surplus" : "Deficit"}: {Math.abs(energyBalance).toFixed(1)} kW
                </span>
              </div>
            </div>
            
            {/* Energy Sources */}
            <EnergyNodeGroup 
              nodes={nodes} 
              type="source" 
              className="absolute left-6 top-16 w-[140px] h-[calc(100%-96px)] flex flex-col justify-around"
              onNodeClick={handleNodeClick}
              selectedNodeId={selectedNodeId}
            />
            
            {/* Battery Storage */}
            <EnergyNodeGroup 
              nodes={nodes} 
              type="storage" 
              className="absolute left-[calc(50%-70px)] top-[calc(50%-60px)]"
              onNodeClick={handleNodeClick}
              selectedNodeId={selectedNodeId}
            />
            
            {/* Energy Consumption */}
            <EnergyNodeGroup 
              nodes={nodes} 
              type="consumption" 
              className="absolute right-6 top-16 w-[140px] h-[calc(100%-96px)] flex flex-col justify-around"
              onNodeClick={handleNodeClick}
              selectedNodeId={selectedNodeId}
            />
            
            {/* Energy flow lines */}
            <EnergyFlowConnections connections={connections} />
            
            {/* Node details panel (when a node is selected) */}
            {selectedNode && (
              <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-[280px] bg-black/60 backdrop-blur-lg p-3 rounded-lg border border-slate-700/50 shadow-lg z-20 animate-in">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-medium text-white">{selectedNode.label} Details</h4>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0 text-slate-400 hover:text-white"
                    onClick={() => setSelectedNodeId(null)}
                  >
                    ×
                  </Button>
                </div>
                <div className="mt-2 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Current Power:</span>
                    <span className="text-white font-medium">{selectedNode.power.toFixed(2)} kW</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Type:</span>
                    <span className="text-white font-medium capitalize">{selectedNode.deviceType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status:</span>
                    <span className={cn(
                      "font-medium",
                      selectedNode.status === 'active' ? "text-green-400" :
                      selectedNode.status === 'warning' ? "text-yellow-400" : "text-red-400"
                    )}>
                      {selectedNode.status.charAt(0).toUpperCase() + selectedNode.status.slice(1)}
                    </span>
                  </div>
                  {selectedNode.deviceType === 'battery' && typeof selectedNode.batteryLevel !== 'undefined' && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Battery Level:</span>
                      <span className="text-white font-medium">{selectedNode.batteryLevel}%</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* System status */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
              <div className="bg-black/40 backdrop-blur-lg px-3 py-1 rounded-full flex items-center gap-1 text-xs shadow-md border border-slate-700/30">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-slate-300">System Active</span>
                <span className="text-slate-500 ml-1">
                  • Updated {lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
          
          {/* Energy metrics cards */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-slate-200/50 dark:border-slate-700/50 shadow-md overflow-hidden">
              <CardContent className="p-4 relative">
                <div className="absolute top-0 right-0 w-16 h-16 text-yellow-200/10 dark:text-yellow-200/5">
                  <SunMedium className="w-full h-full" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Generation</p>
                  <p className="text-xl font-semibold text-yellow-600 dark:text-yellow-400">{totalGeneration.toFixed(1)} kW</p>
                  <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                    <span>{selfConsumptionRate.toFixed(0)}% Self-consumed</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-slate-200/50 dark:border-slate-700/50 shadow-md overflow-hidden">
              <CardContent className="p-4 relative">
                <div className="absolute top-0 right-0 w-16 h-16 text-purple-200/10 dark:text-purple-200/5">
                  <BatteryCharging className="w-full h-full" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Storage</p>
                  <p className="text-xl font-semibold text-purple-600 dark:text-purple-400">{batteryPercentage}%</p>
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mt-1">
                    <div 
                      className="h-full bg-purple-500 rounded-full"
                      style={{ width: `${batteryPercentage}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-slate-200/50 dark:border-slate-700/50 shadow-md overflow-hidden">
              <CardContent className="p-4 relative">
                <div className="absolute top-0 right-0 w-16 h-16 text-green-200/10 dark:text-green-200/5">
                  <Home className="w-full h-full" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Consumption</p>
                  <p className="text-xl font-semibold text-emerald-600 dark:text-emerald-400">{totalConsumption.toFixed(1)} kW</p>
                  <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                    <span>{gridDependencyRate.toFixed(0)}% Grid-dependent</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Sidebar with system insights */}
        <div className="w-full lg:w-1/3">
          <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-slate-200/50 dark:border-slate-700/50 shadow-md h-full">
            <CardHeader className="p-5 pb-0">
              <CardTitle className="text-lg flex items-center">
                <Bolt className="mr-2 h-5 w-5 text-primary" />
                System Insights
              </CardTitle>
              <CardDescription>Current energy system performance</CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              {/* Self-consumption Rate */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5 text-sm font-medium">
                    <SunMedium className="h-4 w-4 text-yellow-500" />
                    Self-Consumption
                  </div>
                  <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">{selfConsumptionRate.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-yellow-500 to-yellow-300 h-2 rounded-full transition-all duration-700" 
                    style={{ width: `${selfConsumptionRate}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selfConsumptionRate > 85 
                    ? 'Excellent! Most renewable energy used on-site.'
                    : selfConsumptionRate > 60
                      ? 'Good renewable energy utilization.'
                      : 'Consider shifting usage to high production times.'}
                </p>
              </div>
              
              {/* Grid Dependency Rate */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5 text-sm font-medium">
                    <PlugZap className="h-4 w-4 text-slate-500" />
                    Grid Dependency
                  </div>
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">{gridDependencyRate.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-slate-500 to-slate-400 h-2 rounded-full transition-all duration-700" 
                    style={{ width: `${gridDependencyRate}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {gridDependencyRate < 15
                    ? 'Excellent energy independence.'
                    : gridDependencyRate < 40
                      ? 'Good energy independence with grid support.'
                      : 'System relies significantly on grid power.'}
                </p>
              </div>
              
              {/* Energy Balance */}
              <div className="mt-6 p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <div className="flex justify-between items-center">
                  <div className="flex items-center font-medium">
                    <Zap className="mr-2 h-5 w-5 text-blue-500" />
                    Energy Balance
                  </div>
                  <span className={isEnergyPositive ? "text-green-500 font-medium" : "text-red-500 font-medium"}>
                    {isEnergyPositive ? "Surplus" : "Deficit"}
                  </span>
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  <div className="text-sm">
                    <div className="text-slate-600 dark:text-slate-400">
                      {isEnergyPositive 
                        ? `Producing ${energyBalance.toFixed(1)} kW more than consuming`
                        : `Consuming ${Math.abs(energyBalance).toFixed(1)} kW more than producing`}
                    </div>
                  </div>
                  <div className={cn(
                    "text-xl font-bold",
                    isEnergyPositive ? "text-green-500" : "text-red-500"
                  )}>
                    {isEnergyPositive ? "+" : "-"}{Math.abs(energyBalance).toFixed(1)}
                  </div>
                </div>
              </div>
              
              {/* Quick Recommendations Section */}
              <div className="mt-2 space-y-3">
                <h4 className="text-sm font-medium flex items-center">
                  <Info className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
                  Quick Tips
                </h4>
                {selfConsumptionRate < 70 && (
                  <div className="text-xs flex items-start gap-2">
                    <div className="mt-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 p-1 rounded-full">
                      <SunMedium className="h-3 w-3" />
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">Shift energy-intensive tasks to daylight hours to use more solar power.</p>
                  </div>
                )}
                
                {batteryPercentage < 30 && (
                  <div className="text-xs flex items-start gap-2">
                    <div className="mt-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 p-1 rounded-full">
                      <Battery className="h-3 w-3" />
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">Battery level is low. Consider reducing consumption until it can recharge.</p>
                  </div>
                )}
                
                {gridDependencyRate > 40 && (
                  <div className="text-xs flex items-start gap-2">
                    <div className="mt-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-1 rounded-full">
                      <PlugZap className="h-3 w-3" />
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">High grid dependency. Check if any renewable sources are underperforming.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const EnergyFlowChart: React.FC<EnergyFlowChartProps> = (props) => {
  return (
    <EnergyFlowProvider>
      <EnergyFlowChartContent {...props} />
    </EnergyFlowProvider>
  );
};

export default EnergyFlowChart;
