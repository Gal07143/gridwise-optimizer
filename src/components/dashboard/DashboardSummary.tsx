
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricsCard } from '@/components/ui/dashboard';
import { FaultSummaryCard } from '@/components/dashboard';
import { AlertSummaryCard } from '@/components/dashboard';
import { LiveTelemetryChart } from '@/components/telemetry';
import { TariffCard, TariffHistoryCard } from '@/components/dashboard';
import { DeviceManagement } from '@/components/dashboard';
import { Battery, Sun, Wind } from 'lucide-react';

// Define a Fault interface if not already defined
interface Fault {
  id: string;
  device_id: string;
  timestamp: string;
  description: string;
  severity: string;
  status: string;
  resolved_at?: string;
}

const DashboardSummary = () => {
  const [faults, setFaults] = useState<Fault[]>([]);
  const [activeFault, setActiveFault] = useState<Fault | null>(null);
  
  useEffect(() => {
    // Simulate fetching faults
    const fetchFaults = async () => {
      // Mock data
      const mockFaults = [
        {
          id: '1',
          device_id: 'batt-01',
          timestamp: new Date().toISOString(),
          description: 'Battery temperature exceeds normal range',
          severity: 'medium',
          status: 'open',
        },
        {
          id: '2',
          device_id: 'inv-03',
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          description: 'Inverter efficiency below expected threshold',
          severity: 'low',
          status: 'open',
        }
      ];
      
      setFaults(mockFaults);
    };
    
    fetchFaults();
  }, []);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {/* Energy Production Summary */}
      <MetricsCard
        title="Total Energy Production"
        value="126.5 kWh"
        change={"+12.3%"}
        changeType="positive"
        description="vs. previous day"
        className="md:col-span-1"
      />
      
      {/* Energy Consumption Summary */}
      <MetricsCard
        title="Energy Consumption"
        value="98.2 kWh"
        change={"-5.7%"}
        changeType="positive"
        description="vs. previous day"
        className="md:col-span-1"
      />
      
      {/* Solar Production */}
      <MetricsCard
        title="Solar Production"
        value="82.4 kWh"
        icon={<Sun className="h-5 w-5" />}
        change={"+15.2%"}
        changeType="positive"
        className="md:col-span-1"
      />
      
      {/* Wind Production */}
      <MetricsCard
        title="Wind Production"
        value="44.1 kWh"
        icon={<Wind className="h-5 w-5" />}
        change={"+8.9%"}
        changeType="positive"
        className="md:col-span-1"
      />
      
      {/* Battery Status */}
      <MetricsCard
        title="Battery State"
        value="78%"
        icon={<Battery className="h-5 w-5" />}
        description="Charging at 3.2 kW"
        change={"+2.1%"}
        changeType="positive"
        className="md:col-span-1"
      />
      
      {/* Grid Import */}
      <MetricsCard
        title="Grid Import"
        value="12.8 kWh"
        change={"-22.4%"}
        changeType="positive"
        description="vs. previous day"
        className="md:col-span-1"
      />
      
      {/* Grid Export */}
      <MetricsCard
        title="Grid Export"
        value="41.1 kWh"
        change={"+31.2%"}
        changeType="positive"
        description="vs. previous day"
        className="md:col-span-1"
      />
      
      {/* Carbon Offset */}
      <MetricsCard
        title="CO2 Avoided"
        value="68.2 kg"
        change={"+14.8%"}
        changeType="positive"
        description="vs. previous day"
        className="md:col-span-1"
      />
      
      {/* Faults Summary */}
      <div className="md:col-span-2">
        <FaultSummaryCard faults={faults} onFaultSelect={setActiveFault} />
      </div>
      
      {/* Live Power Flow */}
      <div className="md:col-span-2">
        <LiveTelemetryChart height={250} deviceId="overview" metric="power" />
        <LiveTelemetryChart height={250} deviceId="overview" metric="energy" />
      </div>
      
      {/* Recent Alerts */}
      <div className="md:col-span-2 lg:col-span-2">
        <AlertSummaryCard limit={5} />
      </div>
      
      {/* Energy Prices */}
      <div className="md:col-span-3 lg:col-span-2">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TariffCard />
          
          <TariffHistoryCard />
        </div>
      </div>
      
      {/* Devices Overview */}
      <div className="md:col-span-3 lg:col-span-4">
        <DeviceManagement />
      </div>
    </div>
  );
};

export default DashboardSummary;
