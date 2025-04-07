
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import PageHeader from '@/components/layout/PageHeader';
import DeviceModelsCard from '@/components/devices/DeviceModelsCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDeviceModels } from '@/hooks/useDeviceModels';
import { Search, X, Settings, Download } from 'lucide-react';
import { DeviceModelCategory } from '@/types/device-model';

const DeviceCategoryDetail = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [category, setCategory] = useState<DeviceModelCategory | null>(null);
  const { models, loadModels } = useDeviceModels();
  const [filteredModels, setFilteredModels] = useState(models);
  const [isLoading, setIsLoading] = useState(true);

  // Load models and simulate API call for category details
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      loadModels();

      // Simulate API call for category details
      setTimeout(() => {
        const mockCategory: DeviceModelCategory = {
          id: categoryId || 'default',
          name: categoryId ? 
            categoryId.charAt(0).toUpperCase() + categoryId.slice(1).replace('-', ' ') : 
            'All Devices',
          description: 'Browse and manage compatible device models in this category',
          device_count: models.length
        };
        setCategory(mockCategory);
        setIsLoading(false);
      }, 500);
    };
    
    loadData();
  }, [categoryId, loadModels]);

  // Filter and sort models whenever dependencies change
  useEffect(() => {
    let filtered = [...models];
    
    // Apply category filter
    if (categoryId) {
      filtered = filtered.filter(model => 
        model.category?.toLowerCase().includes(categoryId.toLowerCase()) ||
        model.device_type.toLowerCase().includes(categoryId.toLowerCase())
      );
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(model => 
        model.name.toLowerCase().includes(query) ||
        model.manufacturer.toLowerCase().includes(query) ||
        model.model_number.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      const aVal = a[sortField as keyof typeof a];
      const bVal = b[sortField as keyof typeof b];
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      
      return 0;
    });
    
    setFilteredModels(filtered);
  }, [models, categoryId, searchQuery, sortField, sortDirection]);

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <AppLayout>
      <div className="p-6">
        <PageHeader 
          title={category?.name || 'Loading...'}
          description={category?.description}
          actions={
            <>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Manage Categories
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Models
              </Button>
            </>
          }
        />

        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search device models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <DeviceModelsCard
          deviceModels={filteredModels} 
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          isLoading={isLoading}
        />
      </div>
    </AppLayout>
  );
};

export default DeviceCategoryDetail;
