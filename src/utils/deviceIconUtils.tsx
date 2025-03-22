
import React from 'react';
import { 
  Battery, 
  Sun, 
  Wind, 
  Zap, 
  Activity,
  BatteryCharging,
  Settings,
  BarChart2,
  Lightbulb,
  Droplets,
  Power
} from 'lucide-react';
import { DeviceType, DeviceStatus } from '@/types/energy';

export const getDeviceIcon = (type: DeviceType) => {
  switch (type) {
    case 'battery':
      return <Battery className="h-6 w-6 text-blue-500" />;
    case 'solar':
      return <Sun className="h-6 w-6 text-yellow-500" />;
    case 'wind':
      return <Wind className="h-6 w-6 text-teal-500" />;
    case 'grid':
      return <Zap className="h-6 w-6 text-purple-500" />;
    case 'load':
      return <Activity className="h-6 w-6 text-red-500" />;
    case 'ev_charger':
      return <BatteryCharging className="h-6 w-6 text-green-500" />;
    case 'inverter':
      return <Settings className="h-6 w-6 text-indigo-500" />;
    case 'meter':
      return <BarChart2 className="h-6 w-6 text-orange-500" />;
    case 'light':
      return <Lightbulb className="h-6 w-6 text-yellow-400" />;
    case 'generator':
      return <Power className="h-6 w-6 text-gray-500" />;
    case 'hydro':
      return <Droplets className="h-6 w-6 text-blue-400" />;
    default:
      return <Settings className="h-6 w-6 text-gray-500" />;
  }
};

export const getStatusBadgeClass = (status: DeviceStatus): string => {
  switch (status) {
    case 'online':
      return 'bg-green-500';
    case 'offline':
      return 'text-gray-500 border-gray-300';
    case 'maintenance':
      return 'bg-blue-500';
    case 'error':
      return 'bg-red-500';
    case 'warning':
      return 'bg-amber-500';
    case 'idle':
      return 'bg-gray-400';
    case 'active':
      return 'bg-green-600';
    case 'charging':
      return 'bg-blue-400';
    case 'discharging':
      return 'bg-purple-500';
    default:
      return 'bg-gray-500';
  }
};

export const getStatusDisplayName = (status: DeviceStatus): string => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};
