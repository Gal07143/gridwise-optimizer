
import React from 'react';
import EnergyNode from './EnergyNode';
import { EnergyNode as EnergyNodeType } from './types';
import { cn } from '@/lib/utils';

interface EnergyNodeGroupProps {
  nodes: EnergyNodeType[];
  type: 'source' | 'storage' | 'consumption';
  className?: string;
  onNodeClick: (nodeId: string) => void;
  selectedNodeId: string | null;
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
    <div className={cn('flex flex-col gap-8', className)}>
      {filteredNodes.map(node => (
        <EnergyNode 
          key={node.id} 
          node={node}
          isSelected={selectedNodeId === node.id}
          onClick={() => onNodeClick(node.id)}
        />
      ))}
    </div>
  );
};

export default EnergyNodeGroup;
