import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Play,
  Pause,
  AlertTriangle,
  Activity,
  RefreshCw,
  Save,
  Plus,
  Trash,
  UploadIcon,
  DownloadIcon
} from 'lucide-react';
import { useModbusConnection } from '@/hooks/useModbusConnection';
import { useModbusData } from '@/hooks/useModbusData';
import { ModbusDataType } from '@/types/modbus';

interface ModbusMonitorProps {
  deviceId: string;
}

const ModbusMonitor: React.FC<ModbusMonitorProps> = ({ deviceId }) => {
  const { 
    device, 
    loading: deviceLoading, 
    error: deviceError,
    connect,
    disconnect,
    isConnected
  } = useModbusConnection(deviceId);

  const {
    readAddress,
    writeAddress,
    isReading,
    lastData,
    startPolling,
    stopPolling,
    pollingInterval
  } = useModbusData(deviceId);

  const [dataType, setDataType] = useState<ModbusDataType>('holdingRegister');
  const [address, setAddress] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [customInterval, setCustomInterval] = useState<number>(5000);
  const [readValues, setReadValues] = useState<Array<number | boolean>>([]);
  const [writeValue, setWriteValue] = useState<string>('0');
  const [lastReadTimestamp, setLastReadTimestamp] = useState<string | null>(null);

  useEffect(() => {
    if (lastData) {
      setLastReadTimestamp(lastData.timestamp);
    }
  }, [lastData]);

  const handleConnect = async () => {
    if (!device) return;
    
    if (isConnected) {
      await disconnect();
    } else {
      await connect();
    }
  };

  const handleReadClick = async () => {
    if (!isConnected) {
      toast.error('Not connected to device. Please connect first.');
      return;
    }
    
    try {
      const result = await readAddress(dataType, address, { quantity });
      if (Array.isArray(result)) {
        setReadValues(result);
      } else {
        setReadValues([result]);
      }
      setLastReadTimestamp(new Date().toISOString());
    } catch (err: any) {
      toast.error(`Read error: ${err.message}`);
    }
  };

  const handleWriteClick = async () => {
    if (!isConnected) {
      toast.error('Not connected to device. Please connect first.');
      return;
    }
    
    if (dataType !== 'holdingRegister' && dataType !== 'coil') {
      toast.error('Can only write to holding registers or coils');
      return;
    }
    
    try {
      let value: number | boolean;
      
      if (dataType === 'coil') {
        value = writeValue === '1' || writeValue.toLowerCase() === 'true';
      } else {
        value = parseInt(writeValue);
        if (isNaN(value)) {
          toast.error('Invalid numeric value');
          return;
        }
      }
      
      await writeAddress(dataType, address, value);
      toast.success('Write operation successful');
      
      // Re-read the values to get the updated state
      handleReadClick();
    } catch (err: any) {
      toast.error(`Write error: ${err.message}`);
    }
  };

  const handleStartPolling = () => {
    if (!isConnected) {
      toast.error('Not connected to device. Please connect first.');
      return;
    }
    
    startPolling(customInterval);
    toast.success(`Started polling every ${customInterval/1000} seconds`);
  };

  const handleStopPolling = () => {
    stopPolling();
    toast.info('Stopped polling');
  };

  if (deviceLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Modbus Monitor</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  if (deviceError || !device) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Modbus Monitor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-8">
            <AlertTriangle className="h-10 w-10 text-amber-500 mr-2" />
            <span>Error loading device information</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Modbus Monitor: {device.name}</CardTitle>
            <CardDescription>
              {device.description || `${device.protocol} device at Unit ID ${device.unitId}`}
            </CardDescription>
          </div>
          <Button
            onClick={handleConnect}
            variant={isConnected ? 'destructive' : 'default'}
          >
            {isConnected ? 'Disconnect' : 'Connect'}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="bg-primary-foreground p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Device Info</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <div>
              <p className="text-sm text-muted-foreground">Protocol</p>
              <p className="font-medium">{device.protocol}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Unit ID</p>
              <p className="font-medium">{device.unitId}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Connection</p>
              <Badge variant={isConnected ? "success" : "secondary"}>
                {isConnected ? "Connected" : "Disconnected"}
              </Badge>
            </div>
            
            {device.protocol === 'TCP' && (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Host</p>
                  <p className="font-medium">{device.host}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Port</p>
                  <p className="font-medium">{device.port}</p>
                </div>
              </>
            )}
            
            {(device.protocol === 'RTU' || device.protocol === 'ASCII') && (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Serial Port</p>
                  <p className="font-medium">{device.serialPort}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Baud Rate</p>
                  <p className="font-medium">{device.baudRate}</p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium mb-2">Manual Read/Write</h3>
            <div className="space-y-4 p-4 border rounded-lg">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm text-muted-foreground">Data Type</label>
                  <Select
                    value={dataType}
                    onValueChange={(value) => setDataType(value as ModbusDataType)}
                    disabled={!isConnected}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select data type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="holdingRegister">Holding Register (03)</SelectItem>
                      <SelectItem value="inputRegister">Input Register (04)</SelectItem>
                      <SelectItem value="coil">Coil (01)</SelectItem>
                      <SelectItem value="discreteInput">Discrete Input (02)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground">Address</label>
                  <Input
                    type="number"
                    min="0"
                    max="65535"
                    value={address}
                    onChange={(e) => setAddress(parseInt(e.target.value))}
                    disabled={!isConnected}
                  />
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground">Quantity</label>
                  <Input
                    type="number"
                    min="1"
                    max="125"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    disabled={!isConnected}
                  />
                </div>
                
                <div className="flex items-end">
                  <Button
                    onClick={handleReadClick}
                    disabled={!isConnected || isReading}
                    className="w-full"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Read
                  </Button>
                </div>
                
                {(dataType === 'holdingRegister' || dataType === 'coil') && (
                  <>
                    <div>
                      <label className="text-sm text-muted-foreground">Write Value</label>
                      <Input
                        value={writeValue}
                        onChange={(e) => setWriteValue(e.target.value)}
                        disabled={!isConnected}
                      />
                    </div>
                    
                    <div className="flex items-end">
                      <Button
                        onClick={handleWriteClick}
                        disabled={!isConnected}
                        variant="secondary"
                        className="w-full"
                      >
                        <UploadIcon className="w-4 h-4 mr-2" />
                        Write
                      </Button>
                    </div>
                  </>
                )}
              </div>
              
              <div className="border rounded p-2 min-h-24 bg-secondary/20">
                <p className="text-sm text-muted-foreground mb-1">Read Values:</p>
                {readValues.length > 0 ? (
                  <div className="grid gap-2 grid-cols-4">
                    {readValues.map((value, index) => (
                      <Badge key={index} variant="outline" className="justify-between">
                        <span className="mr-1">{address + index}:</span>
                        <span className="font-mono">{value.toString()}</span>
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No data</p>
                )}
                {lastReadTimestamp && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Last read: {new Date(lastReadTimestamp).toLocaleTimeString()}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Polling</h3>
            <div className="space-y-4 p-4 border rounded-lg">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm text-muted-foreground">Interval (ms)</label>
                  <Input
                    type="number"
                    min="500"
                    step="100"
                    value={customInterval}
                    onChange={(e) => setCustomInterval(parseInt(e.target.value))}
                    disabled={!!pollingInterval}
                  />
                </div>
                
                <div className="flex items-end">
                  {pollingInterval ? (
                    <Button
                      onClick={handleStopPolling}
                      variant="outline"
                      className="w-full"
                    >
                      <Pause className="w-4 h-4 mr-2" />
                      Stop Polling
                    </Button>
                  ) : (
                    <Button
                      onClick={handleStartPolling}
                      disabled={!isConnected}
                      className="w-full"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Polling
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="border rounded p-2">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">Polling Status</p>
                  {pollingInterval && (
                    <Badge variant="outline" className="bg-green-100 dark:bg-green-900/30">
                      <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-1 animate-pulse"></span>
                      Active ({pollingInterval / 1000}s)
                    </Badge>
                  )}
                </div>
                
                {lastData && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      Last update: {new Date(lastData.timestamp).toLocaleTimeString()}
                    </p>
                    
                    <div className="max-h-40 overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-1/2">Data Point</TableHead>
                            <TableHead className="w-1/2">Value</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Object.entries(lastData.values).map(([key, value]) => (
                            <TableRow key={key}>
                              <TableCell className="py-1 text-sm">{key}</TableCell>
                              <TableCell className="py-1 text-sm font-mono">{String(value)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div className="flex items-center text-xs text-muted-foreground">
          <Activity className="w-3 h-3 mr-1" />
          {isConnected ? 'Connected and ready' : 'Not connected'}
        </div>
        
        <div className="flex space-x-2">
          <Button size="sm" variant="outline">
            <DownloadIcon className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Save className="w-4 h-4 mr-2" />
            Save Config
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ModbusMonitor;
