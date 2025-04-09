
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Type definitions
export type DeviceType = 'solar' | 'battery' | 'grid' | 'ev' | 'home' | 'heatpump' | 'generator' | 'wind';
export type DeviceStatus = 'active' | 'inactive' | 'warning' | 'error';

export interface EnergyDevice {
  id: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  site_id: string;
  model?: string;
  manufacturer?: string;
  capacity?: number;
  power?: number;
  battery_level?: number;
  last_connected?: string;
  firmware_version?: string;
  created_at: string;
  last_updated?: string;
  settings?: Record<string, any>;
  connection_details?: Record<string, any>;
}

interface EnergyDeviceContextType {
  devices: EnergyDevice[];
  selectedDevice: EnergyDevice | null;
  loading: boolean;
  error: string | null;
  fetchDevices: (siteId?: string) => Promise<void>;
  selectDevice: (deviceId: string) => void;
  updateDeviceStatus: (deviceId: string, status: DeviceStatus) => Promise<boolean>;
  refreshDevice: (deviceId: string) => Promise<void>;
}

// Create context
const EnergyDeviceContext = createContext<EnergyDeviceContextType | undefined>(undefined);

// Provider component
export const EnergyDeviceProvider = ({ children }: { children: ReactNode }) => {
  const [devices, setDevices] = useState<EnergyDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<EnergyDevice | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDevices = async (siteId?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase.from('energy_devices').select('*');
      
      if (siteId) {
        query = query.eq('site_id', siteId);
      }
      
      const { data, error: fetchError } = await query.order('name');
      
      if (fetchError) throw new Error(fetchError.message);
      
      setDevices(data as EnergyDevice[]);
    } catch (err: any) {
      console.error('Error fetching devices:', err);
      setError(err.message);
      toast.error('Failed to load devices');
    } finally {
      setLoading(false);
    }
  };

  const selectDevice = (deviceId: string) => {
    const device = devices.find(d => d.id === deviceId) || null;
    setSelectedDevice(device);
  };

  const updateDeviceStatus = async (deviceId: string, status: DeviceStatus): Promise<boolean> => {
    try {
      const { error: updateError } = await supabase
        .from('energy_devices')
        .update({ 
          status, 
          last_updated: new Date().toISOString() 
        })
        .eq('id', deviceId);
      
      if (updateError) throw new Error(updateError.message);
      
      // Update local state
      setDevices(prevDevices => 
        prevDevices.map(device => 
          device.id === deviceId 
            ? { ...device, status, last_updated: new Date().toISOString() } 
            : device
        )
      );
      
      return true;
    } catch (err: any) {
      console.error('Error updating device status:', err);
      toast.error('Failed to update device status');
      return false;
    }
  };

  const refreshDevice = async (deviceId: string) => {
    try {
      const { data, error } = await supabase
        .from('energy_devices')
        .select('*')
        .eq('id', deviceId)
        .single();
      
      if (error) throw new Error(error.message);
      
      // Update in devices array
      setDevices(prevDevices => 
        prevDevices.map(device => 
          device.id === deviceId ? (data as EnergyDevice) : device
        )
      );
      
      // Update selected device if applicable
      if (selectedDevice?.id === deviceId) {
        setSelectedDevice(data as EnergyDevice);
      }
    } catch (err: any) {
      console.error('Error refreshing device:', err);
      toast.error('Failed to refresh device data');
    }
  };

  // Load devices initially
  useEffect(() => {
    fetchDevices();
  }, []);

  return (
    <EnergyDeviceContext.Provider
      value={{
        devices,
        selectedDevice,
        loading,
        error,
        fetchDevices,
        selectDevice,
        updateDeviceStatus,
        refreshDevice,
      }}
    >
      {children}
    </EnergyDeviceContext.Provider>
  );
};

// Hook for using the context
export const useEnergyDevices = () => {
  const context = useContext(EnergyDeviceContext);
  if (context === undefined) {
    throw new Error('useEnergyDevices must be used within an EnergyDeviceProvider');
  }
  return context;
};
