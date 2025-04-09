
export type DeviceType = 'solar' | 'battery' | 'grid' | 'ev' | 'home' | 'heatpump' | 'generator' | 'wind';
export type DeviceStatus = 'active' | 'inactive' | 'warning' | 'error';

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
}

export interface EnergyConnection {
  id: string;
  source: string;
  target: string;
  animated: boolean;
  value: number;
  from?: string;
  to?: string;
  active?: boolean;
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

export interface EnergyFlowContextType {
  nodes: EnergyNode[];
  connections: EnergyConnection[];
  totalGeneration: number;
  totalConsumption: number;
  batteryPercentage: number;
  selfConsumptionRate: number;
  gridDependencyRate: number;
  isLoading: boolean;
  refreshData: () => void;
}
