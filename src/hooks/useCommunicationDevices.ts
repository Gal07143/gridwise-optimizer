
import { useState, useEffect, useCallback } from 'react';
import { 
  getCommunicationDevices, 
  CommunicationDevice 
} from '@/services/communicationDeviceService';

interface UseCommunicationDevicesProps {
  initialType?: string;
}

export function useCommunicationDevices({ initialType = 'all' }: UseCommunicationDevicesProps = {}) {
  const [devices, setDevices] = useState<CommunicationDevice[]>([]);
  const [filteredDevices, setFilteredDevices] = useState<CommunicationDevice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [type, setType] = useState(initialType);
  const [searchQuery, setSearchQuery] = useState('');
  
  const fetchDevices = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getCommunicationDevices();
      setDevices(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch devices'));
      console.error('Error fetching communication devices:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Initial fetch
  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);
  
  // Filter devices based on type and search query
  useEffect(() => {
    let filtered = [...devices];
    
    // Filter by type
    if (type && type !== 'all') {
      filtered = filtered.filter(device => device.type === type);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(device => 
        device.name.toLowerCase().includes(query) || 
        device.manufacturer.toLowerCase().includes(query) || 
        device.model.toLowerCase().includes(query) ||
        (device.ip_address && device.ip_address.includes(query))
      );
    }
    
    setFilteredDevices(filtered);
  }, [devices, type, searchQuery]);
  
  const refresh = useCallback(() => {
    fetchDevices();
  }, [fetchDevices]);
  
  return {
    devices: filteredDevices,
    isLoading,
    error,
    refresh,
    type,
    setType,
    searchQuery,
    setSearchQuery,
    total: devices.length,
    filtered: filteredDevices.length
  };
}
