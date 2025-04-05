
import React from 'react';
import { ArrowUpRight, Battery, Cloud, Loader2, Plug, Sun, Waves, Wind } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricsCard } from '@/components/ui/dashboard/MetricsCard';
import AlertSummaryCard from '@/components/dashboard/AlertSummaryCard';
import CriticalAlertWidget from '@/components/dashboard/CriticalAlertWidget';
import { useRouter } from 'react-router-dom';
import LiveTelemetryChart from '@/components/telemetry/LiveTelemetryChart';
import { Device } from '@/types/energy';

interface DashboardSummaryProps {
  loading?: boolean;
  activeDeviceId?: string;
  solarProduction?: number;
  gridConsumption?: number;
  batteryLevel?: number;
  energySavings?: number;
  devices?: Device[];
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({
  loading = false,
  activeDeviceId,
  solarProduction = 0,
  gridConsumption = 0,
  batteryLevel = 0,
  energySavings = 0,
  devices = [],
}) => {
  const router = useRouter();
  
  const navigateToAlerts = () => {
    router.navigate('/alerts');
  };

  // Find devices by type
  const solarDevice = devices.find(d => d.type === 'solar');
  const batteryDevice = devices.find(d => d.type === 'battery');
  const gridDevice = devices.find(d => d.type === 'grid');
  
  return (
    <div className="space-y-4">
      {/* Critical Alerts Widget */}
      <CriticalAlertWidget onViewAll={navigateToAlerts} />
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {/* Solar Production */}
        <MetricsCard
          title="Solar Production"
          metrics={[
            { value: solarProduction, label: "Current Output (kW)", positive: true }
          ]}
          icon={<Sun className="h-5 w-5" />}
          loading={loading}
        />
        
        {/* Grid Consumption */}
        <MetricsCard
          title="Grid Consumption"
          metrics={[
            { value: gridConsumption, label: "Current Import (kW)" }
          ]}
          icon={<Plug className="h-5 w-5" />}
          loading={loading}
        />
        
        {/* Battery Status */}
        <MetricsCard
          title="Battery Status"
          metrics={[
            { value: batteryLevel, label: "State of Charge (%)" }
          ]}
          icon={<Battery className="h-5 w-5" />}
          loading={loading}
        />
        
        {/* Energy Savings */}
        <MetricsCard
          title="Energy Savings"
          metrics={[
            { value: energySavings, label: "Today's Savings ($)" }
          ]}
          icon={<ArrowUpRight className="h-5 w-5" />}
          loading={loading}
        />
      </div>
      
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        {/* Alert Summary */}
        <Card className="lg:col-span-1 h-full">
          <AlertSummaryCard onViewAll={navigateToAlerts} />
        </Card>
        
        <div className="lg:col-span-2 grid gap-4 grid-cols-1 md:grid-cols-2">
          {/* Solar Panel Telemetry */}
          <Card className="h-96">
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                <Sun className="w-4 h-4 mr-2" />
                Solar Production
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : solarDevice ? (
                <LiveTelemetryChart 
                  deviceId={solarDevice.id} 
                  metric="power"
                  unit="kW"
                  height={250} 
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-64 px-4 text-center">
                  <Sun className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No solar device configured</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Battery Level Telemetry */}
          <Card className="h-96">
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                <Battery className="w-4 h-4 mr-2" />
                Battery Level
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : batteryDevice ? (
                <LiveTelemetryChart 
                  deviceId={batteryDevice.id} 
                  metric="state_of_charge"
                  unit="%"
                  height={250} 
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-64 px-4 text-center">
                  <Battery className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No battery device configured</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardSummary;
