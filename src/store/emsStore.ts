import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { MicrogridState } from '@/components/microgrid/types';

export interface EMSState {
  batteryLevel: number;
  solarProduction: number;
  windProduction: number;
  gridConsumption: number;
  loadDemand: number;
  operatingMode: 'auto' | 'manual' | 'eco' | 'backup';
  systemStatus: 'online' | 'offline' | 'maintenance' | 'warning' | 'error';
  alerts: Array<{
    id: string;
    title: string;
    message: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    timestamp: string;
    acknowledged: boolean;
  }>;
  
  // Actions
  setBatteryLevel: (level: number) => void;
  setSolarProduction: (production: number) => void;
  setWindProduction: (production: number) => void;
  setGridConsumption: (consumption: number) => void;
  setLoadDemand: (demand: number) => void;
  setOperatingMode: (mode: 'auto' | 'manual' | 'eco' | 'backup') => void;
  setSystemStatus: (status: 'online' | 'offline' | 'maintenance' | 'warning' | 'error') => void;
  acknowledgeAlert: (id: string) => void;
  addAlert: (alert: Omit<EMSState['alerts'][0], 'id' | 'timestamp' | 'acknowledged'>) => void;
  updateMicrogridState: (state: Partial<MicrogridState>) => void;
}

export const useEMSStore = create<EMSState>()(
  devtools(
    persist(
      (set) => ({
        batteryLevel: 78,
        solarProduction: 6.2,
        windProduction: 2.1,
        gridConsumption: 1.5,
        loadDemand: 4.8,
        operatingMode: 'auto',
        systemStatus: 'online',
        alerts: [
          {
            id: 'alert-1',
            title: 'System Alert',
            message: 'Microgrid system initialized',
            severity: 'low',
            timestamp: new Date().toISOString(),
            acknowledged: false
          }
        ],
        
        // Actions
        setBatteryLevel: (level) => set({ batteryLevel: level }),
        setSolarProduction: (production) => set({ solarProduction: production }),
        setWindProduction: (production) => set({ windProduction: production }),
        setGridConsumption: (consumption) => set({ gridConsumption: consumption }),
        setLoadDemand: (demand) => set({ loadDemand: demand }),
        setOperatingMode: (mode) => set({ operatingMode: mode }),
        setSystemStatus: (status) => set({ systemStatus: status }),
        acknowledgeAlert: (id) => set((state) => ({
          alerts: state.alerts.map(alert => 
            alert.id === id ? { ...alert, acknowledged: true } : alert
          )
        })),
        addAlert: (alert) => set((state) => ({
          alerts: [
            ...state.alerts,
            {
              id: `alert-${Date.now()}`,
              timestamp: new Date().toISOString(),
              acknowledged: false,
              ...alert
            }
          ]
        })),
        updateMicrogridState: (state) => set((current) => ({
          batteryLevel: state.batteryLevel ?? current.batteryLevel,
          solarProduction: state.solarProduction ?? current.solarProduction,
          windProduction: state.windProduction ?? current.windProduction,
          gridConsumption: state.gridImport ?? current.gridConsumption,
          loadDemand: state.loadDemand ?? current.loadDemand,
          operatingMode: state.operatingMode as any ?? current.operatingMode,
        }))
      }),
      {
        name: 'ems-data-storage',
      }
    )
  )
);
