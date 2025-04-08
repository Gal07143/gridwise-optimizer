
import React from 'react';
import { useParams } from 'react-router-dom';
import { Main } from '@/components/ui/main';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { fetchSiteById, fetchDevices } from '@/services/supabase/supabaseService';
import { Skeleton } from '@/components/ui/skeleton';

const SiteDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: site, isLoading: siteLoading } = useQuery({
    queryKey: ['site', id],
    queryFn: () => fetchSiteById(id!),
    enabled: !!id,
  });
  
  const { data: devices = [], isLoading: devicesLoading } = useQuery({
    queryKey: ['devices', id],
    queryFn: () => fetchDevices(id),
    enabled: !!id,
  });

  if (siteLoading) {
    return (
      <Main title="Site Details">
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

  if (!site) {
    return (
      <Main title="Site Not Found">
        <Card>
          <CardContent className="py-10 text-center">
            <p>The requested site could not be found.</p>
          </CardContent>
        </Card>
      </Main>
    );
  }

  return (
    <Main title={site.name}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{site.name}</h1>
        <p className="text-gray-500 dark:text-gray-400">{site.location}</p>
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="energy">Energy</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Devices</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{devices.length}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold capitalize">{site.status}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Timezone</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{site.timezone}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="devices" className="mt-4">
          {devicesLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <Card>
              <CardContent className="py-4">
                {devices.length === 0 ? (
                  <p className="text-center py-6 text-muted-foreground">
                    No devices found for this site.
                  </p>
                ) : (
                  <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                    {devices.map(device => (
                      <li key={device.id} className="py-3 flex justify-between items-center">
                        <div>
                          <p className="font-medium">{device.name}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {device.type} - {device.status}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </Main>
  );
};

export default SiteDetail;
