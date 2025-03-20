
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface DeviceModel {
  id: string;
  name: string;
  manufacturer: string;
  model_number?: string;
  type: string;
  capacity?: number;
  power_rating?: number;
  efficiency?: number;
  dimensions?: string;
  weight?: number;
  warranty_period?: number;
  release_date?: string;
  description?: string;
  technical_specs?: Record<string, any>;
  datasheet_url?: string;
  created_at: string;
  last_updated: string;
}

export const categoryNames: Record<string, string> = {
  'batteries': 'Batteries',
  'inverters': 'Inverters',
  'solar-panels': 'Solar Panels',
  'wind-turbines': 'Wind Turbines',
  'ev-chargers': 'EV Chargers',
  'meters': 'Smart Meters',
  'loads': 'Loads',
  'grid-connections': 'Grid Connections'
};

export const useDeviceModels = (categoryId?: string) => {
  const [devices, setDevices] = useState<DeviceModel[]>([]);
  const [filteredDevices, setFilteredDevices] = useState<DeviceModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [deviceCount, setDeviceCount] = useState(0);
  
  const categoryName = categoryId ? categoryNames[categoryId] || 'Devices' : 'All Devices';
  
  // Fetch device models from Supabase
  useEffect(() => {
    const fetchDeviceModels = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        let query = supabase.from('device_models').select('*');
        
        // Filter by device type if category is specified
        if (categoryId) {
          const categoryMap: Record<string, string> = {
            'batteries': 'battery',
            'inverters': 'inverter',
            'solar-panels': 'solar',
            'wind-turbines': 'wind',
            'ev-chargers': 'ev_charger',
            'meters': 'meter',
            'loads': 'load',
            'grid-connections': 'grid'
          };
          
          const deviceType = categoryMap[categoryId];
          if (deviceType) {
            query = query.eq('type', deviceType);
          }
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        if (data) {
          setDevices(data as DeviceModel[]);
          setDeviceCount(data.length);
        }
      } catch (err) {
        console.error('Error fetching device models:', err);
        setError(err as Error);
        toast.error('Failed to fetch device models');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDeviceModels();
  }, [categoryId]);
  
  // Apply search filter and sorting
  useEffect(() => {
    let result = [...devices];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(device => 
        device.name.toLowerCase().includes(query) ||
        device.manufacturer.toLowerCase().includes(query) ||
        (device.description?.toLowerCase().includes(query))
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      const fieldA = a[sortField as keyof DeviceModel];
      const fieldB = b[sortField as keyof DeviceModel];
      
      // Handle undefined or null values
      if (fieldA === undefined || fieldA === null) return sortDirection === 'asc' ? -1 : 1;
      if (fieldB === undefined || fieldB === null) return sortDirection === 'asc' ? 1 : -1;
      
      // Compare values
      if (typeof fieldA === 'string' && typeof fieldB === 'string') {
        return sortDirection === 'asc' 
          ? fieldA.localeCompare(fieldB) 
          : fieldB.localeCompare(fieldA);
      } else {
        return sortDirection === 'asc' 
          ? (fieldA as number) - (fieldB as number) 
          : (fieldB as number) - (fieldA as number);
      }
    });
    
    setFilteredDevices(result);
  }, [devices, searchQuery, sortField, sortDirection]);
  
  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  return {
    devices: filteredDevices,
    isLoading,
    error,
    sortField,
    sortDirection,
    searchQuery,
    setSearchQuery,
    handleSort,
    deviceCount,
    categoryName
  };
};

export default useDeviceModels;
