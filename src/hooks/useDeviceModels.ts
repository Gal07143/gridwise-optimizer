
// src/hooks/useDeviceModels.ts
import { useState, useEffect } from 'react';
import { DeviceType } from '@/types/energy';

// Export the DeviceModel interface to fix import error
export interface DeviceModel {
  id: string;
  manufacturer: string;
  model_name: string;
  name?: string;
  device_type: DeviceType;
  description?: string;
  specifications?: Record<string, any>;
  compatible_with?: string[];
  firmware_versions?: string[];
  created_at: string;
  updated_at?: string;
  category?: string;
}

export const useDeviceModels = () => {
  const [models, setModels] = useState<DeviceModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDeviceModels = async () => {
      setLoading(true);
      try {
        // Mock data, in a real app this would fetch from an API
        const mockModels: DeviceModel[] = [
          {
            id: '1',
            manufacturer: 'SolarEdge',
            model_name: 'SE7600H-US',
            device_type: 'inverter',
            description: 'Single Phase Inverter',
            specifications: {
              power: 7600,
              voltage: 240,
              efficiency: 97.6
            },
            created_at: new Date().toISOString()
          },
          {
            id: '2',
            manufacturer: 'Tesla',
            model_name: 'Powerwall 2',
            device_type: 'battery',
            description: 'Home Battery',
            specifications: {
              capacity: 13.5,
              power: 5,
              round_trip_efficiency: 90
            },
            created_at: new Date().toISOString()
          }
        ];
        
        setModels(mockModels);
        setError(null);
      } catch (err) {
        console.error('Error fetching device models:', err);
        setError(err instanceof Error ? err : new Error('Unknown error fetching device models'));
      } finally {
        setLoading(false);
      }
    };

    fetchDeviceModels();
  }, []);

  return { models, loading, error };
};
