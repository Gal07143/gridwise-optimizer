import React, { createContext, useContext, useState, useEffect } from 'react';

interface MicrogridState {
  systemMode: 'auto' | 'manual' | 'economy' | 'backup';
  gridConnection: boolean;
  batteryLevel: number;
  solarProduction: number;
  gridConsumption: number;
  lastUpdated: string | null;
  alerts: Array<{
    id: string;
    severity: 'critical' | 'warning' | 'info';
    message: string;
    timestamp: string;
    acknowledged: boolean;
  }>;
}

interface MicrogridContextType {
  state: MicrogridState;
  handleModeChange: (mode: string) => void;
  handleGridConnectionToggle: () => void;
  setBatteryReserve: (level: number) => void;
  acknowledgeAlert: (alertId: string) => void;
  batteryReserve: number;
  runSystemCheck: () => Promise<boolean>;
}

const initialState: MicrogridState = {
  systemMode: 'auto',
  gridConnection: true,
  batteryLevel: 78,
  solarProduction: 3.2,
  gridConsumption: 1.7,
  lastUpdated: new Date().toISOString(),
  alerts: [
    {
      id: 'alert-1',
      severity: 'warning',
      message: 'Battery efficiency below optimal threshold',
      timestamp: new Date().toISOString(),
      acknowledged: false,
    },
    {
      id: 'alert-2',
      severity: 'info',
      message: 'Solar production increased by 15%',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      acknowledged: true,
    },
  ],
};

const MicrogridContext = createContext<MicrogridContextType | undefined>(undefined);

export const useMicrogrid = () => {
  const context = useContext(MicrogridContext);
  if (!context) {
    throw new Error('useMicrogrid must be used within a MicrogridProvider');
  }
  return context;
};

interface MicrogridProviderProps {
  children: React.ReactNode;
}

const MicrogridProvider: React.FC<MicrogridProviderProps> = ({ children }) => {
  const [state, setState] = useState<MicrogridState>(initialState);
  const [batteryReserve, setBatteryReserve] = useState(20);

  const handleModeChange = (mode: string) => {
    setState(prev => ({
      ...prev,
      systemMode: mode as MicrogridState['systemMode'],
      lastUpdated: new Date().toISOString(),
    }));
  };

  const handleGridConnectionToggle = () => {
    setState(prev => ({
      ...prev,
      gridConnection: !prev.gridConnection,
      lastUpdated: new Date().toISOString(),
    }));
  };

  const acknowledgeAlert = (alertId: string) => {
    setState(prev => ({
      ...prev,
      alerts: prev.alerts.map(alert => 
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      ),
    }));
  };

  const runSystemCheck = async (): Promise<boolean> => {
    // Simulate a network request
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Return success
    return true;
  };

  // Simulate data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => {
        const batteryDelta = Math.random() * 4 - 2; // Between -2 and 2
        const solarDelta = Math.random() * 0.8 - 0.3; // Between -0.3 and 0.5
        const gridDelta = Math.random() * 0.6 - 0.2; // Between -0.2 and 0.4
        
        return {
          ...prev,
          batteryLevel: Math.min(100, Math.max(0, prev.batteryLevel + batteryDelta)),
          solarProduction: Math.max(0, prev.solarProduction + solarDelta),
          gridConsumption: Math.max(0, prev.gridConsumption + gridDelta),
          lastUpdated: new Date().toISOString(),
        };
      });
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <MicrogridContext.Provider value={{ 
      state, 
      handleModeChange, 
      handleGridConnectionToggle,
      setBatteryReserve,
      batteryReserve,
      acknowledgeAlert,
      runSystemCheck
    }}>
      {children}
    </MicrogridContext.Provider>
  );
};

export default MicrogridProvider;
