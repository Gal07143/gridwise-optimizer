import { Device } from '@/types/device';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

class DeviceCache {
  private cache: Map<string, CacheItem<any>>;
  private static instance: DeviceCache;

  private constructor() {
    this.cache = new Map();
  }

  public static getInstance(): DeviceCache {
    if (!DeviceCache.instance) {
      DeviceCache.instance = new DeviceCache();
    }
    return DeviceCache.instance;
  }

  private isExpired(item: CacheItem<any>): boolean {
    return Date.now() > item.timestamp + item.expiresIn;
  }

  public set<T>(key: string, data: T, expiresIn: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresIn,
    });
  }

  public get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item || this.isExpired(item)) {
      this.cache.delete(key);
      return null;
    }
    return item.data as T;
  }

  public invalidate(key: string): void {
    this.cache.delete(key);
  }

  public invalidateAll(): void {
    this.cache.clear();
  }

  public getDevices(): Device[] | null {
    return this.get<Device[]>('devices');
  }

  public setDevices(devices: Device[]): void {
    this.set('devices', devices);
  }

  public getDevice(id: string): Device | null {
    return this.get<Device>(`device:${id}`);
  }

  public setDevice(device: Device): void {
    this.set(`device:${device.id}`, device);
  }

  public invalidateDevice(id: string): void {
    this.invalidate(`device:${id}`);
    this.invalidate('devices'); // Invalidate the devices list as well
  }

  public invalidateDevices(): void {
    // Find and invalidate all device-related cache entries
    for (const key of this.cache.keys()) {
      if (key === 'devices' || key.startsWith('device:')) {
        this.cache.delete(key);
      }
    }
  }

  public getDeviceMetrics(deviceId: string, metricType: string): any[] | null {
    return this.get<any[]>(`metrics:${deviceId}:${metricType}`);
  }

  public setDeviceMetrics(deviceId: string, metricType: string, data: any[]): void {
    // Cache metrics for a shorter duration (1 minute) as they update frequently
    this.set(`metrics:${deviceId}:${metricType}`, data, 60 * 1000);
  }

  public invalidateDeviceMetrics(deviceId: string, metricType?: string): void {
    if (metricType) {
      this.invalidate(`metrics:${deviceId}:${metricType}`);
    } else {
      // Invalidate all metrics for the device
      for (const key of this.cache.keys()) {
        if (key.startsWith(`metrics:${deviceId}:`)) {
          this.cache.delete(key);
        }
      }
    }
  }

  public getDeviceGroups(): any[] | null {
    return this.get<any[]>('deviceGroups');
  }

  public setDeviceGroups(groups: any[]): void {
    this.set('deviceGroups', groups);
  }

  public invalidateDeviceGroups(): void {
    this.invalidate('deviceGroups');
  }

  // Cache statistics
  public getCacheStats(): {
    size: number;
    keys: string[];
    expirationTimes: { [key: string]: number };
  } {
    const stats = {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      expirationTimes: {} as { [key: string]: number },
    };

    for (const [key, item] of this.cache.entries()) {
      stats.expirationTimes[key] = item.timestamp + item.expiresIn;
    }

    return stats;
  }

  // Cleanup expired items
  public cleanup(): void {
    for (const [key, item] of this.cache.entries()) {
      if (this.isExpired(item)) {
        this.cache.delete(key);
      }
    }
  }
}

// Create and export the singleton instance
export const deviceCache = DeviceCache.getInstance();

// Automatically cleanup expired cache items every minute
setInterval(() => {
  deviceCache.cleanup();
}, 60 * 1000); 