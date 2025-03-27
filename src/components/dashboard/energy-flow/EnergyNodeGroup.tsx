
import React from 'react';
import EnergyNode from './EnergyNode';
import { EnergyNode as EnergyNodeType } from './types';
import { cn } from '@/lib/utils';

interface EnergyNodeGroupProps {
  nodes: EnergyNodeType[];
  type: 'source' | 'consumption' | 'storage';
  className: string;
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
  const filteredNodes = nodes.filter(n => n.type === type);
  
  return (
    <div className={className}>
      {filteredNodes.map(node => (
        <EnergyNode 
          key={node.id} 
          node={node} 
          className={cn(
            "transition-all duration-300",
            selectedNodeId && selectedNodeId !== node.id ? "opacity-60 scale-95" : "",
            selectedNodeId === node.id ? "ring-2 ring-white/40 shadow-glow" : ""
          )}
          onClick={() => onNodeClick?.(node.id)} 
        />
      ))}
    </div>
  );
};

export default EnergyNodeGroup;
