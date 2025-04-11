
import React from 'react';
import { EnergyNode } from './types';
import EnergyNode from './EnergyNode';

interface EnergyNodeCardProps {
  node: EnergyNode;
  onClick?: () => void;
}

export const EnergyNodeCard: React.FC<EnergyNodeCardProps> = ({ node, onClick }) => {
  return (
    <EnergyNode node={node} onClick={onClick} />
  );
};
