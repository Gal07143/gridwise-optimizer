
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { fetchDeviceModels, getDeviceCategories } from '@/services/deviceModelsService';
import { DeviceModel } from '@/components/integrations/DeviceModelsTable';

// Define a consistent map of category IDs to display names
export const categoryNames: Record<string, string> = {
  'batteries': 'Batteries',
  'inverters': 'Inverters',
  'ev-chargers': 'EV Chargers',
  'meters': 'Energy Meters',
  'controllers': 'System Controllers',
  'solar': 'Solar Panels',
  'wind': 'Wind Turbines',
  'hydro': 'Hydro Generators',
  'biomass': 'Biomass Systems',
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
  const [categories, setCategories] = useState<string[]>(['all']);

  useEffect(() => {
    // Fetch available categories
    const loadCategories = async () => {
      try {
        const cats = await getDeviceCategories();
        setCategories(cats);
        
        // Get the category name based on ID
        if (categoryId) {
          setCategoryName(categoryNames[categoryId] || 'All Devices');
        } else {
          setCategoryName('All Devices');
        }
      } catch (err) {
        console.error('Error loading device categories:', err);
        toast.error('Failed to load device categories');
      }
    };
    
    loadCategories();
  }, [categoryId]);

  useEffect(() => {
    const fetchDeviceModelData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Convert categoryId to category for database query
        const category = categoryId === 'all' ? undefined : categoryId;
        
        // Fetch device models from the database
        const deviceModels = await fetchDeviceModels(
          category,
          searchQuery,
          sortField,
          sortDirection
        );
        
        setDevices(deviceModels);
        setDeviceCount(deviceModels.length);
      } catch (err) {
        console.error('Error fetching device models:', err);
        setError(err instanceof Error ? err : new Error('Failed to load device models'));
        toast.error('Failed to load device models');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDeviceModelData();
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
    categoryName,
    categories
  };
};
