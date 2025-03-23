
import React, { useEffect, useState } from 'react';
import { Zap, Battery, Sun, Wind, Activity } from 'lucide-react';
import MetricsCard from '@/components/dashboard/MetricsCard';
import TariffCard from './TariffCard';
import TariffHistoryCard from './TariffHistoryCard';
import ModbusCard from './ModbusCard';
import DeviceManagement from './DeviceManagement';
import FaultSummaryCard from './FaultSummaryCard';
import { useFaults } from '@/hooks/useFaults';
import { createClient } from '@supabase/supabase-js';
import LiveTelemetryChart from './LiveTelemetryChart';
import AlertSummaryCard from './AlertSummaryCard';

// Initialize Supabase client with environment variables
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

const DashboardSummary = () => {
  const { faults } = useFaults();
  const [telemetry, setTelemetry] = useState<any | null>(null);

  useEffect(() => {
    // ✅ Fetch latest telemetry_log record
    const fetchTelemetry = async () => {
      const { data, error } = await supabase
        .from('telemetry_log')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(1)
        .single();

      if (!error) {
        setTelemetry(data);
      }
    };

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Section 1: Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricsCard 
          title="Current Power Flow"
          value={42.8}
          unit="kW"
          changeValue={8.2}
          changeType="increase"
          description="Current system power flow"
          icon={<Zap className="h-5 w-5" />}
          animationDelay="0ms"
          className="shadow-md"
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
          className="shadow-md"
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
          className="shadow-md"
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
          className="shadow-md"
        />
      </div>

      {/* Section 1.5: Live Telemetry Log Widget */}
      {telemetry && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <MetricsCard 
            title="Live Voltage"
            value={telemetry.voltage}
            unit="V"
            description="Latest voltage reading"
            icon={<Activity className="h-5 w-5 text-blue-500" />}
            animationDelay="250ms"
            className="shadow-md"
          />
          <MetricsCard 
            title="Live Current"
            value={telemetry.current}
            unit="A"
            description="Latest current reading"
            icon={<Activity className="h-5 w-5 text-green-500" />}
            animationDelay="300ms"
            className="shadow-md"
          />
          <MetricsCard 
            title="Live Power"
            value={telemetry.power}
            unit="kW"
            description="Real-time power"
            icon={<Zap className="h-5 w-5 text-yellow-500" />}
            animationDelay="350ms"
            className="shadow-md"
          />
        </div>
      )}

      {/* Fault Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <FaultSummaryCard faults={faults} />
      </div>
      {/* Section: Live Charts (Power, Voltage, etc.) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <LiveTelemetryChart deviceId="your-device-id" metric="power" unit="kW" />
        <LiveTelemetryChart deviceId="your-device-id" metric="voltage" unit="V" />
      </div>
      {/* Add after Metrics row */}
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

      <div className="mt-8">
        <DeviceManagement />
      </div>
    </div>
  );
};

export default DashboardSummary;
