
export interface EnergyNode {
  id: string;
  label: string;
  type: 'source' | 'storage' | 'consumption';
  power: number;
  status: 'active' | 'inactive' | 'error' | 'warning';
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

export interface EnergyFlowChartProps {
  className?: string;
  animationDelay?: string;
}
