
import React from 'react';
import { EnergyNodeProps } from './types';
import EnergyNodeComponent from './EnergyNode';

interface EnergyNodeCardProps {
  node: EnergyNodeProps['node'];
  onClick?: () => void;
}

export const EnergyNodeCard: React.FC<EnergyNodeCardProps> = ({ node, onClick }) => {
  return (
    <EnergyNodeComponent node={node} onClick={onClick} />
  );
};
