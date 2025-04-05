
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2, Play, Pause, Link2, Link2Off } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import useConnectionStatus from '@/hooks/useConnectionStatus';
import {
  ModbusDevice,
  ModbusRegister
} from '@/types/modbus';
import { getModbusDeviceById } from '@/services/modbus/modbusDeviceService';
import { getModbusRegistersByDeviceId } from '@/services/modbus/modbusRegisterService';

interface ModbusMonitorProps {
  deviceId: string;
}

const ModbusMonitor: React.FC<ModbusMonitorProps> = ({ deviceId }) => {
  const [device, setDevice] = useState<ModbusDevice | null>(null);
  const [registers, setRegisters] = useState<ModbusRegister[]>([]);
  const [selectedRegister, setSelectedRegister] = useState<number | null>(null);
  const [registerValue, setRegisterValue] = useState<number | null>(null);
  const [isPolling, setIsPolling] = useState<boolean>(false);
  const [pollingInterval, setPollingInterval] = useState<number>(1000);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(false);
  
  // Use our hook to get the connection status
  const connection = useConnectionStatus();

  // Handle connection
  const handleConnect = async () => {
    if (!device) return;
    
    try {
      setError(null);
      // In a real implementation, this would connect to the Modbus device
      // For now, let's simulate a successful connection
      setIsOnline(true);
      toast.success(`Connected to ${device.name}`);
    } catch (err) {
      console.error('Connection error:', err);
      setError(`Failed to connect: ${err instanceof Error ? err.message : String(err)}`);
      toast.error(`Connection failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  };
  
  // Handle disconnect
  const handleDisconnect = async () => {
    try {
      // In a real implementation, this would disconnect from the Modbus device
      setIsPolling(false);
      setIsOnline(false);
      toast.info(`Disconnected from ${device?.name || 'device'}`);
    } catch (err) {
      console.error('Disconnect error:', err);
      toast.error(`Disconnect failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const fetchDevice = useCallback(async () => {
    try {
      setError(null);
      const fetchedDevice = await getModbusDeviceById(deviceId);
      if (fetchedDevice) {
        setDevice(fetchedDevice);
      } else {
        setError('Device not found');
        toast.error('Device not found');
      }
    } catch (err) {
      console.error('Error fetching device:', err);
      setError(`Failed to fetch device: ${err instanceof Error ? err.message : String(err)}`);
      toast.error(`Failed to fetch device: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [deviceId]);

  const fetchRegisters = useCallback(async () => {
    if (!deviceId) return;
    try {
      setError(null);
      const fetchedRegisters = await getModbusRegistersByDeviceId(deviceId);
      setRegisters(fetchedRegisters);
    } catch (err) {
      console.error('Error fetching registers:', err);
      setError(`Failed to fetch registers: ${err instanceof Error ? err.message : String(err)}`);
      toast.error(`Failed to fetch registers: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [deviceId]);

  useEffect(() => {
    fetchDevice();
    fetchRegisters();
  }, [fetchDevice, fetchRegisters]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (isPolling && device) {
      intervalId = setInterval(() => {
        // In a real implementation, this would read the register value from the Modbus device
        // For now, let's simulate a random value
        if (selectedRegister !== null) {
          setRegisterValue(Math.floor(Math.random() * 100));
        }
      }, pollingInterval);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPolling, pollingInterval, selectedRegister, device]);

  const handleRegisterSelect = (registerAddress: number) => {
    setSelectedRegister(registerAddress);
    // In a real implementation, this would read the register value from the Modbus device
    // For now, let's simulate a random value
    setRegisterValue(Math.floor(Math.random() * 100));
  };

  const handlePollingToggle = () => {
    setIsPolling(!isPolling);
  };

  const handleIntervalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newInterval = parseInt(event.target.value, 10);
    setPollingInterval(newInterval);
  };

  if (!device) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Modbus Device Monitor</CardTitle>
          <CardDescription>Monitoring and controlling Modbus device registers</CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <div>Loading device...</div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Modbus Device Monitor</CardTitle>
        <CardDescription>Monitoring and controlling Modbus device registers</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold">{device.name}</h3>
          <Badge variant={isOnline ? "outline" : "destructive"}>
            {isOnline ? "Connected" : "Disconnected"}
          </Badge>
          {isOnline ? (
            <Button variant="outline" size="sm" onClick={handleDisconnect}>
              <Link2Off className="h-4 w-4 mr-2" />
              Disconnect
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={handleConnect}>
              <Link2 className="h-4 w-4 mr-2" />
              Connect
            </Button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="pollingInterval">Polling Interval (ms)</Label>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                id="pollingInterval"
                value={pollingInterval}
                onChange={handleIntervalChange}
                disabled={!isOnline}
              />
              <Switch
                id="isPolling"
                checked={isPolling}
                onCheckedChange={handlePollingToggle}
                disabled={!isOnline}
              />
              <Label htmlFor="isPolling" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {isPolling ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isPolling ? "Stop Polling" : "Start Polling"}
              </Label>
            </div>
          </div>
          <div>
            <Label htmlFor="selectedRegister">Select Register</Label>
            <Select onValueChange={(value) => handleRegisterSelect(parseInt(value, 10))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a register" />
              </SelectTrigger>
              <SelectContent>
                {registers.map((register) => (
                  <SelectItem key={register.id} value={register.register_address.toString()}>
                    {register.register_name} (Address: {register.register_address})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {selectedRegister !== null && (
          <div>
            <h4 className="text-sm font-medium">
              Value for Register {selectedRegister}:
            </h4>
            <p className="text-2xl font-bold">
              {registerValue !== null ? registerValue : "N/A"}
            </p>
          </div>
        )}
        <div>
          <h4 className="text-sm font-medium">Available Registers:</h4>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Address</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Length</TableHead>
                  <TableHead>Scale</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registers.map((register) => (
                  <TableRow key={register.id}>
                    <TableCell>{register.register_address}</TableCell>
                    <TableCell>{register.register_name}</TableCell>
                    <TableCell>{register.register_length}</TableCell>
                    <TableCell>{register.scaling_factor}</TableCell>
                  </TableRow>
                ))}
                {registers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                      No registers found. Add registers to monitor this device.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModbusMonitor;
