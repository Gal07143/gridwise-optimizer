
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Main } from '@/components/ui/main';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { fetchDeviceById } from '@/services/supabase/supabaseService';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const DeviceDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: device, isLoading } = useQuery({
    queryKey: ['device', id],
    queryFn: () => fetchDeviceById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <Main title="Device Details">
        <div className="space-y-4">
          <Skeleton className="h-12 w-1/3" />
          <Skeleton className="h-6 w-1/4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
        </div>
      </Main>
    );
  }

  if (!device) {
    return (
      <Main title="Device Not Found">
        <Card>
          <CardContent className="py-10 text-center">
            <p>The requested device could not be found.</p>
          </CardContent>
        </Card>
      </Main>
    );
  }

  return (
    <Main title={device.name}>
      <div className="mb-6">
        <Link to="/devices" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-700 mb-3">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Devices
        </Link>
        
        <h1 className="text-2xl font-bold">{device.name}</h1>
        <p className="text-gray-500 dark:text-gray-400">{device.type} - {device.status}</p>
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="telemetry">Telemetry</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold capitalize">{device.status}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Capacity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{device.capacity} kW</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Location</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{device.location || 'N/A'}</p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Device Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="divide-y divide-slate-100 dark:divide-slate-800">
                <div className="grid grid-cols-1 md:grid-cols-2 py-3">
                  <dt className="font-medium text-slate-500 dark:text-slate-400">Type</dt>
                  <dd className="text-slate-900 dark:text-slate-100">{device.type}</dd>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 py-3">
                  <dt className="font-medium text-slate-500 dark:text-slate-400">Protocol</dt>
                  <dd className="text-slate-900 dark:text-slate-100">{device.protocol || 'N/A'}</dd>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 py-3">
                  <dt className="font-medium text-slate-500 dark:text-slate-400">Firmware Version</dt>
                  <dd className="text-slate-900 dark:text-slate-100">{device.firmware_version || 'N/A'}</dd>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 py-3">
                  <dt className="font-medium text-slate-500 dark:text-slate-400">Description</dt>
                  <dd className="text-slate-900 dark:text-slate-100">{device.description || 'No description'}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="telemetry" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Telemetry Data</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center py-6 text-muted-foreground">
                Coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Main>
  );
};

export default DeviceDetail;
