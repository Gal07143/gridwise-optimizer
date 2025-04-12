import { useState, useEffect, useCallback } from 'react';
import { Device } from '@/types/device';
import { deviceCache } from '@/services/cache/deviceCache';
import { fetchDevices, fetchDevice, fetchDeviceMetrics } from '@/services/api/devices';

export function useDeviceCache() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getDevices = useCallback(async (forceRefresh = false) => {
    try {
      if (!forceRefresh) {
        const cachedDevices = deviceCache.getDevices();
        if (cachedDevices) return cachedDevices;
      }

      setLoading(true);
      const devices = await fetchDevices();
      deviceCache.setDevices(devices);
      return devices;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getDevice = useCallback(async (id: string, forceRefresh = false) => {
    try {
      if (!forceRefresh) {
        const cachedDevice = deviceCache.getDevice(id);
        if (cachedDevice) return cachedDevice;
      }

      setLoading(true);
      const device = await fetchDevice(id);
      deviceCache.setDevice(device);
      return device;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getDeviceMetrics = useCallback(async (
    deviceId: string,
    metricType: string,
    forceRefresh = false
  ) => {
    try {
      if (!forceRefresh) {
        const cachedMetrics = deviceCache.getDeviceMetrics(deviceId, metricType);
        if (cachedMetrics) return cachedMetrics;
      }

      setLoading(true);
      const metrics = await fetchDeviceMetrics(deviceId, metricType);
      deviceCache.setDeviceMetrics(deviceId, metricType, metrics);
      return metrics;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const invalidateDevice = useCallback((id: string) => {
    deviceCache.invalidateDevice(id);
  }, []);

  const invalidateDevices = useCallback(() => {
    deviceCache.invalidateDevices();
  }, []);

  const invalidateDeviceMetrics = useCallback((deviceId: string, metricType?: string) => {
    deviceCache.invalidateDeviceMetrics(deviceId, metricType);
  }, []);

  const getCacheStats = useCallback(() => {
    return deviceCache.getCacheStats();
  }, []);

  return {
    loading,
    error,
    getDevices,
    getDevice,
    getDeviceMetrics,
    invalidateDevice,
    invalidateDevices,
    invalidateDeviceMetrics,
    getCacheStats,
  };
} 