
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Device } from '@/types/energy';
import { Power, BarChart3, Battery, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface DeviceControlsPanelProps {
  device: Device;
  onControlChange?: (control: string, value: any) => Promise<void>;
}

const DeviceControlsPanel: React.FC<DeviceControlsPanelProps> = ({ device, onControlChange }) => {
  const [powerState, setPowerState] = useState(device?.status === 'online');
  const [outputLevel, setOutputLevel] = useState(75);
  const [chargingAllowed, setChargingAllowed] = useState(true);
  const [dischargingAllowed, setDischargingAllowed] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Choose controls based on device type
  const renderControls = () => {
    if (!device) return null;
    
    switch (device.type) {
      case 'inverter':
        return (
          <>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="power-state">Power State</Label>
                <Switch 
                  id="power-state" 
                  checked={powerState}
                  onCheckedChange={async (checked) => {
                    setPowerState(checked);
                    await handleControlChange('power', checked);
                  }}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="output-level">Output Level ({outputLevel}%)</Label>
                </div>
                <Slider
                  id="output-level"
                  min={0}
                  max={100}
                  step={5}
                  value={[outputLevel]}
                  onValueChange={(values) => setOutputLevel(values[0])}
                  onValueCommit={async (values) => {
                    await handleControlChange('output', values[0]);
                  }}
                  disabled={!powerState}
                />
              </div>

              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleReset}
                  className="w-full mt-2"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset to Defaults
                </Button>
              </div>
            </div>
          </>
        );
        
      case 'battery':
        return (
          <>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="charging-allowed">Allow Charging</Label>
                <Switch 
                  id="charging-allowed" 
                  checked={chargingAllowed}
                  onCheckedChange={async (checked) => {
                    setChargingAllowed(checked);
                    await handleControlChange('charging', checked);
                  }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="discharging-allowed">Allow Discharging</Label>
                <Switch 
                  id="discharging-allowed" 
                  checked={dischargingAllowed}
                  onCheckedChange={async (checked) => {
                    setDischargingAllowed(checked);
                    await handleControlChange('discharging', checked);
                  }}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="max-charge">Max Charge Rate ({outputLevel}%)</Label>
                </div>
                <Slider
                  id="max-charge"
                  min={0}
                  max={100}
                  step={5}
                  value={[outputLevel]}
                  onValueChange={(values) => setOutputLevel(values[0])}
                  onValueCommit={async (values) => {
                    await handleControlChange('charge_rate', values[0]);
                  }}
                  disabled={!chargingAllowed && !dischargingAllowed}
                />
              </div>
              
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleReset}
                  className="w-full mt-2"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset to Defaults
                </Button>
              </div>
            </div>
          </>
        );
        
      default:
        return (
          <p className="text-center text-muted-foreground py-4">
            No controls available for this device type.
          </p>
        );
    }
  };

  const handleControlChange = async (control: string, value: any) => {
    setIsLoading(true);
    try {
      if (onControlChange) {
        await onControlChange(control, value);
      }
      toast.success(`${device.name}: ${control} set to ${value}`);
    } catch (error) {
      console.error(`Error setting ${control}:`, error);
      toast.error(`Failed to set ${control}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Revert UI state on error
      switch (control) {
        case 'power':
          setPowerState(!value);
          break;
        case 'output':
          setOutputLevel(outputLevel); // Revert to previous value
          break;
        case 'charging':
          setChargingAllowed(!value);
          break;
        case 'discharging':
          setDischargingAllowed(!value);
          break;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    setIsLoading(true);
    try {
      // Set default values
      if (device.type === 'inverter') {
        setPowerState(true);
        setOutputLevel(100);
        if (onControlChange) {
          await onControlChange('power', true);
          await onControlChange('output', 100);
        }
      } else if (device.type === 'battery') {
        setChargingAllowed(true);
        setDischargingAllowed(true);
        setOutputLevel(50);
        if (onControlChange) {
          await onControlChange('charging', true);
          await onControlChange('discharging', true);
          await onControlChange('charge_rate', 50);
        }
      }
      toast.success(`${device.name} reset to default settings`);
    } catch (error) {
      console.error('Error resetting device:', error);
      toast.error(`Failed to reset device: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getIcon = () => {
    switch (device?.type) {
      case 'inverter':
        return <Power className="h-5 w-5 mr-2" />;
      case 'battery':
        return <Battery className="h-5 w-5 mr-2" />;
      default:
        return <BarChart3 className="h-5 w-5 mr-2" />;
    }
  };

  if (!device) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Device Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">No device selected</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          {getIcon()}
          Device Controls
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : (
          renderControls()
        )}
      </CardContent>
    </Card>
  );
};

export default DeviceControlsPanel;
