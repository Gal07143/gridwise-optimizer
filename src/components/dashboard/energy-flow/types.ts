
// Remove conflicting imports
// import { DeviceType, DeviceStatus } from '@/components/dashboard/energy-flow/types';

export type DeviceType = 'solar' | 'battery' | 'grid' | 'ev' | 'home' | 'heatpump' | 'generator' | 'wind' | 'load' | 'inverter' | 'meter' | 'light' | 'hydro';
export type DeviceStatus = 'active' | 'inactive' | 'warning' | 'error' | 'charging' | 'discharging' | 'idle' | 'online' | 'offline' | 'maintenance';

export interface EnergyNode {
  id: string;
  name: string;
  type: 'source' | 'storage' | 'consumption';
  power: number; // Making power a required property
  position?: {
    x: number;
    y: number;
  };
  data?: {
    power?: number;
    energy?: number;
    status?: DeviceStatus;
    capacity?: number;
    batteryLevel?: number;
  };
  deviceType?: DeviceType;
  status?: DeviceStatus;
  batteryLevel?: number;
  label?: string;
}

export interface EnergyConnection {
  id: string;
  source: string;
  target: string;
  animated: boolean;
  value: number;
  from?: string; // For compatibility
  to?: string; // For compatibility
  active?: boolean; // For compatibility
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
  isSelected?: boolean; // Add this for compatibility
  onClick?: () => void;
}

export interface EnergyFlowChartProps {
  className?: string;
  animationDelay?: number | string; // Updated type to accept string (CSS value)
}
