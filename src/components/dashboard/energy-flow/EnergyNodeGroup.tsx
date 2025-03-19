
import React from 'react';
import EnergyNode from './EnergyNode';
import { EnergyNode as EnergyNodeType } from './types';

interface EnergyNodeGroupProps {
  nodes: EnergyNodeType[];
  type: 'source' | 'consumption' | 'storage';
  className: string;
}

const EnergyNodeGroup: React.FC<EnergyNodeGroupProps> = ({ nodes, type, className }) => {
  const filteredNodes = nodes.filter(n => n.type === type);
  
  return (
    <div className={className}>
      {filteredNodes.map(node => (
        <EnergyNode key={node.id} node={node} />
      ))}
    </div>
  );
};

export default EnergyNodeGroup;
