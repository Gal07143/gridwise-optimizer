
import React from 'react';
import { 
  Battery, Sun, Wind, Cable, PanelTop, Zap, Gauge, PlugZap, Power, 
  Thermometer, Droplet, Radio, Wifi, LampDesk, Zap as LightningBolt
} from 'lucide-react';
import { DeviceType } from '@/types/energy';

/**
 * Get an icon component for the given device type
 */
export const getDeviceIcon = (type: DeviceType): React.ReactNode => {
  // Type is a string, so we use string comparison
  if (type === 'battery' || type === 'battery_system') {
    return <Battery className="h-5 w-5" />;
  }
  else if (type === 'solar' || type === 'solar_panel' || type === 'solar_inverter') {
    return <Sun className="h-5 w-5" />;
  }
  else if (type === 'wind' || type === 'wind_turbine') {
    return <Wind className="h-5 w-5" />;
  }
  else if (type === 'grid') {
    return <Cable className="h-5 w-5" />;
  }
  else if (type === 'load' || type === 'smart_plug') {
    return <PanelTop className="h-5 w-5" />;
  }
  else if (type === 'ev_charger') {
    return <PlugZap className="h-5 w-5" />;
  }
  else if (type === 'inverter' || type === 'hybrid_inverter' || type === 'battery_inverter') {
    return <Zap className="h-5 w-5" />;
  }
  else if (type === 'meter' || type === 'smart_meter' || type === 'energy_meter') {
    return <Gauge className="h-5 w-5" />;
  }
  else if (type === 'sensor' || type === 'weather_station') {
    return <Thermometer className="h-5 w-5" />;
  }
  else if (type === 'generator') {
    return <Power className="h-5 w-5" />;
  }
  else if (type === 'hydro') {
    return <Droplet className="h-5 w-5" />;
  }
  else if (type === 'light') {
    return <LampDesk className="h-5 w-5" />;
  }
  
  // Default icon for unknown types
  return <Radio className="h-5 w-5" />;
};

/**
 * Get an icon for the connection status of a device
 */
export const getConnectionIcon = (status: string): React.ReactNode => {
  if (status === 'online') {
    return <Wifi className="h-4 w-4 text-green-500" />;
  } else {
    return <Wifi className="h-4 w-4 text-red-500" />;
  }
};

/**
 * Get a color for the given device type
 */
export const getDeviceTypeColor = (type: DeviceType): string => {
  // Type is a string, so we use string comparison
  if (type === 'battery') {
    return 'bg-blue-100 text-blue-800 border-blue-300';
  } 
  else if (type === 'solar') {
    return 'bg-yellow-100 text-yellow-800 border-yellow-300';
  } 
  else if (type === 'wind') {
    return 'bg-cyan-100 text-cyan-800 border-cyan-300';
  } 
  else if (type === 'grid') {
    return 'bg-purple-100 text-purple-800 border-purple-300';
  } 
  else if (type === 'load') {
    return 'bg-rose-100 text-rose-800 border-rose-300';
  }
  else if (type === 'ev_charger') {
    return 'bg-green-100 text-green-800 border-green-300';
  }
  else if (type === 'inverter') {
    return 'bg-orange-100 text-orange-800 border-orange-300';
  }
  else if (type === 'meter') {
    return 'bg-slate-100 text-slate-800 border-slate-300';
  }
  else if (type === 'sensor') {
    return 'bg-indigo-100 text-indigo-800 border-indigo-300';
  }
  
  // Default color
  return 'bg-gray-100 text-gray-800 border-gray-300';
};
