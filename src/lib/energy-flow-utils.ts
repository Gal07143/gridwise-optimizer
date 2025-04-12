
import { EnergyNode, EnergyConnection } from '@/components/dashboard/energy-flow/types';

/**
 * Creates positions for nodes in the energy flow diagram
 */
export const createNodePositions = (nodes: EnergyNode[]) => {
  const positions: Record<string, { x: number; y: number }> = {};
  
  // Separate nodes by type
  const sourceNodes = nodes.filter(n => n.type === 'source');
  const storageNodes = nodes.filter(n => n.type === 'storage');
  const consumptionNodes = nodes.filter(n => n.type === 'consumption');
  
  // Calculate positions for source nodes (left side)
  const sourceSpacing = 600 / (sourceNodes.length + 1);
  sourceNodes.forEach((node, index) => {
    positions[node.id] = {
      x: 150,
      y: 100 + (index + 1) * sourceSpacing
    };
  });
  
  // Calculate positions for storage nodes (middle)
  const storageSpacing = 600 / (storageNodes.length + 1);
  storageNodes.forEach((node, index) => {
    positions[node.id] = {
      x: 500,
      y: 100 + (index + 1) * storageSpacing
    };
  });
  
  // Calculate positions for consumption nodes (right side)
  const consumptionSpacing = 600 / (consumptionNodes.length + 1);
  consumptionNodes.forEach((node, index) => {
    positions[node.id] = {
      x: 850,
      y: 100 + (index + 1) * consumptionSpacing
    };
  });
  
  return positions;
};

/**
 * Creates flow lines between energy nodes
 */
export const createEnergyFlowLines = (
  connections: EnergyConnection[],
  positions: Record<string, { x: number; y: number }>
) => {
  return connections.map(connection => {
    const sourceId = connection.source || connection.from || '';
    const targetId = connection.target || connection.to || '';
    
    // If we don't have positions for these nodes, skip
    if (!positions[sourceId] || !positions[targetId]) {
      return {
        id: connection.id,
        points: { x1: 0, y1: 0, x2: 0, y2: 0 },
        value: 0,
        isActive: false
      };
    }
    
    const source = positions[sourceId];
    const target = positions[targetId];
    
    return {
      id: connection.id,
      points: {
        x1: source.x,
        y1: source.y,
        x2: target.x,
        y2: target.y
      },
      value: connection.value || 0,
      isActive: connection.animated !== false
    };
  });
};

/**
 * Calculates the optimal battery charge/discharge schedule
 * based on energy prices and forecasted generation/consumption
 */
export const calculateOptimalBatterySchedule = (
  batteryCapacity: number,
  initialSoc: number,
  minSoc: number,
  maxSoc: number,
  hourlyPrices: number[],
  loadForecast: number[],
  pvForecast: number[],
  maxChargePower: number,
  maxDischargePower: number
) => {
  // Simple implementation - more complex optimization would be done in a real application
  const schedule = [];
  let currentSoc = initialSoc;
  
  for (let hour = 0; hour < 24; hour++) {
    const pv = pvForecast[hour] || 0;
    const load = loadForecast[hour] || 0;
    const price = hourlyPrices[hour] || 0;
    
    let batteryPower = 0;
    
    // Simple logic: charge when solar excess, discharge during high prices
    if (pv > load && currentSoc < maxSoc) {
      // We have excess solar and battery can be charged
      const excessPower = Math.min(pv - load, maxChargePower);
      const socIncrease = (excessPower / batteryCapacity) * 100;
      const newSoc = Math.min(currentSoc + socIncrease, maxSoc);
      
      batteryPower = -excessPower; // Negative means charging
      currentSoc = newSoc;
    } else if (price > 0.15 && currentSoc > minSoc) { // Arbitrary threshold of 15 cents
      // High price, discharge if possible
      const dischargeCapacity = Math.min(
        maxDischargePower,
        ((currentSoc - minSoc) / 100) * batteryCapacity
      );
      const dischargeNeeded = Math.min(load, dischargeCapacity);
      
      batteryPower = dischargeNeeded; // Positive means discharging
      currentSoc -= (dischargeNeeded / batteryCapacity) * 100;
    }
    
    schedule.push({
      hour,
      batteryPower,
      soc: currentSoc,
      pv,
      load,
      grid: load - pv - batteryPower,
      price
    });
  }
  
  return schedule;
};
