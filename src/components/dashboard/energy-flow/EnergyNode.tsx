
import React from 'react';
import { cn } from '@/lib/utils';
import { EnergyNode as EnergyNodeType } from './types';

interface EnergyNodeProps {
  node: EnergyNodeType;
  className?: string;
}

export const getNodeColor = (type: string, status: string) => {
  if (status !== 'active') return 'bg-energy-orange/50 border-energy-orange';
  
  switch (type) {
    case 'source': 
      return 'bg-gradient-to-br from-energy-green/10 to-energy-green/20 border-energy-green/50';
    case 'storage': 
      return 'bg-gradient-to-br from-energy-blue/10 to-energy-blue/20 border-energy-blue/50';
    case 'consumption': 
      return 'bg-gradient-to-br from-energy-purple/10 to-energy-purple/20 border-energy-purple/50';
    default: 
      return 'bg-white dark:bg-slate-800';
  }
};

const EnergyNode: React.FC<EnergyNodeProps> = ({ node, className }) => {
  return (
    <div 
      className={cn(
        "p-3 rounded-lg border shadow-sm backdrop-blur-sm transition-all",
        getNodeColor(node.type, node.status),
        className
      )}
    >
      <div className="text-sm font-medium">{node.label}</div>
      <div className="text-lg font-semibold flex items-center gap-1 mt-1">
        <div className={cn(
          "w-2 h-2 rounded-full animate-pulse",
          node.status === 'active' ? 
            node.type === 'source' ? 'bg-energy-green' : 
            node.type === 'storage' ? 'bg-energy-blue' : 'bg-energy-purple' 
            : 'bg-energy-orange'
        )}></div>
        {node.power.toFixed(1)} kW
      </div>
      {node.type === 'storage' && (
        <div className="mt-2 bg-slate-100 dark:bg-slate-700/50 rounded-full h-2 overflow-hidden">
          <div className="bg-energy-blue h-full animate-pulse" style={{ width: '68%' }}></div>
        </div>
      )}
    </div>
  );
};

export default EnergyNode;
