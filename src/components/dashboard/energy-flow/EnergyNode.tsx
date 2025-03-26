
import React from 'react';
import { Sun, Wind, Battery, Home, Car, Cable, Cpu, Zap } from 'lucide-react';
import { EnergyNode as EnergyNodeType } from './types';
import { cn } from '@/lib/utils';

interface EnergyNodeProps {
  node: EnergyNodeType;
  className?: string;
}

const EnergyNode: React.FC<EnergyNodeProps> = ({ node, className }) => {
  const getNodeIcon = () => {
    switch (node.deviceType) {
      case 'solar':
        return <Sun className="h-8 w-8 text-yellow-400" />;
      case 'wind':
        return <Wind className="h-8 w-8 text-blue-400" />;
      case 'battery':
        return <Battery className="h-8 w-8 text-purple-400" />;
      case 'grid':
        return <Cable className="h-8 w-8 text-red-400" />;
      case 'load':
        return <Home className="h-8 w-8 text-green-400" />;
      case 'ev':
        return <Car className="h-8 w-8 text-green-400" />;
      default:
        return <Zap className="h-8 w-8 text-slate-400" />;
    }
  };

  const getNodeColor = () => {
    switch (node.deviceType) {
      case 'solar':
        return "from-yellow-900/50 to-yellow-950/80 border-yellow-700/30";
      case 'wind':
        return "from-blue-900/50 to-blue-950/80 border-blue-700/30";
      case 'battery':
        return "from-purple-900/50 to-purple-950/80 border-purple-700/30";
      case 'grid':
        return "from-red-900/50 to-red-950/80 border-red-700/30";
      case 'load':
      case 'ev':
        return "from-green-900/50 to-green-950/80 border-green-700/30";
      default:
        return "from-slate-800/50 to-slate-900/80 border-slate-700/30";
    }
  };

  // Show a battery level indicator if the node is a battery
  const showBatteryLevel = node.deviceType === 'battery' && node.batteryLevel !== undefined;

  return (
    <div 
      className={cn(
        "p-3 rounded-lg bg-gradient-to-br shadow-lg border",
        getNodeColor(),
        className
      )}
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-2 p-2 rounded-full bg-slate-800/80 border border-slate-700/50 shadow-inner flex items-center justify-center">
          {getNodeIcon()}
        </div>
        <div className="text-sm font-medium text-slate-200">{node.label}</div>
        <div className="text-xl font-bold text-white">{node.power.toFixed(1)} kW</div>
        
        {showBatteryLevel && (
          <div className="w-full mt-2">
            <div className="text-xs text-slate-400 text-center mb-1">
              {node.batteryLevel}% Charged
            </div>
            <div className="w-full h-2 bg-purple-950/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-purple-500 transition-all duration-700 ease-in-out"
                style={{ width: `${node.batteryLevel}%` }}
              />
            </div>
          </div>
        )}
        
        {node.status !== 'active' && (
          <div className="mt-1 px-2 py-0.5 rounded-full bg-red-900/50 text-xs font-medium text-red-300 border border-red-800/50">
            {node.status === 'offline' ? 'Offline' : 'Warning'}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnergyNode;
