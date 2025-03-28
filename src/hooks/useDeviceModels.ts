
import { useState, useEffect, useCallback } from 'react';
import { DeviceModel, categoryNames } from '@/types/device-model';

// Mock device models data
const mockDeviceModels: DeviceModel[] = [
  {
    id: '1',
    manufacturer: 'Tesla',
    model_name: 'Powerwall 2',
    model_number: 'PW2',
    device_type: 'battery',
    protocol: 'Modbus TCP',
    created_at: '2023-01-01T00:00:00Z',
    support_level: 'full',
    has_manual: true,
    specifications: {
      capacity: 13.5,
      voltage: 240,
      power: 5
    },
    power_rating: 5000,
    capacity: 13.5,
    release_date: '2016-10-28'
  },
  {
    id: '2',
    manufacturer: 'SolarEdge',
    model_name: 'HD-Wave',
    model_number: 'SE7600H',
    device_type: 'inverter',
    protocol: 'SunSpec',
    created_at: '2023-01-01T00:00:00Z',
    support_level: 'full',
    has_manual: true,
    power_rating: 7600,
    release_date: '2018-04-15'
  },
  {
    id: '3',
    manufacturer: 'Fronius',
    model_name: 'Symo',
    model_number: 'SYMO 10.0-3-M',
    device_type: 'inverter',
    protocol: 'ModbusTCP/Sunspec',
    created_at: '2023-01-01T00:00:00Z',
    support_level: 'partial',
    has_manual: true,
    power_rating: 10000,
    release_date: '2019-03-21'
  }
];

export interface UseDeviceModelsResult {
  models: DeviceModel[];
  loading: boolean;
  error: Error | null;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSort: (field: string) => void;
  deviceCount: number;
  categoryName: string;
  devices: DeviceModel[];
  isLoading: boolean;
}

export const useDeviceModels = (categoryId?: string): UseDeviceModelsResult => {
  const [models, setModels] = useState<DeviceModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [sortField, setSortField] = useState('manufacturer');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredModels, setFilteredModels] = useState<DeviceModel[]>([]);

  const fetchDeviceModels = useCallback(async () => {
    try {
      setLoading(true);
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Use the mock data
      setModels(mockDeviceModels);
      setError(null);
    } catch (err) {
      console.error('Error fetching device models:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch device models'));
      setModels([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load models on mount
  useEffect(() => {
    fetchDeviceModels();
  }, [fetchDeviceModels]);

  // Filter models based on category and search query
  useEffect(() => {
    let filtered = [...models];
    
    // Filter by category if provided
    if (categoryId && categoryId !== 'all') {
      filtered = filtered.filter(model => 
        model.category === categoryId || 
        model.device_type === categoryId
      );
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(model => 
        model.manufacturer.toLowerCase().includes(query) ||
        model.model_name.toLowerCase().includes(query) ||
        (model.description && model.description.toLowerCase().includes(query))
      );
    }
    
    // Sort the filtered models
    filtered.sort((a, b) => {
      // Cast a and b to any for easier property access
      const aValue = (a as any)[sortField];
      const bValue = (b as any)[sortField];
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    setFilteredModels(filtered);
  }, [models, categoryId, searchQuery, sortField, sortDirection]);

  // Handle sorting
  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get category name
  const categoryName = categoryId && categoryId !== 'all' 
    ? (categoryNames[categoryId] || categoryId.charAt(0).toUpperCase() + categoryId.slice(1)) 
    : 'All Devices';

  return {
    models: filteredModels,
    loading,
    error,
    sortField,
    sortDirection,
    searchQuery,
    setSearchQuery,
    handleSort,
    deviceCount: models.length,
    categoryName,
    // Alias for compatibility with other components
    devices: filteredModels,
    isLoading: loading
  };
};

export { categoryNames };
