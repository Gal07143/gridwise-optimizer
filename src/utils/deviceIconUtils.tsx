
import React from 'react';
import { DeviceType } from '@/types/energy';
import { Battery, Sun, Wind, Zap, Lightbulb, Wrench, BarChart, Thermometer, MonitorSmartphone, WifiOff } from 'lucide-react';

/**
 * Get an icon component based on device type
 */
export const getDeviceIcon = (deviceType: DeviceType) => {
  // DeviceType is now a string, use string comparison
  if (deviceType === 'battery') {
    return <Battery className="h-5 w-5" />;
  } 
  else if (deviceType === 'solar') {
    return <Sun className="h-5 w-5" />;
  } 
  else if (deviceType === 'wind') {
    return <Wind className="h-5 w-5" />;
  } 
  else if (deviceType === 'grid') {
    return <Zap className="h-5 w-5" />;
  } 
  else if (deviceType === 'load') {
    return <Lightbulb className="h-5 w-5" />;
  } 
  else if (deviceType === 'ev_charger') {
    return <Zap className="h-5 w-5" />;
  } 
  else if (deviceType === 'inverter') {
    return <Wrench className="h-5 w-5" />;
  } 
  else if (deviceType === 'meter') {
    return <BarChart className="h-5 w-5" />;
  } 
  else if (deviceType === 'sensor') {
    return <Thermometer className="h-5 w-5" />;
  } 
  else if (deviceType === 'generator') {
    return <Zap className="h-5 w-5" />;
  } 
  else if (deviceType === 'hydro') {
    return <Zap className="h-5 w-5" />;
  }
  
  // Default for unknown types
  return <MonitorSmartphone className="h-5 w-5" />;
};

/**
 * Get the device icon with a status indicator
 */
export const getStatusAwareDeviceIcon = (deviceType: DeviceType, status: string) => {
  // Status colors
  const statusColor = status === 'online' 
    ? 'text-green-500' 
    : status === 'offline' 
      ? 'text-gray-400'
      : status === 'error' 
        ? 'text-red-500'
        : status === 'warning'
          ? 'text-amber-500'
          : status === 'maintenance'
            ? 'text-blue-500'
            : 'text-gray-400';

  // Use simple string comparison for DeviceType
  if (deviceType === 'battery') {
    return <Battery className={`h-5 w-5 ${statusColor}`} />;
  } 
  else if (deviceType === 'solar') {
    return <Sun className={`h-5 w-5 ${statusColor}`} />;
  } 
  else if (deviceType === 'wind') {
    return <Wind className={`h-5 w-5 ${statusColor}`} />;
  } 
  else if (deviceType === 'grid') {
    return <Zap className={`h-5 w-5 ${statusColor}`} />;
  } 
  else if (deviceType === 'load') {
    return <Lightbulb className={`h-5 w-5 ${statusColor}`} />;
  } 
  else if (deviceType === 'ev_charger') {
    return <Zap className={`h-5 w-5 ${statusColor}`} />;
  } 
  else if (deviceType === 'inverter') {
    return <Wrench className={`h-5 w-5 ${statusColor}`} />;
  } 
  else if (deviceType === 'meter') {
    return <BarChart className={`h-5 w-5 ${statusColor}`} />;
  } 
  else if (deviceType === 'sensor') {
    return <Thermometer className={`h-5 w-5 ${statusColor}`} />;
  }
  
  // Default for unknown types or offline
  return status === 'offline' 
    ? <WifiOff className="h-5 w-5 text-gray-400" />
    : <MonitorSmartphone className={`h-5 w-5 ${statusColor}`} />;
};
