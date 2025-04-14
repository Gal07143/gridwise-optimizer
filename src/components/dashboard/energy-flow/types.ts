
export interface EnergyFlowNode {
  id: string;
  name: string;
  type: 'source' | 'sink' | 'storage' | 'grid' | 'device';
  power: number;
  capacity?: number;
  stateOfCharge?: number;
  position: { x: number; y: number };
  status: 'active' | 'inactive' | 'error' | 'warning';
  icon?: string;
}

export interface EnergyFlowConnection {
  id: string;
  source: string;
  target: string;
  power: number;
  direction: 'forward' | 'reverse' | 'bidirectional';
  status: 'active' | 'inactive';
}

export interface EnergyFlowSnapshot {
  timestamp: string;
  nodes: EnergyFlowNode[];
  connections: EnergyFlowConnection[];
  totalImport: number;
  totalExport: number;
  totalGeneration: number;
  totalConsumption: number;
}
