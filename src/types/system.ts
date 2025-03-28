
// types/system.ts

export type ComponentStatus = 'operational' | 'degraded' | 'maintenance' | 'down';

export type SystemEventSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface SystemComponent {
  id: string;
  component_name: string;
  status: ComponentStatus;
  details: string;
  latency: number;         // in milliseconds
  last_restart: string;    // ISO timestamp
  updated_at: string;      // ISO timestamp
}

export interface SystemEvent {
  id: string;
  timestamp: string;              // ISO string
  severity: SystemEventSeverity;  // includes 'critical' now
  message: string;
  component_id: string | null;
  component_name?: string;        // optional override display
  acknowledged: boolean;
  title: string;                 // Added to fix the error
}
