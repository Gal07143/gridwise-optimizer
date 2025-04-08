
import React from 'react';
import { Battery, Zap, Wind, Home, SunMedium, Cable } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EnergyNode } from './types';

interface EnergyNodeGroupProps {
  nodes: EnergyNode[];
  type: 'source' | 'storage' | 'consumption';
  className?: string;
  onNodeClick?: (nodeId: string) => void;
  selectedNodeId?: string | null;
}

const EnergyNodeGroup: React.FC<EnergyNodeGroupProps> = ({ 
  nodes, 
  type,
  className,
  onNodeClick,
  selectedNodeId
}) => {
  const filteredNodes = nodes.filter(node => node.type === type);
  
  return (
    <div className={cn("space-y-4", className)}>
      {filteredNodes.map(node => (
        <EnergyNodeItem 
          key={node.id}
          node={node}
          onClick={() => onNodeClick?.(node.id)}
          isSelected={selectedNodeId === node.id}
        />
      ))}
    </div>
  );
};

interface EnergyNodeItemProps {
  node: EnergyNode;
  onClick?: () => void;
  isSelected?: boolean;
}

const EnergyNodeItem: React.FC<EnergyNodeItemProps> = ({ node, onClick, isSelected }) => {
  const getNodeIcon = () => {
    switch (node.deviceType) {
      case 'solar':
        return <SunMedium className="h-6 w-6 text-yellow-400" />;
      case 'wind':
        return <Wind className="h-6 w-6 text-blue-400" />;
      case 'battery':
        return <Battery className="h-6 w-6 text-purple-400" />;
      case 'grid':
        return <Cable className="h-6 w-6 text-red-400" />;
      case 'home':
        return <Home className="h-6 w-6 text-green-400" />;
      case 'ev':
        return <Zap className="h-6 w-6 text-amber-400" />;
      default:
        return <Zap className="h-6 w-6 text-gray-400" />;
    }
  };

  const getNodeColors = () => {
    switch (node.deviceType) {
      case 'solar':
        return "from-yellow-800/80 via-yellow-900/80 to-black/80 border-yellow-700/30";
      case 'wind':
        return "from-blue-800/80 via-blue-900/80 to-black/80 border-blue-700/30";
      case 'battery':
        return "from-purple-800/80 via-purple-900/80 to-black/80 border-purple-700/30";
      case 'grid':
        return "from-red-800/80 via-red-900/80 to-black/80 border-red-700/30";
      case 'home':
        return "from-green-800/80 via-green-900/80 to-black/80 border-green-700/30";
      case 'ev':
        return "from-amber-800/80 via-amber-900/80 to-black/80 border-amber-700/30";
      default:
        return "from-gray-800/80 via-gray-900/80 to-black/80 border-gray-700/30";
    }
  };
  
  return (
    <div 
      className={cn(
        "p-4 rounded-xl bg-gradient-to-br border backdrop-blur-sm transition-all duration-300 w-[130px]",
        getNodeColors(),
        isSelected ? "ring-2 ring-white/40 shadow-lg transform scale-105" : "",
        onClick ? "cursor-pointer hover:scale-105" : ""
      )}
      onClick={onClick}
    >
      <div className="flex flex-col items-center text-center gap-2">
        <div className="mb-2 p-3 rounded-full bg-black/30 flex items-center justify-center">
          {getNodeIcon()}
        </div>
        <div className="text-sm font-medium text-white">{node.label}</div>
        <div className="text-xl font-bold text-white">
          {node.power.toFixed(1)} kW
        </div>
        {node.deviceType === 'battery' && typeof node.batteryLevel !== 'undefined' && (
          <>
            <div className="text-xs text-white/70 -mt-1">{node.batteryLevel}% charged</div>
            <div className="w-full h-1.5 bg-white/20 rounded-full">
              <div 
                className="h-full bg-purple-400 rounded-full transition-all duration-700" 
                style={{ width: `${node.batteryLevel}%` }}
              />
            </div>
          </>
        )}
        {node.status !== 'active' && (
          <div className={cn(
            "text-xs px-2 py-0.5 rounded-full mt-1",
            node.status === 'warning' ? "bg-yellow-800/50 text-yellow-300 border border-yellow-700/30" :
            node.status === 'error' ? "bg-red-800/50 text-red-300 border border-red-700/30" :
            "bg-gray-800/50 text-gray-300 border border-gray-700/30"
          )}>
            {node.status.charAt(0).toUpperCase() + node.status.slice(1)}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnergyNodeGroup;
