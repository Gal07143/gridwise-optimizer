import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { DeviceModel } from '@/types/device-model';
import { getAllDeviceModels } from '@/services/deviceCatalogService';
import { Main } from '@/components/ui/main';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const DeviceCatalogPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: devices, isLoading, error } = useQuery({
    queryKey: ['deviceModels'],
    queryFn: getAllDeviceModels,
  });

  const filteredDevices = devices
    ? devices.filter(device =>
        device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.model_number.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <Main title="Device Catalog">
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Device Catalog</h1>
          <Button asChild>
            <Link to="/devices/models/new">Add New Device Model</Link>
          </Button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search device models..."
            className="pl-10"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle><Skeleton className="h-5 w-3/4" /></CardTitle>
                  <CardDescription><Skeleton className="h-4 w-1/2" /></CardDescription>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-red-500">Error: {error.message}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDevices.map(device => (
              <Card key={device.id}>
                <CardHeader>
                  <CardTitle>
                    <Link to={`/devices/models/${device.id}`} className="hover:underline font-medium">
                      {device.name} {device.model_number}
                    </Link>
                  </CardTitle>
                  <CardDescription>{device.manufacturer}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Type: {device.device_type}</p>
                  <p>Category: {device.category}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Main>
  );
};

export default DeviceCatalogPage;
