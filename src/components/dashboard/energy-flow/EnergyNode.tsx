
import React from 'react';
import { EnergyNodeProps } from './types';
import { Battery, Home, Zap, Sun, Wind, MonitorSmartphone, Car } from 'lucide-react';
import { cn } from '@/lib/utils';

const EnergyNode: React.FC<EnergyNodeProps> = ({ 
  node, 
  onClick,
  selected, // Original prop
  isSelected // Added for compatibility
}) => {
  // Use either selected or isSelected prop
  const isNodeSelected = selected || isSelected;
  
  // Determine the icon based on device type
  const renderIcon = () => {
    switch (node.deviceType) {
      case 'solar':
        return <Sun className="h-6 w-6 text-yellow-500" />;
      case 'battery':
        return <Battery className="h-6 w-6 text-blue-500" />;
      case 'grid':
        return <Zap className="h-6 w-6 text-purple-500" />;
      case 'ev':
        return <Car className="h-6 w-6 text-green-500" />;
      case 'home':
        return <Home className="h-6 w-6 text-slate-500" />;
      case 'wind':
        return <Wind className="h-6 w-6 text-cyan-500" />;
      case 'load':
        return <MonitorSmartphone className="h-6 w-6 text-pink-500" />;
      default:
        return <Zap className="h-6 w-6 text-slate-400" />;
    }
  };
  
  // Determine node status indicator color
  const getStatusColor = () => {
    switch (node.status) {
      case 'active':
      case 'charging':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      case 'discharging':
        return 'bg-blue-500';
      default:
        return 'bg-slate-400';
    }
  };
  
  // Format power value with appropriate units
  const formatPower = (power: number) => {
    if (power >= 1000) {
      return `${(power / 1000).toFixed(2)} MW`;
    } else {
      return `${power.toFixed(1)} kW`;
    }
  };

  return (
    <div 
      className={cn(
        "relative flex items-center justify-center w-28 h-28 rounded-full bg-slate-50 dark:bg-slate-800 border-2 shadow-md transition-all",
        isNodeSelected
          ? "border-primary scale-110 shadow-lg"
          : "border-slate-200 dark:border-slate-700 hover:border-primary/50 cursor-pointer"
      )}
      onClick={onClick}
    >
      {/* Status indicator */}
      <div className={cn(
        "absolute top-1 right-1 w-3 h-3 rounded-full",
        getStatusColor()
      )} />
      
      {/* Icon and label */}
      <div className="flex flex-col items-center text-center">
        <div className="p-2 rounded-full bg-slate-100 dark:bg-slate-700 mb-1">
          {renderIcon()}
        </div>
        <div className="text-xs font-medium text-slate-700 dark:text-slate-200 truncate max-w-full px-1">
          {node.label || node.id}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {formatPower(node.power)}
        </div>
        
        {/* Battery level if applicable */}
        {node.deviceType === 'battery' && typeof node.batteryLevel === 'number' && (
          <div className="absolute bottom-1 left-0 w-full flex justify-center">
            <div className="h-1.5 w-16 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500" 
                style={{ width: `${node.batteryLevel}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnergyNode;
