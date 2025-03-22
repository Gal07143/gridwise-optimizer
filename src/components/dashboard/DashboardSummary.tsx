import React from 'react';
import { Zap, Battery, Sun, Wind } from 'lucide-react';
import MetricsCard from '@/components/dashboard/MetricsCard';
import TariffCard from './TariffCard';
import TariffHistoryCard from './TariffHistoryCard';
import ModbusCard from './ModbusCard'; // Import your new ModbusCard

const DashboardSummary = () => {
  return (
    <>
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

      {/* Tariff Overview (Live) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <TariffCard />
      </div>

      {/* Tariff Chart (History) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <TariffHistoryCard />
      </div>

      {/* Modbus Data Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <ModbusCard />
      </div>
    </>
  );
};

export default DashboardSummary;
