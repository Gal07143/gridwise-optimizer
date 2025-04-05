
import React from 'react';
import { useParams } from 'react-router-dom';
import { getDeviceModelsByCategory } from '@/services/deviceCatalogService';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { DeviceModelSelector } from '@/components/devices';
import { PageHeader } from '@/components/pages/PageHeader';
import { getCategoryName } from '@/services/deviceCatalogService';

const DeviceCategoryDetail = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  
  const { data: deviceModels, isLoading, error } = useQuery({
    queryKey: ['deviceModels', categoryId],
    queryFn: () => getDeviceModelsByCategory(categoryId || ''),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!categoryId,
  });
  
  const categoryName = categoryId ? getCategoryName(categoryId) : '';
  
  return (
    <div className="container mx-auto py-6">
      <PageHeader 
        title={categoryName || 'Device Category'} 
        description={`Browse and select ${categoryName?.toLowerCase() || 'device'} models to add to your system`}
        backLink="/devices/catalog"
        backLinkText="Back to Categories"
      />
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading devices...</span>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500">Error loading devices</p>
          <p className="text-sm text-gray-500">{(error as Error).message}</p>
        </div>
      ) : deviceModels && deviceModels.length > 0 ? (
        <DeviceModelSelector models={deviceModels} category={categoryId || ''} />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No {categoryName?.toLowerCase() || 'device'} models available</p>
        </div>
      )}
    </div>
  );
};

export default DeviceCategoryDetail;
