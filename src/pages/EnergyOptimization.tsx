import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { useAppStore } from '@/store/appStore';
import { fetchDevices } from '@/services/supabase/supabaseService';
import { EnergyDevice } from '@/types/energy';
import { useEnergyOptimization } from '@/hooks/useEnergyOptimization';
import { OptimizationSettings } from '@/types/optimization';
import { toast } from 'sonner';
import ReferenceLine from '@/components/charts/ReferenceLine';
import LabelComponent from '@/components/charts/Label';
import Clock from '@/components/ui/Clock';
import Sun from '@/components/ui/Sun';

interface OptimizationResult {
  timestamp: string;
  battery_charge_power: number;
  grid_power: number;
  load_power: number;
  pv_power: number;
  battery_soc: number;
}

const EnergyOptimization = () => {
  const { currentSite } = useAppStore();
  const siteId = currentSite?.id || '';
  const [optimizeEV, setOptimizeEV] = useState(false);
  const [timeWindowStart, setTimeWindowStart] = useState('00:00');
  const [timeWindowEnd, setTimeWindowEnd] = useState('23:59');
  const [evDepartureTime, setEvDepartureTime] = useState('08:00');
  const [evTargetSoc, setEvTargetSoc] = useState(80);
  const [priorityDevices, setPriorityDevices] = useState<string[]>([]);
  const [selectedObjective, setSelectedObjective] = useState<string>('cost');
  const [isPeakShavingEnabled, setIsPeakShavingEnabled] = useState(false);
  const [maxGridPower, setMaxGridPower] = useState<number | undefined>(undefined);
  const [energyExportLimit, setEnergyExportLimit] = useState<number | undefined>(undefined);
  const [minBatterySoc, setMinBatterySoc] = useState(20);
  const [maxBatterySoc, setMaxBatterySoc] = useState(90);
  const [batteryStrategy, setBatteryStrategy] = useState<string>('time_of_use');
  const [optimizationResults, setOptimizationResults] = useState<OptimizationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isApplyingRecommendation, setIsApplyingRecommendation] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isControlling, setIsControlling] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<any>(null);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);

  const {
    runOptimization,
    updateSettings,
    currentSettings,
    controlDevice,
    isControlling,
    applyRecommendation,
  } = useEnergyOptimization(siteId);

  const { data: devices = [] } = useQuery<EnergyDevice[]>({
    queryKey: ['devices', siteId],
    queryFn: () => fetchDevices(siteId),
    enabled: !!siteId,
  });

  const batteryDevices = devices.filter(device => device.type === 'battery');
  const evChargers = devices.filter(device => device.type === 'ev_charger');

  const handleRunOptimization = async () => {
    setIsOptimizing(true);
    setError(null);

    try {
      const deviceIds = [
        ...batteryDevices.map(d => d.id),
        ...(optimizeEV ? evChargers.map(d => d.id) : [])
      ];

      if (deviceIds.length === 0) {
        toast.warning('No optimizable devices found.');
        return;
      }

      const optimizationSettings: OptimizationSettings = {
        priority: selectedObjective as "cost" | "self_consumption" | "carbon",
        battery_strategy: batteryStrategy as "charge_from_solar" | "time_of_use" | "backup_only",
        ev_charging_time: currentSettings.ev_charging_time,
        ev_departure_time: evDepartureTime,
        peak_shaving_enabled: isPeakShavingEnabled,
        max_grid_power: maxGridPower,
        energy_export_limit: energyExportLimit,
        min_soc: minBatterySoc,
        max_soc: maxBatterySoc,
        time_window_start: timeWindowStart,
        time_window_end: timeWindowEnd,
        objective: selectedObjective,
        site_id: siteId,
        priority_device_ids: priorityDevices,
        evTargetSoc: evTargetSoc,
      };

      updateSettings(optimizationSettings);

      const result = await runOptimization(deviceIds);
      setOptimizationResult(result);

      if (result) {
        toast.success('Optimization completed successfully!');
      } else {
        toast.error('Optimization failed.');
      }
    } catch (err: any) {
      console.error('Optimization error:', err);
      setError(err.message || 'Unknown error');
      toast.error(`Optimization failed: ${err.message || 'Unknown error'}`);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleApplyRecommendation = async (recommendationId: string) => {
    setIsApplyingRecommendation(true);
    try {
      const success = await applyRecommendation(recommendationId);
      if (success) {
        toast.success('Recommendation applied successfully!');
      } else {
        toast.error('Failed to apply recommendation.');
      }
    } catch (error: any) {
      console.error('Error applying recommendation:', error);
      toast.error(`Failed to apply recommendation: ${error.message || 'Unknown error'}`);
    } finally {
      setIsApplyingRecommendation(false);
    }
  };

  const handleControlDevice = async (deviceId: string, command: string, parameters?: Record<string, any>) => {
    setIsControlling(true);
    try {
      const result = await controlDevice({ deviceId, command, parameters });
      if (result?.success) {
        toast.success(`Command "${command}" sent to device.`);
      } else {
        toast.error(`Failed to send command "${command}".`);
      }
    } catch (error: any) {
      console.error('Error controlling device:', error);
      toast.error(`Failed to control device: ${error.message || 'Unknown error'}`);
    } finally {
      setIsControlling(false);
    }
  };

  const dailySimulatedData = [
    { timestamp: '00:00', battery_charge_power: 100, grid_power: 500, load_power: 600, pv_power: 0, battery_soc: 20 },
    { timestamp: '02:00', battery_charge_power: 200, grid_power: 400, load_power: 600, pv_power: 0, battery_soc: 30 },
    { timestamp: '04:00', battery_charge_power: 300, grid_power: 300, load_power: 600, pv_power: 0, battery_soc: 40 },
    { timestamp: '06:00', battery_charge_power: 400, grid_power: 200, load_power: 600, pv_power: 100, battery_soc: 50 },
    { timestamp: '08:00', battery_charge_power: 500, grid_power: 100, load_power: 600, pv_power: 200, battery_soc: 60 },
    { timestamp: '10:00', battery_charge_power: 600, grid_power: 0, load_power: 500, pv_power: 300, battery_soc: 70 },
    { timestamp: '12:00', battery_charge_power: 500, grid_power: 100, load_power: 400, pv_power: 400, battery_soc: 80 },
    { timestamp: '14:00', battery_charge_power: 400, grid_power: 200, load_power: 300, pv_power: 500, battery_soc: 90 },
    { timestamp: '16:00', battery_charge_power: 300, grid_power: 300, load_power: 400, pv_power: 400, battery_soc: 80 },
    { timestamp: '18:00', battery_charge_power: 200, grid_power: 400, load_power: 500, pv_power: 300, battery_soc: 70 },
    { timestamp: '20:00', battery_charge_power: 100, grid_power: 500, load_power: 600, pv_power: 200, battery_soc: 60 },
    { timestamp: '22:00', battery_charge_power: 0, grid_power: 600, load_power: 700, pv_power: 100, battery_soc: 50 },
    { timestamp: '24:00', battery_charge_power: 100, grid_power: 500, load_power: 600, pv_power: 0, battery_soc: 40 },
  ];

  const generateCustomColor = (data: any) => {
    const value = typeof data === 'number' ? data : parseInt(data as string, 10);
    return value >= 30 ? '#8884d8' : '#82ca9d';
  };

  return (
    <AppLayout>
      <div className="container mx-auto p-4 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">Energy Optimization</h1>
            <p className="text-muted-foreground">Optimize your energy usage based on forecasts and preferences</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleRunOptimization}
              disabled={isOptimizing}
            >
              {isOptimizing ? 'Optimizing...' : 'Run Optimization'}
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => {
                // Handle refresh logic here
              }}
            >
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-sm border border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Optimization Settings</CardTitle>
              <CardDescription>Configure your preferences for energy optimization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="objective">Optimization Objective</Label>
                  <Select onValueChange={setSelectedObjective} defaultValue={selectedObjective}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select objective" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cost">Cost</SelectItem>
                      <SelectItem value="self_consumption">Self Consumption</SelectItem>
                      <SelectItem value="carbon">Carbon Footprint</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="batteryStrategy">Battery Strategy</Label>
                  <Select onValueChange={setBatteryStrategy} defaultValue={batteryStrategy}>
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="timeWindowStart">Time Window Start</Label>
                    <Input
                      type="time"
                      id="timeWindowStart"
                      value={timeWindowStart}
                      onChange={(e) => setTimeWindowStart(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="timeWindowEnd">Time Window End</Label>
                    <Input
                      type="time"
                      id="timeWindowEnd"
                      value={timeWindowEnd}
                      onChange={(e) => setTimeWindowEnd(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Label htmlFor="peakShaving">Peak Shaving</Label>
                  <Switch id="peakShaving" checked={isPeakShavingEnabled} onCheckedChange={setIsPeakShavingEnabled} />
                </div>

                {isPeakShavingEnabled && (
                  <div>
                    <Label htmlFor="maxGridPower">Max Grid Power (kW)</Label>
                    <Input
                      type="number"
                      id="maxGridPower"
                      value={maxGridPower || ''}
                      onChange={(e) => setMaxGridPower(Number(e.target.value))}
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="energyExportLimit">Energy Export Limit (kW)</Label>
                  <Input
                    type="number"
                    id="energyExportLimit"
                    value={energyExportLimit || ''}
                    onChange={(e) => setEnergyExportLimit(Number(e.target.value))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="minBatterySoc">Min Battery SoC (%)</Label>
                    <Slider
                      id="minBatterySoc"
                      defaultValue={[minBatterySoc]}
                      min={0}
                      max={100}
                      step={5}
                      onValueChange={(value) => setMinBatterySoc(value[0])}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxBatterySoc">Max Battery SoC (%)</Label>
                    <Slider
                      id="maxBatterySoc"
                      defaultValue={[maxBatterySoc]}
                      min={0}
                      max={100}
                      step={5}
                      onValueChange={(value) => setMaxBatterySoc(value[0])}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Label htmlFor="optimizeEV">Optimize EV Charging</Label>
                  <Switch id="optimizeEV" checked={optimizeEV} onCheckedChange={setOptimizeEV} />
                </div>

                {optimizeEV && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="evDepartureTime">EV Departure Time</Label>
                      <Input
                        type="time"
                        id="evDepartureTime"
                        value={evDepartureTime}
                        onChange={(e) => setEvDepartureTime(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="evTargetSoc">EV Target SoC (%)</Label>
                      <Slider
                        id="evTargetSoc"
                        defaultValue={[evTargetSoc]}
                        min={0}
                        max={100}
                        step={5}
                        onValueChange={(value) => setEvTargetSoc(value[0])}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="priorityDevices">Priority Devices</Label>
                  <Select onValueChange={(value) => setPriorityDevices(value ? [value] : [])} multiple>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select priority devices" />
                    </SelectTrigger>
                    <SelectContent>
                      {devices.map((device) => (
                        <SelectItem key={device.id} value={device.id}>
                          {device.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Simulated Optimization Results</CardTitle>
              <CardDescription>A simulated view of how your settings would impact energy flow</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={dailySimulatedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="battery_charge_power" stroke="#8884d8" fill="#8884d8" name="Battery Charge" />
                  <Area type="monotone" dataKey="grid_power" stroke="#82ca9d" fill="#82ca9d" name="Grid Power" />
                  <Area type="monotone" dataKey="load_power" stroke="#ffc658" fill="#ffc658" name="Load Power" />
                  <Area type="monotone" dataKey="pv_power" stroke="#ff7300" fill="#ff7300" name="PV Power" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-sm border border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Optimization Results</CardTitle>
              <CardDescription>View the results of the latest optimization run</CardDescription>
            </CardHeader>
            <CardContent>
              {optimizationResult ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dailySimulatedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="battery_charge_power" fill="#8884d8" name="Battery Charge">
                      {dailySimulatedData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={generateCustomColor(entry.battery_charge_power)} />
                      ))}
                    </Bar>
                    <ReferenceLine y={30} stroke="#A0522D" strokeDasharray="3 3" />
                    <LabelComponent value="Threshold" position="right" />
                    <Bar dataKey="grid_power" fill="#82ca9d" name="Grid Power">
                      {dailySimulatedData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={generateCustomColor(entry.grid_power)} />
                      ))}
                    </Bar>
                    <ReferenceLine y={30} stroke="#A0522D" strokeDasharray="3 3" />
                    <LabelComponent value="Threshold" position="right" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-4">No optimization results available.</div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm border border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Device Control</CardTitle>
              <CardDescription>Manually control connected devices</CardDescription>
            </CardHeader>
            <CardContent>
              {devices.map((device) => (
                <div key={device.id} className="mb-4">
                  <h3 className="text-md font-semibold">{device.name}</h3>
                  <Button
                    variant="outline"
                    onClick={() => handleControlDevice(device.id, 'start', {})}
                    disabled={isControlling}
                  >
                    Start
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleControlDevice(device.id, 'stop', {})}
                    disabled={isControlling}
                  >
                    Stop
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-sm border border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Recommendations</CardTitle>
              <CardDescription>View and apply system recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              {recommendations.length > 0 ? (
                recommendations.map((recommendation) => (
                  <div key={recommendation.id} className="mb-4">
                    <h3 className="text-md font-semibold">{recommendation.title}</h3>
                    <p>{recommendation.description}</p>
                    <Button
                      variant="outline"
                      onClick={() => handleApplyRecommendation(recommendation.id)}
                      disabled={isApplyingRecommendation}
                    >
                      Apply Recommendation
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">No recommendations available.</div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm border border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">System Status</CardTitle>
              <CardDescription>View the current status of your energy system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-md font-semibold">Current Time</h3>
                  <Clock />
                </div>
                <div>
                  <Sun className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default EnergyOptimization;
