
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, ArrowLeft, Download, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  getDeviceModelsByCategory, 
  getCategoryName 
} from '@/services/deviceCatalogService';
import { getDeviceCategoryById } from '@/types/device-catalog';
import DeviceModelsCard from '@/components/devices/DeviceModelsCard';
import AppLayout from '@/components/layout/AppLayout';
import * as LucideIcons from 'lucide-react';

const DeviceCategoryDetail = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('manufacturer');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Get category information
  const category = categoryId ? getDeviceCategoryById(categoryId) : undefined;
  
  // Fetch device models for this category
  const { data: deviceModels, isLoading, error } = useQuery({
    queryKey: ['deviceModels', categoryId],
    queryFn: () => categoryId ? getDeviceModelsByCategory(categoryId) : Promise.resolve([]),
    enabled: !!categoryId
  });
  
  // Filter device models based on search
  const filteredDeviceModels = deviceModels?.filter(device => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      device.manufacturer.toLowerCase().includes(query) ||
      device.model_name.toLowerCase().includes(query) ||
      device.model_number.toLowerCase().includes(query) ||
      device.description?.toLowerCase().includes(query) 
    );
  }) || [];
  
  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Get the icon component
  const getIconComponent = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName] || LucideIcons.HelpCircle;
    return Icon;
  };
  
  const CategoryIcon = category ? getIconComponent(category.icon) : LucideIcons.HelpCircle;
  const categoryName = category ? category.name : getCategoryName(categoryId || '');
  
  return (
    <AppLayout>
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/devices/catalog')}
            className="mb-4 pl-0 hover:pl-2 transition-all"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Catalog
          </Button>
          
          <div className="flex items-center mb-2">
            <CategoryIcon className="h-6 w-6 mr-2 text-primary" />
            <h1 className="text-2xl font-bold">{categoryName}</h1>
          </div>
          
          {category?.description && (
            <p className="text-muted-foreground">{category.description}</p>
          )}
        </div>
        
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <Input
            placeholder={`Search ${categoryName.toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow"
          />
          
          <Button
            variant="default"
            onClick={() => navigate('/devices/add-model')}
            className="ml-auto whitespace-nowrap"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New {categoryId ? `${categoryName.slice(0, -1)}` : 'Device'}
          </Button>
        </div>
        
        <DeviceModelsCard
          deviceModels={filteredDeviceModels}
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
