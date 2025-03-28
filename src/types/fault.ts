
export interface Fault {
  id: string;
  title: string;
  description: string;
  severity: 'warning' | 'critical' | 'info';
  timestamp: string;
  status: 'active' | 'acknowledged' | 'resolved';
  device: {
    id: string;
    name: string;
  };
}
