
import { supabase } from "@/lib/supabase";

export interface Device {
  id: string;
  name: string;
  description?: string;
  type: string;
  status: string;
  site_id?: string;
  location?: string;
  firmware?: string;
  capacity: number;
  lat?: number;
  lng?: number;
  installation_date?: string;
  created_at?: string;
  created_by?: string;
  last_updated?: string;
  metrics?: Record<string, any>;
  connection_info?: Record<string, any>;
  config?: Record<string, any>;
}

export interface DeviceReading {
  id: string;
  device_id: string;
  timestamp: string;
  voltage?: number;
  current?: number;
  power?: number;
  energy?: number;
  temperature?: number;
  state_of_charge?: number;
  [key: string]: any;
}

// Fetch all devices for the current user
export async function fetchDevices(): Promise<Device[]> {
  try {
    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .order('name');

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching devices:', error);
    throw error;
  }
}

// Fetch a specific device by ID
export async function fetchDeviceById(id: string): Promise<Device | null> {
  try {
    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error(`Error fetching device ${id}:`, error);
    throw error;
  }
}

// Create a new device
export async function createDevice(device: Omit<Device, 'id' | 'created_at' | 'last_updated'>): Promise<Device> {
  try {
    const { data, error } = await supabase
      .from('devices')
      .insert([device])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Error creating device:', error);
    throw error;
  }
}

// Update an existing device
export async function updateDevice(id: string, updates: Partial<Device>): Promise<Device> {
  try {
    const { data, error } = await supabase
      .from('devices')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error(`Error updating device ${id}:`, error);
    throw error;
  }
}

// Delete a device
export async function deleteDevice(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('devices')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    return true;
  } catch (error) {
    console.error(`Error deleting device ${id}:`, error);
    throw error;
  }
}

// Fetch the device telemetry history
export async function fetchDeviceTelemetry(
  deviceId: string,
  limit: number = 100,
  timeRange?: { start: string; end: string }
): Promise<DeviceReading[]> {
  try {
    let query = supabase
      .from('energy_readings')
      .select('*')
      .eq('device_id', deviceId)
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (timeRange) {
      query = query
        .gte('timestamp', timeRange.start)
        .lte('timestamp', timeRange.end);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  } catch (error) {
    console.error(`Error fetching telemetry for device ${deviceId}:`, error);
    throw error;
  }
}

// Fetch devices by site ID
export async function fetchDevicesBySite(siteId: string): Promise<Device[]> {
  try {
    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .eq('site_id', siteId)
      .order('name');

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  } catch (error) {
    console.error(`Error fetching devices for site ${siteId}:`, error);
    throw error;
  }
}

// Set a device online/offline status
export async function updateDeviceStatus(id: string, status: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('devices')
      .update({ status })
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    return true;
  } catch (error) {
    console.error(`Error updating status for device ${id}:`, error);
    throw error;
  }
}

// Get device aggregated statistics
export async function getDeviceStats(deviceId: string): Promise<Record<string, any>> {
  try {
    // Here we would normally call a database function or query aggregated data
    // For simplicity, we'll just mock the data
    const mockStats = {
      totalEnergyToday: Math.random() * 100,
      averagePower: Math.random() * 50,
      peakPower: Math.random() * 100,
      uptime: 99.5,
      lastReading: new Date().toISOString()
    };
    
    return mockStats;
  } catch (error) {
    console.error(`Error fetching stats for device ${deviceId}:`, error);
    throw error;
  }
}
