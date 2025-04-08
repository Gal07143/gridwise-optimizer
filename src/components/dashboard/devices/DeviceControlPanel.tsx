
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Battery, Power, PlugZap, Gauge, Clock, BatteryMedium, BatteryFull, BatteryWarning } from 'lucide-react';
import { useEnergyOptimization } from '@/hooks/useEnergyOptimization';
import { EnergyDevice } from '@/types/energy';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAppStore } from '@/store/appStore';

interface DeviceControlPanelProps {
  device: EnergyDevice;
}

const DeviceControlPanel: React.FC<DeviceControlPanelProps> = ({ device }) => {
  const { currentSite } = useAppStore();
  const siteId = currentSite?.id || '';
  const { controlDevice, isControlling } = useEnergyOptimization(siteId);
  
  const renderControlsByType = () => {
    switch (device.type) {
      case 'battery':
        return renderBatteryControls();
      case 'ev_charger':
        return renderEVChargerControls();
      case 'inverter':
        return renderInverterControls();
      default:
        return renderGenericControls();
    }
  };
  
  const renderBatteryControls = () => {
    const batteryLevel = device.metrics?.state_of_charge || 50;
    const isCharging = device.metrics?.charging || false;
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {batteryLevel < 20 ? (
              <BatteryWarning className="h-5 w-5 text-amber-500" />
            ) : batteryLevel < 60 ? (
              <BatteryMedium className="h-5 w-5 text-blue-500" />
            ) : (
              <BatteryFull className="h-5 w-5 text-green-500" />
            )}
            <span className="font-medium">Battery Level: {batteryLevel}%</span>
          </div>
          <div className="text-sm">
            {isCharging ? (
              <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                <Power className="h-3 w-3" />
                Charging
              </span>
            ) : (
              <span className="text-slate-600 dark:text-slate-400">Idle</span>
            )}
          </div>
        </div>
        
        <Tabs defaultValue="operation">
          <TabsList className="w-full">
            <TabsTrigger value="operation" className="flex-1">Operation</TabsTrigger>
            <TabsTrigger value="limits" className="flex-1">Limits</TabsTrigger>
          </TabsList>
          
          <TabsContent value="operation" className="space-y-4 pt-4">
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                className="flex flex-col p-3 h-auto"
                onClick={() => controlDevice({ deviceId: device.id, command: 'charge', parameters: { rate: 0.5 } })}
                disabled={isControlling}
              >
                <Battery className="h-4 w-4 mb-1" />
                <span className="text-xs">Charge</span>
              </Button>
              
              <Button
                variant="outline"
                className="flex flex-col p-3 h-auto"
                onClick={() => controlDevice({ deviceId: device.id, command: 'idle' })}
                disabled={isControlling}
              >
                <Clock className="h-4 w-4 mb-1" />
                <span className="text-xs">Idle</span>
              </Button>
              
              <Button
                variant="outline"
                className="flex flex-col p-3 h-auto"
                onClick={() => controlDevice({ deviceId: device.id, command: 'discharge', parameters: { rate: 0.5 } })}
                disabled={isControlling}
              >
                <Power className="h-4 w-4 mb-1" />
                <span className="text-xs">Discharge</span>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="limits" className="space-y-4 pt-4">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Minimum SoC</span>
                  <span className="text-sm">20%</span>
                </div>
                <Slider
                  defaultValue={[20]}
                  min={0}
                  max={50}
                  step={5}
                  onValueCommit={(value) => 
                    controlDevice({ deviceId: device.id, command: 'setMinSoc', parameters: { value: value[0] } })
                  }
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Maximum SoC</span>
                  <span className="text-sm">90%</span>
                </div>
                <Slider
                  defaultValue={[90]}
                  min={50}
                  max={100}
                  step={5}
                  onValueCommit={(value) => 
                    controlDevice({ deviceId: device.id, command: 'setMaxSoc', parameters: { value: value[0] } })
                  }
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  };
  
  const renderEVChargerControls = () => {
    const chargingPower = device.metrics?.charging_power || 0;
    const isCharging = chargingPower > 0;
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlugZap className="h-5 w-5 text-indigo-500" />
            <span className="font-medium">Charging Status</span>
          </div>
          <div className="text-sm">
            {isCharging ? (
              <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                <Power className="h-3 w-3" />
                {chargingPower} kW
              </span>
            ) : (
              <span className="text-slate-600 dark:text-slate-400">Idle</span>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            className="flex flex-col p-3 h-auto"
            onClick={() => controlDevice({ deviceId: device.id, command: 'startCharging' })}
            disabled={isControlling || isCharging}
          >
            <Power className="h-4 w-4 mb-1" />
            <span className="text-xs">Start</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col p-3 h-auto"
            onClick={() => controlDevice({ deviceId: device.id, command: 'stopCharging' })}
            disabled={isControlling || !isCharging}
          >
            <Clock className="h-4 w-4 mb-1" />
            <span className="text-xs">Stop</span>
          </Button>
        </div>
        
        <div className="space-y-2 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Charging Power</span>
            <span className="text-sm">{Math.round(device.capacity / 2)} kW</span>
          </div>
          <Slider
            defaultValue={[Math.round(device.capacity / 2)]}
            min={1}
            max={Math.round(device.capacity)}
            step={1}
            onValueCommit={(value) => 
              controlDevice({ deviceId: device.id, command: 'setPower', parameters: { power: value[0] } })
            }
          />
        </div>
        
        <Button
          variant="secondary"
          className="w-full mt-2"
          onClick={() => controlDevice({ deviceId: device.id, command: 'scheduleCharging', parameters: {
            startTime: new Date().toISOString(),
            endTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
            targetSoc: 80
          } })}
          disabled={isControlling}
        >
          Schedule Charging
        </Button>
      </div>
    );
  };
  
  const renderInverterControls = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gauge className="h-5 w-5 text-amber-500" />
            <span className="font-medium">Inverter Controls</span>
          </div>
          <div className="text-sm">
            <span className="text-green-600 dark:text-green-400">Active</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            className="flex flex-col p-3 h-auto"
            onClick={() => controlDevice({ deviceId: device.id, command: 'enable' })}
            disabled={isControlling}
          >
            <Power className="h-4 w-4 mb-1" />
            <span className="text-xs">Enable</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col p-3 h-auto"
            onClick={() => controlDevice({ deviceId: device.id, command: 'disable' })}
            disabled={isControlling}
          >
            <Clock className="h-4 w-4 mb-1" />
            <span className="text-xs">Disable</span>
          </Button>
        </div>
        
        <div className="space-y-2 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Power Limit</span>
            <span className="text-sm">50%</span>
          </div>
          <Slider
            defaultValue={[50]}
            min={10}
            max={100}
            step={5}
            onValueCommit={(value) => 
              controlDevice({ deviceId: device.id, command: 'setActivePowerLimit', parameters: { value: value[0] } })
            }
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Power Factor</span>
            <span className="text-sm">1.0</span>
          </div>
          <Slider
            defaultValue={[100]}
            min={80}
            max={100}
            step={1}
            onValueCommit={(value) => 
              controlDevice({ deviceId: device.id, command: 'setPowerFactor', parameters: { value: value[0] / 100 } })
            }
          />
        </div>
      </div>
    );
  };
  
  const renderGenericControls = () => {
    return (
      <div className="text-center py-4">
        <p className="text-slate-500">No specific controls available for this device type.</p>
        <p className="text-sm mt-1">View device details and metrics in the monitoring section.</p>
      </div>
    );
  };
  
  return (
    <Card className="shadow-sm border border-slate-200 dark:border-slate-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{device.name}</CardTitle>
        <CardDescription>Control and configure device settings</CardDescription>
      </CardHeader>
      
      <CardContent>
        {renderControlsByType()}
      </CardContent>
    </Card>
  );
};

export default DeviceControlPanel;
