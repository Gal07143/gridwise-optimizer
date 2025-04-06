
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import useModbusData from '@/hooks/useModbusData';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import useConnectionStatus from '@/hooks/useConnectionStatus';
import { getModbusDeviceById } from '@/services/modbus/modbusDeviceService';
import { getModbusRegistersByDeviceId } from '@/services/modbus/modbusRegisterService';
import { ModbusDevice, ModbusRegister } from '@/types/modbus';

interface ModbusMonitorProps {
  deviceId: string;
}

const ModbusMonitor: React.FC<ModbusMonitorProps> = ({ deviceId }) => {
  const [device, setDevice] = useState<ModbusDevice | null>(null);
  const [registers, setRegisters] = useState<ModbusRegister[]>([]);
  const [selectedRegister, setSelectedRegister] = useState<ModbusRegister | null>(null);
  const [regValues, setRegValues] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const connectionStatus = useConnectionStatus({
    deviceId: deviceId
  });
  
  const modbusData = useModbusData({
    deviceId,
    register: selectedRegister?.register_address || 0
  });
  
  // Fetch device and register information
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const deviceData = await getModbusDeviceById(deviceId);
        if (!deviceData) {
          throw new Error('Device not found');
        }
        setDevice(deviceData);
        
        const registerData = await getModbusRegistersByDeviceId(deviceId);
        setRegisters(registerData);
        
        if (registerData.length > 0) {
          setSelectedRegister(registerData[0]);
        }
      } catch (err) {
        console.error('Error loading Modbus monitor data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load device data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [deviceId]);
  
  const handleRefreshData = () => {
    if (selectedRegister) {
      modbusData.refetch();
    }
  };
  
  const handleSelectRegister = (register: ModbusRegister) => {
    setSelectedRegister(register);
  };
  
  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="py-10">
          <div className="flex justify-center items-center">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2">Loading Modbus device...</span>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error || !device) {
    return (
      <Card className="w-full border-destructive/20">
        <CardContent className="py-10">
          <div className="flex justify-center items-center text-destructive">
            <AlertCircle className="h-6 w-6 mr-2" />
            <span>{error || 'Device not found'}</span>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Modbus Monitor: {device.name}</CardTitle>
            <CardDescription>IP: {device.ip}:{device.port} - Unit ID: {device.unit_id}</CardDescription>
          </div>
          <div>
            <Badge variant={connectionStatus.isConnected ? "success" : "destructive"}>
              {connectionStatus.isConnected ? 'Connected' : 'Disconnected'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="registers">
          <TabsList className="mb-4">
            <TabsTrigger value="registers">Registers</TabsTrigger>
            <TabsTrigger value="realtime">Real-time Data</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
          </TabsList>
          
          <TabsContent value="registers">
            <div className="grid md:grid-cols-5 gap-4">
              <div className="md:col-span-2 border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Address</TableHead>
                      <TableHead>Name</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registers.map(register => (
                      <TableRow 
                        key={register.id}
                        className={selectedRegister?.id === register.id ? 'bg-muted' : ''}
                        onClick={() => handleSelectRegister(register)}
                      >
                        <TableCell>{register.register_address}</TableCell>
                        <TableCell>{register.register_name}</TableCell>
                      </TableRow>
                    ))}
                    {registers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={2} className="h-24 text-center">
                          No registers configured
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              <div className="md:col-span-3 border rounded-md p-4">
                {selectedRegister ? (
                  <div>
                    <h3 className="font-medium text-lg mb-4">{selectedRegister.register_name}</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-muted-foreground text-sm">Register Address</p>
                        <p className="font-mono">{selectedRegister.register_address}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm">Length</p>
                        <p className="font-mono">{selectedRegister.register_length}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm">Scaling Factor</p>
                        <p className="font-mono">{selectedRegister.scaling_factor}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm">Current Value</p>
                        <div className="flex items-center">
                          <p className="font-mono text-xl">{modbusData.isLoading ? '...' : modbusData.value}</p>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="ml-2" 
                            onClick={handleRefreshData}
                            disabled={modbusData.isLoading}
                          >
                            <RefreshCw className={`h-4 w-4 ${modbusData.isLoading ? 'animate-spin' : ''}`} />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Last updated: {modbusData.lastReadTime?.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-muted-foreground">Select a register to view details</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="realtime">
            <div className="text-center py-10">
              <p className="text-muted-foreground">Real-time monitoring features coming soon</p>
            </div>
          </TabsContent>
          
          <TabsContent value="config">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Connection Settings</h3>
                <div className="grid md:grid-cols-2 gap-4 mt-2">
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-sm">Protocol</p>
                    <p>{device.protocol}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-sm">IP Address</p>
                    <p>{device.ip}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-sm">Port</p>
                    <p>{device.port}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-sm">Unit ID</p>
                    <p>{device.unit_id}</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <div className="w-full flex justify-end">
          <Button variant="outline" onClick={() => connectionStatus.retryConnection?.()}>
            Reconnect
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ModbusMonitor;
