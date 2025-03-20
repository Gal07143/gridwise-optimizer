
export type ComponentStatus = 'operational' | 'degraded' | 'down' | 'maintenance';

export interface SystemComponent {
  id: string;
  component_name: string;
  status: ComponentStatus;
  details: string;
  latency: number;
  last_restart: string;
  updated_at: string;
}

export interface SystemEvent {
  id: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'error';
  message: string;
  component_id: string | null;
  component_name?: string;
  acknowledged: boolean;
}
