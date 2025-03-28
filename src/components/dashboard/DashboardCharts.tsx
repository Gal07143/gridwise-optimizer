
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
        <div className="lg:col-span-2 glass-panel shadow-md p-4 rounded-xl">
          <StatusOverview animationDelay="300ms" />
        </div>
        <div className="glass-panel shadow-md p-4 rounded-xl">
          <h3 className="text-lg font-medium mb-3">Power Trend (24h)</h3>
          <LiveChart 
            data={powerTrendData}
            animationDelay="400ms" 
            type="area" 
            gradientFrom="rgba(14, 165, 233, 0.5)" 
            gradientTo="rgba(14, 165, 233, 0.0)"
            color="var(--color-primary)"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="glass-panel shadow-md p-4 rounded-xl">
          <EnergyForecastCard animationDelay="500ms" />
        </div>
        <div className="glass-panel shadow-md p-4 rounded-xl">
          <PowerQualityCard animationDelay="600ms" />
        </div>
      </div>

      <div className="glass-panel shadow-md p-4 rounded-xl mb-8">
        <h3 className="text-lg font-medium mb-3">Energy Flow Diagram</h3>
        <EnergyFlowChart animationDelay="700ms" />
      </div>

      <div className="glass-panel shadow-md p-4 rounded-xl">
        <AdvancedBatteryCard animationDelay="800ms" />
      </div>
    </>
  );
};

export default DashboardCharts;
