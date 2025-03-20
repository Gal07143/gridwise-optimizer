
import React, { useState } from 'react';
import SettingsPageTemplate from '@/components/settings/SettingsPageTemplate';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  LineChart, 
  Battery, 
  SunMoon, 
  Zap,
  Settings
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const AlgorithmsSettings = () => {
  const [activeTab, setActiveTab] = useState('optimization');
  
  // Mock settings
  const [optimizationEnabled, setOptimizationEnabled] = useState(true);
  const [optimizationMode, setOptimizationMode] = useState('balanced');
  const [optimizationPriority, setOptimizationPriority] = useState('75');
  
  const [loadForecastEnabled, setLoadForecastEnabled] = useState(true);
  const [loadForecastModel, setLoadForecastModel] = useState('lstm');
  const [loadForecastAccuracy, setLoadForecastAccuracy] = useState('85');
  
  const [batteryManagementEnabled, setBatteryManagementEnabled] = useState(true);
  const [batteryManagementStrategy, setBatteryManagementStrategy] = useState('dynamic');
  const [reserveCapacity, setReserveCapacity] = useState('15');
  
  const [demandResponseEnabled, setDemandResponseEnabled] = useState(false);
  const [demandResponseTrigger, setDemandResponseTrigger] = useState('price');
  const [demandResponseThreshold, setDemandResponseThreshold] = useState('85');
  
  const handleSaveAlgorithms = () => {
    toast.success("Algorithm settings saved successfully");
  };
  
  return (
    <SettingsPageTemplate 
      title="Optimization Algorithms" 
      description="Configure energy optimization and forecasting algorithms"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="mb-4">
          <TabsTrigger value="optimization">
            <Settings className="h-4 w-4 mr-2" />
            Energy Optimization
          </TabsTrigger>
          <TabsTrigger value="forecast">
            <LineChart className="h-4 w-4 mr-2" />
            Load Forecasting
          </TabsTrigger>
          <TabsTrigger value="battery">
            <Battery className="h-4 w-4 mr-2" />
            Battery Management
          </TabsTrigger>
          <TabsTrigger value="demand">
            <Zap className="h-4 w-4 mr-2" />
            Demand Response
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="optimization" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Energy Optimization Algorithm</CardTitle>
                  <CardDescription>
                    Configure the energy optimization algorithm for your system
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="optimization-enabled">Enabled</Label>
                  <Switch 
                    id="optimization-enabled" 
                    checked={optimizationEnabled} 
                    onCheckedChange={setOptimizationEnabled} 
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="optimization-mode">Optimization Mode</Label>
                <Select
                  value={optimizationMode}
                  onValueChange={setOptimizationMode}
                  disabled={!optimizationEnabled}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select optimization mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cost">Cost Savings</SelectItem>
                    <SelectItem value="balanced">Balanced</SelectItem>
                    <SelectItem value="environmental">Environmental Impact</SelectItem>
                    <SelectItem value="resilience">System Resilience</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Choose the primary focus for the optimization algorithm
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="optimization-priority">Cost vs. Renewables Priority</Label>
                  <span>{optimizationPriority}%</span>
                </div>
                <Slider 
                  id="optimization-priority"
                  min={0} 
                  max={100} 
                  step={5} 
                  value={[parseInt(optimizationPriority)]} 
                  onValueChange={(value) => setOptimizationPriority(value[0].toString())}
                  disabled={!optimizationEnabled}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">
                  Higher values prioritize cost savings, lower values prioritize renewable usage
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="update-frequency">Update Frequency (minutes)</Label>
                  <Input 
                    id="update-frequency" 
                    type="number" 
                    defaultValue="15"
                    min="1" 
                    max="60"
                    disabled={!optimizationEnabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prediction-horizon">Prediction Horizon (hours)</Label>
                  <Input 
                    id="prediction-horizon" 
                    type="number" 
                    defaultValue="24"
                    min="1" 
                    max="72"
                    disabled={!optimizationEnabled}
                  />
                </div>
              </div>
              
              <Button 
                className="mt-4" 
                disabled={!optimizationEnabled}
                onClick={handleSaveAlgorithms}
              >
                Save Optimization Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="forecast" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Load Forecasting Algorithm</CardTitle>
                  <CardDescription>
                    Configure the load forecasting algorithm and model parameters
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="forecast-enabled">Enabled</Label>
                  <Switch 
                    id="forecast-enabled" 
                    checked={loadForecastEnabled} 
                    onCheckedChange={setLoadForecastEnabled} 
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="forecast-model">Forecasting Model</Label>
                <Select
                  value={loadForecastModel}
                  onValueChange={setLoadForecastModel}
                  disabled={!loadForecastEnabled}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select forecasting model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="arima">ARIMA</SelectItem>
                    <SelectItem value="lstm">LSTM Neural Network</SelectItem>
                    <SelectItem value="prophet">Prophet</SelectItem>
                    <SelectItem value="ensemble">Ensemble Model</SelectItem>
                    <SelectItem value="xgboost">XGBoost</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Select the machine learning model used for load prediction
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="forecast-accuracy">Model Accuracy Target</Label>
                  <span>{loadForecastAccuracy}%</span>
                </div>
                <Slider 
                  id="forecast-accuracy"
                  min={50} 
                  max={99} 
                  step={1} 
                  value={[parseInt(loadForecastAccuracy)]} 
                  onValueChange={(value) => setLoadForecastAccuracy(value[0].toString())}
                  disabled={!loadForecastEnabled}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">
                  Higher values require more computation but provide more accurate forecasts
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="training-window">Training Window (days)</Label>
                  <Input 
                    id="training-window" 
                    type="number" 
                    defaultValue="30"
                    min="1" 
                    max="365"
                    disabled={!loadForecastEnabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="retrain-frequency">Retraining Frequency (days)</Label>
                  <Input 
                    id="retrain-frequency" 
                    type="number" 
                    defaultValue="7"
                    min="1" 
                    max="30"
                    disabled={!loadForecastEnabled}
                  />
                </div>
              </div>
              
              <Button 
                className="mt-4" 
                disabled={!loadForecastEnabled}
                onClick={handleSaveAlgorithms}
              >
                Save Forecasting Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="battery" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Battery Management Algorithm</CardTitle>
                  <CardDescription>
                    Configure the battery charging and discharging strategies
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="battery-enabled">Enabled</Label>
                  <Switch 
                    id="battery-enabled" 
                    checked={batteryManagementEnabled} 
                    onCheckedChange={setBatteryManagementEnabled} 
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="battery-strategy">Management Strategy</Label>
                <Select
                  value={batteryManagementStrategy}
                  onValueChange={setBatteryManagementStrategy}
                  disabled={!batteryManagementEnabled}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select management strategy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="time-of-use">Time-of-Use Optimization</SelectItem>
                    <SelectItem value="peak-shaving">Peak Shaving</SelectItem>
                    <SelectItem value="dynamic">Dynamic Adaptation</SelectItem>
                    <SelectItem value="backup">Backup Priority</SelectItem>
                    <SelectItem value="self-consumption">Self-Consumption</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Select how the system manages battery charging and discharging
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="reserve-capacity">Reserve Capacity</Label>
                  <span>{reserveCapacity}%</span>
                </div>
                <Slider 
                  id="reserve-capacity"
                  min={0} 
                  max={50} 
                  step={5} 
                  value={[parseInt(reserveCapacity)]} 
                  onValueChange={(value) => setReserveCapacity(value[0].toString())}
                  disabled={!batteryManagementEnabled}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">
                  Minimum battery capacity to maintain for backup or emergency use
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="max-cycles">Max Daily Cycles</Label>
                  <Input 
                    id="max-cycles" 
                    type="number" 
                    defaultValue="1"
                    min="0.5" 
                    max="3"
                    step="0.5"
                    disabled={!batteryManagementEnabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cycle-depth">Max Cycle Depth (%)</Label>
                  <Input 
                    id="cycle-depth" 
                    type="number" 
                    defaultValue="80"
                    min="50" 
                    max="100"
                    disabled={!batteryManagementEnabled}
                  />
                </div>
              </div>
              
              <Button 
                className="mt-4" 
                disabled={!batteryManagementEnabled}
                onClick={handleSaveAlgorithms}
              >
                Save Battery Management Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="demand" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Demand Response Algorithm</CardTitle>
                  <CardDescription>
                    Configure automated demand response settings
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="demand-enabled">Enabled</Label>
                  <Switch 
                    id="demand-enabled" 
                    checked={demandResponseEnabled} 
                    onCheckedChange={setDemandResponseEnabled} 
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="demand-trigger">Response Trigger</Label>
                <Select
                  value={demandResponseTrigger}
                  onValueChange={setDemandResponseTrigger}
                  disabled={!demandResponseEnabled}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select response trigger" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price">Price Signals</SelectItem>
                    <SelectItem value="grid">Grid Stability Signal</SelectItem>
                    <SelectItem value="peak">Peak Demand</SelectItem>
                    <SelectItem value="manual">Manual Trigger</SelectItem>
                    <SelectItem value="schedule">Scheduled Events</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Select what triggers the demand response system
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="demand-threshold">Response Threshold</Label>
                  <span>{demandResponseThreshold}%</span>
                </div>
                <Slider 
                  id="demand-threshold"
                  min={50} 
                  max={95} 
                  step={5} 
                  value={[parseInt(demandResponseThreshold)]} 
                  onValueChange={(value) => setDemandResponseThreshold(value[0].toString())}
                  disabled={!demandResponseEnabled}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">
                  Threshold at which demand response is triggered
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="response-duration">Response Duration (minutes)</Label>
                  <Input 
                    id="response-duration" 
                    type="number" 
                    defaultValue="30"
                    min="5" 
                    max="120"
                    disabled={!demandResponseEnabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recovery-time">Recovery Time (minutes)</Label>
                  <Input 
                    id="recovery-time" 
                    type="number" 
                    defaultValue="15"
                    min="5" 
                    max="60"
                    disabled={!demandResponseEnabled}
                  />
                </div>
              </div>
              
              <Button 
                className="mt-4" 
                disabled={!demandResponseEnabled}
                onClick={handleSaveAlgorithms}
              >
                Save Demand Response Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </SettingsPageTemplate>
  );
};

export default AlgorithmsSettings;
