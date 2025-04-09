
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ModbusDevice } from '@/types/modbus';
import useConnectionStatus from '@/hooks/useConnectionStatus';
import { HardDrive, AlertCircle, Check, Clock } from 'lucide-react';

interface ModbusDeviceCardProps {
  device: ModbusDevice;
  onClick?: () => void; // Make onClick optional
}

const ModbusDeviceCard: React.FC<ModbusDeviceCardProps> = ({ device, onClick }) => {
  const { isOnline, isConnected } = useConnectionStatus({
    deviceId: device.id,
    initialStatus: device.is_active || false
  });

  const getStatusIcon = () => {
    if (!isOnline) {
      return <AlertCircle className="w-4 h-4 text-destructive" />;
    }

    if (isConnected) {
      return <Check className="w-4 h-4 text-success" />;
    }

    return <Clock className="w-4 h-4 text-amber-500" />;
  };

  const getStatusText = () => {
    if (!isOnline) {
      return 'Offline';
    }

    if (isConnected) {
      return 'Connected';
    }

    return 'Ready';
  };

  return (
    <Card className={`hover:shadow-md transition-shadow ${onClick ? 'cursor-pointer' : ''}`} onClick={onClick}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center justify-between">
          <div className="flex items-center">
            <HardDrive className="w-4 h-4 mr-2" /> 
            {device.name}
          </div>
          <Badge 
            variant={isConnected ? "success" : isOnline ? "outline" : "destructive"} 
            className="flex items-center gap-1 ml-2"
          >
            {getStatusIcon()}
            <span>{getStatusText()}</span>
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground grid grid-cols-2 gap-1">
          <div>IP: <span className="font-mono">{device.ip_address || device.ip}</span></div>
          <div>Port: <span className="font-mono">{device.port}</span></div>
          <div>Unit ID: <span className="font-mono">{device.unit_id}</span></div>
          {device.protocol && <div>Protocol: <span className="font-mono">{device.protocol}</span></div>}
          {device.description && <div className="col-span-2 truncate">
            Description: {device.description}
          </div>}
        </div>
      </CardContent>
    </Card>
  );
};

export default ModbusDeviceCard;
