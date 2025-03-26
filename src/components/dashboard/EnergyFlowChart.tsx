
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { EnergyFlowProvider, useEnergyFlow } from './energy-flow/EnergyFlowContext';
import EnergyNodeGroup from './energy-flow/EnergyNodeGroup';
import EnergyFlowConnections from './energy-flow/EnergyFlowConnections';
import EnergyFlowSummary from './energy-flow/EnergyFlowSummary';
import { EnergyFlowChartProps } from './energy-flow/types';
import { ArrowDownUp, Battery, Bolt, Cloud, Home, Zap, RefreshCw } from 'lucide-react';
import EnergyFlowInsights from './energy-flow/EnergyFlowInsights';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const EnergyFlowChartContent: React.FC<EnergyFlowChartProps> = ({ className, animationDelay }) => {
  const { 
    nodes, 
    connections, 
    totalGeneration, 
    totalConsumption, 
    batteryPercentage, 
    selfConsumptionRate, 
    gridDependencyRate,
    refreshData
  } = useEnergyFlow();
  
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  
  const handleRefresh = () => {
    refreshData();
    setLastRefreshed(new Date());
  };
  
  return (
    <div className={cn("w-full h-full", className)} style={animationDelay ? { animationDelay } : undefined}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Energy Flow Visualization</h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Refresh energy flow data</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-2/3">
          <div className="relative w-full h-[350px] overflow-hidden rounded-xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 dark:from-slate-950 dark:to-slate-900 border border-slate-700/50 dark:border-slate-800/50 p-4 shadow-lg">
            {/* Real-time metrics at the top */}
            <div className="absolute top-4 left-0 right-0 flex justify-center gap-4 px-4 z-10">
              <div className="bg-slate-800/80 dark:bg-slate-900/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 text-sm shadow-sm border border-slate-700/30">
                <Zap className="h-4 w-4 text-green-400" />
                <span className="font-medium text-green-100">{totalGeneration.toFixed(1)} kW</span>
                <span className="text-slate-400">Generation</span>
              </div>
              
              <div className="bg-slate-800/80 dark:bg-slate-900/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 text-sm shadow-sm border border-slate-700/30">
                <Home className="h-4 w-4 text-purple-400" />
                <span className="font-medium text-purple-100">{totalConsumption.toFixed(1)} kW</span>
                <span className="text-slate-400">Consumption</span>
              </div>
              
              <div className="bg-slate-800/80 dark:bg-slate-900/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 text-sm shadow-sm border border-slate-700/30">
                <Battery className="h-4 w-4 text-blue-400" />
                <span className="font-medium text-blue-100">{batteryPercentage.toFixed(1)}%</span>
                <span className="text-slate-400">Battery</span>
              </div>
            </div>
            
            {/* Energy Sources */}
            <EnergyNodeGroup 
              nodes={nodes} 
              type="source" 
              className="absolute left-6 top-16 w-[140px] h-[calc(100%-96px)] flex flex-col justify-around" 
            />
            
            {/* Battery Storage */}
            <EnergyNodeGroup 
              nodes={nodes} 
              type="storage" 
              className="absolute left-[calc(50%-70px)] top-[calc(50%-60px)]" 
            />
            
            {/* Energy Consumption */}
            <EnergyNodeGroup 
              nodes={nodes} 
              type="consumption" 
              className="absolute right-6 top-16 w-[140px] h-[calc(100%-96px)] flex flex-col justify-around" 
            />
            
            {/* Energy flow lines */}
            <EnergyFlowConnections connections={connections} />
            
            {/* System status */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
              <div className="bg-slate-800/80 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 text-xs shadow-sm border border-slate-700/30">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-slate-300">System Active</span>
                <span className="text-slate-500 ml-1">
                  • Updated {lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
          
          <EnergyFlowSummary nodes={nodes} />
        </div>
        
        {/* Insights section */}
        <div className="w-full md:w-1/3">
          <EnergyFlowInsights 
            selfConsumptionRate={selfConsumptionRate}
            gridDependencyRate={gridDependencyRate}
            batteryPercentage={batteryPercentage}
            totalGeneration={totalGeneration}
            totalConsumption={totalConsumption}
          />
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
