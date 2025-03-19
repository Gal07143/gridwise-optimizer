
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BadgeCheck, BatteryCharging, Flame, Leaf, PlugZap, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnergyFlowInsightsProps {
  selfConsumptionRate: number;
  gridDependencyRate: number;
  batteryPercentage: number;
  totalGeneration: number;
  totalConsumption: number;
}

const EnergyFlowInsights: React.FC<EnergyFlowInsightsProps> = ({
  selfConsumptionRate,
  gridDependencyRate,
  batteryPercentage,
  totalGeneration,
  totalConsumption
}) => {
  // Calculate energy balance
  const energyBalance = totalGeneration - totalConsumption;
  const isEnergyPositive = energyBalance >= 0;
  
  // Determine battery status
  const isBatteryCharging = energyBalance > 0 && batteryPercentage < 100;
  const batteryStatus = isBatteryCharging 
    ? 'Charging' 
    : batteryPercentage > 20 
      ? 'Discharging' 
      : 'Low';
      
  // Determine system efficiency
  let efficiencyRating = 'Good';
  let efficiencyColor = 'text-amber-500';
  
  if (selfConsumptionRate > 85 && gridDependencyRate < 15) {
    efficiencyRating = 'Excellent';
    efficiencyColor = 'text-green-500';
  } else if (selfConsumptionRate < 50 || gridDependencyRate > 50) {
    efficiencyRating = 'Needs Improvement';
    efficiencyColor = 'text-orange-500';
  }
  
  return (
    <div className="space-y-4">
      <Card className="shadow-sm bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200/70 dark:border-slate-700/70">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Zap className="mr-2 h-5 w-5 text-primary" />
            Energy Flow Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Self-consumption Rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center text-sm font-medium">
                <Leaf className="mr-2 h-4 w-4 text-energy-green" />
                Self-Consumption Rate
              </div>
              <span className="text-energy-green font-bold">{selfConsumptionRate.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <div 
                className="bg-energy-green h-2 rounded-full" 
                style={{ width: `${selfConsumptionRate}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground">
              {selfConsumptionRate > 85 
                ? 'Excellent! Most of your renewable energy is used on-site.'
                : selfConsumptionRate > 60
                  ? 'Good utilization of your renewable energy production.'
                  : 'Consider shifting usage to times of high production.'}
            </p>
          </div>
          
          {/* Grid Dependency Rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center text-sm font-medium">
                <PlugZap className="mr-2 h-4 w-4 text-slate-500" />
                Grid Dependency Rate
              </div>
              <span className={gridDependencyRate < 30 ? 'text-energy-green font-bold' : 'text-slate-500 font-bold'}>
                {gridDependencyRate.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <div 
                className={cn(
                  "h-2 rounded-full",
                  gridDependencyRate < 30 ? 'bg-energy-green' : 'bg-slate-500'
                )} 
                style={{ width: `${gridDependencyRate}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground">
              {gridDependencyRate < 15
                ? 'Excellent energy independence with minimal grid usage.'
                : gridDependencyRate < 40
                  ? 'Good energy independence with moderate grid support.'
                  : 'Your system still relies significantly on grid power.'}
            </p>
          </div>
          
          {/* Battery Status */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center text-sm font-medium">
                <BatteryCharging className="mr-2 h-4 w-4 text-energy-blue" />
                Battery Status
              </div>
              <span className={cn(
                "font-bold",
                isBatteryCharging ? 'text-energy-green' : 
                batteryStatus === 'Low' ? 'text-energy-orange' : 'text-energy-blue'
              )}>
                {batteryStatus} • {batteryPercentage}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <div 
                className={cn(
                  "h-2 rounded-full",
                  isBatteryCharging ? 'bg-energy-green' : 
                  batteryStatus === 'Low' ? 'bg-energy-orange' : 'bg-energy-blue'
                )} 
                style={{ width: `${batteryPercentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground">
              {isBatteryCharging
                ? 'Battery is charging from excess renewable energy.'
                : batteryStatus === 'Low'
                  ? 'Battery level is low - conserve power or charge soon.'
                  : 'Battery is discharging to support your energy needs.'}
            </p>
          </div>
          
          {/* System Efficiency Rating */}
          <div className="mt-4 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center font-medium">
                <BadgeCheck className="mr-2 h-5 w-5 text-primary" />
                System Efficiency
              </div>
              <span className={`${efficiencyColor} font-bold`}>{efficiencyRating}</span>
            </div>
            
            <div className="mt-3 text-xs">
              <div className="flex items-start space-x-2">
                <Flame className="h-4 w-4 text-energy-orange mt-0.5" />
                <div>
                  <div className="font-medium">Energy Balance</div>
                  <p className="text-muted-foreground">
                    {isEnergyPositive 
                      ? `Producing ${energyBalance.toFixed(1)} kW more than consuming.`
                      : `Consuming ${Math.abs(energyBalance).toFixed(1)} kW more than producing.`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Recommendations Section */}
      <Card className="shadow-sm bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200/70 dark:border-slate-700/70">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Quick Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {selfConsumptionRate < 70 && (
            <div className="text-xs flex items-start gap-2">
              <div className="mt-0.5 bg-energy-green/10 text-energy-green p-1 rounded-full">
                <Leaf className="h-3 w-3" />
              </div>
              <p>Shift energy-intensive tasks to daylight hours to utilize more solar power.</p>
            </div>
          )}
          
          {batteryPercentage < 30 && !isBatteryCharging && (
            <div className="text-xs flex items-start gap-2">
              <div className="mt-0.5 bg-energy-blue/10 text-energy-blue p-1 rounded-full">
                <BatteryCharging className="h-3 w-3" />
              </div>
              <p>Battery level is low. Consider reducing consumption until it can recharge.</p>
            </div>
          )}
          
          {gridDependencyRate > 40 && (
            <div className="text-xs flex items-start gap-2">
              <div className="mt-0.5 bg-primary/10 text-primary p-1 rounded-full">
                <PlugZap className="h-3 w-3" />
              </div>
              <p>High grid dependency. Check if any renewable sources are underperforming.</p>
            </div>
          )}
          
          {/* Always show general recommendation */}
          <div className="text-xs flex items-start gap-2">
            <div className="mt-0.5 bg-amber-500/10 text-amber-500 p-1 rounded-full">
              <Zap className="h-3 w-3" />
            </div>
            <p>View the Analytics page for more detailed energy optimization recommendations.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnergyFlowInsights;
