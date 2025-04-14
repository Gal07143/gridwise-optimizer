import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useDevices } from '@/contexts/DeviceContext';
import { toast } from 'react-hot-toast';

/**
 * Types for microgrid metrics and status
 */
export type GridStatus = 'connected' | 'disconnected' | 'unknown';
export type DeviceType = 'battery' | 'grid' | 'solar' | 'wind' | 'load';

export interface MicrogridMetrics {
  isConnected: boolean;
  totalPower: number;
  batteryLevel: number;
  gridStatus: GridStatus;
  solarPower: number;
  windPower: number;
  loadPower: number;
  efficiency: number;
  lastUpdated: Date;
}

export interface MicrogridState extends MicrogridMetrics {
  isLoading: boolean;
  error: string | null;
}

export interface MicrogridContextType extends MicrogridState {
  refreshMetrics: () => Promise<void>;
  getDeviceMetrics: (type: DeviceType) => {
    count: number;
    totalPower: number;
    averageEfficiency: number;
  };
}

/**
 * Default values for microgrid context
 */
const defaultContext: MicrogridContextType = {
  isConnected: false,
  totalPower: 0,
  batteryLevel: 0,
  gridStatus: 'unknown',
  solarPower: 0,
  windPower: 0,
  loadPower: 0,
  efficiency: 0,
  lastUpdated: new Date(),
  isLoading: false,
  error: null,
  refreshMetrics: async () => {},
  getDeviceMetrics: () => ({ count: 0, totalPower: 0, averageEfficiency: 0 }),
};

const MicrogridContext = createContext<MicrogridContextType>(defaultContext);

/**
 * Hook to access microgrid context
 */
export const useMicrogrid = () => useContext(MicrogridContext);

interface MicrogridProviderProps {
  children: React.ReactNode;
  refreshInterval?: number; // in milliseconds
}

/**
 * Provider component for microgrid-related data and state
 * Manages connection status, power metrics, and grid status
 */
const MicrogridProvider: React.FC<MicrogridProviderProps> = ({ 
  children,
  refreshInterval = 30000, // 30 seconds default
}) => {
  const { devices, deviceTelemetry } = useDevices();
  const [state, setState] = useState<MicrogridState>({
    ...defaultContext,
    isLoading: true,
  });

  /**
   * Get the latest telemetry data for a device
   */
  const getLatestTelemetry = useCallback((deviceId: string): TelemetryData | null => {
    const telemetry = deviceTelemetry[deviceId];
    return telemetry && telemetry.length > 0 ? telemetry[0] : null;
  }, [deviceTelemetry]);

  /**
   * Calculate metrics for a specific device type
   */
  const calculateDeviceMetrics = useCallback((type: DeviceType) => {
    const typeDevices = devices.filter(device => device.type === type && device.status === 'online');
    const totalPower = typeDevices.reduce((sum, device) => {
      const telemetry = getLatestTelemetry(device.id);
      return sum + (telemetry?.data.power || 0);
    }, 0);
    const averageEfficiency = typeDevices.reduce((sum, device) => {
      const telemetry = getLatestTelemetry(device.id);
      return sum + (telemetry?.data.efficiency || 0);
    }, 0) / typeDevices.length || 0;

    return {
      count: typeDevices.length,
      totalPower,
      averageEfficiency,
    };
  }, [devices, getLatestTelemetry]);

  /**
   * Calculate all microgrid metrics based on device data
   */
  const calculateMetrics = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const connectedDevices = devices.filter(device => device.status === 'online');
      const totalPower = connectedDevices.reduce((sum, device) => {
        const telemetry = getLatestTelemetry(device.id);
        return sum + (telemetry?.data.power || 0);
      }, 0);

      const batteryMetrics = calculateDeviceMetrics('battery');
      const solarMetrics = calculateDeviceMetrics('solar');
      const windMetrics = calculateDeviceMetrics('wind');
      const loadMetrics = calculateDeviceMetrics('load');

      const gridDevices = connectedDevices.filter(device => device.type === 'grid');
      const gridStatus = gridDevices.length > 0
        ? gridDevices.some(device => {
            const telemetry = getLatestTelemetry(device.id);
            return telemetry?.data.gridConnected;
          })
          ? 'connected'
          : 'disconnected'
        : 'unknown';

      const efficiency = connectedDevices.reduce((sum, device) => {
        const telemetry = getLatestTelemetry(device.id);
        return sum + (telemetry?.data.efficiency || 0);
      }, 0) / connectedDevices.length || 0;

      setState({
        isConnected: connectedDevices.length > 0,
        totalPower,
        batteryLevel: batteryMetrics.totalPower,
        gridStatus,
        solarPower: solarMetrics.totalPower,
        windPower: windMetrics.totalPower,
        loadPower: loadMetrics.totalPower,
        efficiency,
        lastUpdated: new Date(),
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to calculate metrics';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      toast.error(errorMessage);
    }
  }, [devices, calculateDeviceMetrics, getLatestTelemetry]);

  /**
   * Get metrics for a specific device type
   */
  const getDeviceMetrics = useCallback((type: DeviceType) => {
    return calculateDeviceMetrics(type);
  }, [calculateDeviceMetrics]);

  // Initial metrics calculation
  useEffect(() => {
    calculateMetrics();
  }, [calculateMetrics]);

  // Set up refresh interval
  useEffect(() => {
    const interval = setInterval(calculateMetrics, refreshInterval);
    return () => clearInterval(interval);
  }, [calculateMetrics, refreshInterval]);

  return (
    <MicrogridContext.Provider 
      value={{
        ...state,
        refreshMetrics: calculateMetrics,
        getDeviceMetrics,
      }}
    >
      {children}
    </MicrogridContext.Provider>
  );
};

export default MicrogridProvider;
