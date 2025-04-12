import { supabase } from '@/lib/supabase';
import { Device } from '@/types/device';

export const fetchDevices = async (): Promise<Device[]> => {
  const { data, error } = await supabase
    .from('devices')
    .select('*')
    .order('name');

  if (error) throw error;
  return data;
};

export const fetchDevice = async (id: string): Promise<Device> => {
  const { data, error } = await supabase
    .from('devices')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export interface DeviceMetric {
  id: string;
  deviceId: string;
  type: string;
  value: number;
  timestamp: string;
}

export const fetchDeviceMetrics = async (
  deviceId: string,
  metricType: string,
  startTime?: string,
  endTime?: string
): Promise<DeviceMetric[]> => {
  let query = supabase
    .from('device_metrics')
    .select('*')
    .eq('deviceId', deviceId)
    .eq('type', metricType)
    .order('timestamp', { ascending: false });

  if (startTime) query = query.gte('timestamp', startTime);
  if (endTime) query = query.lte('timestamp', endTime);

  const { data, error } = await query;

  if (error) throw error;
  return data;
};

export const updateDevice = async (
  id: string,
  updates: Partial<Device>
): Promise<Device> => {
  const { data, error } = await supabase
    .from('devices')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const createDevice = async (device: Omit<Device, 'id' | 'createdAt' | 'updatedAt'>): Promise<Device> => {
  const { data, error } = await supabase
    .from('devices')
    .insert([device])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteDevice = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('devices')
    .delete()
    .eq('id', id);

  if (error) throw error;
}; 