
import React from 'react';
import { ArrowUpDown, CheckCircle, AlertCircle, BookOpen, ExternalLink, Settings, Download, Info } from 'lucide-react';
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';

export interface DeviceModel {
  id: string;
  name: string;
  manufacturer: string;
  model_number: string;
  device_type: string;
  category?: string;
  protocol: string;
  firmware_version?: string;
  power_rating?: number;
  capacity?: number;
  release_date?: string;
  support_level: 'full' | 'partial' | 'none';
  has_manual: boolean;
  has_datasheet?: boolean;
  has_video?: boolean;
  specifications?: any;
  connectivity?: any;
  description?: string;
  warranty?: string;
  certifications?: string[];
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
    // Update route path to device model detail page
    navigate(`/integrations/device-model/${deviceId}`);
  };

  const handleViewManual = (e: React.MouseEvent, device: DeviceModel) => {
    e.stopPropagation(); // Prevent row click
    if (device.has_manual) {
      toast.success(`Opening manual for ${device.name}`);
      window.open(`/manuals/${device.id}.pdf`, '_blank');
    } else {
      toast.info("Manual not available for this device");
    }
  };
  
  const handleViewDatasheet = (e: React.MouseEvent, device: DeviceModel) => {
    e.stopPropagation(); // Prevent row click
    if (device.has_datasheet) {
      toast.success(`Opening datasheet for ${device.name}`);
      window.open(`/datasheets/${device.id}.pdf`, '_blank');
    } else {
      toast.info("Datasheet not available for this device");
    }
  };
  
  const handleViewVideo = (e: React.MouseEvent, device: DeviceModel) => {
    e.stopPropagation(); // Prevent row click
    if (device.has_video) {
      toast.success(`Opening video for ${device.name}`);
      // This would be replaced with a modal or route to view the device video
      window.open(`/videos/${device.id}`, '_blank');
    } else {
      toast.info("Video not available for this device");
    }
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
              <Button variant="ghost" className="p-0 font-medium" onClick={() => onSort('model_number')}>
                Model {getSortIndicator('model_number')}
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
            <TableHead className="text-center">Documentation</TableHead>
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
              <TableCell>{device.model_number}</TableCell>
              <TableCell>{device.protocol}</TableCell>
              <TableCell>{getSupportBadge(device.support_level)}</TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={`h-8 w-8 p-0 ${!device.has_manual ? 'opacity-50' : ''}`} 
                          onClick={(e) => handleViewManual(e, device)}
                        >
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>User Manual</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={`h-8 w-8 p-0 ${!device.has_datasheet ? 'opacity-50' : ''}`} 
                          onClick={(e) => handleViewDatasheet(e, device)}
                        >
                          <Download className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Datasheet</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={`h-8 w-8 p-0 ${!device.has_video ? 'opacity-50' : ''}`} 
                          onClick={(e) => handleViewVideo(e, device)}
                        >
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Installation Video</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0" 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/integrations/device-model/${device.id}/settings`);
                          }}
                        >
                          <Settings className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Device Settings</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0" 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/integrations/device-model/${device.id}`);
                          }}
                        >
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Device Details</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DeviceModelsTable;
