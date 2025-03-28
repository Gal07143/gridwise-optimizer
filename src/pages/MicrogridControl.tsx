
import React from 'react';
import { GlassPanel } from '@/components/ui';
import LiveTelemetryChart from '@/components/telemetry/LiveTelemetryChart';
import DashboardCard from '@/components/ui/dashboard/DashboardCard';
import { StatusOverview } from '@/components/dashboard/status';

// Export the index components
export * from './StatusItem';
export * from './StatusOverview';
export * from './StatusSkeleton';

const MicrogridControl = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      <div className="md:col-span-8">
        <GlassPanel className="p-5">
          <h2 className="text-xl font-semibold mb-4">Microgrid Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <LiveTelemetryChart 
              deviceId="microgrid-controller-1"
              metric="power"
              unit="kW"
              height={200}
            />
            <LiveTelemetryChart 
              deviceId="microgrid-controller-1"
              metric="voltage"
              unit="V"
              height={200}
            />
          </div>
        </GlassPanel>
      </div>
      
      <div className="md:col-span-4">
        <StatusOverview />
      </div>
    </div>
  );
};

export default MicrogridControl;
