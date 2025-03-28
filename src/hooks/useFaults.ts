
import { useState, useEffect } from 'react';

export interface Fault {
  id: string;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: string;
  status: string;
  device: {
    id: string;
    name: string;
  };
}

export const useFaults = () => {
  const [faults, setFaults] = useState<Fault[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchFaults = async () => {
      try {
        setLoading(true);
        // Mock data
        const mockFaults: Fault[] = [
          {
            id: 'fault-1',
            title: 'Inverter Overheating',
            description: 'Inverter temperature exceeds normal operating range',
            severity: 'critical',
            timestamp: new Date().toISOString(),
            status: 'active',
            device: { id: 'dev-1', name: 'Main Inverter' }
          },
          {
            id: 'fault-2',
            title: 'Battery Low Charge',
            description: 'Battery charge below 15% threshold',
            severity: 'warning',
            timestamp: new Date().toISOString(),
            status: 'active',
            device: { id: 'dev-2', name: 'Home Battery' }
          },
          {
            id: 'fault-3',
            title: 'Communication Error',
            description: 'Communication lost with solar panels',
            severity: 'info',
            timestamp: new Date().toISOString(),
            status: 'resolved',
            device: { id: 'dev-3', name: 'Solar Array' }
          }
        ];
        
        setFaults(mockFaults);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch faults'));
      } finally {
        setLoading(false);
      }
    };

    fetchFaults();
    // In a real implementation, we might set up a polling interval here
  }, []);

  return { faults, loading, error };
};
