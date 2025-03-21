
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { executeSql } from '@/services/sqlExecutor';
import { DeviceModel } from '@/types/energy';

interface UseDeviceModelsResult {
  devices: DeviceModel[];
  isLoading: boolean;
  error: Error | null;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSort: (field: string) => void;
  deviceCount: number;
  categoryName: string;
}

export function useDeviceModels(category?: string): UseDeviceModelsResult {
  const [devices, setDevices] = useState<DeviceModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [deviceCount, setDeviceCount] = useState(0);
  const [categoryName, setCategoryName] = useState(category || 'All');

  const fetchDevices = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Construct SQL query with proper filtering and sorting
      let query = `
        SELECT * FROM device_models
        WHERE 1=1
      `;
      
      const params: any[] = [];
      
      // Add category filter if provided
      if (category) {
        query += ` AND category = $1`;
        params.push(category);
      }
      
      // Add search filter if provided
      if (searchQuery) {
        const searchParam = `%${searchQuery}%`;
        query += ` AND (name ILIKE $${params.length + 1} OR manufacturer ILIKE $${params.length + 1})`;
        params.push(searchParam);
      }
      
      // Add sorting
      query += ` ORDER BY ${sortField} ${sortDirection}`;
      
      // Execute the query through our SQL executor
      const result = await executeSql<DeviceModel>(query, params);
      
      if (Array.isArray(result)) {
        setDevices(result);
        setDeviceCount(result.length);
      } else {
        console.error('Unexpected response format:', result);
        setDevices([]);
        setDeviceCount(0);
      }
    } catch (err) {
      console.error('Error fetching device models:', err);
      setError(err as Error);
      toast.error('Failed to fetch device models');
      setDevices([]);
      setDeviceCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [category, searchQuery, sortField, sortDirection]);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  const handleSort = useCallback((field: string) => {
    setSortDirection(current => {
      if (sortField === field) {
        return current === 'asc' ? 'desc' : 'asc';
      }
      return 'asc';
    });
    setSortField(field);
  }, [sortField]);

  return {
    devices,
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
}
