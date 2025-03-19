
import React from 'react';
import { cn } from '@/lib/utils';
import { EnergyFlowProvider, useEnergyFlow } from './energy-flow/EnergyFlowContext';
import EnergyNodeGroup from './energy-flow/EnergyNodeGroup';
import EnergyFlowConnections from './energy-flow/EnergyFlowConnections';
import EnergyFlowSummary from './energy-flow/EnergyFlowSummary';
import { EnergyFlowChartProps } from './energy-flow/types';
import { ArrowDownUp, Battery, Bolt, Cloud, Home, Zap } from 'lucide-react';
import EnergyFlowInsights from './energy-flow/EnergyFlowInsights';

const EnergyFlowChartContent: React.FC<EnergyFlowChartProps> = ({ className, animationDelay }) => {
  const { nodes, connections, totalGeneration, totalConsumption, batteryPercentage, selfConsumptionRate, gridDependencyRate } = useEnergyFlow();
  
  return (
    <div className={cn("w-full h-full", className)} style={animationDelay ? { animationDelay } : undefined}>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-2/3">
          <div className="relative w-full h-[350px] overflow-hidden rounded-xl backdrop-blur-sm bg-gradient-to-br from-slate-50/80 to-slate-100/50 dark:from-slate-800/30 dark:to-slate-900/20 border border-slate-200/50 dark:border-slate-700/50 p-4 grid-pattern shadow-sm">
            {/* Real-time metrics at the top */}
            <div className="absolute top-4 left-0 right-0 flex justify-center gap-8 px-4 z-10">
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 text-sm shadow-sm">
                <Zap className="h-4 w-4 text-energy-green" />
                <span className="font-medium">{totalGeneration.toFixed(1)} kW</span>
                <span className="text-muted-foreground">Generation</span>
              </div>
              
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 text-sm shadow-sm">
                <Home className="h-4 w-4 text-energy-purple" />
                <span className="font-medium">{totalConsumption.toFixed(1)} kW</span>
                <span className="text-muted-foreground">Consumption</span>
              </div>
              
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 text-sm shadow-sm">
                <Battery className="h-4 w-4 text-energy-blue" />
                <span className="font-medium">{batteryPercentage}%</span>
                <span className="text-muted-foreground">Battery</span>
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
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 text-xs shadow-sm">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span>System Active</span>
                <span className="text-muted-foreground ml-1 hidden sm:inline">• Updated just now</span>
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
