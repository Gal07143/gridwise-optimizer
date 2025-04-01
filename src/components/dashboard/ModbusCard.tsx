
import React from 'react';
import { useModbusReadings } from '@/hooks/useModbusReadings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gauge, Activity, AlertTriangle } from 'lucide-react';

const ModbusCard = () => {
  const { readings, loading } = useModbusReadings(1); // get the latest reading

  if (loading) {
    return (
      <Card className="shadow">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Gauge className="mr-2 h-5 w-5" />
            Modbus Readings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!readings || readings.length === 0) {
    return (
      <Card className="shadow">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Gauge className="mr-2 h-5 w-5" />
            Modbus Readings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-6 text-center text-muted-foreground">
            <div className="flex flex-col items-center">
              <AlertTriangle className="h-10 w-10 text-amber-500 mb-2" />
              <p>No Modbus data available</p>
              <p className="text-sm">Check device connection or configuration</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const latest = readings[0];

  return (
    <Card className="shadow">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Gauge className="mr-2 h-5 w-5" />
          Modbus Readings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Device</p>
            <p className="font-medium">{latest.device_id}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Voltage</p>
            <p className="font-medium">{latest.voltage} V</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Current</p>
            <p className="font-medium">{latest.current} A</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Power</p>
            <p className="font-medium">{latest.power_kw} kW</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-muted-foreground">Energy</p>
            <p className="font-medium">{latest.energy_kwh} kWh</p>
          </div>
        </div>
        <div className="flex items-center mt-4 text-xs text-muted-foreground">
          <Activity className="h-3 w-3 mr-1" />
          <p>Last updated: {new Date(latest.timestamp).toLocaleString()}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModbusCard;
