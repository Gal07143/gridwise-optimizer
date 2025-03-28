
import React from 'react';
import { 
  AlertTriangle, 
  Battery, 
  CircleDot,
  Cpu, 
  Home, 
  Zap 
} from 'lucide-react';
import { EnergyNode as EnergyNodeType } from './types';
import { cn } from '@/lib/utils';

interface EnergyNodeProps {
  node: EnergyNodeType;
  className?: string;
  onClick?: () => void;
}

const EnergyNode: React.FC<EnergyNodeProps> = ({ 
  node, 
  className,
  onClick
}) => {
  const getNodeIcon = () => {
    switch (node.deviceType) {
      case 'solar':
        return <Zap className="h-6 w-6 text-amber-500" />;
      case 'wind':
        return <Zap className="h-6 w-6 text-blue-500" />;
      case 'battery':
        return <Battery className="h-6 w-6 text-green-500" />;
      case 'grid':
        return <Zap className="h-6 w-6 text-purple-500" />;
      case 'load':
      case 'ev':
        return <Home className="h-6 w-6 text-orange-500" />;
      default:
        return <Cpu className="h-6 w-6 text-muted-foreground" />;
    }
  };
  
  const getStatusIndicator = () => {
    switch (node.status) {
      case 'active':
        return "bg-green-500";
      case 'warning':
        return "bg-yellow-500";
      case 'error':
        return "bg-red-500";
      case 'maintenance':
      case 'inactive':
      case 'offline':
      default:
        return "bg-gray-400";
    }
  };
  
  const getNodeTypeLabel = () => {
    switch (node.type) {
      case 'source':
        return 'Generation';
      case 'storage':
        return 'Storage';
      case 'consumption':
        return 'Consumption';
      default:
        return node.type;
    }
  };
  
  return (
    <div 
      className={cn(
        "relative bg-card border rounded-lg p-3 shadow-sm hover:shadow-md transition-all",
        "cursor-pointer",
        node.status === 'error' && "border-red-500/50 animate-pulse",
        node.status === 'warning' && "border-yellow-500/50",
        node.status === 'active' && "border-green-500/30",
        node.status === 'maintenance' && "border-blue-500/30",
        node.status === 'inactive' && "border-gray-300 opacity-70",
        node.status === 'offline' && "border-gray-300 opacity-70",
        className
      )}
      onClick={onClick}
    >
      {/* Status indicator */}
      <div className="absolute top-2 right-2 flex items-center gap-1.5">
        <span className="text-xs text-muted-foreground capitalize">{node.status}</span>
        <div className={cn("h-2.5 w-2.5 rounded-full", getStatusIndicator())} />
      </div>
      
      {node.status === 'error' && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">
          <AlertTriangle className="h-4 w-4" />
        </div>
      )}
      
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-muted rounded-md">
          {getNodeIcon()}
        </div>
        <div>
          <h3 className="font-medium text-sm">{node.label}</h3>
          <p className="text-xs text-muted-foreground">{getNodeTypeLabel()}</p>
        </div>
      </div>
      
      <div className="mt-3 pt-2 border-t text-sm">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Power:</span>
          <span className="font-medium">{node.power} kW</span>
        </div>
        
        {node.batteryLevel !== undefined && (
          <div className="flex justify-between items-center mt-1">
            <span className="text-muted-foreground">Battery:</span>
            <span className="font-medium">{node.batteryLevel}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnergyNode;
