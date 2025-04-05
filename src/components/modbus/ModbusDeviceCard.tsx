import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  ServerIcon, 
  PlugZap, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ChevronRight,
  Settings 
} from 'lucide-react';
import { ModbusDeviceConfig } from '@/types/modbus';
import { formatDistanceToNow } from 'date-fns';

interface ModbusDeviceCardProps {
  device: ModbusDeviceConfig;
  onClick?: () => void;
}

const ModbusDeviceCard: React.FC<ModbusDeviceCardProps> = ({ device, onClick }) => {
  const navigate = useNavigate();
  
  const getStatusBadge = () => {
    switch (device.status) {
      case 'online':
        return (
          <Badge variant="success" className="ml-2">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Online
          </Badge>
        );
      case 'offline':
        return (
          <Badge variant="secondary" className="ml-2">
            <XCircle className="w-3 h-3 mr-1" />
            Offline
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="destructive" className="ml-2">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Error
          </Badge>
        );
      case 'connecting':
        return (
          <Badge variant="outline" className="ml-2">
            <span className="animate-pulse mr-1">⚡</span>
            Connecting
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="ml-2">
            <Clock className="w-3 h-3 mr-1" />
            Unknown
          </Badge>
        );
    }
  };

  const getProtocolBadge = () => {
    switch (device.protocol) {
      case 'TCP':
        return <Badge variant="outline">Modbus TCP</Badge>;
      case 'RTU':
        return <Badge variant="outline">Modbus RTU</Badge>;
      case 'ASCII':
        return <Badge variant="outline">Modbus ASCII</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getLastConnectedText = () => {
    if (!device.lastConnected) {
      return 'Never connected';
    }
    return `Last connected ${formatDistanceToNow(new Date(device.lastConnected))} ago`;
  };

  const handleViewDetails = () => {
    navigate(`/modbus/devices/${device.id}`);
  };

  const handleConfigure = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/modbus/devices/${device.id}/configure`);
  };

  return (
    <Card 
      className={`
        transition-all duration-200 hover:shadow-md
        ${device.status === 'online' ? 'border-green-200' : ''}
        ${device.status === 'error' ? 'border-red-200' : ''}
      `}
      onClick={onClick || handleViewDetails}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <ServerIcon className="w-5 h-5 mr-2 text-muted-foreground" />
            <CardTitle className="text-lg">{device.name}</CardTitle>
          </div>
          {getStatusBadge()}
        </div>
        <CardDescription className="flex items-center justify-between">
          <div>ID: {device.id.slice(0, 8)}</div>
          {getProtocolBadge()}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="space-y-2 text-sm">
          {device.protocol === 'TCP' && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Host:</span>
              <span className="font-medium">{device.host}:{device.port}</span>
            </div>
          )}
          
          {(device.protocol === 'RTU' || device.protocol === 'ASCII') && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Serial Port:</span>
              <span className="font-medium">{device.serialPort}</span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Unit ID:</span>
            <span className="font-medium">{device.unitId}</span>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-muted-foreground">Connection Status:</span>
              <span className="font-medium">{getLastConnectedText()}</span>
            </div>
            <Progress 
              value={device.status === 'online' ? 100 : 0} 
              variant={device.status === 'online' ? 'success' : 'default'} 
            />
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        <div className="flex w-full justify-between gap-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={handleConfigure}>
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
          <Button size="sm" className="flex-1">
            Connect
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ModbusDeviceCard;
