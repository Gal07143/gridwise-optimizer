
import React, { useEffect, useState } from 'react';
import { useEnergyFlow } from '../dashboard/energy-flow/EnergyFlowContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Battery, Zap, Sun, Home, ArrowRight, RefreshCcw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const EnergyFlowVisualization = () => {
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
  
  const [showAnimation, setShowAnimation] = useState(true);
  
  // Subscribe to real-time energy reading updates
  useRealtimeSubscription({
    table: 'energy_readings',
    event: '*',
    showToasts: false,
    onError: (error) => console.error('Energy readings subscription error:', error)
  }, (payload) => {
    // We don't need to do anything here as EnergyFlowContext already handles real-time updates
    console.log('Real-time energy reading update received');
  });
  
  const handleRefresh = () => {
    refreshData();
    toast.success('Energy flow data refreshed');
  };
  
  const toggleAnimation = () => {
    setShowAnimation(!showAnimation);
  };
  
  const solarNode = nodes.find(node => node.deviceType === 'solar');
  const batteryNode = nodes.find(node => node.deviceType === 'battery');
  const homeNode = nodes.find(node => node.deviceType === 'load' && node.label.toLowerCase().includes('home'));
  const gridNode = nodes.find(node => node.deviceType === 'grid');
  
  const solarToBatteryFlow = connections.find(conn => 
    nodes.find(n => n.id === conn.from)?.deviceType === 'solar' &&
    nodes.find(n => n.id === conn.to)?.deviceType === 'battery'
  );
  
  const solarToHomeFlow = connections.find(conn => 
    nodes.find(n => n.id === conn.from)?.deviceType === 'solar' &&
    nodes.find(n => n.id === conn.to)?.deviceType === 'load'
  );
  
  const batteryToHomeFlow = connections.find(conn => 
    nodes.find(n => n.id === conn.from)?.deviceType === 'battery' &&
    nodes.find(n => n.id === conn.to)?.deviceType === 'load'
  );
  
  const gridToHomeFlow = connections.find(conn => 
    nodes.find(n => n.id === conn.from)?.deviceType === 'grid' &&
    nodes.find(n => n.id === conn.to)?.deviceType === 'load'
  );
  
  return (
    <Card className="col-span-full xl:col-span-8 shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className="h-5 w-5 text-blue-500" />
            Live Energy Flow
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 px-2 text-xs"
              onClick={toggleAnimation}
            >
              {showAnimation ? 'Pause' : 'Animate'}
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCcw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative h-[360px] bg-slate-50 dark:bg-slate-900/50 rounded-lg overflow-hidden">
          {/* Energy flow diagram */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="grid grid-cols-3 gap-8 w-full max-w-3xl px-4">
              {/* Left Column - Solar & Grid */}
              <div className="flex flex-col justify-between items-center gap-16">
                {/* Solar */}
                <div className="relative">
                  <div className={cn(
                    "p-4 rounded-full",
                    "bg-gradient-to-br from-amber-50 to-amber-100",
                    "dark:from-amber-900/30 dark:to-amber-800/20",
                    "border border-amber-200 dark:border-amber-700/50"
                  )}>
                    <Sun className="h-10 w-10 text-amber-500" />
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-center w-32">
                    <p className="font-medium">Solar</p>
                    <p className="text-sm font-semibold">{solarNode?.power.toFixed(1)} kW</p>
                  </div>
                </div>
                
                {/* Grid */}
                <div className="relative">
                  <div className={cn(
                    "p-4 rounded-full",
                    "bg-gradient-to-br from-purple-50 to-purple-100",
                    "dark:from-purple-900/30 dark:to-purple-800/20",
                    "border border-purple-200 dark:border-purple-700/50"
                  )}>
                    <Zap className="h-10 w-10 text-purple-500" />
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-center w-32">
                    <p className="font-medium">Grid</p>
                    <p className="text-sm font-semibold">{gridNode?.power.toFixed(1)} kW</p>
                  </div>
                </div>
              </div>
              
              {/* Center Column - Battery */}
              <div className="flex justify-center items-center">
                <div className="relative">
                  <div className={cn(
                    "p-4 rounded-full",
                    "bg-gradient-to-br from-blue-50 to-blue-100",
                    "dark:from-blue-900/30 dark:to-blue-800/20",
                    "border border-blue-200 dark:border-blue-700/50"
                  )}>
                    <Battery className="h-12 w-12 text-blue-500" />
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-center w-32">
                    <p className="font-medium">Battery</p>
                    <p className="text-sm font-semibold">{batteryPercentage}%</p>
                    <div className="mt-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div 
                        className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${batteryPercentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs mt-1 text-gray-500">
                      {batteryNode?.power < 0 ? 'Charging' : batteryNode?.power > 0 ? 'Discharging' : 'Idle'}
                      {batteryNode?.power !== 0 && ` (${Math.abs(batteryNode?.power || 0).toFixed(1)} kW)`}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Right Column - Home */}
              <div className="flex justify-center items-center">
                <div className="relative">
                  <div className={cn(
                    "p-4 rounded-full",
                    "bg-gradient-to-br from-green-50 to-green-100",
                    "dark:from-green-900/30 dark:to-green-800/20",
                    "border border-green-200 dark:border-green-700/50"
                  )}>
                    <Home className="h-10 w-10 text-green-600" />
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-center w-32">
                    <p className="font-medium">Home</p>
                    <p className="text-sm font-semibold">{totalConsumption.toFixed(1)} kW</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Flow lines with animated dots */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
            {/* Solar to Battery */}
            {solarToBatteryFlow?.active && (
              <g>
                <path 
                  d="M200,100 C280,100 320,200 400,200" 
                  fill="none" 
                  stroke="rgba(59, 130, 246, 0.3)" 
                  strokeWidth="2" 
                  strokeDasharray="4 2"
                />
                {showAnimation && (
                  <circle 
                    cx="0" cy="0" r="4" 
                    fill="#3b82f6"
                    className="animate-flow-solar-battery"
                  >
                    <animateMotion
                      path="M200,100 C280,100 320,200 400,200"
                      dur="4s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
              </g>
            )}
            
            {/* Solar to Home */}
            {solarToHomeFlow?.active && (
              <g>
                <path 
                  d="M200,100 C300,100 500,150 600,200" 
                  fill="none" 
                  stroke="rgba(22, 163, 74, 0.3)" 
                  strokeWidth="2" 
                  strokeDasharray="4 2"
                />
                {showAnimation && (
                  <circle 
                    cx="0" cy="0" r="4" 
                    fill="#16a34a"
                    className="animate-flow-solar-home"
                  >
                    <animateMotion
                      path="M200,100 C300,100 500,150 600,200"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
              </g>
            )}
            
            {/* Battery to Home */}
            {batteryToHomeFlow?.active && (
              <g>
                <path 
                  d="M400,200 C450,200 550,200 600,200" 
                  fill="none" 
                  stroke="rgba(59, 130, 246, 0.3)" 
                  strokeWidth="2" 
                  strokeDasharray="4 2"
                />
                {showAnimation && (
                  <circle 
                    cx="0" cy="0" r="4" 
                    fill="#3b82f6"
                    className="animate-flow-battery-home"
                  >
                    <animateMotion
                      path="M400,200 C450,200 550,200 600,200"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
              </g>
            )}
            
            {/* Grid to Home */}
            {gridToHomeFlow?.active && (
              <g>
                <path 
                  d="M200,300 C300,300 500,250 600,200" 
                  fill="none" 
                  stroke="rgba(147, 51, 234, 0.3)" 
                  strokeWidth="2" 
                  strokeDasharray="4 2"
                />
                {showAnimation && (
                  <circle 
                    cx="0" cy="0" r="4" 
                    fill="#9333ea"
                    className="animate-flow-grid-home"
                  >
                    <animateMotion
                      path="M200,300 C300,300 500,250 600,200"
                      dur="2.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
              </g>
            )}
          </svg>
        </div>
        
        {/* Stats section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="text-sm text-slate-500 dark:text-slate-400">Total Generation</div>
            <div className="text-2xl font-bold mt-1">{totalGeneration.toFixed(1)} kW</div>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="text-sm text-slate-500 dark:text-slate-400">Total Consumption</div>
            <div className="text-2xl font-bold mt-1">{totalConsumption.toFixed(1)} kW</div>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="text-sm text-slate-500 dark:text-slate-400">Self-Consumption</div>
            <div className="flex items-end gap-2">
              <div className="text-2xl font-bold">{selfConsumptionRate.toFixed(0)}%</div>
              <div className="text-xs text-green-500 mb-1">Solar-powered</div>
            </div>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="text-sm text-slate-500 dark:text-slate-400">Grid Dependency</div>
            <div className="flex items-end gap-2">
              <div className="text-2xl font-bold">{gridDependencyRate.toFixed(0)}%</div>
              <div className="text-xs text-purple-500 mb-1">From grid</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnergyFlowVisualization;
