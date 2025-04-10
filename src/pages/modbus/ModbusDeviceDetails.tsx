
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getModbusDeviceById, getDeviceRegisters } from '@/services/modbus/modbusService';
import { ModbusDevice, ModbusRegister } from '@/types/modbus';
import { PageHeader } from '@/components/ui/page-header';
import { Activity, ArrowLeft, Download, UploadCloud, Save, Trash2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const ModbusDeviceDetails = () => {
  const { deviceId } = useParams<{ deviceId: string }>();
  const navigate = useNavigate();
  const [device, setDevice] = useState<ModbusDevice | null>(null);
  const [registers, setRegisters] = useState<ModbusRegister[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (deviceId) {
      fetchDeviceDetails();
    }
  }, [deviceId]);

  const fetchDeviceDetails = async () => {
    try {
      setLoading(true);
      const deviceData = await getModbusDeviceById(deviceId!);
      if (deviceData) {
        setDevice(deviceData);
        // Also fetch registers
        const registersData = await getDeviceRegisters(deviceId!);
        setRegisters(registersData);
      } else {
        toast.error('Device not found');
        navigate('/modbus/devices');
      }
    } catch (error) {
      toast.error('Failed to load device details');
      console.error('Error fetching device:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!device) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p>Device not found</p>
              <Button variant="outline" className="mt-4" onClick={() => navigate('/modbus/devices')}>
                Back to Devices
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header with back button */}
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={() => navigate('/modbus/devices')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Devices
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={fetchDeviceDetails}>
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh
          </Button>
          <Button variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" /> Delete Device
          </Button>
        </div>
      </div>

      <PageHeader 
        title={device.name} 
        description="Modbus device configuration and monitoring"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Device Information Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Device Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Status</span>
              <Badge variant={device.status === 'online' ? 'success' : 'secondary'} className="flex items-center">
                <Activity className="h-3 w-3 mr-1" /> {device.status}
              </Badge>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Connection</span>
              <span className="font-medium">{device.ip_address || device.ip}:{device.port}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Protocol</span>
              <span className="font-medium">{device.protocol}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Unit ID</span>
              <span className="font-medium">{device.slave_id || device.unit_id || 1}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Description</span>
              <span className="font-medium">{device.description || 'No description'}</span>
            </div>

            <div className="pt-4 space-y-2">
              <Button className="w-full">
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <UploadCloud className="mr-2 h-4 w-4" /> Import Map
                </Button>
                <Button variant="outline" className="flex-1">
                  <Download className="mr-2 h-4 w-4" /> Export Map
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for different sections */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="registers">Registers</TabsTrigger>
              <TabsTrigger value="monitor">Monitor</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Device Overview</CardTitle>
                  <CardDescription>Summary of device registers and recent activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm">
                      This Modbus device has {registers.length} configured registers.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      You can monitor live values, configure register mappings, and export data using the tabs above.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="registers" className="space-y-4 mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Register Mappings</CardTitle>
                    <CardDescription>Configure Modbus register mappings for this device</CardDescription>
                  </div>
                  <Button>Add Register</Button>
                </CardHeader>
                <CardContent>
                  {registers.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Address</TableHead>
                          <TableHead>Length</TableHead>
                          <TableHead>Scale</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {registers.map((register) => (
                          <TableRow key={register.register_address}>
                            <TableCell>{register.register_name}</TableCell>
                            <TableCell>{register.register_address}</TableCell>
                            <TableCell>{register.register_length}</TableCell>
                            <TableCell>{register.scaleFactor || 1}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No registers configured</p>
                      <Button variant="outline" className="mt-4">Add First Register</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="monitor" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Live Monitoring</CardTitle>
                  <CardDescription>Monitor register values in real-time</CardDescription>
                </CardHeader>
                <CardContent>
                  {registers.length > 0 ? (
                    <div>
                      <p className="mb-4 text-sm">Click "Start Monitoring" to view live data from this device</p>
                      <Button>Start Monitoring</Button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Configure registers first to monitor them</p>
                      <Button variant="outline" className="mt-4" onClick={() => setActiveTab('registers')}>
                        Configure Registers
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ModbusDeviceDetails;
