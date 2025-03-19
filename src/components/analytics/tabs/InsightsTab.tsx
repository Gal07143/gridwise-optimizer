
import React from 'react';
import { Activity, BarChart, BarChart3 } from 'lucide-react';
import DashboardCard from '@/components/dashboard/DashboardCard';

const InsightsTab = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <DashboardCard
          title="Key Performance Indicators"
          icon={<Activity size={18} />}
        >
          <div className="space-y-4 p-2">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">System Efficiency</div>
                <div className="text-xs text-muted-foreground">Energy out vs energy in</div>
              </div>
              <div className="text-xl font-bold">94.3%</div>
            </div>
            
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Self-Consumption Rate</div>
                <div className="text-xs text-muted-foreground">Energy used on-site</div>
              </div>
              <div className="text-xl font-bold">68.7%</div>
            </div>
            
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Grid Independence</div>
                <div className="text-xs text-muted-foreground">Energy from renewable sources</div>
              </div>
              <div className="text-xl font-bold">82.4%</div>
            </div>
            
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Carbon Offset</div>
                <div className="text-xs text-muted-foreground">CO2 emissions avoided</div>
              </div>
              <div className="text-xl font-bold">3.8 tons</div>
            </div>
          </div>
        </DashboardCard>
        
        <DashboardCard
          title="System Insights"
          icon={<BarChart3 size={18} />}
        >
          <div className="space-y-4 p-2">
            <div className="p-3 rounded-lg border border-amber-100 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900/30">
              <div className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-1">Peak Usage Alert</div>
              <div className="text-xs">Your energy consumption peaks between 5-7PM, which coincides with the highest electricity rates. Consider shifting some usage to off-peak hours.</div>
            </div>
            
            <div className="p-3 rounded-lg border border-green-100 bg-green-50 dark:bg-green-950/20 dark:border-green-900/30">
              <div className="text-sm font-medium text-green-800 dark:text-green-300 mb-1">Efficiency Improvement</div>
              <div className="text-xs">Your solar panel efficiency has increased by 5% compared to last month, possibly due to recent cleaning or favorable weather conditions.</div>
            </div>
            
            <div className="p-3 rounded-lg border border-blue-100 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900/30">
              <div className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">Battery Optimization</div>
              <div className="text-xs">Your battery storage is only utilized at 65% capacity. Optimizing charge/discharge cycles could improve your energy independence by up to 15%.</div>
            </div>
            
            <div className="p-3 rounded-lg border border-purple-100 bg-purple-50 dark:bg-purple-950/20 dark:border-purple-900/30">
              <div className="text-sm font-medium text-purple-800 dark:text-purple-300 mb-1">Seasonal Pattern</div>
              <div className="text-xs">Energy production has increased 18% month-over-month, following the expected seasonal pattern as we move toward summer months.</div>
            </div>
          </div>
        </DashboardCard>
      </div>
      
      <DashboardCard
        title="Comparative Analysis"
        icon={<BarChart size={18} />}
      >
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
            <h4 className="text-sm font-medium mb-2">vs. Similar Households</h4>
            <div className="flex items-center justify-center py-4">
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle
                    className="text-slate-200 dark:text-slate-700 stroke-current"
                    strokeWidth="8"
                    fill="transparent"
                    r="42"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-energy-green stroke-current"
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="transparent"
                    r="42"
                    cx="50"
                    cy="50"
                    strokeDasharray="263.89"
                    strokeDashoffset="66"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-center">
                  <div>
                    <div className="text-2xl font-bold">75%</div>
                    <div className="text-xs text-muted-foreground">More efficient</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-xs text-center text-muted-foreground mt-2">
              You use 25% less energy than similar homes in your area
            </div>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
            <h4 className="text-sm font-medium mb-2">vs. Previous Year</h4>
            <div className="flex items-center justify-center py-4">
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle
                    className="text-slate-200 dark:text-slate-700 stroke-current"
                    strokeWidth="8"
                    fill="transparent"
                    r="42"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-energy-blue stroke-current"
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="transparent"
                    r="42"
                    cx="50"
                    cy="50"
                    strokeDasharray="263.89"
                    strokeDashoffset="92.4"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-center">
                  <div>
                    <div className="text-2xl font-bold">65%</div>
                    <div className="text-xs text-muted-foreground">Cost reduction</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-xs text-center text-muted-foreground mt-2">
              Your energy costs are 35% lower than last year
            </div>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
            <h4 className="text-sm font-medium mb-2">vs. Optimal Performance</h4>
            <div className="flex items-center justify-center py-4">
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle
                    className="text-slate-200 dark:text-slate-700 stroke-current"
                    strokeWidth="8"
                    fill="transparent"
                    r="42"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-amber-500 stroke-current"
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="transparent"
                    r="42"
                    cx="50"
                    cy="50"
                    strokeDasharray="263.89"
                    strokeDashoffset="79.2"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-center">
                  <div>
                    <div className="text-2xl font-bold">70%</div>
                    <div className="text-xs text-muted-foreground">Optimization</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-xs text-center text-muted-foreground mt-2">
              You're at 70% of optimal performance for your system
            </div>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
};

export default InsightsTab;
