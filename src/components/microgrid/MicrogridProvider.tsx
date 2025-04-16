
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useDevicesContext } from '@/contexts/DeviceContext';

interface MicrogridState {
  solarProduction: number;
  batteryCharge: number;
  gridPower: number;
  homeConsumption: number;
  batteryStatus: 'charging' | 'discharging' | 'idle';
  gridStatus: 'importing' | 'exporting' | 'neutral';
}

interface MicrogridContextType {
  state: MicrogridState;
  isLoading: boolean;
  error: Error | null;
  updateMicrogrid: (data: Partial<MicrogridState>) => void;
}

const defaultState: MicrogridState = {
  solarProduction: 0,
  batteryCharge: 50,
  gridPower: 0,
  homeConsumption: 0,
  batteryStatus: 'idle',
  gridStatus: 'neutral',
};

const MicrogridContext = createContext<MicrogridContextType | null>(null);

export const useMicrogrid = () => {
  const context = useContext(MicrogridContext);
  if (!context) {
    throw new Error('useMicrogrid must be used within a MicrogridProvider');
  }
  return context;
};

interface MicrogridProviderProps {
  children: ReactNode;
}

const MicrogridProvider: React.FC<MicrogridProviderProps> = ({ children }) => {
  const [state, setState] = useState<MicrogridState>(defaultState);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Use device context if available, otherwise proceed without it
  let deviceContext;
  try {
    deviceContext = useDevicesContext();
  } catch (error) {
    console.log('Device context not available in MicrogridProvider');
  }

  useEffect(() => {
    const fetchMicrogridData = async () => {
      try {
        setIsLoading(true);
        
        // In a real application, this would fetch data from an API
        // For now, we'll use simulated data
        const now = new Date();
        const hour = now.getHours();
        
        // Simulate solar production based on time of day
        let solarProduction = 0;
        if (hour >= 6 && hour <= 18) {
          // Peak solar production at noon (hour 12)
          const peakFactor = 1 - Math.abs(hour - 12) / 6;
          solarProduction = 7 * peakFactor * (0.85 + Math.random() * 0.3);
        }
        
        // Simulate battery dynamics
        let batteryCharge = 30 + Math.random() * 60;
        let batteryStatus: 'charging' | 'discharging' | 'idle' = 'idle';
        
        if (solarProduction > 3.5) {
          batteryStatus = 'charging';
        } else if (hour >= 18 || hour <= 6) {
          batteryStatus = 'discharging';
        }
        
        // Simulate home consumption
        let homeConsumption = 1 + Math.random();
        if (hour >= 7 && hour <= 9) {
          homeConsumption = 3 + Math.random() * 2; // Morning peak
        } else if (hour >= 17 && hour <= 22) {
          homeConsumption = 4 + Math.random() * 3; // Evening peak
        }
        
        // Calculate grid power
        const gridPower = homeConsumption - solarProduction - 
          (batteryStatus === 'discharging' ? 2 : batteryStatus === 'charging' ? -1 : 0);
        
        // Determine grid status
        let gridStatus: 'importing' | 'exporting' | 'neutral' = 'neutral';
        if (gridPower > 0.2) {
          gridStatus = 'importing';
        } else if (gridPower < -0.2) {
          gridStatus = 'exporting';
        }
        
        setState({
          solarProduction: Number(solarProduction.toFixed(2)),
          batteryCharge: Number(batteryCharge.toFixed(1)),
          gridPower: Number(gridPower.toFixed(2)),
          homeConsumption: Number(homeConsumption.toFixed(2)),
          batteryStatus,
          gridStatus,
        });
        
        setError(null);
      } catch (err) {
        console.error('Error fetching microgrid data:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch microgrid data'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchMicrogridData();
    
    // Update every minute
    const interval = setInterval(fetchMicrogridData, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const updateMicrogrid = (data: Partial<MicrogridState>) => {
    setState(prev => ({
      ...prev,
      ...data,
    }));
  };

  return (
    <MicrogridContext.Provider value={{ state, isLoading, error, updateMicrogrid }}>
      {children}
    </MicrogridContext.Provider>
  );
};

export default MicrogridProvider;
