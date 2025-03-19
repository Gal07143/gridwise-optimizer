
import React from 'react';
import { 
  Settings, 
  RefreshCw, 
  ZapOff, 
  Cable, 
  AlertTriangle 
} from 'lucide-react';
import { MicrogridState } from './types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

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
    <Card>
      <CardHeader className="bg-primary/5">
        <CardTitle className="flex items-center text-lg">
          <Settings className="mr-2 h-5 w-5 text-primary" />
          Microgrid Controls
        </CardTitle>
        <CardDescription>
          Change operating modes and system behavior
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        <Tabs defaultValue="mode">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="mode">Operating Modes</TabsTrigger>
            <TabsTrigger value="connection">Grid Connection</TabsTrigger>
            <TabsTrigger value="battery">Battery Control</TabsTrigger>
          </TabsList>
          
          <TabsContent value="mode" className="pt-6">
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant={microgridState.operatingMode === 'automatic' ? 'default' : 'outline'}
                className="flex flex-col h-auto py-4"
                onClick={() => onModeChange('automatic')}
              >
                <RefreshCw className="h-10 w-10 mb-2" />
                <span className="font-semibold">Automatic</span>
                <span className="text-xs mt-1">Optimized control</span>
              </Button>
              
              <Button 
                variant={microgridState.operatingMode === 'manual' ? 'default' : 'outline'}
                className="flex flex-col h-auto py-4"
                onClick={() => onModeChange('manual')}
              >
                <Settings className="h-10 w-10 mb-2" />
                <span className="font-semibold">Manual</span>
                <span className="text-xs mt-1">User-defined settings</span>
              </Button>
              
              <Button 
                variant={microgridState.operatingMode === 'island' ? 'default' : 'outline'}
                className="flex flex-col h-auto py-4"
                onClick={() => onModeChange('island')}
                disabled={microgridState.gridConnection}
              >
                <ZapOff className="h-10 w-10 mb-2" />
                <span className="font-semibold">Island Mode</span>
                <span className="text-xs mt-1">Off-grid operation</span>
              </Button>
              
              <Button 
                variant={microgridState.operatingMode === 'grid-connected' ? 'default' : 'outline'}
                className="flex flex-col h-auto py-4"
                onClick={() => onModeChange('grid-connected')}
                disabled={!microgridState.gridConnection}
              >
                <Cable className="h-10 w-10 mb-2" />
                <span className="font-semibold">Grid Connected</span>
                <span className="text-xs mt-1">Grid-tied operation</span>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="connection" className="pt-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="grid-connection" className="text-base font-medium">Grid Connection</Label>
                  <p className="text-sm text-muted-foreground mt-1">Connect or disconnect from the utility grid</p>
                </div>
                <Switch 
                  id="grid-connection" 
                  checked={microgridState.gridConnection}
                  onCheckedChange={onGridConnectionToggle}
                />
              </div>
              
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <h4 className="font-medium mb-2">Grid Connection Status</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Import Power</div>
                    <div className="text-lg font-semibold">{microgridState.gridImport.toFixed(1)} kW</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Export Power</div>
                    <div className="text-lg font-semibold">{microgridState.gridExport.toFixed(1)} kW</div>
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
              </div>
              
              <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-200 dark:border-yellow-900">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-700 dark:text-yellow-400">Important Notice</h4>
                    <p className="text-sm mt-1">
                      Disconnecting from the grid will immediately switch the system to island mode. 
                      Ensure you have sufficient battery capacity before disconnecting.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="battery" className="pt-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="battery-discharge" className="text-base font-medium">Battery Discharge</Label>
                  <p className="text-sm text-muted-foreground mt-1">Allow the battery to discharge for energy supply</p>
                </div>
                <Switch 
                  id="battery-discharge" 
                  checked={microgridState.batteryDischargeEnabled}
                  onCheckedChange={onBatteryDischargeToggle}
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <Label htmlFor="min-reserve" className="text-base font-medium">Minimum Reserve Level</Label>
                  <span>{minBatteryReserve}%</span>
                </div>
                <Slider 
                  id="min-reserve"
                  min={5}
                  max={50}
                  step={5}
                  value={[minBatteryReserve]}
                  onValueChange={(value) => onBatteryReserveChange(value[0])}
                />
                <p className="text-sm text-muted-foreground mt-2">
                  The battery will not discharge below this level to preserve battery health and emergency capacity
                </p>
              </div>
              
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <h4 className="font-medium mb-2">Battery Status</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Charge Level</div>
                    <div className="text-lg font-semibold">{microgridState.batteryCharge.toFixed(0)}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Discharge Status</div>
                    <div className="text-lg font-semibold">{microgridState.batteryDischargeEnabled ? 'Enabled' : 'Disabled'}</div>
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
    </Card>
  );
};

export default MicrogridControls;
