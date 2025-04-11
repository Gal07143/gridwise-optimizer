
import React from 'react';
import { EnergyNode } from './types';
import EnergyNodeComponent from './EnergyNode';

interface EnergyNodeCardProps {
  node: EnergyNode;
  onClick?: () => void;
}

export const EnergyNodeCard: React.FC<EnergyNodeCardProps> = ({ node, onClick }) => {
  return (
    <EnergyNodeComponent node={node} onClick={onClick} />
  );
};
