
import React from 'react';
import { cn } from '@/lib/utils';
import { EnergyFlowProvider, useEnergyFlow } from './energy-flow/EnergyFlowContext';
import EnergyNodeGroup from './energy-flow/EnergyNodeGroup';
import EnergyFlowConnections from './energy-flow/EnergyFlowConnections';
import EnergyFlowSummary from './energy-flow/EnergyFlowSummary';
import { EnergyFlowChartProps } from './energy-flow/types';

const EnergyFlowChartContent: React.FC<EnergyFlowChartProps> = ({ className, animationDelay }) => {
  const { nodes, connections } = useEnergyFlow();
  
  return (
    <div className={cn("w-full h-full min-h-[350px]", className)} style={animationDelay ? { animationDelay } : undefined}>
      <div className="relative w-full h-[300px] overflow-hidden rounded-lg bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-700/50 p-4 grid-pattern">
        {/* Energy Sources */}
        <EnergyNodeGroup 
          nodes={nodes} 
          type="source" 
          className="absolute left-6 top-4 w-[140px] h-[calc(100%-32px)] flex flex-col justify-around" 
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
          className="absolute right-6 top-4 w-[140px] h-[calc(100%-32px)] flex flex-col justify-around" 
        />
        
        {/* Energy flow lines */}
        <EnergyFlowConnections connections={connections} />
      </div>
      
      <EnergyFlowSummary nodes={nodes} />
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
