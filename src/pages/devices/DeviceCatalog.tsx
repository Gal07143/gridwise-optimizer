
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, FileText, Database } from 'lucide-react';
import { deviceCategories } from '@/types/device-catalog';
import { getAllDeviceModels, getDeviceModelsByCategory } from '@/services/deviceCatalogService';
import DeviceModelsCard from '@/components/devices/DeviceModelsCard';
import DeviceCategoryGrid from '@/components/devices/DeviceCategoryGrid';
import AppLayout from '@/components/layout/AppLayout';
import { useNavigate } from 'react-router-dom';

const DeviceCatalog = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('categories');
  const [sortField, setSortField] = useState('manufacturer');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Fetch all device models
  const { data: allDeviceModels, isLoading, error } = useQuery({
    queryKey: ['deviceModels'],
    queryFn: getAllDeviceModels
  });
  
  // Filter device models based on search query
  const filteredDeviceModels = allDeviceModels?.filter(device => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      device.manufacturer.toLowerCase().includes(query) ||
      device.model_name.toLowerCase().includes(query) ||
      device.model_number.toLowerCase().includes(query) ||
      device.description?.toLowerCase().includes(query) ||
      device.device_type.toLowerCase().includes(query)
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

  return (
    <AppLayout>
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Device Catalog</h1>
            <p className="text-muted-foreground">Browse and manage compatible devices</p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => navigate('/devices')}
              className="flex items-center gap-2"
            >
              <Database className="h-4 w-4" />
              My Devices
            </Button>
            <Button
              variant="default"
              onClick={() => navigate('/devices/add-model')}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Device Model
            </Button>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search devices by name, manufacturer or type..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <Tabs defaultValue="categories" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="all">All Devices</TabsTrigger>
            <TabsTrigger value="manufacturers">Manufacturers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="categories" className="space-y-4">
            <DeviceCategoryGrid categories={deviceCategories} />
          </TabsContent>
          
          <TabsContent value="all" className="space-y-4">
            <DeviceModelsCard
              deviceModels={filteredDeviceModels}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
              isLoading={isLoading}
            />
          </TabsContent>
          
          <TabsContent value="manufacturers" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground">
                  Manufacturer directory coming soon
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default DeviceCatalog;
