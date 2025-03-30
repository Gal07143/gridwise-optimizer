
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Package } from 'lucide-react';
import { getAllDeviceModels } from '@/services/deviceCatalogService';
import { DeviceModelReference } from '@/types/device-catalog';
import { Skeleton } from '@/components/ui/skeleton';

interface DeviceModelSelectorProps {
  onSelectModel: (model: DeviceModelReference) => void;
  selectedModelId?: string;
  excludeIds?: string[];
}

const DeviceModelSelector: React.FC<DeviceModelSelectorProps> = ({ 
  onSelectModel, 
  selectedModelId,
  excludeIds = []
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: deviceModels, isLoading } = useQuery({
    queryKey: ['deviceModels'],
    queryFn: getAllDeviceModels
  });
  
  // Filter device models
  const filteredModels = deviceModels?.filter(model => {
    // Exclude specific IDs if needed
    if (excludeIds.includes(model.id)) {
      return false;
    }
    
    // Apply search filter
    if (!searchQuery) {
      return true;
    }
    
    const query = searchQuery.toLowerCase();
    return (
      model.manufacturer.toLowerCase().includes(query) ||
      model.model_name.toLowerCase().includes(query) ||
      model.model_number.toLowerCase().includes(query) ||
      model.description?.toLowerCase().includes(query) ||
      model.device_type.toLowerCase().includes(query)
    );
  }) || [];
  
  const handleSelectModel = (model: DeviceModelReference) => {
    onSelectModel(model);
  };
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search for device models..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 6 }).map((_, index) => (
            <Card key={`skeleton-${index}`} className="cursor-pointer hover:border-primary/50">
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3 mt-2" />
              </CardContent>
            </Card>
          ))
        ) : filteredModels.length > 0 ? (
          filteredModels.map(model => (
            <Card 
              key={model.id} 
              className={`cursor-pointer hover:border-primary/50 transition-colors ${
                selectedModelId === model.id ? 'border-primary bg-primary/5' : ''
              }`}
              onClick={() => handleSelectModel(model)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{model.manufacturer}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{model.model_name}</p>
                <p className="text-sm text-muted-foreground">{model.model_number}</p>
                {model.description && (
                  <p className="text-sm mt-2 line-clamp-2">{model.description}</p>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center p-8 border rounded">
            <Package className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No device models found matching your search</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeviceModelSelector;
