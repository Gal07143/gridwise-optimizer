
import React from 'react';
import { 
  Sun, 
  Wind, 
  Battery, 
  Bolt, 
  Cable,
  Clock,
  ArrowRightLeft,
  Activity,
  ArrowUp,
  ArrowDown,
  Info,
  RadioTower
} from 'lucide-react';
import { MicrogridState } from './types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface StatusOverviewProps {
  microgridState: MicrogridState;
}

const StatusOverview: React.FC<StatusOverviewProps> = ({ microgridState }) => {
  // Calculate time since last update
  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const lastUpdated = new Date(timestamp);
    const seconds = Math.floor((now.getTime() - lastUpdated.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    return `${Math.floor(seconds / 3600)} hours ago`;
  };

  // Calculate total production
  const totalProduction = microgridState.solarProduction + microgridState.windProduction;

  // Calculate net energy flow
  const netEnergyFlow = totalProduction - microgridState.loadConsumption;

  // Calculate self-sufficiency
  const selfSufficiency = microgridState.loadConsumption > 0 
    ? Math.min(100, (totalProduction / microgridState.loadConsumption) * 100) 
    : 0;

  return (
    <Card className="overflow-hidden border-slate-200/60 dark:border-slate-800/60 shadow-lg">
      <CardHeader className="bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10">
        <CardTitle className="flex items-center text-lg">
          <Bolt className="mr-2 h-5 w-5 text-primary" />
          Microgrid Status Overview
        </CardTitle>
        <CardDescription>
          Real-time energy flow and system status
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Generation Section */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider flex items-center">
              <Activity className="h-4 w-4 mr-1" />
              Generation
            </h3>
                        
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100/50 dark:from-yellow-900/20 dark:to-yellow-800/10 rounded-xl p-4 border border-yellow-200/50 dark:border-yellow-800/30">
              <div className="flex items-center gap-3">
                <Sun className="h-8 w-8 text-yellow-500" />
                <div>
                  <div className="font-medium">Solar Power</div>
                  <div className="text-2xl font-bold">{microgridState.solarProduction.toFixed(1)} kW</div>
                </div>
              </div>
              
              <div className="mt-2">
                <Progress 
                  value={microgridState.solarProduction / 0.2} 
                  className="h-2 bg-yellow-200 dark:bg-yellow-900"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0 kW</span>
                  <span>20 kW</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-xl p-4 border border-blue-200/50 dark:border-blue-800/30">
              <div className="flex items-center gap-3">
                <Wind className="h-8 w-8 text-blue-500" />
                <div>
                  <div className="font-medium">Wind Power</div>
                  <div className="text-2xl font-bold">{microgridState.windProduction.toFixed(1)} kW</div>
                </div>
              </div>
              
              <div className="mt-2">
                <Progress 
                  value={microgridState.windProduction / 0.15} 
                  className="h-2 bg-blue-200 dark:bg-blue-900"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0 kW</span>
                  <span>15 kW</span>
                </div>
              </div>
            </div>
            
            <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <div className="text-sm text-muted-foreground">Total Generation</div>
              <div className="text-2xl font-bold">{totalProduction.toFixed(1)} kW</div>
            </div>
          </div>
          
          {/* Battery & Energy Flow Section */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-36 h-36 border-8 border-primary/10 rounded-full flex items-center justify-center">
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "absolute bottom-0 left-0 right-0 bg-primary/20 transition-all ease-in-out duration-700",
                    microgridState.batteryCharge > 80 ? "bg-green-500/30" : 
                    microgridState.batteryCharge > 40 ? "bg-primary/30" : 
                    microgridState.batteryCharge > 20 ? "bg-yellow-500/30" : "bg-red-500/30"
                  )}
                  style={{ height: `${microgridState.batteryCharge}%` }}
                ></div>
              </div>
              <div className="text-center z-10">
                <Battery className={cn(
                  "h-8 w-8 mx-auto mb-1",
                  microgridState.batteryCharge > 80 ? "text-green-500" : 
                  microgridState.batteryCharge > 40 ? "text-primary" : 
                  microgridState.batteryCharge > 20 ? "text-yellow-500" : "text-red-500"
                )} />
                <div className="text-2xl font-bold">{microgridState.batteryCharge.toFixed(0)}%</div>
              </div>
            </div>
            
            <div className="mt-4 text-center space-y-1">
              <h3 className="font-semibold">Battery Storage</h3>
              <div className={cn(
                "text-sm font-medium px-2 py-1 rounded-full inline-flex items-center",
                microgridState.batteryDischargeEnabled 
                  ? "bg-green-500/10 text-green-700 dark:text-green-500" 
                  : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
              )}>
                {microgridState.batteryDischargeEnabled ? 'Discharge Enabled' : 'Discharge Disabled'}
              </div>
            </div>
            
            <div className="mt-4 w-full">
              <div className="flex justify-center items-center gap-4">
                <Badge variant={netEnergyFlow >= 0 ? "outline" : "secondary"} className="flex items-center gap-1">
                  <ArrowUp className="h-3 w-3" />
                  Charging
                </Badge>
                <Badge variant={netEnergyFlow < 0 ? "outline" : "secondary"} className="flex items-center gap-1">
                  <ArrowDown className="h-3 w-3" />
                  Discharging
                </Badge>
              </div>
            </div>
          </div>
          
          {/* Consumption & Grid Section */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider flex items-center">
              <Activity className="h-4 w-4 mr-1" />
              Consumption & Grid
            </h3>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 rounded-xl p-4 border border-purple-200/50 dark:border-purple-800/30">
              <div className="flex items-center gap-3">
                <Bolt className="h-8 w-8 text-purple-500" />
                <div>
                  <div className="font-medium">Load Consumption</div>
                  <div className="text-2xl font-bold">{microgridState.loadConsumption.toFixed(1)} kW</div>
                </div>
              </div>
              
              <div className="mt-2">
                <Progress 
                  value={microgridState.loadConsumption / 0.2} 
                  className="h-2 bg-purple-200 dark:bg-purple-900"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0 kW</span>
                  <span>20 kW</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-900/20 dark:to-slate-800/10 rounded-xl p-4 border border-slate-200/50 dark:border-slate-800/30">
              <div className="flex items-center gap-3">
                <Cable className="h-8 w-8 text-slate-500" />
                <div>
                  <div className="font-medium">Grid Exchange</div>
                  <div className="flex justify-start gap-4">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Import</div>
                      <div className="text-lg font-semibold">{microgridState.gridImport.toFixed(1)} kW</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Export</div>
                      <div className="text-lg font-semibold">{microgridState.gridExport.toFixed(1)} kW</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <div className="text-sm text-muted-foreground">Self-Sufficiency</div>
              <div className="text-2xl font-bold">{selfSufficiency.toFixed(0)}%</div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="inline-flex items-center mt-1 cursor-help text-xs text-muted-foreground">
                      <Info className="h-3 w-3 mr-1" />
                      What is this?
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs max-w-xs">
                      Self-sufficiency measures how much of your energy consumption is covered by your own generation.
                      100% means you're generating all the energy you consume.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full">
            <Clock className="h-4 w-4 text-slate-500" />
            <span className="text-sm">Last updated: {getTimeAgo(microgridState.lastUpdated)}</span>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full">
            <RadioTower className="h-4 w-4 text-slate-500" />
            <span className="text-sm">Frequency: {microgridState.frequency.toFixed(2)} Hz</span>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full">
            <Bolt className="h-4 w-4 text-slate-500" />
            <span className="text-sm">Voltage: {microgridState.voltage.toFixed(1)} V</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center py-3">
        <div>
          <Badge variant="outline" className={cn(
            "mr-2",
            microgridState.gridConnection ? "border-green-500 text-green-700 dark:text-green-500" : 
                                      "border-yellow-500 text-yellow-700 dark:text-yellow-500"
          )}>
            {microgridState.gridConnection ? 'Grid Connected' : 'Island Mode'}
          </Badge>
          <Badge variant="outline" className="border-primary text-primary">
            {microgridState.operatingMode.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Badge>
        </div>
        <div className={cn(
          "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
          microgridState.operatingMode === 'automatic' ? "bg-green-500/10 text-green-700 dark:text-green-500" : 
          "bg-blue-500/10 text-blue-700 dark:text-blue-500"
        )}>
          <div className="h-1.5 w-1.5 rounded-full bg-current animate-pulse"></div>
          System Active
        </div>
      </CardFooter>
    </Card>
  );
};

export default StatusOverview;
