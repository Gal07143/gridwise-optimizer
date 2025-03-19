
import React from 'react';
import { 
  LineChart, 
  TrendingUp, 
  BarChart3, 
  Lightbulb,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  CheckCircle2,
  Zap,
  BatteryCharging
} from 'lucide-react';
import { MicrogridState } from './types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface MicrogridSystemInsightsProps {
  microgridState: MicrogridState;
  minBatteryReserve: number;
}

const MicrogridSystemInsights: React.FC<MicrogridSystemInsightsProps> = ({ 
  microgridState,
  minBatteryReserve
}) => {
  // Calculate derived metrics
  const totalProduction = microgridState.solarProduction + microgridState.windProduction;
  const netEnergy = totalProduction - microgridState.loadConsumption;
  const selfConsumptionRate = totalProduction > 0 
    ? Math.min(100, ((totalProduction - microgridState.gridExport) / totalProduction) * 100) 
    : 0;
  const gridDependenceRate = microgridState.loadConsumption > 0 
    ? (microgridState.gridImport / microgridState.loadConsumption) * 100 
    : 0;
  const batteryUsableCapacity = microgridState.batteryCharge - minBatteryReserve;
  const batteryEstimatedRuntime = Math.max(0, batteryUsableCapacity / 10); // hours, assuming 10% discharge per hour

  // System health assessment
  const batteryHealth = microgridState.batteryCharge > 50 ? 'good' : microgridState.batteryCharge > 20 ? 'moderate' : 'poor';
  const frequencyHealth = microgridState.frequency >= 49.9 && microgridState.frequency <= 50.1 ? 'good' : 'moderate';
  const voltageHealth = microgridState.voltage >= 220 && microgridState.voltage <= 240 ? 'good' : 'moderate';
  
  // System recommendations
  const needsBatteryCharging = microgridState.batteryCharge < 40;
  const excessProduction = netEnergy > 5;
  const highConsumption = microgridState.loadConsumption > 15;

  return (
    <Card className="overflow-hidden border-slate-200/60 dark:border-slate-800/60 shadow-lg">
      <CardHeader className="bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10">
        <CardTitle className="flex items-center text-lg">
          <LineChart className="mr-2 h-5 w-5 text-primary" />
          System Insights
        </CardTitle>
        <CardDescription>
          Operational metrics and performance analysis
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Performance Metrics */}
          <div>
            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider flex items-center mb-4">
              <TrendingUp className="h-4 w-4 mr-1" />
              Performance Metrics
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-sm">Self-Consumption Rate</div>
                  <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary">
                    {selfConsumptionRate.toFixed(0)}%
                  </Badge>
                </div>
                <Progress value={selfConsumptionRate} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  Percentage of generated energy consumed on-site
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-sm">Grid Dependence</div>
                  <Badge variant="outline" className="bg-orange-500/10 border-orange-500/20 text-orange-700 dark:text-orange-500">
                    {gridDependenceRate.toFixed(0)}%
                  </Badge>
                </div>
                <Progress value={gridDependenceRate} className="h-2 bg-slate-200 dark:bg-slate-700" />
                <p className="text-xs text-muted-foreground mt-2">
                  Percentage of consumption supplied by grid
                </p>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Energy Balance */}
          <div>
            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider flex items-center mb-4">
              <BarChart3 className="h-4 w-4 mr-1" />
              Energy Balance
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 rounded-xl p-3 text-center">
                <div className="text-xs text-muted-foreground">Generation</div>
                <div className="text-xl font-bold">{totalProduction.toFixed(1)}</div>
                <div className="text-xs">kW</div>
              </div>
              
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 rounded-xl p-3 text-center">
                <div className="text-xs text-muted-foreground">Consumption</div>
                <div className="text-xl font-bold">{microgridState.loadConsumption.toFixed(1)}</div>
                <div className="text-xs">kW</div>
              </div>
              
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 rounded-xl p-3 text-center">
                <div className="text-xs text-muted-foreground">Net Energy</div>
                <div className={cn(
                  "text-xl font-bold flex items-center justify-center gap-1",
                  netEnergy >= 0 ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"
                )}>
                  {netEnergy >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                  {Math.abs(netEnergy).toFixed(1)}
                </div>
                <div className="text-xs">kW</div>
              </div>
              
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 rounded-xl p-3 text-center">
                <div className="text-xs text-muted-foreground">Battery Runtime</div>
                <div className="text-xl font-bold">{batteryEstimatedRuntime.toFixed(1)}</div>
                <div className="text-xs">hours</div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* System Health */}
          <div>
            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider flex items-center mb-4">
              <Zap className="h-4 w-4 mr-1" />
              System Health
            </h3>
            
            <div className="space-y-3">
              <div className={cn(
                "flex items-center justify-between p-3 rounded-lg",
                batteryHealth === 'good' ? "bg-green-500/10" : 
                batteryHealth === 'moderate' ? "bg-yellow-500/10" : "bg-red-500/10"
              )}>
                <div className="flex items-center gap-2">
                  <BatteryCharging className={cn(
                    "h-5 w-5",
                    batteryHealth === 'good' ? "text-green-600 dark:text-green-500" : 
                    batteryHealth === 'moderate' ? "text-yellow-600 dark:text-yellow-500" : "text-red-600 dark:text-red-500"
                  )} />
                  <div className="font-medium">Battery Health</div>
                </div>
                <Badge variant="outline" className={cn(
                  batteryHealth === 'good' ? "border-green-500 text-green-700 dark:text-green-500" : 
                  batteryHealth === 'moderate' ? "border-yellow-500 text-yellow-700 dark:text-yellow-500" : "border-red-500 text-red-700 dark:text-red-500"
                )}>
                  {batteryHealth === 'good' ? 'Good' : batteryHealth === 'moderate' ? 'Moderate' : 'Critical'}
                </Badge>
              </div>
              
              <div className={cn(
                "flex items-center justify-between p-3 rounded-lg",
                frequencyHealth === 'good' ? "bg-green-500/10" : "bg-yellow-500/10"
              )}>
                <div className="flex items-center gap-2">
                  <Zap className={cn(
                    "h-5 w-5",
                    frequencyHealth === 'good' ? "text-green-600 dark:text-green-500" : "text-yellow-600 dark:text-yellow-500"
                  )} />
                  <div className="font-medium">Frequency</div>
                </div>
                <Badge variant="outline" className={cn(
                  frequencyHealth === 'good' ? "border-green-500 text-green-700 dark:text-green-500" : "border-yellow-500 text-yellow-700 dark:text-yellow-500"
                )}>
                  {frequencyHealth === 'good' ? 'Normal' : 'Fluctuating'}
                </Badge>
              </div>
              
              <div className={cn(
                "flex items-center justify-between p-3 rounded-lg",
                voltageHealth === 'good' ? "bg-green-500/10" : "bg-yellow-500/10"
              )}>
                <div className="flex items-center gap-2">
                  <Zap className={cn(
                    "h-5 w-5",
                    voltageHealth === 'good' ? "text-green-600 dark:text-green-500" : "text-yellow-600 dark:text-yellow-500"
                  )} />
                  <div className="font-medium">Voltage</div>
                </div>
                <Badge variant="outline" className={cn(
                  voltageHealth === 'good' ? "border-green-500 text-green-700 dark:text-green-500" : "border-yellow-500 text-yellow-700 dark:text-yellow-500"
                )}>
                  {voltageHealth === 'good' ? 'Normal' : 'Fluctuating'}
                </Badge>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* System Recommendations */}
          <div>
            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider flex items-center mb-4">
              <Lightbulb className="h-4 w-4 mr-1" />
              Smart Recommendations
            </h3>
            
            <div className="space-y-3">
              {needsBatteryCharging && (
                <div className="flex items-start gap-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-200 dark:border-yellow-900/30">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium">Low Battery Reserve</div>
                    <p className="text-sm text-muted-foreground">
                      Consider charging your battery to increase energy reserves for peak usage or outages.
                    </p>
                  </div>
                </div>
              )}
              
              {excessProduction && (
                <div className="flex items-start gap-3 p-3 bg-green-500/10 rounded-lg border border-green-200 dark:border-green-900/30">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium">Excess Generation</div>
                    <p className="text-sm text-muted-foreground">
                      You're producing more than you're using. Consider running energy-intensive tasks now.
                    </p>
                  </div>
                </div>
              )}
              
              {highConsumption && (
                <div className="flex items-start gap-3 p-3 bg-orange-500/10 rounded-lg border border-orange-200 dark:border-orange-900/30">
                  <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium">High Consumption</div>
                    <p className="text-sm text-muted-foreground">
                      Your current consumption is high. Consider reducing non-essential loads to optimize self-consumption.
                    </p>
                  </div>
                </div>
              )}
              
              {!needsBatteryCharging && !excessProduction && !highConsumption && (
                <div className="flex items-start gap-3 p-3 bg-green-500/10 rounded-lg border border-green-200 dark:border-green-900/30">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium">System Operating Optimally</div>
                    <p className="text-sm text-muted-foreground">
                      Your microgrid is currently balanced and operating efficiently.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MicrogridSystemInsights;
