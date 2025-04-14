
export interface Asset {
  id: string;
  name: string;
  type: string;
  capacity: number;
  status: string;
  lastUpdated: string;
}

export interface GridSignal {
  id: string;
  timestamp: string;
  type: string;
  source: string;
  priority: string;
  value: number;
  duration: number;
  status: string;
}
