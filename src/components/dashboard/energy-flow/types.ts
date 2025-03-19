
export interface EnergyNode {
  id: string;
  label: string;
  type: 'source' | 'consumption' | 'storage';
  power: number; // in kW
  status: 'active' | 'inactive' | 'warning';
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
