
import { useState, useCallback, useEffect } from 'react';
import { DeviceModel } from '@/types/device-model';
import { useDeviceModels } from './useDeviceModels';

export const useIntegrationCategory = (categoryId?: string) => {
  // Enhance useDeviceModels with our own isLoading and error states
  const { models } = useDeviceModels() as { models: DeviceModel[] };
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [filteredModels, setFilteredModels] = useState<DeviceModel[]>([]);
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [deviceCount, setDeviceCount] = useState<number>(0);
  const [categoryName, setCategoryName] = useState<string>('');

  // Get the category name from the categoryId
  useEffect(() => {
    if (categoryId) {
      // Example mapping of categoryId to readable name
      const categoryNames: Record<string, string> = {
        'solar-inverters': 'Solar Inverters',
        'battery-systems': 'Battery Systems',
        'ev-chargers': 'EV Chargers',
        'meters': 'Meters',
        'load-controllers': 'Load Controllers',
        'wind-turbines': 'Wind Turbines',
        'generators': 'Generators',
        'hvac': 'HVAC Systems'
      };
      
      setCategoryName(categoryNames[categoryId] || categoryId);
    }

    // Simulate data loading
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [categoryId]);

  // Filter and sort the models
  useEffect(() => {
    try {
      if (!isLoading && models.length > 0) {
        let result = [...models];

        // Apply category filter if specified
        if (categoryId) {
          result = result.filter(model => {
            // Map categoryId to category property
            const categoryMapping: Record<string, string> = {
              'solar-inverters': 'Solar Inverters',
              'battery-systems': 'Battery Systems',
              'ev-chargers': 'EV Chargers',
              'meters': 'Meters',
              // Add more mappings as needed
            };
            
            const category = categoryMapping[categoryId] || categoryId;
            return model.category === category || model.device_type.toLowerCase().includes(categoryId);
          });
        }

        // Apply search filter if specified
        if (searchQuery) {
          const lowerQuery = searchQuery.toLowerCase();
          result = result.filter(model => 
            model.name.toLowerCase().includes(lowerQuery) ||
            model.manufacturer.toLowerCase().includes(lowerQuery) ||
            model.model_number.toLowerCase().includes(lowerQuery)
          );
        }

        // Apply sorting
        result.sort((a, b) => {
          // Ensure the field exists on both objects being compared
          const aVal = a[sortField as keyof DeviceModel] || '';
          const bVal = b[sortField as keyof DeviceModel] || '';
          
          // Compare the values
          if (typeof aVal === 'string' && typeof bVal === 'string') {
            return sortDirection === 'asc' 
              ? aVal.localeCompare(bVal)
              : bVal.localeCompare(aVal);
          }
          
          // For numeric values
          const aNumber = Number(aVal);
          const bNumber = Number(bVal);
          
          if (!isNaN(aNumber) && !isNaN(bNumber)) {
            return sortDirection === 'asc' ? aNumber - bNumber : bNumber - aNumber;
          }
          
          // Default case
          return 0;
        });

        setFilteredModels(result);
        setDeviceCount(result.length);
      } else {
        setFilteredModels([]);
        setDeviceCount(0);
      }
    } catch (err) {
      setError(err);
      console.error("Error filtering models:", err);
    }
  }, [models, categoryId, sortField, sortDirection, searchQuery, isLoading]);

  const handleSort = useCallback((field: string) => {
    if (field === sortField) {
      // Toggle direction if same field
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField]);

  return {
    models: filteredModels,
    loading: isLoading,
    error,
    sortField,
    sortDirection,
    searchQuery,
    setSearchQuery,
    handleSort,
    deviceCount,
    categoryName,
    devices: filteredModels, // Alias for IntegrationCategoryPage
  };
};
