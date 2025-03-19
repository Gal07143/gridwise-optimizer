
import React from 'react';
import { EnergyNode } from './types';

interface EnergyFlowSummaryProps {
  nodes: EnergyNode[];
}

const EnergyFlowSummary: React.FC<EnergyFlowSummaryProps> = ({ nodes }) => {
  const totalGeneration = nodes
    .filter(n => n.type === 'source')
    .reduce((sum, node) => sum + node.power, 0);
  
  const storageCapacity = nodes.find(n => n.id === 'battery')?.power || 0;
  
  const totalConsumption = nodes
    .filter(n => n.type === 'consumption')
    .reduce((sum, node) => sum + node.power, 0);

  return (
    <div className="mt-6 grid grid-cols-3 gap-4">
      <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 p-3 rounded-lg border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
        <div className="text-xs text-slate-500 dark:text-slate-400">Total Generation</div>
        <div className="text-xl font-medium text-energy-green">
          {totalGeneration.toFixed(1)} kW
        </div>
      </div>
      <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 p-3 rounded-lg border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
        <div className="text-xs text-slate-500 dark:text-slate-400">Storage Capacity</div>
        <div className="text-xl font-medium text-energy-blue">
          {storageCapacity.toFixed(1)} kW
        </div>
      </div>
      <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 p-3 rounded-lg border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
        <div className="text-xs text-slate-500 dark:text-slate-400">Total Consumption</div>
        <div className="text-xl font-medium text-energy-purple">
          {totalConsumption.toFixed(1)} kW
        </div>
      </div>
    </div>
  );
};

export default EnergyFlowSummary;
