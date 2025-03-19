
export interface EnergyNode {
  id: string;
  label: string;
  type: 'source' | 'consumption' | 'storage';
  power: number; // in kW
  status: 'active' | 'inactive' | 'warning';
  deviceId?: string; // Reference to the actual device ID for controls
  deviceType?: 'solar' | 'wind' | 'battery' | 'grid' | 'load' | 'ev_charger';
}

export interface EnergyConnection {
  from: string;
  to: string;
  value: number; // in kW
  active: boolean;
}

export interface EnergyFlowChartProps {
  className?: string;
  animationDelay?: string;
}

export interface EnergyControlAction {
  nodeId: string;
  deviceId: string;
  deviceType: 'solar' | 'wind' | 'battery' | 'grid' | 'load' | 'ev_charger';
}
