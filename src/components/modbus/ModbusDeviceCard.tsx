
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Trash2, WifiOff, Cable, ServerIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ModbusDevice } from '@/types/modbus';
import useConnectionStatus from '@/hooks/useConnectionStatus'; 
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { deleteModbusDevice } from '@/services/modbus/modbusDeviceService';

interface ModbusDeviceCardProps {
  device: ModbusDevice;
  onDeleted?: () => void;
}

const ModbusDeviceCard: React.FC<ModbusDeviceCardProps> = ({ device, onDeleted }) => {
  const { isConnected, error } = useConnectionStatus(device.id);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteModbusDevice(device.id);
      toast.success(`Device "${device.name}" deleted successfully`);
      if (onDeleted) {
        onDeleted();
      }
    } catch (error) {
      console.error('Error deleting Modbus device:', error);
      toast.error('Failed to delete Modbus device');
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center">
              <ServerIcon className="mr-2 h-5 w-5" />
              {device.name}
            </CardTitle>
            <CardDescription>{device.protocol} Device</CardDescription>
          </div>
          <Badge variant={device.is_active ? (isConnected ? 'success' : 'destructive') : 'secondary'}>
            {device.is_active 
              ? (isConnected ? 'Connected' : 'Disconnected') 
              : 'Disabled'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Connection:</span> 
            <span className="font-mono">{device.ip}:{device.port}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Unit ID:</span> 
            <span>{device.unit_id}</span>
          </div>
          {error && (
            <div className="mt-2 p-2 bg-destructive/10 text-destructive rounded-md text-xs">
              <WifiOff className="inline-block mr-1 h-3 w-3" />
              Connection error: {error.toString().substring(0, 50)}
              {error.toString().length > 50 ? '...' : ''}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Device</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this Modbus device? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete} 
                className="bg-destructive hover:bg-destructive/90" 
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        <div>
          <Button variant="outline" size="sm" asChild>
            <Link to={`/modbus/devices/${device.id}`}>
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="ml-2" asChild>
            <Link to={`/modbus/monitor/${device.id}`}>
              <Cable className="h-4 w-4 mr-2" />
              Monitor
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ModbusDeviceCard;
