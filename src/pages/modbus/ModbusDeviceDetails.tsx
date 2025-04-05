import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Main } from '@/components/ui/main';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  ArrowLeft, 
  ServerIcon, 
  Trash, 
  Settings, 
  Activity, 
  Terminal, 
  Database,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useModbusConnection } from '@/hooks/useModbusConnection';
import ModbusRegisterMapEditor from '@/components/modbus/ModbusRegisterMap';
import ModbusMonitor from '@/components/modbus/ModbusMonitor';
import { supabase } from '@/integrations/supabase/client';

const ModbusDeviceDetailsPage: React.FC = () => {
  const { deviceId } = useParams<{ deviceId: string }>();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const { 
    device, 
    loading, 
    error, 
    connect, 
    disconnect, 
    isConnected,
    refreshDevice
  } = useModbusConnection(deviceId);

  const handleBack = () => {
    navigate('/modbus/devices');
  };

  const handleEdit = () => {
    navigate(`/modbus/devices/${deviceId}/edit`);
  };

  const handleDelete = async () => {
    if (!deviceId) return;

    // If connected, disconnect first
    if (isConnected) {
      await disconnect();
    }

    try {
      // Delete register maps first
      await supabase
        .from('modbus_register_maps')
        .delete()
        .eq('device_id', deviceId);
      
      // Delete device readings
      await supabase
        .from('modbus_readings')
        .delete()
        .eq('device_id', deviceId);
      
      // Delete the device itself
      const { error } = await supabase
        .from('modbus_devices')
        .delete()
        .eq('id', deviceId);
      
      if (error) throw error;
      
      toast.success('Device deleted successfully');
      navigate('/modbus/devices');
    } catch (err: any) {
      toast.error(`Error deleting device: ${err.message}`);
    }
  };

  const handleToggleConnection = async () => {
    if (isConnected) {
      await disconnect();
    } else {
      const success = await connect();
      if (!success) {
        toast.error('Failed to connect to device');
      }
    }
  };

  if (loading) {
    return (
      <Main title="Device Details">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={handleBack} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="animate-pulse h-8 w-60 bg-secondary rounded"></div>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-secondary rounded w-full max-w-md"></div>
          <div className="h-64 bg-secondary rounded"></div>
        </div>
      </Main>
    );
  }

  if (error || !device) {
    return (
      <Main title="Device Details">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={handleBack} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Device Not Found</h1>
        </div>
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6 text-center">
          <AlertTriangle className="h-12 w-12 mx-auto text-destructive mb-4" />
          <p className="text-lg font-medium mb-2 text-destructive">Error Loading Device</p>
          <p className="text-muted-foreground mb-4">
            {error || "The device you're looking for could not be found."}
          </p>
          <Button onClick={handleBack}>Return to Devices List</Button>
        </div>
      </Main>
    );
  }

  return (
    <Main title={`Modbus: ${device.name}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={handleBack} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center">
            <ServerIcon className="h-6 w-6 mr-2" />
            <h1 className="text-2xl font-bold">{device.name}</h1>
            <Badge 
              variant={isConnected ? "success" : "outline"}
              className="ml-3"
            >
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline"
            onClick={handleToggleConnection}
          >
            {isConnected ? 'Disconnect' : 'Connect to Device'}
            {!isConnected && <ChevronRight className="ml-2 h-4 w-4" />}
          </Button>
          <Button variant="outline" onClick={handleEdit}>
            <Settings className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {device.description && (
        <p className="text-muted-foreground mb-6">{device.description}</p>
      )}

      <Tabs defaultValue="monitor" className="mt-6">
        <TabsList className="mb-4">
          <TabsTrigger value="monitor">
            <Terminal className="mr-2 h-4 w-4" />
            Monitor
          </TabsTrigger>
          <TabsTrigger value="registers">
            <Database className="mr-2 h-4 w-4" />
            Register Map
          </TabsTrigger>
          <TabsTrigger value="log">
            <Activity className="mr-2 h-4 w-4" />
            Data Log
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="monitor">
          <ModbusMonitor deviceId={deviceId!} />
        </TabsContent>
        
        <TabsContent value="registers">
          <ModbusRegisterMapEditor deviceId={deviceId!} />
        </TabsContent>
        
        <TabsContent value="log">
          <div className="bg-card border rounded-md p-8 text-center">
            <Activity className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Data Logging</h3>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              View historical data and export readings for this Modbus device.
              This feature will be available soon.
            </p>
            <Button disabled variant="outline">Coming Soon</Button>
          </div>
        </TabsContent>
      </Tabs>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the Modbus device "{device.name}" and all associated data. 
              This action cannot be undone.
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
    </Main>
  );
};

export default ModbusDeviceDetailsPage;
