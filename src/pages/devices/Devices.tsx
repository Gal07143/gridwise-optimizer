import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus, Database, Package, Gauge, Filter, Search, Download } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getDevices } from '@/services/deviceService';
import DeviceTableRow from '@/components/DeviceTableRow';
import AppLayout from '@/components/layout/AppLayout';
import { toast } from 'sonner';

const DevicesPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);
  
  const { data: devices, isLoading, error } = useQuery({
    queryKey: ['devices'],
    queryFn: getDevices
  });
  
  // Filter devices based on search and type filter
  const filteredDevices = devices?.filter(device => {
    // Apply type filter
    if (filterType && device.type !== filterType) {
      return false;
    }
    
    // Apply search filter
    if (!searchQuery) {
      return true;
    }
    
    const query = searchQuery.toLowerCase();
    return (
      device.name.toLowerCase().includes(query) ||
      device.type.toLowerCase().includes(query) ||
      device.location?.toLowerCase().includes(query) ||
      device.model?.toLowerCase().includes(query)
    );
  }) || [];
  
  const handleClearFilters = () => {
    setSearchQuery('');
    setFilterType(null);
  };
  
  const handleExportDevices = () => {
    try {
      // Create CSV content
      const headers = ['Name', 'Type', 'Status', 'Location', 'Model', 'Capacity'];
      const csvContent = [
        headers.join(','),
        ...filteredDevices.map(device => [
          device.name,
          device.type,
          device.status,
          device.location || 'N/A',
          device.model || 'N/A',
          device.capacity || 'N/A'
        ].join(','))
      ].join('\n');
      
      // Create blob and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `devices-export-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Devices exported successfully');
    } catch (error) {
      console.error('Error exporting devices:', error);
      toast.error('Failed to export devices');
    }
  };
  
  return (
    <AppLayout>
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Devices</h1>
            <p className="text-muted-foreground">Manage your energy devices</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline"
              onClick={() => navigate('/devices/catalog')}
              className="flex items-center gap-2"
            >
              <Package className="h-4 w-4" />
              Device Catalog
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/maintenance')}
              className="flex items-center gap-2"
            >
              <Gauge className="h-4 w-4" />
              Maintenance
            </Button>
            <Button
              variant="default"
              onClick={() => navigate('/devices/add')}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Device
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search devices..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  {filterType ? `Type: ${filterType}` : 'Filter'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setFilterType('battery')}>Battery</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType('solar')}>Solar</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType('inverter')}>Inverter</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType('meter')}>Meter</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType('ev_charger')}>EV Charger</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleClearFilters}>Clear Filters</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="outline" onClick={handleExportDevices} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-0">
            <CardTitle>Device Inventory</CardTitle>
            <CardDescription>
              {filteredDevices.length} {filteredDevices.length === 1 ? 'device' : 'devices'} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <p className="text-red-500">Error loading devices</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </div>
            ) : filteredDevices.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Protocol</TableHead>
                      <TableHead>Model</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Electrical</TableHead>
                      <TableHead>Temperature</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDevices.map((device) => (
                      <DeviceTableRow key={device.id} device={device} />
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8">
                <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium text-lg mb-2">No devices found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || filterType 
                    ? "No devices match your current filters" 
                    : "You haven't added any devices yet"}
                </p>
                {searchQuery || filterType ? (
                  <Button variant="outline" onClick={handleClearFilters}>
                    Clear Filters
                  </Button>
                ) : (
                  <Button onClick={() => navigate('/devices/add')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Device
                  </Button>
                )}
              </div>
            )}
          </CardContent>
          {filteredDevices.length > 0 && (
            <CardFooter className="flex justify-between border-t pt-6">
              <p className="text-sm text-muted-foreground">
                Showing {filteredDevices.length} of {devices?.length || 0} devices
              </p>
              <Button 
                size="sm" 
                onClick={() => navigate('/devices/add')}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Device
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </AppLayout>
  );
};

export { DevicesPage };
export default DevicesPage;
