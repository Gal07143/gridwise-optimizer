
import React from 'react';
import { Link } from 'react-router-dom';
import { Download } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DeviceModelsTable from './DeviceModelsTable';
import { DeviceModel } from '@/hooks/useDeviceModels';

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
  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle>Device Models</CardTitle>
        <CardDescription>
          {deviceCount} {categoryName.toLowerCase()} found matching your criteria
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DeviceModelsTable 
          devices={filteredDevices}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={onSort}
        />
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-6">
        <Button variant="outline" size="sm" className="text-muted-foreground">
          <Download className="h-4 w-4 mr-2" />
          Export List
        </Button>
        <Button size="sm" asChild>
          <Link to="/integrations/add-device-model">
            Add New Device
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DeviceModelsCard;
