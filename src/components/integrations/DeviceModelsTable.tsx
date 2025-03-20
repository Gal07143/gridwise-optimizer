
import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, AlertCircle, ArrowUpDown } from 'lucide-react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface DeviceModel {
  id: string;
  manufacturer: string;
  model: string;
  protocol: string;
  firmware: string;
  supported: boolean;
  hasManual: boolean;
}

interface DeviceModelsTableProps {
  devices: DeviceModel[];
  sortField: string;
  sortDirection: 'asc' | 'desc';
  onSort: (field: string) => void;
}

const DeviceModelsTable: React.FC<DeviceModelsTableProps> = ({
  devices,
  sortField,
  sortDirection,
  onSort,
}) => {
  const handleViewManual = (deviceId: string) => {
    // This would open the manual in a real app
    toast.info('Opening device manual...');
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="cursor-pointer" onClick={() => onSort('manufacturer')}>
            <div className="flex items-center">
              Manufacturer
              {sortField === 'manufacturer' && (
                <ArrowUpDown className="ml-2 h-4 w-4" />
              )}
            </div>
          </TableHead>
          <TableHead className="cursor-pointer" onClick={() => onSort('model')}>
            <div className="flex items-center">
              Model
              {sortField === 'model' && (
                <ArrowUpDown className="ml-2 h-4 w-4" />
              )}
            </div>
          </TableHead>
          <TableHead className="cursor-pointer" onClick={() => onSort('protocol')}>
            <div className="flex items-center">
              Protocol
              {sortField === 'protocol' && (
                <ArrowUpDown className="ml-2 h-4 w-4" />
              )}
            </div>
          </TableHead>
          <TableHead className="cursor-pointer" onClick={() => onSort('firmware')}>
            <div className="flex items-center">
              Firmware
              {sortField === 'firmware' && (
                <ArrowUpDown className="ml-2 h-4 w-4" />
              )}
            </div>
          </TableHead>
          <TableHead className="cursor-pointer" onClick={() => onSort('supported')}>
            <div className="flex items-center">
              Status
              {sortField === 'supported' && (
                <ArrowUpDown className="ml-2 h-4 w-4" />
              )}
            </div>
          </TableHead>
          <TableHead>Documentation</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {devices.length > 0 ? (
          devices.map((device) => (
            <TableRow key={device.id}>
              <TableCell className="font-medium">{device.manufacturer}</TableCell>
              <TableCell>{device.model}</TableCell>
              <TableCell>{device.protocol}</TableCell>
              <TableCell>{device.firmware}</TableCell>
              <TableCell>
                {device.supported ? (
                  <Badge className="bg-green-500">Supported</Badge>
                ) : (
                  <Badge variant="outline" className="border-amber-500 text-amber-500">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Not Supported
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                {device.hasManual ? (
                  <Button variant="ghost" size="sm" onClick={() => handleViewManual(device.id)}>
                    <FileText className="h-4 w-4 mr-1" />
                    Manual
                  </Button>
                ) : (
                  <span className="text-muted-foreground text-sm">No manual</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/integrations/device/${device.id}`}>
                      View
                    </Link>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="h-24 text-center">
              No devices found matching your search criteria.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default DeviceModelsTable;
