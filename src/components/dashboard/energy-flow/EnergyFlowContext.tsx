import React, { createContext, useContext, useState } from 'react';
import { EnergyFlowData, EnergyNode } from './types';
import { useSiteContext } from '@/contexts/SiteContext';

interface EnergyFlowContextType {
  energyFlowData: EnergyFlowData;
  setEnergyFlowData: (data: EnergyFlowData) => void;
  selectedNode: EnergyNode | null;
  setSelectedNode: (node: EnergyNode | null) => void;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
}

const EnergyFlowContext = createContext<EnergyFlowContextType | undefined>(undefined);

export const useEnergyFlowContext = () => {
  const context = useContext(EnergyFlowContext);
  if (!context) {
    throw new Error('useEnergyFlowContext must be used within a EnergyFlowProvider');
  }
  return context;
};

export const EnergyFlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [energyFlowData, setEnergyFlowData] = useState<EnergyFlowData>({
    nodes: [],
    links: [],
  });
  const [selectedNode, setSelectedNode] = useState<EnergyNode | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { activeSite } = useSiteContext();

  // Example function to update a node's data
  const updateNodeData = (nodeId: string, newData: Partial<EnergyNode>) => {
    setEnergyFlowData(prevData => {
      const updatedNodes = prevData.nodes.map(node =>
        node.id === nodeId ? { ...node, ...newData } : node
      );
      return { ...prevData, nodes: updatedNodes };
    });
  };

  return (
    <EnergyFlowContext.Provider
      value={{
        energyFlowData,
        setEnergyFlowData,
        selectedNode,
        setSelectedNode,
        isModalOpen,
        setIsModalOpen,
      }}
    >
      {children}
    </EnergyFlowContext.Provider>
  );
};
