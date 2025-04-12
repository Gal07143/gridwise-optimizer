import React, { useState } from 'react';
import ReferenceLine from '@/components/charts/ReferenceLine';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useEnergyOptimization } from '@/hooks/useEnergyOptimization';
import { OptimizationObjective } from '@/types/optimization';

const EnergyOptimization = () => {
  // This component will display energy optimization data and controls
  const data = [
    { name: '00:00', self: 65, grid: 35, total: 100 },
    { name: '06:00', self: 78, grid: 22, total: 100 },
    { name: '12:00', self: 95, grid: 5, total: 100 },
    { name: '18:00', self: 45, grid: 55, total: 100 },
    { name: '23:59', self: 30, grid: 70, total: 100 },
  ];

  const [objective, setObjective] = useState<OptimizationObjective>("cost");
  const [isControlling, setIsControlling] = useState(false);
  const [optimizationSettings, setOptimizationSettings] = useState({
    priority: "cost" as OptimizationObjective,
    battery_strategy: "time_of_use",
    ev_charging_time: "23:00",
    ev_departure_time: "07:00",
    peak_shaving_enabled: true,
    min_soc: 20,
    max_soc: 80,
    time_window_start: "00:00",
    time_window_end: "23:59",
    objective: "cost" as OptimizationObjective,
    site_id: "site-1",
    priority_device_ids: [] as string[]
  });

  // Use the proper signature for useEnergyOptimization
  const energyOptimizationService = useEnergyOptimization("site-1");

  const handleObjectiveChange = (value: string) => {
    setObjective(value as OptimizationObjective);
    setOptimizationSettings({
      ...optimizationSettings,
      priority: value as OptimizationObjective,
      objective: value as OptimizationObjective,
    });
    
    // Update settings through the service
    energyOptimizationService.updateSettings({
      priority: value as OptimizationObjective,
      objective: value as OptimizationObjective
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Energy Optimization</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Optimization Objective</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={objective} onValueChange={handleObjectiveChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select objective" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cost">Cost Saving</SelectItem>
                <SelectItem value="self_consumption">Self Consumption</SelectItem>
                <SelectItem value="carbon">Carbon Reduction</SelectItem>
                <SelectItem value="peak_shaving">Peak Shaving</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Battery Settings</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="min-soc">Min SoC: {optimizationSettings.min_soc}%</Label>
              <input 
                type="range" 
                id="min-soc" 
                className="w-1/2" 
                value={optimizationSettings.min_soc} 
                min={0} 
                max={50} 
                onChange={e => setOptimizationSettings({
                  ...optimizationSettings,
                  min_soc: parseInt(e.target.value)
                })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="max-soc">Max SoC: {optimizationSettings.max_soc}%</Label>
              <input 
                type="range" 
                id="max-soc" 
                className="w-1/2" 
                value={optimizationSettings.max_soc}
                min={50} 
                max={100} 
                onChange={e => setOptimizationSettings({
                  ...optimizationSettings, 
                  max_soc: parseInt(e.target.value)
                })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Control Settings</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="automatic-control">Automated Control</Label>
              <Switch 
                id="automatic-control" 
                checked={isControlling} 
                onCheckedChange={setIsControlling}
              />
            </div>
            <Button 
              disabled={!isControlling}
              onClick={() => alert('Applying optimization settings...')}
            >
              Apply Settings
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Self Consumption Optimization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="self" stroke="#8884d8" name="Self Consumption %" />
                <Line type="monotone" dataKey="grid" stroke="#82ca9d" name="Grid Import %" />
                <ReferenceLine 
                  y={80} 
                  stroke="#8884d8" 
                  strokeDasharray="3 3" 
                  label="80%"
                />
                <ReferenceLine 
                  y={20} 
                  stroke="#82ca9d" 
                  strokeDasharray="3 3"
                  label="20%"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Device Priorities</CardTitle>
          </CardHeader>
          <CardContent>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select devices to prioritize" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ev-charger">EV Charger</SelectItem>
                <SelectItem value="heat-pump">Heat Pump</SelectItem>
                <SelectItem value="battery">Battery Storage</SelectItem>
                <SelectItem value="appliances">Smart Appliances</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Time Windows</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-time">Start Time</Label>
                <input 
                  type="time" 
                  id="start-time" 
                  className="w-full p-2 border rounded mt-1" 
                  value={optimizationSettings.time_window_start}
                  onChange={e => setOptimizationSettings({
                    ...optimizationSettings,
                    time_window_start: e.target.value
                  })}
                />
              </div>
              <div>
                <Label htmlFor="end-time">End Time</Label>
                <input 
                  type="time" 
                  id="end-time" 
                  className="w-full p-2 border rounded mt-1" 
                  value={optimizationSettings.time_window_end}
                  onChange={e => setOptimizationSettings({
                    ...optimizationSettings,
                    time_window_end: e.target.value
                  })}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="peak-shaving">Peak Shaving</Label>
              <Switch 
                id="peak-shaving" 
                checked={optimizationSettings.peak_shaving_enabled}
                onCheckedChange={(checked) => setOptimizationSettings({
                  ...optimizationSettings,
                  peak_shaving_enabled: checked
                })}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnergyOptimization;
