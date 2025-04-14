
// Implementation of device cache
import { Device } from '@/types/device';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface MetricsCache {
  [deviceId: string]: {
    [metricType: string]: CacheEntry<any>;
  };
}

class DeviceCache {
  private devices: CacheEntry<Device[]> | null = null;
  private deviceMap: Map<string, CacheEntry<Device>> = new Map();
  private metrics: MetricsCache = {};
  private TTL = 5 * 60 * 1000; // 5 minutes default TTL

  setDevices(devices: Device[]): void {
    this.devices = {
      data: devices,
      timestamp: Date.now(),
      expiresAt: Date.now() + this.TTL
    };
  }

  getDevices(): Device[] | null {
    if (!this.devices || Date.now() > this.devices.expiresAt) {
      return null;
    }
    return this.devices.data;
  }

  setDevice(device: Device): void {
    this.deviceMap.set(device.id, {
      data: device,
      timestamp: Date.now(),
      expiresAt: Date.now() + this.TTL
    });
  }

  getDevice(id: string): Device | null {
    const entry = this.deviceMap.get(id);
    if (!entry || Date.now() > entry.expiresAt) {
      return null;
    }
    return entry.data;
  }

  setDeviceMetrics(deviceId: string, metricType: string, data: any): void {
    if (!this.metrics[deviceId]) {
      this.metrics[deviceId] = {};
    }

    this.metrics[deviceId][metricType] = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + this.TTL
    };
  }

  getDeviceMetrics(deviceId: string, metricType: string): any | null {
    const deviceMetrics = this.metrics[deviceId];
    if (!deviceMetrics) return null;

    const metricEntry = deviceMetrics[metricType];
    if (!metricEntry || Date.now() > metricEntry.expiresAt) {
      return null;
    }

    return metricEntry.data;
  }

  invalidateDevice(id: string): void {
    this.deviceMap.delete(id);
    delete this.metrics[id];
  }

  invalidateDevices(): void {
    this.devices = null;
    this.deviceMap.clear();
  }

  invalidateDeviceMetrics(deviceId: string, metricType?: string): void {
    if (!this.metrics[deviceId]) return;

    if (metricType) {
      delete this.metrics[deviceId][metricType];
    } else {
      delete this.metrics[deviceId];
    }
  }

  getCacheStats(): {
    devices: number;
    individualDevices: number;
    metrics: number;
  } {
    let metricsCount = 0;
    Object.values(this.metrics).forEach(deviceMetrics => {
      metricsCount += Object.keys(deviceMetrics).length;
    });

    return {
      devices: this.devices ? 1 : 0,
      individualDevices: this.deviceMap.size,
      metrics: metricsCount
    };
  }
}

export const deviceCache = new DeviceCache();
