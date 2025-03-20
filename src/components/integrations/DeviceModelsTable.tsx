
import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, AlertCircle, ArrowUpDown, ExternalLink, Download, Info, Settings } from 'lucide-react';
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
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/tooltip';

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
  const handleViewManual = (deviceId: string, hasManual: boolean) => {
    if (hasManual) {
      toast.info('Opening device manual...');
    } else {
      toast.error('Manual not available for this device');
    }
  };

  const handleProtocolInfo = (protocol: string) => {
    toast.info(`${protocol} Information`, {
      description: `Details about the ${protocol} communication protocol would appear here.`,
      duration: 5000,
    });
  };

  return (
    <div className="overflow-x-auto">
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
                <TableCell>
                  <div className="flex items-center">
                    {device.protocol}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 ml-1" 
                            onClick={() => handleProtocolInfo(device.protocol)}
                          >
                            <Info className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View protocol information</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
                <TableCell>{device.firmware}</TableCell>
                <TableCell>
                  {device.supported ? (
                    <Badge variant="default" className="bg-green-500">Supported</Badge>
                  ) : (
                    <Badge variant="outline" className="border-amber-500 text-amber-500">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Not Supported
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={device.hasManual ? "" : "text-muted-foreground"} 
                    onClick={() => handleViewManual(device.id, device.hasManual)}
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    Manual
                  </Button>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/integrations/device-models/${device.id}`}>
                        View
                      </Link>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => toast.info(`Downloading ${device.manufacturer} ${device.model} specs...`)}>
                          <Download className="h-4 w-4 mr-2" />
                          Download Specs
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.info(`Opening ${device.manufacturer} website...`)}>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Manufacturer Website
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
    </div>
  );
};

export default DeviceModelsTable;
