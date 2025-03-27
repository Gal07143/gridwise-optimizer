
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
  nodes = [], // Provide a default empty array to prevent issues
  type, 
  className,
  onNodeClick,
  selectedNodeId
}) => {
  // Safely filter nodes - handle case where nodes might be undefined
  const filteredNodes = Array.isArray(nodes) 
    ? nodes.filter(n => n && n.type === type)
    : [];
  
  // If no nodes match, render an empty placeholder to maintain layout
  if (filteredNodes.length === 0) {
    return <div className={className} />;
  }
  
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
