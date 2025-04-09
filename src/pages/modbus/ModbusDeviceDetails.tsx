
// Update to handle Error as ReactNode and ensure device has description property
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Main } from '@/components/ui/main';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ServerIcon, Power, PowerOff } from 'lucide-react';
import { useModbusConnection } from '@/hooks/useModbusConnection';
import ModbusRegisterMap from '@/components/modbus/ModbusRegisterMap';
import ModbusReadRegister from '@/components/modbus/ModbusReadRegister';
import ModbusWriteRegister from '@/components/modbus/ModbusWriteRegister';
import ModbusDeviceSettings from '@/components/modbus/ModbusDeviceSettings';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const ModbusDeviceDetails: React.FC = () => {
  const { deviceId } = useParams<{ deviceId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('registers');
  
  const { 
    device, 
    isConnected,
    isConnecting,
    connect,
    disconnect,
    loading, 
    error 
  } = useModbusConnection(deviceId || '');
  
  useEffect(() => {
    if (device) {
      // Set page title
      document.title = `${device.name} - Modbus Device`;
    }
  }, [device]);
  
  const handleBack = () => {
    navigate('/modbus/devices');
  };
  
  const toggleConnection = async () => {
    if (isConnected) {
      await disconnect?.();
      toast.success("Disconnected from device");
    } else {
      try {
        await connect?.();
        toast.success("Connected to device successfully");
      } catch (err) {
        toast.error("Failed to connect to device");
      }
    }
  };
  
  const getConnectionStatusColor = () => {
    if (isConnected) return "bg-green-500";
    if (isConnecting) return "bg-yellow-500";
    return "bg-red-500";
  };
  
  const getConnectionStatusText = () => {
    if (isConnected) return "Connected";
    if (isConnecting) return "Connecting";
    return "Disconnected";
  };
  
  return (
    <Main title={device?.name || "Modbus Device"}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={handleBack} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center">
            <ServerIcon className="h-6 w-6 mr-2" />
            <h1 className="text-2xl font-bold">
              {device?.name || 'Loading...'}
            </h1>
          </div>
        </div>
        
        {device && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 mr-4">
              <div className={`h-3 w-3 rounded-full ${getConnectionStatusColor()}`}></div>
              <span className="text-sm font-medium">{getConnectionStatusText()}</span>
            </div>
            <Button 
              variant={isConnected ? "destructive" : "default"}
              onClick={toggleConnection}
              disabled={isConnecting}
            >
              {isConnected ? (
                <>
                  <PowerOff className="mr-2 h-4 w-4" />
                  Disconnect
                </>
              ) : (
                <>
                  <Power className="mr-2 h-4 w-4" />
                  Connect
                </>
              )}
            </Button>
          </div>
        )}
      </div>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="bg-destructive/10 border border-destructive/30 p-4 rounded-md">
          <p className="text-destructive font-medium">Error loading device</p>
          <p className="text-sm text-destructive/80 mt-1">{error instanceof Error ? error.message : String(error)}</p>
          <div className="mt-4">
            <Button onClick={handleBack}>Return to Devices</Button>
          </div>
        </div>
      ) : device ? (
        <>
          <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge variant="outline">{`IP: ${device.ip_address || device.ip}:${device.port}`}</Badge>
                <Badge variant="outline">{`Unit ID: ${device.unit_id}`}</Badge>
                <Badge>{device.protocol}</Badge>
                <Badge variant={device.is_active ? "default" : "secondary"}>
                  {device.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              {device.description && (
                <p className="text-muted-foreground text-sm">{device.description}</p>
              )}
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="registers">Register Map</TabsTrigger>
              <TabsTrigger value="read">Read Registers</TabsTrigger>
              <TabsTrigger value="write">Write Registers</TabsTrigger>
              <TabsTrigger value="settings">Device Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="registers">
              <ModbusRegisterMap deviceId={deviceId || ''} />
            </TabsContent>
            <TabsContent value="read">
              <ModbusReadRegister deviceId={deviceId || ''} />
            </TabsContent>
            <TabsContent value="write">
              <ModbusWriteRegister deviceId={deviceId || ''} />
            </TabsContent>
            <TabsContent value="settings">
              <ModbusDeviceSettings device={device} />
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Device not found</p>
        </div>
      )}
    </Main>
  );
};

export default ModbusDeviceDetails;
