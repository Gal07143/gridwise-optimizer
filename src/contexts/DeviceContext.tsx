import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'react-hot-toast';

export interface Device {
  id: string;
  name: string;
  type: string;
  protocol: string;
  mqtt_topic?: string;
  http_endpoint?: string;
  status: string;
  last_seen?: string;
  is_active: boolean;
  metadata?: Record<string, any>;
}

export interface TelemetryData {
  id: string;
  device_id: string;
  timestamp: string;
  message: Record<string, any>;
  source: string;
}

interface DeviceContextType {
  devices: Device[];
  loading: boolean;
  error: string | null;
  selectedDevice: Device | null;
  deviceTelemetry: Record<string, TelemetryData[]>;
  fetchDevices: () => Promise<void>;
  addDevice: (device: Omit<Device, 'id'>) => Promise<void>;
  updateDevice: (id: string, updates: Partial<Device>) => Promise<void>;
  deleteDevice: (id: string) => Promise<void>;
  sendCommand: (deviceId: string, command: Record<string, any>) => Promise<void>;
  selectDevice: (device: Device | null) => void;
  fetchDeviceTelemetry: (deviceId: string) => Promise<void>;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export function DeviceProvider({ children }: { children: React.ReactNode }) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [deviceTelemetry, setDeviceTelemetry] = useState<Record<string, TelemetryData[]>>({});

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('devices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDevices(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch devices');
      toast.error('Failed to fetch devices');
    } finally {
      setLoading(false);
    }
  };

  const addDevice = async (device: Omit<Device, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('devices')
        .insert([device])
        .select()
        .single();

      if (error) throw error;
      setDevices(prev => [data, ...prev]);
      toast.success('Device added successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add device');
      toast.error('Failed to add device');
    }
  };

  const updateDevice = async (id: string, updates: Partial<Device>) => {
    try {
      const { data, error } = await supabase
        .from('devices')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setDevices(prev => prev.map(device => 
        device.id === id ? { ...device, ...data } : device
      ));
      toast.success('Device updated successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update device');
      toast.error('Failed to update device');
    }
  };

  const deleteDevice = async (id: string) => {
    try {
      const { error } = await supabase
        .from('devices')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setDevices(prev => prev.filter(device => device.id !== id));
      toast.success('Device deleted successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete device');
      toast.error('Failed to delete device');
    }
  };

  const sendCommand = async (deviceId: string, command: Record<string, any>) => {
    try {
      const response = await fetch(`/api/devices/${deviceId}/command`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(command),
      });

      if (!response.ok) throw new Error('Failed to send command');
      toast.success('Command sent successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send command');
      toast.error('Failed to send command');
    }
  };

  const fetchDeviceTelemetry = async (deviceId: string) => {
    try {
      const { data, error } = await supabase
        .from('telemetry_log')
        .select('*')
        .eq('device_id', deviceId)
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) throw error;
      setDeviceTelemetry(prev => ({
        ...prev,
        [deviceId]: data || [],
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch telemetry');
      toast.error('Failed to fetch telemetry data');
    }
  };

  // Subscribe to real-time device updates
  useEffect(() => {
    const channel = supabase
      .channel('devices')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'devices',
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setDevices(prev => [payload.new as Device, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setDevices(prev => prev.map(device => 
            device.id === payload.new.id ? { ...device, ...payload.new } : device
          ));
        } else if (payload.eventType === 'DELETE') {
          setDevices(prev => prev.filter(device => device.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Subscribe to real-time telemetry updates
  useEffect(() => {
    if (!selectedDevice) return;

    const channel = supabase
      .channel(`telemetry-${selectedDevice.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'telemetry_log',
        filter: `device_id=eq.${selectedDevice.id}`,
      }, (payload) => {
        setDeviceTelemetry(prev => ({
          ...prev,
          [selectedDevice.id]: [payload.new as TelemetryData, ...(prev[selectedDevice.id] || [])].slice(0, 100),
        }));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedDevice]);

  return (
    <DeviceContext.Provider
      value={{
        devices,
        loading,
        error,
        selectedDevice,
        deviceTelemetry,
        fetchDevices,
        addDevice,
        updateDevice,
        deleteDevice,
        sendCommand,
        selectDevice: setSelectedDevice,
        fetchDeviceTelemetry,
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
}

export function useDevices() {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error('useDevices must be used within a DeviceProvider');
  }
  return context;
} 