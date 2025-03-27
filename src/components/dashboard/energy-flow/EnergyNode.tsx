
import React from 'react';
import { Sun, Wind, Battery, Home, Car, Cable, Cpu, Zap, ArrowDownUp } from 'lucide-react';
import { EnergyNode as EnergyNodeType } from './types';
import { cn } from '@/lib/utils';

interface EnergyNodeProps {
  node: EnergyNodeType;
  className?: string;
  onClick?: () => void;
}

const EnergyNode: React.FC<EnergyNodeProps> = ({ node, className, onClick }) => {
  const getNodeIcon = () => {
    switch (node.deviceType) {
      case 'solar':
        return <Sun className="h-8 w-8 text-yellow-400 drop-shadow-glow-yellow" />;
      case 'wind':
        return <Wind className="h-8 w-8 text-blue-400 drop-shadow-glow-blue" />;
      case 'battery':
        return <Battery className="h-8 w-8 text-purple-400 drop-shadow-glow-purple" />;
      case 'grid':
        return <Cable className="h-8 w-8 text-red-400 drop-shadow-glow-red" />;
      case 'load':
        return <Home className="h-8 w-8 text-green-400 drop-shadow-glow-green" />;
      case 'ev':
        return <Car className="h-8 w-8 text-emerald-400 drop-shadow-glow-green" />;
      case 'device':
        return <Cpu className="h-8 w-8 text-sky-400 drop-shadow-glow-blue" />;
      default:
        return <Zap className="h-8 w-8 text-slate-400" />;
    }
  };

  const getNodeGradient = () => {
    switch (node.deviceType) {
      case 'solar':
        return "bg-gradient-to-br from-yellow-900/80 via-yellow-950/80 to-black/80 border-yellow-600/40";
      case 'wind':
        return "bg-gradient-to-br from-blue-900/80 via-blue-950/80 to-black/80 border-blue-600/40";
      case 'battery':
        return "bg-gradient-to-br from-purple-900/80 via-purple-950/80 to-black/80 border-purple-600/40";
      case 'grid':
        return "bg-gradient-to-br from-red-900/80 via-red-950/80 to-black/80 border-red-600/40";
      case 'load':
      case 'ev':
        return "bg-gradient-to-br from-green-900/80 via-green-950/80 to-black/80 border-green-600/40";
      case 'device':
        return "bg-gradient-to-br from-sky-900/80 via-sky-950/80 to-black/80 border-sky-600/40";
      default:
        return "bg-gradient-to-br from-slate-800/80 via-slate-900/80 to-black/80 border-slate-600/40";
    }
  };

  // Show a battery level indicator if the node is a battery and batteryLevel is defined
  const showBatteryLevel = node.deviceType === 'battery' && typeof node.batteryLevel !== 'undefined';

  return (
    <div 
      className={cn(
        "p-4 rounded-xl shadow-xl border backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl",
        getNodeGradient(),
        node.status !== 'active' ? "opacity-70" : "",
        className,
        "cursor-pointer energy-node"
      )}
      onClick={onClick}
    >
      <div className="flex flex-col items-center text-center gap-2">
        <div className="mb-2 p-3 rounded-full bg-black/50 border border-slate-700/50 shadow-inner flex items-center justify-center">
          {getNodeIcon()}
        </div>
        <div className="text-sm font-medium text-slate-200">{node.label}</div>
        <div className="flex items-center gap-1">
          <ArrowDownUp className={cn(
            "h-3 w-3",
            node.power > 0 ? "text-green-400" : "text-red-400"
          )} />
          <div className="text-xl font-bold text-white">{Math.abs(node.power).toFixed(1)} kW</div>
        </div>
        
        {showBatteryLevel && (
          <div className="w-full mt-2">
            <div className="text-xs text-slate-300 text-center mb-1 flex justify-between px-1">
              <span>{node.batteryLevel}%</span>
              <span>{node.batteryLevel < 20 ? "Low" : node.batteryLevel > 80 ? "Full" : "Charging"}</span>
            </div>
            <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden border border-purple-800/30">
              <div 
                className="h-full bg-gradient-to-r from-purple-800 to-purple-400 transition-all duration-700 ease-in-out"
                style={{ width: `${node.batteryLevel}%` }}
              />
            </div>
          </div>
        )}
        
        {node.status !== 'active' && (
          <div className="mt-2 px-2 py-0.5 rounded-full bg-red-900/70 text-xs font-medium text-red-200 border border-red-800/50 animate-pulse">
            {node.status === 'offline' ? 'Offline' : 'Warning'}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnergyNode;
