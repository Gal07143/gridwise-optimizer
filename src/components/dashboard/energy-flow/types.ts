
export interface EnergyNode {
  id: string;
  label: string;
  type: 'source' | 'storage' | 'consumption';
  power: number;
  status: 'active' | 'inactive' | 'error' | 'warning' | 'maintenance' | 'offline';
  deviceId?: string;
  deviceType?: 'solar' | 'wind' | 'battery' | 'grid' | 'load' | 'ev' | string;
  batteryLevel?: number; // Added for battery storage nodes
}

export interface EnergyConnection {
  from: string;
  to: string;
  value: number;
  active: boolean;
}

export interface EnergyFlowData {
  nodes: EnergyNode[];
  links: EnergyConnection[];
}

export type NodeConnection = EnergyConnection;

export interface EnergyFlowChartProps {
  className?: string;
  animationDelay?: string;
}
