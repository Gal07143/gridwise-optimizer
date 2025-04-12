import React from 'react';
import { Link } from 'react-router-dom';
import { Download, Plus, Filter, RefreshCw } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import DeviceModelsTable from './DeviceModelsTable';
import { DeviceModel } from '@/types/device-model';
import { toast } from 'sonner';

// Define SupportLevel type locally since it's not exported from device-model.ts
type SupportLevel = 'none' | 'full' | 'partial' | 'beta' | 'community';

// Internal interface that matches what DeviceModelsTable expects
interface MappedDeviceModel {
  id: string;
  name: string;
  manufacturer: string;
  model_number: string;
  device_type: string;
  protocol?: string;
  support_level?: SupportLevel;
  has_manual?: boolean;
  has_datasheet?: boolean;
  has_video?: boolean;
  category?: string;
  power_rating?: number;
  capacity?: number;
  description?: string;
}

interface DeviceModelsCardProps {
  deviceModels: DeviceModel[];
  sortField: string;
  sortDirection: 'asc' | 'desc';
  onSort: (field: string) => void;
}

const DeviceModelsCard: React.FC<DeviceModelsCardProps> = ({
  deviceModels,
  sortField,
  sortDirection,
  onSort
}) => {
  const handleExportList = () => {
    toast.success("Exporting device list...");
    
    // Create CSV content
    const headers = ['Name', 'Manufacturer', 'Model Number', 'Device Type'];
    const csvContent = [
      headers.join(','),
      ...deviceModels.map(device => [
        device.name || `${device.manufacturer} ${device.model_number}`,
        device.manufacturer,
        device.model_number,
        device.device_type
      ].join(','))
    ].join('\n');
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `device-models-list-${timestamp}.csv`;
    link.setAttribute('download', filename);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setTimeout(() => {
      toast.info(`Device list exported as ${filename}`);
    }, 1500);
  };

  const handleRefreshData = () => {
    toast.success("Refreshing device data...");
    // In a real application, this would trigger a refetch
    setTimeout(() => {
      toast.info("Device data refreshed successfully");
    }, 1200);
  };

  const handleClearFilters = () => {
    // This would be implemented to clear all active filters
    toast.info("Filters cleared");
  };

  const handleDownloadCatalog = () => {
    toast.success(`Downloading device catalog...`);
    
    // Create a simulated PDF download
    setTimeout(() => {
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `device-catalog-${timestamp}.pdf`;
      
      // Create a sample PDF blob (in a real app, this would be actual PDF content)
      const pdfContent = `This is a sample PDF catalog for devices`;
      const blob = new Blob([pdfContent], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      // Create a temporary anchor element to download the file
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.info(`Catalog downloaded as ${filename}`);
    }, 2000);
  };

  // Map to DeviceModelsTable's expected DeviceModel type
  const mappedDevices: MappedDeviceModel[] = deviceModels.map(device => ({
    id: device.id,
    name: device.name || `${device.manufacturer} ${device.model_number}`,
    manufacturer: device.manufacturer,
    model_number: device.model_number,
    device_type: device.device_type,
    protocol: device.protocol,
    support_level: device.support_level as SupportLevel, // Type assertion to fix compatibility
    has_manual: device.has_manual,
    has_datasheet: device.has_datasheet,
    has_video: device.has_video,
    category: device.category,
    power_rating: device.power_rating,
    capacity: device.capacity,
    description: device.description,
  }));

  return (
    <Card>
      <CardHeader className="pb-0">
        <div className="flex flex-col sm:flex-row justify-between">
          <div>
            <CardTitle>Device Models</CardTitle>
            <CardDescription>
              {deviceModels.length} device models found
            </CardDescription>
          </div>
          <div className="flex gap-2 mt-4 sm:mt-0">
            <Button size="sm" variant="outline" onClick={handleRefreshData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button size="sm" variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DeviceModelsTable 
          devices={mappedDevices as any}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={onSort}
        />
        
        {deviceModels.length === 0 && (
          <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/50 rounded-lg mt-4">
            <p className="text-muted-foreground">No device models found matching your criteria.</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={handleClearFilters}>Clear Filters</Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-4 justify-between border-t pt-6">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-muted-foreground" onClick={handleExportList}>
            <Download className="h-4 w-4 mr-2" />
            Export List
          </Button>
          <Button variant="outline" size="sm" className="text-muted-foreground" onClick={handleDownloadCatalog}>
            <Download className="h-4 w-4 mr-2" />
            Download Catalog
          </Button>
        </div>
        <Button size="sm" asChild>
          <Link to="/integrations/add-device-model">
            <Plus className="h-4 w-4 mr-2" />
            Add New Device
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DeviceModelsCard;
