
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

// Export the DeviceModel interface
export interface DeviceModel {
  id: string;
  name: string;
  manufacturer: string;
  model_number: string;
  device_type: string;
  protocol: string;
  firmware_version?: string;
  power_rating?: number;
  capacity?: number;
  release_date?: string;
  support_level: 'full' | 'partial' | 'none';
  has_manual: boolean;
}

// Define category names mapping
export const categoryNames: Record<string, string> = {
  'batteries': 'Batteries',
  'inverters': 'Inverters',
  'ev-chargers': 'EV Chargers',
  'meters': 'Energy Meters',
  'controllers': 'System Controllers',
  'all': 'All Devices',
};

export const useDeviceModels = (categoryId?: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [devices, setDevices] = useState<DeviceModel[]>([]);
  const [deviceCount, setDeviceCount] = useState(0);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryName, setCategoryName] = useState('All Devices');

  useEffect(() => {
    if (categoryId && categoryNames[categoryId]) {
      setCategoryName(categoryNames[categoryId]);
    } else {
      setCategoryName('All Devices');
    }
  }, [categoryId]);

  useEffect(() => {
    const fetchDeviceModels = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // For demo purposes, creating mock data
        const mockData: DeviceModel[] = [];
        const deviceTypes = ['battery', 'inverter', 'meter', 'controller', 'ev-charger'];
        const manufacturers = ['SunPower', 'Tesla', 'Enphase', 'SMA', 'Huawei', 'SolarEdge'];
        
        for (let i = 1; i <= 20; i++) {
          const deviceType = deviceTypes[Math.floor(Math.random() * deviceTypes.length)];
          
          // Filter by category if provided
          if (categoryId && categoryId !== 'all') {
            // Convert categoryId format (ev-chargers) to deviceType format (ev-charger)
            const categoryType = categoryId === 'ev-chargers' ? 'ev-charger' : 
                               categoryId === 'controllers' ? 'controller' :
                               categoryId === 'meters' ? 'meter' :
                               categoryId === 'batteries' ? 'battery' :
                               categoryId === 'inverters' ? 'inverter' : categoryId;
                               
            if (deviceType !== categoryType.replace('-s', '')) {
              continue;
            }
          }
          
          mockData.push({
            id: `dev-${i}`,
            name: `${manufacturers[i % manufacturers.length]} ${deviceType.charAt(0).toUpperCase() + deviceType.slice(1)} Pro ${i}`,
            manufacturer: manufacturers[i % manufacturers.length],
            model_number: `${deviceType.toUpperCase()}-${1000 + i}`,
            device_type: deviceType,
            protocol: i % 3 === 0 ? 'Modbus' : i % 3 === 1 ? 'SunSpec' : 'Proprietary',
            firmware_version: `v${Math.floor(i/5) + 1}.${i % 5}.0`,
            power_rating: deviceType === 'inverter' ? 3000 + (i * 500) : undefined,
            capacity: deviceType === 'battery' ? 5 + (i % 10) : undefined,
            release_date: `202${Math.floor(i/10)}-${(i % 12) + 1}-01`,
            support_level: i % 3 === 0 ? 'full' : i % 3 === 1 ? 'partial' : 'none',
            has_manual: i % 4 !== 0,
          });
        }
        
        // Filter by search query if provided
        const filteredData = searchQuery 
          ? mockData.filter(device => 
              device.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
              device.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()))
          : mockData;
        
        // Sort the data
        const sortedData = [...filteredData].sort((a, b) => {
          const aValue = a[sortField as keyof DeviceModel];
          const bValue = b[sortField as keyof DeviceModel];
          
          if (aValue === undefined || bValue === undefined) return 0;
          
          if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortDirection === 'asc' 
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue);
          }
          
          // @ts-ignore - we know these are comparable values
          return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
        });
        
        setDevices(sortedData);
        setDeviceCount(sortedData.length);
      } catch (err) {
        console.error('Error fetching device models:', err);
        setError(err instanceof Error ? err : new Error('Failed to load device models'));
        toast.error('Failed to load device models');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDeviceModels();
  }, [categoryId, sortField, sortDirection, searchQuery]);
  
  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  return {
    devices,
    isLoading,
    error,
    deviceCount,
    sortField,
    sortDirection,
    searchQuery,
    setSearchQuery,
    handleSort,
    categoryName
  };
};
