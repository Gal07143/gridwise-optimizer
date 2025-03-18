
import React from 'react';
import { BarChart3, Calendar, TrendingUp, Zap } from 'lucide-react';
import DashboardCard from '@/components/dashboard/DashboardCard';
import LiveChart from '@/components/dashboard/LiveChart';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';

// Mock data for charts
const weeklyEnergyData = [
  { time: 'Mon', value: 320 },
  { time: 'Tue', value: 350 },
  { time: 'Wed', value: 410 },
  { time: 'Thu', value: 390 },
  { time: 'Fri', value: 450 },
  { time: 'Sat', value: 380 },
  { time: 'Sun', value: 290 },
];

const monthlyGenerationData = [
  { time: 'Jan', value: 4200 },
  { time: 'Feb', value: 4500 },
  { time: 'Mar', value: 5100 },
  { time: 'Apr', value: 5400 },
  { time: 'May', value: 6200 },
  { time: 'Jun', value: 6800 },
  { time: 'Jul', value: 7100 },
  { time: 'Aug', value: 7000 },
  { time: 'Sep', value: 6300 },
  { time: 'Oct', value: 5600 },
  { time: 'Nov', value: 4900 },
  { time: 'Dec', value: 4100 },
];

const peakDemandData = [
  { time: '00:00', value: 86 },
  { time: '03:00', value: 72 },
  { time: '06:00', value: 91 },
  { time: '09:00', value: 132 },
  { time: '12:00', value: 145 },
  { time: '15:00', value: 156 },
  { time: '18:00', value: 168 },
  { time: '21:00', value: 120 },
  { time: '24:00', value: 94 },
];

const Analytics = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold mb-1">Energy Analytics</h1>
            <p className="text-muted-foreground">Historical data analysis and performance metrics</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <DashboardCard 
              title="Daily Energy Consumption (kWh)"
              icon={<Calendar size={18} />}
              className="animate-slide-up"
              style={{ animationDelay: '0.1s' }}
            >
              <LiveChart
                data={weeklyEnergyData}
                height={250}
                color="rgba(122, 90, 248, 1)"
                type="area"
                gradientFrom="rgba(122, 90, 248, 0.5)"
                gradientTo="rgba(122, 90, 248, 0)"
                animated={false}
              />
            </DashboardCard>
            
            <DashboardCard 
              title="Peak Power Demand (kW)"
              icon={<TrendingUp size={18} />}
              className="animate-slide-up"
              style={{ animationDelay: '0.2s' }}
            >
              <LiveChart
                data={peakDemandData}
                height={250}
                color="rgba(255, 153, 0, 1)"
                type="area"
                gradientFrom="rgba(255, 153, 0, 0.5)"
                gradientTo="rgba(255, 153, 0, 0)"
                animated={false}
              />
            </DashboardCard>
          </div>
          
          <DashboardCard 
            title="Monthly Energy Generation (kWh)"
            icon={<BarChart3 size={18} />}
            className="mb-6 animate-slide-up"
            style={{ animationDelay: '0.3s' }}
          >
            <LiveChart
              data={monthlyGenerationData}
              height={300}
              color="rgba(45, 211, 111, 1)"
              type="area"
              gradientFrom="rgba(45, 211, 111, 0.5)"
              gradientTo="rgba(45, 211, 111, 0)"
              animated={false}
            />
          </DashboardCard>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <DashboardCard title="Carbon Footprint" icon={<Zap size={18} />}>
              <div className="text-center py-4">
                <div className="text-3xl font-bold mb-2">-82.6%</div>
                <div className="text-sm text-muted-foreground">Carbon reduction from grid baseline</div>
                <div className="flex justify-center mt-4">
                  <div className="w-32 h-32 relative">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle 
                        className="text-muted stroke-current" 
                        strokeWidth="8" 
                        fill="transparent" 
                        r="40" 
                        cx="50" 
                        cy="50" 
                      />
                      <circle 
                        className="text-energy-green stroke-current" 
                        strokeWidth="8" 
                        fill="transparent" 
                        r="40" 
                        cx="50" 
                        cy="50" 
                        strokeDasharray="251.2" 
                        strokeDashoffset="43.7" 
                        strokeLinecap="round" 
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-sm">
                      82.6%
                    </div>
                  </div>
                </div>
              </div>
            </DashboardCard>
            
            <DashboardCard title="Energy Cost Savings" icon={<Zap size={18} />}>
              <div className="text-center py-4">
                <div className="text-3xl font-bold mb-2">$4,287</div>
                <div className="text-sm text-muted-foreground">Monthly savings vs. grid-only</div>
                <div className="mt-4 glass-panel p-2 rounded-lg inline-block">
                  <div className="text-xs text-energy-green">↑ 12.4% from last month</div>
                </div>
              </div>
            </DashboardCard>
            
            <DashboardCard title="System Efficiency" icon={<Zap size={18} />}>
              <div className="text-center py-4">
                <div className="text-3xl font-bold mb-2">94.3%</div>
                <div className="text-sm text-muted-foreground">Overall system efficiency</div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                  <div className="glass-panel p-2 rounded-lg">
                    <div className="text-muted-foreground">Solar</div>
                    <div className="font-medium">97.1%</div>
                  </div>
                  <div className="glass-panel p-2 rounded-lg">
                    <div className="text-muted-foreground">Storage</div>
                    <div className="font-medium">92.4%</div>
                  </div>
                  <div className="glass-panel p-2 rounded-lg">
                    <div className="text-muted-foreground">Distribution</div>
                    <div className="font-medium">95.8%</div>
                  </div>
                </div>
              </div>
            </DashboardCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
