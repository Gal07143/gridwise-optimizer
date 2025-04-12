import { supabase } from '@/integrations/supabase/client';
import { Device, TelemetryData, DeviceCommand, DeviceError, DeviceNotFoundError, DeviceOperationError, DeviceConnectionError } from '@/types/device';
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

// Types for real-time subscriptions
type DatabaseDevice = Omit<Device, 'id'> & { id: string };
type DatabaseTelemetry = Omit<TelemetryData, 'id'> & { id: string };

interface RealtimePayload<T> {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new: T;
  old: T | null;
}

// Cache configuration
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Cache for devices and telemetry data
const cache = {
  devices: new Map<string, { data: Device[]; timestamp: number }>(),
  telemetry: new Map<string, { data: TelemetryData[]; timestamp: number }>(),
};

/**
 * Retry a function with exponential backoff
 */
async function retry<T>(fn: () => Promise<T>, retries = MAX_RETRIES): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (MAX_RETRIES - retries + 1)));
    return retry(fn, retries - 1);
  }
}

/**
 * Check if cached data is still valid
 */
function isCacheValid(timestamp: number): boolean {
  return Date.now() - timestamp < CACHE_TTL;
}

/**
 * Device service for interacting with the device management Edge Function
 */
export const deviceService = {
  /**
   * Fetch all devices for the current user
   */
  async fetchDevices(): Promise<Device[]> {
    const cacheKey = 'all';
    const cached = cache.devices.get(cacheKey);
    
    if (cached && isCacheValid(cached.timestamp)) {
      return cached.data;
    }

    try {
      const { data, error } = await retry(() => 
        supabase.functions.invoke('device-management/list')
      );

      if (error) throw new DeviceOperationError('fetch devices', error.message);
      if (!data) return [];

      cache.devices.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      if (error instanceof DeviceError) throw error;
      throw new DeviceOperationError('fetch devices', error instanceof Error ? error.message : 'Unknown error');
    }
  },

  /**
   * Fetch a specific device by ID
   */
  async fetchDevice(id: string): Promise<Device> {
    try {
      const { data, error } = await retry(() =>
        supabase.functions.invoke(`device-management/${id}/get`)
      );

      if (error) throw new DeviceOperationError('fetch device', error.message);
      if (!data) throw new DeviceNotFoundError(id);

      return data;
    } catch (error) {
      if (error instanceof DeviceError) throw error;
      throw new DeviceOperationError('fetch device', error instanceof Error ? error.message : 'Unknown error');
    }
  },

  /**
   * Add a new device
   */
  async addDevice(device: Omit<Device, 'id'>): Promise<Device> {
    try {
      const { data, error } = await retry(() =>
        supabase.functions.invoke('device-management/create', {
          body: device,
        })
      );

      if (error) throw new DeviceOperationError('add device', error.message);
      if (!data) throw new DeviceOperationError('add device', 'No data returned');

      // Invalidate devices cache
      cache.devices.clear();
      return data;
    } catch (error) {
      if (error instanceof DeviceError) throw error;
      throw new DeviceOperationError('add device', error instanceof Error ? error.message : 'Unknown error');
    }
  },

  /**
   * Update an existing device
   */
  async updateDevice(id: string, updates: Partial<Device>): Promise<Device> {
    try {
      const { data, error } = await retry(() =>
        supabase.functions.invoke(`device-management/${id}/update`, {
          body: updates,
        })
      );

      if (error) throw new DeviceOperationError('update device', error.message);
      if (!data) throw new DeviceNotFoundError(id);

      // Invalidate devices cache
      cache.devices.clear();
      return data;
    } catch (error) {
      if (error instanceof DeviceError) throw error;
      throw new DeviceOperationError('update device', error instanceof Error ? error.message : 'Unknown error');
    }
  },

  /**
   * Delete a device
   */
  async deleteDevice(id: string): Promise<void> {
    try {
      const { error } = await retry(() =>
        supabase.functions.invoke(`device-management/${id}/delete`)
      );

      if (error) throw new DeviceOperationError('delete device', error.message);

      // Invalidate devices cache
      cache.devices.clear();
    } catch (error) {
      if (error instanceof DeviceError) throw error;
      throw new DeviceOperationError('delete device', error instanceof Error ? error.message : 'Unknown error');
    }
  },

  /**
   * Send a command to a device
   */
  async sendCommand(deviceId: string, command: DeviceCommand): Promise<void> {
    try {
      const { error } = await retry(() =>
        supabase.functions.invoke(`device-management/${deviceId}/command`, {
          body: command,
        })
      );

      if (error) throw new DeviceConnectionError(deviceId, error.message);
    } catch (error) {
      if (error instanceof DeviceError) throw error;
      throw new DeviceConnectionError(deviceId, error instanceof Error ? error.message : 'Unknown error');
    }
  },

  /**
   * Fetch telemetry data for a device
   */
  async fetchDeviceTelemetry(
    deviceId: string,
    options: { limit?: number; startTime?: string; endTime?: string } = {}
  ): Promise<TelemetryData[]> {
    const cacheKey = `${deviceId}-${JSON.stringify(options)}`;
    const cached = cache.telemetry.get(cacheKey);
    
    if (cached && isCacheValid(cached.timestamp)) {
      return cached.data;
    }

    try {
      const { data, error } = await retry(() =>
        supabase.functions.invoke(`device-management/${deviceId}/telemetry`, {
          body: options,
        })
      );

      if (error) throw new DeviceOperationError('fetch telemetry', error.message);
      if (!data) return [];

      cache.telemetry.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      if (error instanceof DeviceError) throw error;
      throw new DeviceOperationError('fetch telemetry', error instanceof Error ? error.message : 'Unknown error');
    }
  },

  /**
   * Subscribe to device changes
   */
  subscribeToDevices(callback: (payload: RealtimePayload<Device>) => void): RealtimeChannel {
    return supabase
      .channel('devices')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'devices',
        },
        (payload: RealtimePostgresChangesPayload<DatabaseDevice>) => {
          const transformedPayload: RealtimePayload<Device> = {
            eventType: payload.eventType,
            new: payload.new as Device,
            old: payload.old as Device | null,
          };
          // Invalidate cache on any change
          cache.devices.clear();
          callback(transformedPayload);
        }
      )
      .subscribe();
  },

  /**
   * Subscribe to device telemetry changes
   */
  subscribeToDeviceTelemetry(
    deviceId: string,
    callback: (payload: RealtimePayload<TelemetryData>) => void
  ): RealtimeChannel {
    return supabase
      .channel(`telemetry-${deviceId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'telemetry_log',
          filter: `device_id=eq.${deviceId}`,
        },
        (payload: RealtimePostgresChangesPayload<DatabaseTelemetry>) => {
          const transformedPayload: RealtimePayload<TelemetryData> = {
            eventType: payload.eventType,
            new: payload.new as TelemetryData,
            old: payload.old as TelemetryData | null,
          };
          // Invalidate telemetry cache for this device
          for (const [key] of cache.telemetry) {
            if (key.startsWith(deviceId)) {
              cache.telemetry.delete(key);
            }
          }
          callback(transformedPayload);
        }
      )
      .subscribe();
  },
}; 