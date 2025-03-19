
import React from 'react';
import { PieChart, TrendingUp, Activity } from 'lucide-react';
import DashboardCard from '@/components/dashboard/DashboardCard';
import LiveChart from '@/components/dashboard/LiveChart';

interface CostTabProps {
  costBreakdownData: any[];
  monthlyGenerationData: any[];
}

const CostTab = ({
  costBreakdownData,
  monthlyGenerationData
}: CostTabProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <DashboardCard 
          title="Energy Cost Distribution"
          icon={<PieChart size={18} />}
        >
          <div className="flex flex-col h-64">
            <div className="flex-1 flex items-center justify-center">
              <div className="relative w-40 h-40">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* Peak - 45% */}
                  <circle
                    className="fill-energy-red"
                    cx="50"
                    cy="50"
                    r="40"
                    strokeWidth="0"
                    strokeDasharray="251.2"
                    strokeDashoffset="0"
                    transform="rotate(-90 50 50)"
                  />
                  {/* Shoulder - 35% */}
                  <circle
                    className="fill-energy-blue"
                    cx="50"
                    cy="50"
                    r="40"
                    strokeWidth="0"
                    strokeDasharray="251.2"
                    strokeDashoffset="113.04"
                    transform="rotate(-90 50 50)"
                  />
                  {/* Off-Peak - 20% */}
                  <circle
                    className="fill-energy-green"
                    cx="50"
                    cy="50"
                    r="40"
                    strokeWidth="0"
                    strokeDasharray="251.2"
                    strokeDashoffset="200.96"
                    transform="rotate(-90 50 50)"
                  />
                  <circle
                    className="fill-white dark:fill-slate-800"
                    cx="50"
                    cy="50"
                    r="25"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-xl font-bold">$403</div>
                    <div className="text-xs text-muted-foreground">Total</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="flex flex-col items-center p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center mb-1">
                  <div className="w-3 h-3 rounded-full bg-energy-red mr-1"></div>
                  <span className="text-xs">Peak</span>
                </div>
                <div className="text-sm font-semibold">$182.50</div>
              </div>
              <div className="flex flex-col items-center p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center mb-1">
                  <div className="w-3 h-3 rounded-full bg-energy-blue mr-1"></div>
                  <span className="text-xs">Shoulder</span>
                </div>
                <div className="text-sm font-semibold">$142.20</div>
              </div>
              <div className="flex flex-col items-center p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center mb-1">
                  <div className="w-3 h-3 rounded-full bg-energy-green mr-1"></div>
                  <span className="text-xs">Off-Peak</span>
                </div>
                <div className="text-sm font-semibold">$78.30</div>
              </div>
            </div>
          </div>
        </DashboardCard>
        
        <DashboardCard 
          title="Monthly Cost Trend"
          icon={<TrendingUp size={18} />}
        >
          <div className="h-64">
            <LiveChart
              data={monthlyGenerationData.map(d => ({ time: d.time, value: d.value * 0.09 }))}
              height={250}
              color="rgba(255, 99, 132, 1)"
              type="area"
              gradientFrom="rgba(255, 99, 132, 0.5)"
              gradientTo="rgba(255, 99, 132, 0)"
              animated={false}
            />
          </div>
        </DashboardCard>
      </div>
      
      <DashboardCard 
        title="Potential Cost Savings with Time of Use Optimization"
        icon={<Activity size={18} />}
      >
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <div className="text-muted-foreground text-sm mb-2">Current Monthly Cost</div>
              <div className="text-2xl font-bold mb-1">$403.00</div>
              <div className="text-xs text-muted-foreground">Based on current usage patterns</div>
            </div>
            
            <div className="flex flex-col p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <div className="text-muted-foreground text-sm mb-2">Optimized Cost</div>
              <div className="text-2xl font-bold text-energy-green mb-1">$312.50</div>
              <div className="text-xs text-muted-foreground">With ToU optimization</div>
            </div>
            
            <div className="flex flex-col p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <div className="text-muted-foreground text-sm mb-2">Annual Savings</div>
              <div className="text-2xl font-bold text-energy-green mb-1">$1,086</div>
              <div className="text-xs text-muted-foreground">22.5% reduction in costs</div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-100 dark:border-green-900/30">
            <h4 className="font-medium mb-2 flex items-center">
              <TrendingUp className="mr-2 h-4 w-4 text-energy-green" />
              Optimization Recommendations
            </h4>
            <ul className="text-sm space-y-2">
              <li className="flex items-start">
                <div className="h-5 w-5 mr-2 flex items-center justify-center text-white bg-energy-green rounded-full text-xs">1</div>
                <span>Shift EV charging from 6-8PM (peak) to 12-4AM (off-peak) to save $38/month</span>
              </li>
              <li className="flex items-start">
                <div className="h-5 w-5 mr-2 flex items-center justify-center text-white bg-energy-green rounded-full text-xs">2</div>
                <span>Pre-cool/heat your home before peak hours to reduce HVAC usage during expensive periods</span>
              </li>
              <li className="flex items-start">
                <div className="h-5 w-5 mr-2 flex items-center justify-center text-white bg-energy-green rounded-full text-xs">3</div>
                <span>Enable battery discharge during peak hours (5-9PM) to avoid highest rates</span>
              </li>
            </ul>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
};

export default CostTab;
