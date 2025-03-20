
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
  datasheet_url?: string;
  created_at: string;
  last_updated: string;
}

export const categoryNames: Record<string, string> = {
  'solar': 'Solar Panels',
  'wind': 'Wind Turbines',
  'battery': 'Battery Storage',
  'inverter': 'Inverters',
  'meter': 'Energy Meters',
  'ev-charger': 'EV Chargers',
  'hybrid': 'Hybrid Systems'
};

export const useDeviceModels = (categoryId?: string) => {
  const [devices, setDevices] = useState<DeviceModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [deviceCount, setDeviceCount] = useState(0);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  useEffect(() => {
    const fetchDeviceModels = async () => {
      setIsLoading(true);
      try {
        let query = `SELECT * FROM device_models`;
        
        // Add category filter if specified
        if (categoryId && categoryId !== 'all') {
          const category = categoryId === 'ev-charger' ? 'ev_charger' : categoryId;
          query += ` WHERE type = '${category}'`;
        }
        
        // Add sorting
        query += ` ORDER BY ${sortField} ${sortDirection}`;
        
        // Execute the query
        const { data, error } = await supabase.functions.invoke('execute-sql', {
          body: { query }
        });
        
        if (error) throw error;
        
        // Parse the response if needed
        let parsedData;
        if (typeof data === 'string') {
          try {
            parsedData = JSON.parse(data);
          } catch (e) {
            console.error('Error parsing response:', e);
            parsedData = [];
          }
        } else {
          parsedData = data;
        }
        
        // Check if we got an array of device models
        if (Array.isArray(parsedData)) {
          setDevices(parsedData as DeviceModel[]);
          setDeviceCount(parsedData.length);
        } else {
          setDevices([]);
          setDeviceCount(0);
        }
        
      } catch (err) {
        console.error('Error fetching device models:', err);
        setError(err as Error);
        toast.error('Failed to load device models');
        setDevices([]);
        setDeviceCount(0);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDeviceModels();
  }, [categoryId, sortField, sortDirection]);
  
  const handleSort = (field: string) => {
    if (field === sortField) {
      // Toggle direction if same field
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, set to ascending by default
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  return {
    devices,
    isLoading,
    error,
    sortField,
    sortDirection,
    searchQuery: '',
    setSearchQuery: () => {},
    handleSort,
    deviceCount,
    categoryName: categoryId ? categoryNames[categoryId as keyof typeof categoryNames] || 'Devices' : 'Devices'
  };
};
