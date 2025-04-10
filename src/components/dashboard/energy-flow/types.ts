
export type DeviceType = 'solar' | 'battery' | 'grid' | 'ev' | 'home' | 'heatpump' | 'generator' | 'wind' | 'load';
export type DeviceStatus = 'active' | 'inactive' | 'warning' | 'error' | 'charging' | 'discharging' | 'idle';

export interface EnergyNode {
  id: string;
  name: string;
  type: 'source' | 'storage' | 'consumption';
  position: {
    x: number;
    y: number;
  };
  data?: {
    power?: number;
    energy?: number;
    status?: DeviceStatus;
    capacity?: number;
  };
  deviceType?: DeviceType;
  power?: number;
  status?: DeviceStatus;
  batteryLevel?: number;
  label?: string; // Added for compatibility
}

export interface EnergyConnection {
  id: string;
  source: string;
  target: string;
  animated: boolean;
  value: number;
  from?: string; // Added for compatibility 
  to?: string; // Added for compatibility
  active?: boolean; // Added for compatibility
}

export interface EnergyFlowData {
  nodes: EnergyNode[];
  connections: EnergyConnection[];
  totalGeneration: number;
  totalConsumption: number;
  batteryPercentage: number;
  selfConsumptionRate: number;
  gridDependencyRate: number;
}

export interface EnergyFlowState extends EnergyFlowData {
  isLoading: boolean;
}

export interface EnergyFlowContextType extends EnergyFlowState {
  refreshData: () => void;
}

export interface EnergyNodeProps {
  node: EnergyNode;
  selected?: boolean;
  onClick?: () => void;
}

export interface EnergyFlowChartProps {
  className?: string;
}
