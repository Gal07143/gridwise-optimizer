
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EquipmentParameter } from '@/types/equipment';

interface DeviceOverviewProps {
  deviceId: string;
  deviceName: string;
}

interface DeviceParameterProps {
  name: string;
  value: string;
  unit?: string;
}

const DeviceParameter: React.FC<DeviceParameterProps> = ({ name, value, unit }) => {
  return (
    <div className="grid grid-cols-2 gap-2 border-b py-2 last:border-b-0">
      <div className="text-sm font-medium text-muted-foreground">{name}</div>
      <div className="text-sm text-right">{value} {unit}</div>
    </div>
  );
};

const mockParameters: EquipmentParameter[] = [
  { id: '1', equipment_id: 'demo-device', name: 'Temperature', value: 25, unit: '°C', is_critical: false },
  { id: '2', equipment_id: 'demo-device', name: 'Voltage', value: 220, unit: 'V', is_critical: false },
  { id: '3', equipment_id: 'demo-device', name: 'Current', value: 10, unit: 'A', is_critical: false },
  { id: '4', equipment_id: 'demo-device', name: 'Power Consumption', value: 2.2, unit: 'kW', is_critical: false },
];

// Function to handle the numeric parameter
const formatValue = (value: number | string): string => {
  if (typeof value === 'number') {
    return value.toString();
  }
  return value;
};

export const DeviceOverview: React.FC<DeviceOverviewProps> = ({ deviceId, deviceName }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Device Overview</CardTitle>
        <CardDescription>Overview of device: {deviceName}</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="text-lg font-semibold mb-4">Device Parameters</div>
        <div className="divide-y divide-border">
          {mockParameters.map((param, index) => (
            <DeviceParameter 
              key={index} 
              name={param.name} 
              value={formatValue(param.value)} 
              unit={param.unit} 
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
