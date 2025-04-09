
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Battery, BatteryCharging, Zap, ZapOff, WifiOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Device } from '@/types/device';

interface DeviceStatusWidgetProps {
  devices: Device[];
  className?: string;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'online':
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case 'offline':
      return <WifiOff className="h-4 w-4 text-gray-500" />;
    case 'error':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case 'warning':
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    case 'charging':
      return <BatteryCharging className="h-4 w-4 text-green-500" />;
    case 'discharging':
      return <Battery className="h-4 w-4 text-amber-500" />;
    case 'active':
      return <Zap className="h-4 w-4 text-blue-500" />;
    case 'idle':
      return <ZapOff className="h-4 w-4 text-gray-400" />;
    default:
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
  }
};

const getTypeColor = (type: string) => {
  const colorMap: Record<string, string> = {
    'solar': 'bg-yellow-100 text-yellow-800',
    'battery': 'bg-green-100 text-green-800',
    'grid': 'bg-blue-100 text-blue-800',
    'load': 'bg-purple-100 text-purple-800',
    'ev_charger': 'bg-cyan-100 text-cyan-800',
    'inverter': 'bg-red-100 text-red-800',
    'meter': 'bg-indigo-100 text-indigo-800',
    'wind': 'bg-sky-100 text-sky-800',
    'generator': 'bg-orange-100 text-orange-800',
    'hydro': 'bg-teal-100 text-teal-800',
    'light': 'bg-amber-100 text-amber-800'
  };
  
  return colorMap[type] || 'bg-gray-100 text-gray-800';
};

const DeviceStatusWidget = ({ devices = [], className = '' }: DeviceStatusWidgetProps) => {
  // Count devices by status
  const statusCounts = devices.reduce((acc, device) => {
    acc[device.status] = (acc[device.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Total devices
  const totalDevices = devices.length;
  
  // Calculate online percentage
  const onlineCount = statusCounts['online'] || 0;
  const onlinePercentage = totalDevices > 0 ? Math.round((onlineCount / totalDevices) * 100) : 0;
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          Device Status
          <span className="text-sm font-normal text-muted-foreground">
            {onlineCount} of {totalDevices} online
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between mb-2 text-sm">
            <span>System Health</span>
            <span>{onlinePercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full ${
                onlinePercentage > 80 ? 'bg-green-500' : 
                onlinePercentage > 50 ? 'bg-yellow-500' : 
                'bg-red-500'
              }`} 
              style={{ width: `${onlinePercentage}%` }}
            ></div>
          </div>
        </div>
        
        <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
          {devices.slice(0, 6).map(device => (
            <div key={device.id} className="flex justify-between items-center border-b border-gray-100 pb-2">
              <div className="flex items-center">
                <div className="mr-3">
                  {getStatusIcon(device.status)}
                </div>
                <div>
                  <div className="font-medium">{device.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {device.location || 'No location'}
                  </div>
                </div>
              </div>
              <span className={`text-xs py-1 px-2 rounded-full ${getTypeColor(device.type)}`}>
                {device.type.replace('_', ' ')}
              </span>
            </div>
          ))}
          
          {devices.length > 6 && (
            <div className="text-center text-sm text-muted-foreground pt-2">
              +{devices.length - 6} more devices
            </div>
          )}
          
          {devices.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No devices found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceStatusWidget;
