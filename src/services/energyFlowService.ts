
import { EnergyNode, EnergyConnection } from '@/components/dashboard/energy-flow/types';
import { supabase } from '@/integrations/supabase/client';

// Sample data for the initial state
const defaultNodes: EnergyNode[] = [
  {
    id: 'solar',
    label: 'Solar Panels',
    type: 'source',
    power: 5.2,
    status: 'active',
    deviceType: 'solar'
  },
  {
    id: 'wind',
    label: 'Wind Turbine',
    type: 'source',
    power: 1.8,
    status: 'active',
    deviceType: 'wind'
  },
  {
    id: 'battery',
    label: 'Battery Storage',
    type: 'storage',
    power: 3.5,
    status: 'active',
    deviceType: 'battery',
    batteryLevel: 65
  },
  {
    id: 'grid',
    label: 'Grid',
    type: 'source',
    power: 2.0,
    status: 'active',
    deviceType: 'grid'
  },
  {
    id: 'home',
    label: 'Home Consumption',
    type: 'consumption',
    power: 3.8,
    status: 'active',
    deviceType: 'load'
  },
  {
    id: 'ev',
    label: 'EV Charger',
    type: 'consumption',
    power: 1.5,
    status: 'active',
    deviceType: 'ev'
  }
];

const defaultConnections: EnergyConnection[] = [
  { from: 'solar', to: 'home', value: 2.5, active: true },
  { from: 'solar', to: 'battery', value: 1.2, active: true },
  { from: 'solar', to: 'grid', value: 1.5, active: true },
  { from: 'wind', to: 'home', value: 0.8, active: true },
  { from: 'wind', to: 'battery', value: 1.0, active: true },
  { from: 'battery', to: 'home', value: 0.5, active: true },
  { from: 'grid', to: 'home', value: 0.0, active: false },
  { from: 'grid', to: 'ev', value: 1.5, active: true }
];

export interface EnergyFlowData {
  nodes: EnergyNode[];
  connections: EnergyConnection[];
  timestamp: string;
  totalGeneration: number;
  totalConsumption: number;
  batteryPercentage: number;
  selfConsumptionRate: number;
  gridDependencyRate: number;
}

// Function to fetch energy flow data
export async function fetchEnergyFlowData(siteId: string): Promise<EnergyFlowData> {
  try {
    // In a real implementation, we would fetch this from Supabase
    // For now, we'll use our default data and simulate some variations
    
    // Calculate totals
    const totalGeneration = defaultNodes
      .filter(node => node.type === 'source' && node.deviceType !== 'grid')
      .reduce((sum, node) => sum + node.power, 0);
    
    const totalConsumption = defaultNodes
      .filter(node => node.type === 'consumption')
      .reduce((sum, node) => sum + node.power, 0);
    
    const batteryNode = defaultNodes.find(node => node.deviceType === 'battery');
    const batteryPercentage = batteryNode?.batteryLevel || 0;
    
    // Calculate self-consumption rate (percentage of generated energy used directly)
    const gridImport = defaultConnections
      .filter(conn => conn.from === 'grid' && conn.active)
      .reduce((sum, conn) => sum + conn.value, 0);
    
    const selfConsumption = totalConsumption - gridImport;
    const selfConsumptionRate = totalGeneration > 0 
      ? (selfConsumption / totalGeneration) * 100 
      : 0;
    
    // Calculate grid dependency rate
    const gridDependencyRate = totalConsumption > 0 
      ? (gridImport / totalConsumption) * 100 
      : 0;
    
    return {
      nodes: defaultNodes,
      connections: defaultConnections,
      timestamp: new Date().toISOString(),
      totalGeneration,
      totalConsumption,
      batteryPercentage,
      selfConsumptionRate,
      gridDependencyRate
    };
  } catch (error) {
    console.error('Error fetching energy flow data:', error);
    // Return default data in case of error
    return {
      nodes: defaultNodes,
      connections: defaultConnections,
      timestamp: new Date().toISOString(),
      totalGeneration: 7.0,
      totalConsumption: 5.3,
      batteryPercentage: 65,
      selfConsumptionRate: 75,
      gridDependencyRate: 25
    };
  }
}

// Function to send control commands
export async function sendEnergyFlowCommand(command: string, params: any): Promise<boolean> {
  try {
    // Simulate a command being sent
    console.log(`Sending command: ${command}`, params);
    // In a real implementation, we would send this to the backend
    
    // Simulate success
    return true;
  } catch (error) {
    console.error('Error sending command:', error);
    return false;
  }
}
