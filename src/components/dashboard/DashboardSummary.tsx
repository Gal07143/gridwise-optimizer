
import React, { useState, useEffect } from 'react';
import { MetricsCard } from '@/components/ui/dashboard';
import { AlertSummaryCard, LiveTelemetryChart } from '@/components/dashboard';
import { Battery, Sun, Wind, Home } from 'lucide-react';

interface DashboardSummaryProps {
  siteId: string;
}

interface Metric {
  total: number;
  online: number;
  offline: number;
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({ siteId }) => {
  const [metrics, setMetrics] = useState<Record<string, Metric>>({
    solar: { total: 0, online: 0, offline: 0 },
    battery: { total: 0, online: 0, offline: 0 },
    wind: { total: 0, online: 0, offline: 0 },
    load: { total: 0, online: 0, offline: 0 },
  });

  // Mock data that would come from API/database in a real app
  useEffect(() => {
    // This would be a real API call in a production app
    const mockFetchData = () => {
      setMetrics({
        solar: { total: 8, online: 7, offline: 1 },
        battery: { total: 4, online: 4, offline: 0 },
        wind: { total: 2, online: 1, offline: 1 },
        load: { total: 12, online: 10, offline: 2 },
      });
    };

    mockFetchData();
    // In a real app, we would set up an interval to refresh data
  }, [siteId]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricsCard
          title="Solar Production"
          value="12.5"
          unit="kW"
          icon={<Sun className="h-4 w-4" />}
          description={`${metrics.solar.online} of ${metrics.solar.total} inverters online`}
          trend={5}
          trendDescription="vs. yesterday"
          isPositiveTrend={true}
        />
        
        <MetricsCard
          title="Battery Status"
          value="78"
          unit="%"
          icon={<Battery className="h-4 w-4" />}
          description={`Discharging at 2.3 kW`}
          trend={-10}
          trendDescription="remaining capacity"
          isPositiveTrend={false}
        />
        
        <MetricsCard
          title="Wind Generation"
          value="3.2"
          unit="kW"
          icon={<Wind className="h-4 w-4" />}
          description={`${metrics.wind.online} of ${metrics.wind.total} turbines online`}
          trend={12}
          trendDescription="vs. yesterday"
          isPositiveTrend={true}
        />
        
        <MetricsCard
          title="Building Demand"
          value="18.7"
          unit="kW"
          icon={<Home className="h-4 w-4" />}
          description={`Peak today: 22.4 kW`}
          trend={-8}
          trendDescription="vs. yesterday"
          isPositiveTrend={true}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricsCard
              title="Energy Generated Today"
              value="87.5"
              unit="kWh"
              description="Solar: 74.2 kWh, Wind: 13.3 kWh"
              trend={15}
              trendDescription="vs. yesterday"
              isPositiveTrend={true}
            />
            
            <MetricsCard
              title="Energy Consumed Today"
              value="112.8"
              unit="kWh"
              description="Peak hours: 67.5 kWh, Off-peak: 45.3 kWh"
              trend={-7}
              trendDescription="vs. yesterday"
              isPositiveTrend={true}
            />
            
            <MetricsCard
              title="Grid Energy Imported"
              value="38.4"
              unit="kWh"
              description="Cost today: $7.40"
              trend={-22}
              trendDescription="vs. yesterday"
              isPositiveTrend={true}
            />
          </div>
          
          <div className="mt-4 grid grid-cols-1 gap-4">
            <LiveTelemetryChart 
              deviceId="solar-1" 
              metric="power" 
              height={200} 
              title="Solar Power Output"
              unit="kW"
            />
            
            <LiveTelemetryChart 
              deviceId="battery-1" 
              metric="state_of_charge" 
              height={200} 
              title="Battery State of Charge"
              unit="%"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <AlertSummaryCard />

          {/* Placeholder for other cards */}
          <div className="h-64 bg-muted/20 border rounded-lg flex items-center justify-center">
            <span className="text-muted-foreground">Weather Forecast</span>
          </div>
          
          <div className="h-64 bg-muted/20 border rounded-lg flex items-center justify-center">
            <span className="text-muted-foreground">System Notifications</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSummary;
