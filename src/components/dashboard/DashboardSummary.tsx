
import React, { useEffect, useState } from 'react';
import { Zap, Battery, Sun, Wind, Activity } from 'lucide-react';
import MetricsCard from '@/components/dashboard/MetricsCard';
import TariffCard from './TariffCard';
import TariffHistoryCard from './TariffHistoryCard';
import ModbusCard from './ModbusCard';
import DeviceManagement from './DeviceManagement';
import FaultSummaryCard from './FaultSummaryCard';
import LiveTelemetryChart from './LiveTelemetryChart';
import AlertSummaryCard from './AlertSummaryCard';

// Mock telemetry data
const mockTelemetry = {
  power: 6.2,
  voltage: 240.3,
  current: 25.8,
  temperature: 43.2,
  timestamp: new Date().toISOString()
};

// Mock faults data
const mockFaults = [
  {
    id: 'fault-1',
    title: 'Inverter Overheating',
    description: 'Inverter temperature exceeds normal operating range',
    severity: 'critical',
    timestamp: new Date().toISOString(),
    status: 'active',
    device: { id: 'dev-1', name: 'Inverter 1' }
  },
  {
    id: 'fault-2',
    title: 'Low Battery Voltage',
    description: 'Battery voltage below recommended threshold',
    severity: 'warning',
    timestamp: new Date().toISOString(),
    status: 'acknowledged',
    device: { id: 'dev-2', name: 'Battery Storage' }
  },
  {
    id: 'fault-3',
    title: 'Communication Loss',
    description: 'Lost communication with solar controller',
    severity: 'warning',
    timestamp: new Date().toISOString(),
    status: 'active',
    device: { id: 'dev-3', name: 'Solar Controller' }
  }
] as const;

const DashboardSummary = () => {
  const [telemetry, setTelemetry] = useState<any | null>(mockTelemetry);

  useEffect(() => {
    // In a real implementation, this would subscribe to telemetry events
    const interval = setInterval(() => {
      // Update with slightly different values to simulate real-time changes
      setTelemetry({
        power: mockTelemetry.power + (Math.random() * 0.4 - 0.2),
        voltage: mockTelemetry.voltage + (Math.random() * 2 - 1),
        current: mockTelemetry.current + (Math.random() * 0.6 - 0.3),
        temperature: mockTelemetry.temperature + (Math.random() * 0.2 - 0.1),
        timestamp: new Date().toISOString()
      });
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricsCard 
          title="Current Power Flow"
          value={telemetry ? telemetry.power : '—'}
          unit="kW"
          changeValue={8.2}
          changeType="increase"
          description="Current system power flow"
          icon={<Zap className="h-5 w-5" />}
          animationDelay="0ms"
        />
        <MetricsCard 
          title="Solar Generation" 
          value={215.6}
          unit="kWh"
          changeValue={24.3}
          changeType="increase"
          description="Energy generated today"
          icon={<Sun className="h-5 w-5" />}
          animationDelay="100ms"
        />
        <MetricsCard 
          title="Wind Generation" 
          value={118.3}
          unit="kWh"
          changeValue={12.5}
          changeType="increase"
          description="Wind power today"
          icon={<Wind className="h-5 w-5" />}
          animationDelay="150ms"
        />
        <MetricsCard 
          title="Battery Storage"
          value={68}
          unit="%"
          changeValue={3.5}
          changeType="decrease"
          description="Current battery level"
          icon={<Battery className="h-5 w-5" />}
          animationDelay="200ms"
        />
      </div>

      {/* Live Telemetry Metrics */}
      {telemetry && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <MetricsCard 
            title="Live Voltage"
            value={telemetry.voltage}
            unit="V"
            description="Latest voltage reading"
            icon={<Activity className="h-5 w-5 text-blue-500" />}
            animationDelay="250ms"
          />
          <MetricsCard 
            title="Live Current"
            value={telemetry.current}
            unit="A"
            description="Latest current reading"
            icon={<Activity className="h-5 w-5 text-green-500" />}
            animationDelay="300ms"
          />
          <MetricsCard 
            title="Live Power"
            value={telemetry.power}
            unit="kW"
            description="Real-time power"
            icon={<Zap className="h-5 w-5 text-yellow-500" />}
            animationDelay="350ms"
          />
        </div>
      )}

      {/* Fault Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <FaultSummaryCard faults={mockFaults} />
      </div>

      {/* Live Telemetry Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <LiveTelemetryChart deviceId="your-device-id" metric="power" unit="kW" />
        <LiveTelemetryChart deviceId="your-device-id" metric="voltage" unit="V" />
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <AlertSummaryCard />
      </div>

      {/* Modbus / Quality */}
      <div className="space-y-4 mb-8">
        <ModbusCard />
      </div>

      {/* Tariff Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <TariffCard />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <TariffHistoryCard />
      </div>

      {/* Device Management */}
      <div className="mt-8">
        <DeviceManagement />
      </div>
    </div>
  );
};

export default DashboardSummary;
