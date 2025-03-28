
import React from 'react';
import StatusOverview from '@/components/dashboard/StatusOverview';
import LiveChart from '@/components/dashboard/LiveChart';
import EnergyForecastCard from '@/components/dashboard/EnergyForecastCard';
import EnergyFlowChart from '@/components/dashboard/EnergyFlowChart';
import PowerQualityCard from '@/components/dashboard/PowerQualityCard';
import AdvancedBatteryCard from '@/components/dashboard/AdvancedBatteryCard';

// Sample data for the power trend chart
const powerTrendData = [
  { time: '00:00', value: 2.5 },
  { time: '04:00', value: 1.8 },
  { time: '08:00', value: 4.2 },
  { time: '12:00', value: 6.5 },
  { time: '16:00', value: 5.3 },
  { time: '20:00', value: 3.2 },
  { time: '24:00', value: 2.8 },
];

const DashboardCharts = () => {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white dark:bg-gridx-dark-gray/90 shadow-sm p-6 rounded-xl border border-gray-100 dark:border-gray-700/30">
          <h3 className="text-base font-medium mb-4 text-gridx-navy dark:text-white">System Status Overview</h3>
          <StatusOverview animationDelay="300ms" />
        </div>
        <div className="bg-white dark:bg-gridx-dark-gray/90 shadow-sm p-6 rounded-xl border border-gray-100 dark:border-gray-700/30">
          <h3 className="text-base font-medium mb-4 text-gridx-navy dark:text-white">Power Trend (24h)</h3>
          <LiveChart 
            data={powerTrendData}
            animationDelay="400ms" 
            type="area" 
            gradientFrom="rgba(45, 78, 245, 0.4)" 
            gradientTo="rgba(45, 78, 245, 0.0)"
            color="#2D4EF5"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gridx-dark-gray/90 shadow-sm p-6 rounded-xl border border-gray-100 dark:border-gray-700/30">
          <h3 className="text-base font-medium mb-4 text-gridx-navy dark:text-white">Energy Forecast</h3>
          <EnergyForecastCard animationDelay="500ms" />
        </div>
        <div className="bg-white dark:bg-gridx-dark-gray/90 shadow-sm p-6 rounded-xl border border-gray-100 dark:border-gray-700/30">
          <h3 className="text-base font-medium mb-4 text-gridx-navy dark:text-white">Power Quality</h3>
          <PowerQualityCard animationDelay="600ms" />
        </div>
      </div>

      <div className="bg-white dark:bg-gridx-dark-gray/90 shadow-sm p-6 rounded-xl border border-gray-100 dark:border-gray-700/30 mb-8">
        <h3 className="text-base font-medium mb-4 text-gridx-navy dark:text-white">Energy Flow Diagram</h3>
        <EnergyFlowChart animationDelay="700ms" />
      </div>

      <div className="bg-white dark:bg-gridx-dark-gray/90 shadow-sm p-6 rounded-xl border border-gray-100 dark:border-gray-700/30">
        <h3 className="text-base font-medium mb-4 text-gridx-navy dark:text-white">Battery System</h3>
        <AdvancedBatteryCard animationDelay="800ms" />
      </div>
    </>
  );
};

export default DashboardCharts;
