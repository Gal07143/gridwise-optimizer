import React from 'react';
import { BarChart3, Battery, Bolt, Globe, Home, Thermometer, Wind, Zap } from 'lucide-react';
import DashboardCard from '@/components/dashboard/DashboardCard';
import MetricsCard from '@/components/dashboard/MetricsCard';
import LiveChart from '@/components/dashboard/LiveChart';
import EnergyFlowChart from '@/components/dashboard/EnergyFlowChart';
import StatusOverview from '@/components/dashboard/StatusOverview';
import PowerQualityCard from '@/components/dashboard/PowerQualityCard';
import AdvancedBatteryCard from '@/components/dashboard/AdvancedBatteryCard';
import EnergyForecastCard from '@/components/dashboard/EnergyForecastCard';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import GlassPanel from '@/components/ui/GlassPanel';

const powerGenerationData = [
  { time: '00:00', value: 45 },
  { time: '03:00', value: 35 },
  { time: '06:00', value: 32 },
  { time: '09:00', value: 85 },
  { time: '12:00', value: 120 },
  { time: '15:00', value: 115 },
  { time: '18:00', value: 80 },
  { time: '21:00', value: 55 },
  { time: '24:00', value: 45 },
];

const energyConsumptionData = [
  { time: '00:00', value: 35 },
  { time: '03:00', value: 30 },
  { time: '06:00', value: 40 },
  { time: '09:00', value: 85 },
  { time: '12:00', value: 95 },
  { time: '15:00', value: 90 },
  { time: '18:00', value: 105 },
  { time: '21:00', value: 65 },
  { time: '24:00', value: 45 },
];

const batteryStateData = [
  { time: '00:00', value: 75 },
  { time: '03:00', value: 68 },
  { time: '06:00', value: 62 },
  { time: '09:00', value: 55 },
  { time: '12:00', value: 65 },
  { time: '15:00', value: 75 },
  { time: '18:00', value: 82 },
  { time: '21:00', value: 78 },
  { time: '24:00', value: 72 },
];

const gridFeedInData = [
  { time: '00:00', value: 25 },
  { time: '03:00', value: 20 },
  { time: '06:00', value: 15 },
  { time: '09:00', value: -10 },
  { time: '12:00', value: -35 },
  { time: '15:00', value: -30 },
  { time: '18:00', value: -15 },
  { time: '21:00', value: 5 },
  { time: '24:00', value: 20 },
];

const Dashboard = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold mb-1">Energy Management Dashboard</h1>
            <p className="text-muted-foreground">Real-time monitoring and control of your energy systems</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <MetricsCard
              title="Power Generation"
              value="153.7 kW"
              change={{ value: 12.4, type: 'increase' }}
              icon={<Zap size={18} />}
              subtitle="Solar + Wind"
            />
            <MetricsCard
              title="Power Consumption"
              value="121.0 kW"
              change={{ value: 5.7, type: 'increase' }}
              icon={<Home size={18} />}
              subtitle="Building + EV"
            />
            <MetricsCard
              title="Battery Capacity"
              value="68.2 %"
              change={{ value: 3.1, type: 'decrease' }}
              icon={<Battery size={18} />}
              subtitle="120 kWh System"
            />
            <MetricsCard
              title="Grid Exchange"
              value="+32.7 kW"
              change={{ value: 0, type: 'neutral' }}
              icon={<Globe size={18} />}
              subtitle="Exporting"
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 space-y-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <DashboardCard 
                title="Energy Generation & Consumption"
                icon={<BarChart3 size={18} />}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <LiveChart
                      data={powerGenerationData}
                      title="Power Generation (kW)"
                      color="rgba(45, 211, 111, 1)"
                      type="area"
                      gradientFrom="rgba(45, 211, 111, 0.5)"
                      gradientTo="rgba(45, 211, 111, 0)"
                    />
                  </div>
                  <div>
                    <LiveChart
                      data={energyConsumptionData}
                      title="Power Consumption (kW)"
                      color="rgba(122, 90, 248, 1)"
                      type="area"
                      gradientFrom="rgba(122, 90, 248, 0.5)"
                      gradientTo="rgba(122, 90, 248, 0)"
                    />
                  </div>
                </div>
              </DashboardCard>
              
              <EnergyFlowChart />
              
              <PowerQualityCard />
            </div>
            
            <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <StatusOverview />
              
              <AdvancedBatteryCard />
              
              <DashboardCard 
                title="Grid Feed-In Power"
                icon={<Wind size={18} />}
              >
                <LiveChart
                  data={gridFeedInData}
                  color="rgba(255, 196, 9, 1)"
                  type="line"
                  hideAxis={false}
                  yAxisLabel="Power (kW)"
                />
              </DashboardCard>
            </div>
          </div>
          
          <EnergyForecastCard className="mb-6 animate-slide-up" style={{ animationDelay: '0.4s' }} />
          
          <GlassPanel className="mt-2 p-4 text-xs text-center text-muted-foreground animate-fade-in" style={{ animationDelay: '0.5s' }}>
            GridWise Energy Management System — Real-time data last updated: {new Date().toLocaleTimeString()}
          </GlassPanel>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
