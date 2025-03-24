
import React from 'react';
import { ArrowUpDown, CheckCircle, AlertCircle, BookOpen } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { DeviceModel } from '@/components/integrations/IntegrationDeviceModelsCard';

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
  onSort
}) => {
  const navigate = useNavigate();

  const getSupportBadge = (supportLevel: 'full' | 'partial' | 'none') => {
    switch (supportLevel) {
      case 'full':
        return (
          <Badge className="bg-green-500 hover:bg-green-600 gap-1 flex items-center">
            <CheckCircle className="h-3 w-3" />
            Fully Supported
          </Badge>
        );
      case 'partial':
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600 gap-1 flex items-center">
            <AlertCircle className="h-3 w-3" />
            Partial Support
          </Badge>
        );
      case 'none':
        return (
          <Badge variant="outline" className="gap-1 flex items-center text-muted-foreground">
            <AlertCircle className="h-3 w-3" />
            Not Supported
          </Badge>
        );
    }
  };

  const handleClickRow = (deviceId: string) => {
    // Update route path to match what we added in Routes.tsx
    navigate(`/integrations/device-model/${deviceId}`);
  };

  const getSortIndicator = (field: string) => {
    if (sortField === field) {
      return sortDirection === 'asc' ? '↑' : '↓';
    }
    return null;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">
              <Button variant="ghost" className="p-0 font-medium" onClick={() => onSort('name')}>
                Device Name {getSortIndicator('name')}
                <ArrowUpDown className="ml-2 h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" className="p-0 font-medium" onClick={() => onSort('manufacturer')}>
                Manufacturer {getSortIndicator('manufacturer')}
                <ArrowUpDown className="ml-2 h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" className="p-0 font-medium" onClick={() => onSort('protocol')}>
                Protocol {getSortIndicator('protocol')}
                <ArrowUpDown className="ml-2 h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Manual</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {devices.map((device) => (
            <TableRow 
              key={device.id} 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleClickRow(device.id)}
            >
              <TableCell className="font-medium">{device.name}</TableCell>
              <TableCell>{device.manufacturer}</TableCell>
              <TableCell>{device.protocol}</TableCell>
              <TableCell>{getSupportBadge(device.support_level)}</TableCell>
              <TableCell className="text-center">
                {device.has_manual ? (
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(e) => {
                    e.stopPropagation();
                    window.open(`/manuals/${device.id}.pdf`, '_blank');
                  }}>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </Button>
                ) : (
                  <span className="text-muted-foreground text-xs">—</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DeviceModelsTable;
