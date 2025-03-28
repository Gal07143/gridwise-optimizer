
import { useState, useEffect } from 'react';
import { DeviceType } from '@/types/energy';
import { DeviceModel, categoryNames } from '@/types/device-model';

export type { DeviceModel };
export { categoryNames };

export function useDeviceModels(categoryId?: string) {
  const [models, setModels] = useState<DeviceModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [sortField, setSortField] = useState<string>('manufacturer');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [deviceCount, setDeviceCount] = useState(0);
  const [categoryName, setCategoryName] = useState('All Devices');

  // Add other state and functions as needed
  
  useEffect(() => {
    const fetchDeviceModels = async () => {
      setLoading(true);
      try {
        // Simulate API call delay
        await new Promise(r => setTimeout(r, 500));
        
        // Mock data - in a real app, this would be an API call
        const mockModels: DeviceModel[] = [
          {
            id: "dm-1",
            manufacturer: "SunPower",
            model_name: "X-Series",
            name: "SunPower X-Series",
            model_number: "SPR-X22-370",
            device_type: "solar_panel" as DeviceType,
            description: "High-efficiency solar panel for residential installations",
            compatible_with: ["inv-001", "inv-002"],
            firmware_versions: ["1.2.3"],
            created_at: new Date().toISOString(),
            protocol: "Modbus",
            power_rating: 370,
            capacity: 0,
            release_date: "2022-01-15",
            support_level: "full",
            has_manual: true
          },
          {
            id: "dm-2",
            manufacturer: "Tesla",
            model_name: "Powerwall",
            name: "Tesla Powerwall 2",
            model_number: "PW-2",
            device_type: "battery" as DeviceType,
            description: "Home battery for energy storage",
            compatible_with: ["inv-003"],
            firmware_versions: ["2.1.4"],
            created_at: new Date().toISOString(),
            protocol: "Proprietary",
            power_rating: 5000,
            capacity: 13.5,
            release_date: "2021-03-20",
            support_level: "full",
            has_manual: true
          },
          {
            id: "dm-3",
            manufacturer: "SMA",
            model_name: "Sunny Boy",
            name: "SMA Sunny Boy",
            model_number: "SB-7.7",
            device_type: "inverter" as DeviceType,
            description: "Solar inverter for residential installations",
            compatible_with: ["dm-1"],
            firmware_versions: ["3.0.1"],
            created_at: new Date().toISOString(),
            protocol: "Modbus",
            power_rating: 7700,
            capacity: 0,
            release_date: "2022-06-10",
            support_level: "full",
            has_manual: true
          }
        ];
        
        // Filter by category if provided
        let filteredModels = categoryId 
          ? mockModels.filter(model => model.device_type === categoryId)
          : mockModels;
        
        // Filter by search query
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filteredModels = filteredModels.filter(model => 
            model.manufacturer.toLowerCase().includes(query) ||
            model.model_name.toLowerCase().includes(query) ||
            model.description?.toLowerCase().includes(query) ||
            model.model_number.toLowerCase().includes(query)
          );
        }
        
        // Sort the data
        filteredModels.sort((a, b) => {
          const aValue = a[sortField as keyof DeviceModel];
          const bValue = b[sortField as keyof DeviceModel];
          
          if (aValue === undefined || bValue === undefined) return 0;
          
          // String comparison
          if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortDirection === 'asc'
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue);
          }
          
          // Number comparison
          if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortDirection === 'asc'
              ? aValue - bValue
              : bValue - aValue;
          }
          
          return 0;
        });
        
        setModels(filteredModels);
        setDeviceCount(filteredModels.length);
        
        // Set category name
        if (categoryId && categoryId in categoryNames) {
          setCategoryName(categoryNames[categoryId]);
        } else if (categoryId) {
          setCategoryName(categoryId.charAt(0).toUpperCase() + categoryId.slice(1).replace('_', ' '));
        } else {
          setCategoryName('All Devices');
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching device models:', err);
        setError(err instanceof Error ? err : new Error('Unknown error fetching device models'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchDeviceModels();
  }, [categoryId, sortField, sortDirection, searchQuery]);
  
  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  return { 
    models, 
    loading, 
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
