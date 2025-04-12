
import React from 'react';
import { Device } from '@/types/device';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LiveTelemetryChart from '@/components/telemetry/LiveTelemetryChart';

interface DeviceTelemetryTabProps {
  device: Device;
}

const DeviceTelemetryTab: React.FC<DeviceTelemetryTabProps> = ({ device }) => {
  // Different metrics to show based on device type
  const getMetricsForDeviceType = (type: string) => {
    switch (type) {
      case 'solar':
        return [
          { metric: 'power', unit: 'W', label: 'Power Output' },
          { metric: 'voltage', unit: 'V', label: 'Voltage' },
          { metric: 'current', unit: 'A', label: 'Current' },
          { metric: 'temperature', unit: '°C', label: 'Temperature' },
        ];
      case 'battery':
        return [
          { metric: 'state_of_charge', unit: '%', label: 'State of Charge' },
          { metric: 'power', unit: 'W', label: 'Power' },
          { metric: 'voltage', unit: 'V', label: 'Voltage' },
          { metric: 'temperature', unit: '°C', label: 'Temperature' },
        ];
      case 'inverter':
        return [
          { metric: 'power', unit: 'W', label: 'Power Output' },
          { metric: 'efficiency', unit: '%', label: 'Efficiency' },
          { metric: 'temperature', unit: '°C', label: 'Temperature' },
          { metric: 'frequency', unit: 'Hz', label: 'AC Frequency' },
        ];
      case 'ev_charger':
        return [
          { metric: 'power', unit: 'W', label: 'Charging Power' },
          { metric: 'energy_delivered', unit: 'kWh', label: 'Energy Delivered' },
          { metric: 'current', unit: 'A', label: 'Current' },
          { metric: 'temperature', unit: '°C', label: 'Temperature' },
        ];
      default:
        return [
          { metric: 'power', unit: 'W', label: 'Power' },
          { metric: 'energy', unit: 'kWh', label: 'Energy' },
        ];
    }
  };

  const metrics = getMetricsForDeviceType(device.type);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Real-time Telemetry</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={metrics[0]?.metric || "power"} className="space-y-4">
            <TabsList>
              {metrics.map((metric) => (
                <TabsTrigger key={metric.metric} value={metric.metric}>
                  {metric.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {metrics.map((metric) => (
              <TabsContent key={metric.metric} value={metric.metric} className="space-y-4">
                <div className="h-[400px] w-full">
                  <LiveTelemetryChart
                    deviceId={device.id}
                    metric={metric.metric}
                    unit={metric.unit}
                    height={350}
                    showSource
                  />
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeviceTelemetryTab;
