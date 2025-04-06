
import { nanoid } from 'nanoid';
import { Alert } from '@/types/alert';

// Mock alerts for development
const mockAlerts: Alert[] = [
  {
    id: "alert-001",
    title: "Battery Low State of Charge",
    message: "Battery state of charge is below 15%",
    severity: "warning",
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(), // 15 minutes ago
    source: "Battery System",
    deviceId: "device-001",
    acknowledged: false,
    resolved: false
  },
  {
    id: "alert-002",
    title: "Grid Connection Lost",
    message: "Grid connection has been lost. System operating on battery power.",
    severity: "critical",
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(), // 45 minutes ago
    source: "Grid Connection",
    deviceId: "device-002",
    acknowledged: true,
    resolved: false
  },
  {
    id: "alert-003",
    title: "Inverter Firmware Update Available",
    message: "A new firmware update (v2.3.5) is available for your inverter.",
    severity: "info",
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), // 2 hours ago
    source: "System Updates",
    deviceId: "device-003",
    acknowledged: false,
    resolved: false
  },
  {
    id: "alert-004",
    title: "Solar Production Below Expected",
    message: "Solar production is 35% below expected for current weather conditions.",
    severity: "warning",
    timestamp: new Date(Date.now() - 4 * 3600000).toISOString(), // 4 hours ago
    source: "Performance Monitoring",
    deviceId: "device-004",
    acknowledged: true,
    resolved: true
  }
];

// In-memory store for alerts
let alerts = [...mockAlerts];

export const getRecentAlerts = async (): Promise<Alert[]> => {
  return [...alerts].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

export const getAlertById = async (id: string): Promise<Alert | null> => {
  return alerts.find(alert => alert.id === id) || null;
};

export const getCriticalAlerts = async (): Promise<Alert[]> => {
  return alerts
    .filter(alert => alert.severity === 'critical' && !alert.resolved)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const createAlert = async (alertData: Omit<Alert, 'id'>): Promise<Alert> => {
  const newAlert: Alert = {
    ...alertData,
    id: `alert-${nanoid(8)}`
  };
  
  alerts.push(newAlert);
  return newAlert;
};

export const acknowledgeAlert = async (id: string): Promise<Alert | null> => {
  const alertIndex = alerts.findIndex(alert => alert.id === id);
  if (alertIndex === -1) return null;
  
  const updatedAlert = {
    ...alerts[alertIndex],
    acknowledged: true
  };
  
  alerts[alertIndex] = updatedAlert;
  return updatedAlert;
};

export const resolveAlert = async (id: string): Promise<Alert | null> => {
  const alertIndex = alerts.findIndex(alert => alert.id === id);
  if (alertIndex === -1) return null;
  
  const updatedAlert = {
    ...alerts[alertIndex],
    resolved: true
  };
  
  alerts[alertIndex] = updatedAlert;
  return updatedAlert;
};

export type { Alert };
