
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
import { DeviceModel } from '@/hooks/useDeviceModels';
import { toast } from 'sonner';

interface DeviceModelsCardProps {
  deviceCount: number;
  categoryName: string;
  filteredDevices: DeviceModel[];
  sortField: string;
  sortDirection: 'asc' | 'desc';
  onSort: (field: string) => void;
}

const DeviceModelsCard: React.FC<DeviceModelsCardProps> = ({
  deviceCount,
  categoryName,
  filteredDevices,
  sortField,
  sortDirection,
  onSort
}) => {
  const handleExportList = () => {
    toast.success("Exporting device list...");
    setTimeout(() => {
      toast.info("Device list exported as CSV");
    }, 1500);
  };

  const handleRefreshData = () => {
    toast.success("Refreshing device data...");
    // In a real application, this would trigger a refetch
  };

  const handleClearFilters = () => {
    // This would be implemented to clear all active filters
    toast.info("Filters cleared");
  };

  return (
    <Card>
      <CardHeader className="pb-0">
        <div className="flex flex-col sm:flex-row justify-between">
          <div>
            <CardTitle>Device Models</CardTitle>
            <CardDescription>
              {deviceCount} {categoryName.toLowerCase()} found matching your criteria
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
          devices={filteredDevices}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={onSort}
        />
        
        {filteredDevices.length === 0 && (
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
          <Button variant="outline" size="sm" className="text-muted-foreground">
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
