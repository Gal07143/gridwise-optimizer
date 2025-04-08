
export interface EnergyNode {
  id: string;
  label: string;
  type: 'source' | 'storage' | 'consumption';
  power: number;
  status: 'active' | 'inactive' | 'warning' | 'error';
  deviceType: string;
  batteryLevel?: number;
}

export interface EnergyConnection {
  from: string;
  to: string;
  value: number;
  active: boolean;
  color?: string;
}

export interface EnergyFlowChartProps {
  className?: string;
  animationDelay?: string;
}

export interface EnergyFlowContextType {
  nodes: EnergyNode[];
  connections: EnergyConnection[];
  totalGeneration: number;
  totalConsumption: number;
  batteryPercentage: number;
  selfConsumptionRate: number;
  gridDependencyRate: number;
  refreshData: () => void;
  isLoading: boolean;
}

export interface EnergyFlowState {
  nodes: EnergyNode[];
  connections: EnergyConnection[];
  isLoading: boolean;
}

export interface EnergyNodeProps {
  node: EnergyNode;
  isSelected: boolean;
  onClick: () => void;
}
