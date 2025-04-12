import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Main } from '@/components/ui/main';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { useAppStore } from '@/store/appStore';
import { OptimizationSettings, OptimizationObjective } from '@/types/optimization';
import { EnergyDevice } from '@/types/energy';

const mockDevices: EnergyDevice[] = [
  {
    id: 'solar-1',
    name: 'Solar Array',
    type: 'solar',
    status: 'online',
    capacity: 10,
    site_id: 'site-1',
    created_at: new Date().toISOString(),
    last_updated: new Date().toISOString(),
  },
  {
    id: 'battery-1',
    name: 'Battery Storage',
    type: 'battery',
    status: 'online',
    capacity: 15,
    site_id: 'site-1',
    created_at: new Date().toISOString(),
    last_updated: new Date().toISOString(),
  },
  {
    id: 'grid-1',
    name: 'Grid Connection',
    type: 'grid',
    status: 'online',
    capacity: 1000,
    site_id: 'site-1',
    created_at: new Date().toISOString(),
    last_updated: new Date().toISOString(),
  },
  {
    id: 'load-1',
    name: 'Main Load',
    type: 'load',
    status: 'online',
    capacity: 5,
    site_id: 'site-1',
    created_at: new Date().toISOString(),
    last_updated: new Date().toISOString(),
  },
];

const EnergyOptimization: React.FC = () => {
  const navigate = useNavigate();
  const { currentSite } = useAppStore();
  const [optimizationSettings, setOptimizationSettings] = useState<OptimizationSettings>({
    priority: 'cost',
    battery_strategy: 'charge_from_solar',
    ev_charging_time: '22:00',
    ev_departure_time: '07:00',
    peak_shaving_enabled: false,
    max_grid_power: 50,
    energy_export_limit: 10,
    min_soc: 20,
    max_soc: 90,
    time_window_start: '06:00',
    time_window_end: '18:00',
    objective: 'cost',
    site_id: currentSite?.id || 'site-1',
    priority_device_ids: [],
    evTargetSoc: 80,
  });
  const [devices, setDevices] = useState<EnergyDevice[]>(mockDevices);
  const [maxPowerLimit, setMaxPowerLimit] = useState(50);
  const [minPowerLimit, setMinPowerLimit] = useState(10);
  const [controlMode, setControlMode] = useState<'manual' | 'auto'>('auto');
  const isControllingSystem = controlMode === 'manual';

  const handlePriorityChange = (value: string) => {
    if (value === 'cost' || value === 'self_consumption' || value === 'carbon' || value === 'peak_shaving') {
      setOptimizationSettings(prev => ({ ...prev, priority: value }));
    }
  };

  const handleBatteryStrategyChange = (value: string) => {
    if (value === 'charge_from_solar' || value === 'time_of_use' || value === 'backup_only') {
      setOptimizationSettings(prev => ({ ...prev, battery_strategy: value }));
    }
  };

  const handleTimeChange = (field: string, value: string) => {
    setOptimizationSettings(prev => ({ ...prev, [field]: value }));
  };

  const handlePeakShavingToggle = (checked: boolean) => {
    setOptimizationSettings(prev => ({ ...prev, peak_shaving_enabled: checked }));
  };

  const handleSliderChange = (field: string, value: number[]) => {
    setOptimizationSettings(prev => ({ ...prev, [field]: value[0] }));
  };

  const handleDeviceSelection = (deviceId: string) => {
    setOptimizationSettings(prev => {
      const deviceIndex = prev.priority_device_ids.indexOf(deviceId);
      if (deviceIndex === -1) {
        return { ...prev, priority_device_ids: [...prev.priority_device_ids, deviceId] };
      } else {
        const newDeviceIds = [...prev.priority_device_ids];
        newDeviceIds.splice(deviceIndex, 1);
        return { ...prev, priority_device_ids: newDeviceIds };
      }
    });
  };

  const handleApplyOptimization = () => {
    console.log('Applying optimization settings:', optimizationSettings);
    navigate('/dashboard');
  };

  const chartData = [
    { time: '00:00', grid: 10, solar: 0, battery: 0 },
    { time: '02:00', grid: 8, solar: 0, battery: 2 },
    { time: '04:00', grid: 5, solar: 1, battery: 4 },
    { time: '06:00', grid: 2, solar: 3, battery: 5 },
    { time: '08:00', grid: 0, solar: 6, battery: 4 },
    { time: '10:00', grid: 1, solar: 8, battery: 1 },
    { time: '12:00', grid: 3, solar: 7, battery: 0 },
    { time: '14:00', grid: 5, solar: 5, battery: 0 },
    { time: '16:00', grid: 7, solar: 3, battery: 0 },
    { time: '18:00', grid: 9, solar: 1, battery: 0 },
    { time: '20:00', grid: 11, solar: 0, battery: 0 },
    { time: '22:00', grid: 10, solar: 0, battery: 0 },
  ];

  return (
    <Main title="Energy Optimization">
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Optimization Settings</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="space-y-4">
              <Label htmlFor="priority">Optimization Priority</Label>
              <Select onValueChange={handlePriorityChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cost">Cost</SelectItem>
                  <SelectItem value="self_consumption">Self Consumption</SelectItem>
                  <SelectItem value="carbon">Carbon Reduction</SelectItem>
                  <SelectItem value="peak_shaving">Peak Shaving</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label htmlFor="battery_strategy">Battery Strategy</Label>
              <Select onValueChange={handleBatteryStrategyChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="charge_from_solar">Charge from Solar</SelectItem>
                  <SelectItem value="time_of_use">Time of Use</SelectItem>
                  <SelectItem value="backup_only">Backup Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ev_charging_time">EV Charging Time</Label>
                <Input
                  type="time"
                  id="ev_charging_time"
                  value={optimizationSettings.ev_charging_time}
                  onChange={(e) => handleTimeChange('ev_charging_time', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ev_departure_time">EV Departure Time</Label>
                <Input
                  type="time"
                  id="ev_departure_time"
                  value={optimizationSettings.ev_departure_time}
                  onChange={(e) => handleTimeChange('ev_departure_time', e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="peak_shaving">Peak Shaving Enabled</Label>
              <Switch
                id="peak_shaving"
                checked={optimizationSettings.peak_shaving_enabled}
                onCheckedChange={handlePeakShavingToggle}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_grid_power">Max Grid Power (kW)</Label>
              <Slider
                id="max_grid_power"
                defaultValue={[optimizationSettings.max_grid_power || 50]}
                max={100}
                step={5}
                onValueChange={(value) => handleSliderChange('max_grid_power', value)}
              />
              <p className="text-sm text-muted-foreground">
                Current: {optimizationSettings.max_grid_power} kW
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="energy_export_limit">Energy Export Limit (kW)</Label>
              <Slider
                id="energy_export_limit"
                defaultValue={[optimizationSettings.energy_export_limit || 10]}
                max={50}
                step={1}
                onValueChange={(value) => handleSliderChange('energy_export_limit', value)}
              />
              <p className="text-sm text-muted-foreground">
                Current: {optimizationSettings.energy_export_limit} kW
              </p>
            </div>
            
            <div className="space-y-4">
              <label>Priority Devices</label>
              <div className="flex gap-2 flex-wrap">
                {devices.map(device => (
                  <div key={device.id} className="border rounded p-2">
                    <label className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={optimizationSettings.priority_device_ids.includes(device.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleDeviceSelection(device.id);
                          } else {
                            handleDeviceSelection(device.id);
                          }
                        }} 
                      />
                      {device.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={handleApplyOptimization}>Apply Optimization</Button>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Real-time Power Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <ReferenceLine y={maxPowerLimit} stroke="#FF0000" strokeDasharray="3 3" value={maxPowerLimit}/>
                  <ReferenceLine y={minPowerLimit} stroke="#0088FE" strokeDasharray="3 3" value={minPowerLimit}/>
                  <Area type="monotone" dataKey="grid" stroke="#8884d8" fill="#8884d8" />
                  <Area type="monotone" dataKey="solar" stroke="#82ca9d" fill="#82ca9d" />
                  <Area type="monotone" dataKey="battery" stroke="#ffc658" fill="#ffc658" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <div className="mb-4">
          <h2 className="text-lg font-medium mb-2">Control Mode</h2>
          <div className="flex gap-4">
            <button 
              className={`px-4 py-2 rounded-md ${!isControllingSystem ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setControlMode('auto')}
            >
              Auto
            </button>
            <button 
              className={`px-4 py-2 rounded-md ${isControllingSystem ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setControlMode('manual')}
            >
              Manual
            </button>
          </div>
        </div>
      </div>
    </Main>
  );
};

export default EnergyOptimization;
