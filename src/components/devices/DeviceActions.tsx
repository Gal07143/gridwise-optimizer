import React from 'react';
import { Link } from 'react-router-dom';
import {
  Power,
  Settings,
  RefreshCw,
  Download,
  Trash2,
  FileText,
  Database,
  AlertTriangle,
  History
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

interface DeviceActionsProps {
  deviceId: string;
  deviceName: string;
  isOnline: boolean;
  onStatusChange?: (newStatus: boolean) => void;
  onDelete?: () => void;
}

const DeviceActions: React.FC<DeviceActionsProps> = ({
  deviceId,
  deviceName,
  isOnline,
  onStatusChange,
  onDelete,
}) => {
  const handlePowerToggle = async () => {
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onStatusChange?.(!isOnline);
      toast.success(`Device ${isOnline ? 'powered off' : 'powered on'} successfully`);
    } catch (error) {
      toast.error('Failed to change device power state');
    }
  };

  const handleRefresh = async () => {
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Device data refreshed successfully');
    } catch (error) {
      toast.error('Failed to refresh device data');
    }
  };

  const handleExportData = async () => {
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Device data exported successfully');
    } catch (error) {
      toast.error('Failed to export device data');
    }
  };

  const handleDelete = async () => {
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onDelete?.();
      toast.success('Device deleted successfully');
    } catch (error) {
      toast.error('Failed to delete device');
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={isOnline ? "default" : "outline"}
        onClick={handlePowerToggle}
        className="flex items-center gap-2"
      >
        <Power className="h-4 w-4" />
        {isOnline ? 'Power Off' : 'Power On'}
      </Button>

      <Button
        variant="outline"
        onClick={handleRefresh}
        className="flex items-center gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        Refresh
      </Button>

      <Button
        variant="outline"
        asChild
        className="flex items-center gap-2"
      >
        <Link to={`/devices/${deviceId}/settings`}>
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => toast.success('Downloading specifications...')}>
            <FileText className="h-4 w-4 mr-2" />
            Specifications
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => toast.success('Downloading manual...')}>
            <FileText className="h-4 w-4 mr-2" />
            User Manual
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExportData}>
            <Database className="h-4 w-4 mr-2" />
            Export Data
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to={`/devices/${deviceId}/logs`} className="flex items-center">
              <History className="h-4 w-4 mr-2" />
              View Logs
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="flex items-center gap-2">
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete Device
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {deviceName}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeviceActions; 