
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronDown, 
  ChevronUp, 
  Edit, 
  Eye, 
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { BadgeExtended } from '@/components/ui/badge-extended';
import { toast } from 'sonner';
import { DeviceModel } from '@/hooks/useDeviceModels';

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

  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  const handleViewDevice = (deviceId: string) => {
    navigate(`/integrations/device-models/${deviceId}`);
  };

  const handleEditDevice = (deviceId: string) => {
    navigate(`/integrations/edit-device-model/${deviceId}`);
  };

  const handleDeleteDevice = (deviceId: string, deviceName: string) => {
    toast.error(`Delete selected: ${deviceName}`, {
      description: "This action would permanently delete this device model.",
      action: {
        label: "Undo",
        onClick: () => toast.info(`Deletion of ${deviceName} cancelled`)
      }
    });
  };

  return (
    <div className="overflow-x-auto border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer w-[250px]"
              onClick={() => onSort('name')}
            >
              <div className="flex items-center space-x-1">
                <span>Name</span>
                {getSortIcon('name')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => onSort('manufacturer')}
            >
              <div className="flex items-center space-x-1">
                <span>Manufacturer</span>
                {getSortIcon('manufacturer')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hidden md:table-cell"
              onClick={() => onSort('powerRating')}
            >
              <div className="flex items-center space-x-1">
                <span>Power Rating</span>
                {getSortIcon('powerRating')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hidden lg:table-cell"
              onClick={() => onSort('capacity')}
            >
              <div className="flex items-center space-x-1">
                <span>Capacity</span>
                {getSortIcon('capacity')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hidden lg:table-cell"
              onClick={() => onSort('releaseDate')}
            >
              <div className="flex items-center space-x-1">
                <span>Release Date</span>
                {getSortIcon('releaseDate')}
              </div>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {devices.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center p-4">
                <div className="flex flex-col items-center justify-center space-y-2 py-4">
                  <AlertTriangle className="h-6 w-6 text-muted-foreground" />
                  <p className="text-muted-foreground">No device models found</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            devices.map((device) => (
              <TableRow key={device.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleViewDevice(device.id)}>
                <TableCell className="font-medium">{device.name}</TableCell>
                <TableCell>{device.manufacturer}</TableCell>
                <TableCell className="hidden md:table-cell">{device.powerRating || "N/A"}</TableCell>
                <TableCell className="hidden lg:table-cell">{device.capacity ? `${device.capacity} kW` : "N/A"}</TableCell>
                <TableCell className="hidden lg:table-cell">{device.releaseDate || "N/A"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 w-8 p-0" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDevice(device.id);
                      }}
                    >
                      <span className="sr-only">View</span>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="12" cy="5" r="1" />
                            <circle cx="12" cy="19" r="1" />
                          </svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDevice(device.id);
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          <span>View</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditDevice(device.id);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteDevice(device.id, device.name);
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DeviceModelsTable;
