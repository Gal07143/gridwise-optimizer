
import { EnergyNode, EnergyConnection } from '@/components/dashboard/energy-flow/types';

// Calculate positions for nodes based on their type
export const createNodePositions = (nodes: EnergyNode[]) => {
  const positions: Record<string, { x: number, y: number }> = {};
  
  // Group nodes by type
  const sourceNodes = nodes.filter(node => node.type === 'source');
  const storageNodes = nodes.filter(node => node.type === 'storage');
  const consumptionNodes = nodes.filter(node => node.type === 'consumption');
  
  // Calculate positions based on node type
  // Sources at the top
  sourceNodes.forEach((node, index) => {
    const spread = 1000 / (sourceNodes.length + 1);
    positions[node.id] = {
      x: spread * (index + 1),
      y: 150
    };
  });
  
  // Storage in the middle
  storageNodes.forEach((node, index) => {
    const spread = 1000 / (storageNodes.length + 1);
    positions[node.id] = {
      x: spread * (index + 1),
      y: 300
    };
  });
  
  // Consumption at the bottom
  consumptionNodes.forEach((node, index) => {
    const spread = 1000 / (consumptionNodes.length + 1);
    positions[node.id] = {
      x: spread * (index + 1),
      y: 450
    };
  });
  
  return positions;
};

// Create flow lines between nodes
export const createEnergyFlowLines = (
  connections: EnergyConnection[],
  positions: Record<string, { x: number, y: number }>
) => {
  return connections.map(connection => {
    const sourceId = connection.source || connection.from;
    const targetId = connection.target || connection.to;
    
    if (!positions[sourceId] || !positions[targetId]) {
      console.warn('Position not found for connection', connection);
      return null;
    }
    
    const source = positions[sourceId];
    const target = positions[targetId];
    
    // Scale line thickness by energy value
    const strokeWidth = Math.max(1, Math.min(10, connection.value / 3));
    
    return {
      id: connection.id,
      sourceId,
      targetId,
      source,
      target,
      animated: connection.animated,
      value: connection.value,
      strokeWidth,
      active: connection.active !== false
    };
  }).filter(line => line !== null);
};
