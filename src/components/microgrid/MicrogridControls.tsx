
import React from 'react';
import { 
  Settings, 
  RefreshCw, 
  ZapOff, 
  Cable, 
  AlertTriangle,
  Battery,
  ArrowRight,
  ChevronRight,
  X
} from 'lucide-react';
import { MicrogridState } from './types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface MicrogridControlsProps {
  microgridState: MicrogridState;
  minBatteryReserve: number;
  onModeChange: (mode: 'automatic' | 'manual' | 'island' | 'grid-connected') => void;
  onGridConnectionToggle: (enabled: boolean) => void;
  onBatteryDischargeToggle: (enabled: boolean) => void;
  onBatteryReserveChange: (value: number) => void;
}

const MicrogridControls: React.FC<MicrogridControlsProps> = ({
  microgridState,
  minBatteryReserve,
  onModeChange,
  onGridConnectionToggle,
  onBatteryDischargeToggle,
  onBatteryReserveChange
}) => {
  return (
    <Card className="overflow-hidden border-slate-200/60 dark:border-slate-800/60 shadow-lg">
      <CardHeader className="bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10">
        <CardTitle className="flex items-center text-lg">
          <Settings className="mr-2 h-5 w-5 text-primary" />
          Microgrid Controls
        </CardTitle>
        <CardDescription>
          Change operating modes and system behavior
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        <Tabs defaultValue="mode" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="mode" className="text-sm">Operating Modes</TabsTrigger>
            <TabsTrigger value="connection" className="text-sm">Grid Connection</TabsTrigger>
            <TabsTrigger value="battery" className="text-sm">Battery Control</TabsTrigger>
          </TabsList>
          
          <TabsContent value="mode" className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant={microgridState.operatingMode === 'automatic' ? 'default' : 'outline'}
                className={cn(
                  "flex flex-col h-auto py-4 transition-all",
                  microgridState.operatingMode === 'automatic' 
                    ? "bg-gradient-to-br from-primary to-primary/80 shadow-md" 
                    : ""
                )}
                onClick={() => onModeChange('automatic')}
              >
                <RefreshCw className={cn(
                  "h-10 w-10 mb-2",
                  microgridState.operatingMode === 'automatic' ? "text-white" : "text-primary"
                )} />
                <span className="font-semibold">Automatic</span>
                <span className={cn(
                  "text-xs mt-1",
                  microgridState.operatingMode === 'automatic' ? "text-white/80" : "text-muted-foreground"
                )}>Optimized control</span>
              </Button>
              
              <Button 
                variant={microgridState.operatingMode === 'manual' ? 'default' : 'outline'}
                className={cn(
                  "flex flex-col h-auto py-4 transition-all",
                  microgridState.operatingMode === 'manual' 
                    ? "bg-gradient-to-br from-primary to-primary/80 shadow-md" 
                    : ""
                )}
                onClick={() => onModeChange('manual')}
              >
                <Settings className={cn(
                  "h-10 w-10 mb-2",
                  microgridState.operatingMode === 'manual' ? "text-white" : "text-primary"
                )} />
                <span className="font-semibold">Manual</span>
                <span className={cn(
                  "text-xs mt-1", 
                  microgridState.operatingMode === 'manual' ? "text-white/80" : "text-muted-foreground"
                )}>User-defined settings</span>
              </Button>
              
              <Button 
                variant={microgridState.operatingMode === 'island' ? 'default' : 'outline'}
                className={cn(
                  "flex flex-col h-auto py-4 transition-all",
                  microgridState.operatingMode === 'island' 
                    ? "bg-gradient-to-br from-primary to-primary/80 shadow-md" 
                    : "",
                  microgridState.gridConnection ? "opacity-50" : ""
                )}
                onClick={() => onModeChange('island')}
                disabled={microgridState.gridConnection}
              >
                <ZapOff className={cn(
                  "h-10 w-10 mb-2",
                  microgridState.operatingMode === 'island' ? "text-white" : "text-primary"
                )} />
                <span className="font-semibold">Island Mode</span>
                <span className={cn(
                  "text-xs mt-1",
                  microgridState.operatingMode === 'island' ? "text-white/80" : "text-muted-foreground"
                )}>Off-grid operation</span>
              </Button>
              
              <Button 
                variant={microgridState.operatingMode === 'grid-connected' ? 'default' : 'outline'}
                className={cn(
                  "flex flex-col h-auto py-4 transition-all",
                  microgridState.operatingMode === 'grid-connected' 
                    ? "bg-gradient-to-br from-primary to-primary/80 shadow-md" 
                    : "",
                  !microgridState.gridConnection ? "opacity-50" : ""
                )}
                onClick={() => onModeChange('grid-connected')}
                disabled={!microgridState.gridConnection}
              >
                <Cable className={cn(
                  "h-10 w-10 mb-2",
                  microgridState.operatingMode === 'grid-connected' ? "text-white" : "text-primary"
                )} />
                <span className="font-semibold">Grid Connected</span>
                <span className={cn(
                  "text-xs mt-1",
                  microgridState.operatingMode === 'grid-connected' ? "text-white/80" : "text-muted-foreground"
                )}>Grid-tied operation</span>
              </Button>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4">
              <h4 className="font-medium text-sm mb-2 flex items-center">
                <ChevronRight className="h-4 w-4 mr-1" />
                Active Mode Information
              </h4>
              <p className="text-sm text-muted-foreground">
                {microgridState.operatingMode === 'automatic' && "Automatic mode optimizes energy flow based on cost, weather, and demand predictions."}
                {microgridState.operatingMode === 'manual' && "Manual mode gives you full control over energy dispatch decisions."}
                {microgridState.operatingMode === 'island' && "Island mode operates independently from the grid using local generation and storage."}
                {microgridState.operatingMode === 'grid-connected' && "Grid-connected mode allows energy exchange with the utility grid."}
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="connection" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="grid-connection" className="text-base font-medium">Grid Connection</Label>
                <p className="text-sm text-muted-foreground mt-1">Connect or disconnect from the utility grid</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{microgridState.gridConnection ? 'Connected' : 'Disconnected'}</span>
                <Switch 
                  id="grid-connection" 
                  checked={microgridState.gridConnection}
                  onCheckedChange={onGridConnectionToggle}
                  className="data-[state=checked]:bg-green-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4">
              <div>
                <div className="text-sm text-muted-foreground">Import Power</div>
                <div className="text-lg font-semibold flex items-center">
                  {microgridState.gridImport.toFixed(1)} kW
                  {microgridState.gridImport > 0 && 
                    <Badge variant="outline" className="ml-2 bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800 text-xs">
                      Importing
                    </Badge>
                  }
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Export Power</div>
                <div className="text-lg font-semibold flex items-center">
                  {microgridState.gridExport.toFixed(1)} kW
                  {microgridState.gridExport > 0 && 
                    <Badge variant="outline" className="ml-2 bg-green-500/10 text-green-600 border-green-200 dark:border-green-800 text-xs">
                      Exporting
                    </Badge>
                  }
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Frequency</div>
                <div className="text-lg font-semibold">{microgridState.frequency.toFixed(2)} Hz</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Voltage</div>
                <div className="text-lg font-semibold">{microgridState.voltage.toFixed(1)} V</div>
              </div>
            </div>
            
            {microgridState.gridConnection && (
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                <div className="text-sm font-medium">Connected to utility grid</div>
                <div className="text-xs text-muted-foreground ml-auto">
                  Grid quality: {microgridState.frequency >= 49.9 && microgridState.frequency <= 50.1 ? 'Excellent' : 'Good'}
                </div>
              </div>
            )}
            
            {!microgridState.gridConnection && (
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4">
                <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse"></div>
                <div className="text-sm font-medium">Disconnected from utility grid</div>
                <div className="text-xs text-muted-foreground ml-auto">
                  Operating in island mode
                </div>
              </div>
            )}
            
            <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-200 dark:border-yellow-900">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-yellow-700 dark:text-yellow-400">Important Notice</h4>
                  <p className="text-sm mt-1">
                    Disconnecting from the grid will immediately switch the system to island mode. 
                    Ensure you have sufficient battery capacity before disconnecting.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="battery" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="battery-discharge" className="text-base font-medium">Battery Discharge</Label>
                <p className="text-sm text-muted-foreground mt-1">Allow the battery to discharge for energy supply</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{microgridState.batteryDischargeEnabled ? 'Enabled' : 'Disabled'}</span>
                <Switch 
                  id="battery-discharge" 
                  checked={microgridState.batteryDischargeEnabled}
                  onCheckedChange={onBatteryDischargeToggle}
                  className="data-[state=checked]:bg-green-500"
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <Label htmlFor="min-reserve" className="text-base font-medium">Minimum Reserve Level</Label>
                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-medium">{minBatteryReserve}%</span>
              </div>
              <div className="pb-4">
                <Slider 
                  id="min-reserve"
                  min={5}
                  max={50}
                  step={5}
                  value={[minBatteryReserve]}
                  onValueChange={(value) => onBatteryReserveChange(value[0])}
                  className="mb-1"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>5%</span>
                  <span>25%</span>
                  <span>50%</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                The battery will not discharge below this level to preserve battery health and emergency capacity
              </p>
            </div>
            
            <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-xl p-4 overflow-hidden border border-slate-200/50 dark:border-slate-700/50">
              <div className="absolute inset-0 bg-battery-pattern opacity-5"></div>
              
              <div className="relative">
                <h4 className="font-medium mb-3">Battery Status</h4>
                
                <div className="w-full h-6 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-3">
                  <div 
                    className={cn(
                      "h-full transition-all duration-500",
                      microgridState.batteryCharge > 50 ? "bg-green-500" : 
                      microgridState.batteryCharge > 20 ? "bg-yellow-500" : "bg-red-500"
                    )}
                    style={{ width: `${microgridState.batteryCharge}%` }}
                  ></div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Charge Level</div>
                    <div className="text-lg font-semibold flex items-center gap-2">
                      <Battery className="h-4 w-4 text-primary" />
                      {microgridState.batteryCharge.toFixed(0)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Discharge Status</div>
                    <div className={cn(
                      "text-sm font-medium px-2 py-1 rounded-full inline-flex items-center",
                      microgridState.batteryDischargeEnabled 
                        ? "bg-green-500/10 text-green-700 dark:text-green-500" 
                        : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                    )}>
                      {microgridState.batteryDischargeEnabled ? 'Enabled' : 'Disabled'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Minimum Reserve</div>
                    <div className="text-lg font-semibold">{minBatteryReserve}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Estimated Runtime</div>
                    <div className="text-lg font-semibold">
                      {Math.floor((microgridState.batteryCharge - minBatteryReserve) / 10)}h {Math.floor(((microgridState.batteryCharge - minBatteryReserve) % 10) * 6)}m
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="bg-slate-50 dark:bg-slate-900/50 flex justify-between">
        <div className="text-xs text-muted-foreground flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          Last updated: {new Date(microgridState.lastUpdated).toLocaleTimeString()}
        </div>
        <Button variant="ghost" size="sm" className="text-xs">
          <ArrowRight className="h-3 w-3 mr-1" />
          View Control History
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MicrogridControls;
