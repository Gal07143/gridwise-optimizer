
import React from 'react';
import { Activity, BarChart, BarChart3 } from 'lucide-react';
import DashboardCard from '@/components/dashboard/DashboardCard';
import PredictionsCard from '@/components/analytics/PredictionsCard';
import SystemRecommendationsCard from '@/components/analytics/SystemRecommendationsCard';
import usePredictions from '@/hooks/usePredictions';

interface InsightsTabProps {
  timeframe?: string;
  customData?: any[];
}

const InsightsTab = ({ timeframe = 'week', customData }: InsightsTabProps) => {
  const { 
    predictions, 
    recommendations,
    isLoading, 
    refetch 
  } = usePredictions(timeframe, customData);

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
        
        <PredictionsCard 
          timeframe={timeframe}
          customData={customData}
        />
      </div>
      
      <SystemRecommendationsCard
        recommendations={recommendations}
        isLoading={isLoading}
        onRefresh={refetch}
      />
      
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
