import React from 'react';
import { useParams } from 'react-router-dom';
import { Main } from '@/components/ui/main';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { getDeviceModelsByCategory } from '@/services/deviceCatalogService';
import { DeviceModel } from '@/types/device-model';
import { Skeleton } from '@/components/ui/skeleton';
import { DeviceModelCategory } from '@/types/device-model-category';
import { categoryNames } from '@/types/device-model';

const DeviceCategoryDetail: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  
  const { data: deviceModels, isLoading, error } = useQuery<DeviceModel[]>({
    queryKey: ['deviceModels', categoryId],
    queryFn: () => getDeviceModelsByCategory(categoryId || ''),
    enabled: !!categoryId,
  });

  const categoryName = categoryId ? (categoryNames[categoryId] || categoryId) : '';

  return (
    <Main title={`${categoryName} Devices`}>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{categoryName} Devices</h1>
          <Button>Add New {categoryName.slice(0, -1)}</Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="border rounded-lg p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-red-500">Error loading device models: {(error as Error).message}</div>
        ) : deviceModels && deviceModels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {deviceModels.map((device) => (
              <div key={device.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h2 className="text-lg font-semibold">{device.name}</h2>
                <p className="text-sm text-gray-500 mb-2">{device.manufacturer}</p>
                <p className="text-sm mb-1">Model: {device.model_number}</p>
                <p className="text-sm mb-1">Type: {device.device_type}</p>
                {device.power_rating && (
                  <p className="text-sm mb-1">Power Rating: {device.power_rating} kW</p>
                )}
                {device.capacity && (
                  <p className="text-sm mb-1">Capacity: {device.capacity} kWh</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No {categoryName.toLowerCase()} found.</p>
          </div>
        )}
      </div>
    </Main>
  );
};

export default DeviceCategoryDetail;
