
export interface Fault {
  id: string;
  title: string;
  description: string;
  severity: 'warning' | 'critical' | 'info';
  timestamp: string;
  status: string;
  device: {
    id: string;
    name: string;
  };
}
