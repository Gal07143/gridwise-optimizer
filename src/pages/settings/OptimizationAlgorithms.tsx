
import React, { useState } from 'react';
import SettingsPageTemplate from '@/components/settings/SettingsPageTemplate';
import { CircuitBoard, ToggleLeft, Settings2, Save, RefreshCw, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';

interface AlgorithmProps {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  status: 'active' | 'inactive' | 'warning' | 'error';
  priority: number;
  lastRun: string;
  impact: 'high' | 'medium' | 'low';
  parameters?: {
    name: string;
    value: number;
    min: number;
    max: number;
    unit: string;
  }[];
}

const OptimizationAlgorithms = () => {
  const [energyAlgorithms, setEnergyAlgorithms] = useState<AlgorithmProps[]>([
    {
      id: 'peak-shaving',
      name: 'Peak Load Shaving',
      description: 'Reduces peak demand charges by optimizing battery discharge during high consumption periods',
      enabled: true,
      status: 'active',
      priority: 90,
      lastRun: '2025-03-22T18:45:00Z',
      impact: 'high',
      parameters: [
        {
          name: 'Peak Threshold',
          value: 15,
          min: 5,
          max: 30,
          unit: 'kW'
        },
        {
          name: 'Response Time',
          value: 5,
          min: 1,
          max: 15,
          unit: 'min'
        }
      ]
    },
    {
      id: 'self-consumption',
      name: 'Self-Consumption Optimization',
      description: 'Maximizes usage of on-site generation before drawing from the grid',
      enabled: true,
      status: 'active',
      priority: 80,
      lastRun: '2025-03-22T19:15:00Z',
      impact: 'high',
      parameters: [
        {
          name: 'Min Battery Reserve',
          value: 20,
          min: 10,
          max: 50,
          unit: '%'
        }
      ]
    },
    {
      id: 'tou-arbitrage',
      name: 'Time-of-Use Arbitrage',
      description: 'Charges battery during low-cost periods and discharges during high-cost periods',
      enabled: false,
      status: 'inactive',
      priority: 70,
      lastRun: '2025-03-21T22:30:00Z',
      impact: 'medium',
      parameters: [
        {
          name: 'Price Differential Threshold',
          value: 0.05,
          min: 0.01,
          max: 0.2,
          unit: '$/kWh'
        }
      ]
    }
  ]);
  
  const [batteryAlgorithms, setBatteryAlgorithms] = useState<AlgorithmProps[]>([
    {
      id: 'battery-health',
      name: 'Battery Health Manager',
      description: 'Optimizes charging patterns to prolong battery lifespan and health',
      enabled: true,
      status: 'warning',
      priority: 85,
      lastRun: '2025-03-22T19:00:00Z',
      impact: 'high',
      parameters: [
        {
          name: 'Max Depth of Discharge',
          value: 80,
          min: 50,
          max: 95,
          unit: '%'
        },
        {
          name: 'Charge Rate Limit',
          value: 0.5,
          min: 0.2,
          max: 1,
          unit: 'C'
        }
      ]
    },
    {
      id: 'temperature-management',
      name: 'Battery Temperature Management',
      description: 'Adjusts battery operation based on temperature conditions',
      enabled: true,
      status: 'active',
      priority: 75,
      lastRun: '2025-03-22T18:30:00Z',
      impact: 'medium',
      parameters: [
        {
          name: 'High Temp Threshold',
          value: 35,
          min: 25,
          max: 45,
          unit: '°C'
        }
      ]
    }
  ]);
  
  const [changed, setChanged] = useState(false);
  
  const handleAlgorithmToggle = (
    algorithmId: string, 
    type: 'energy' | 'battery'
  ) => {
    if (type === 'energy') {
      setEnergyAlgorithms(prev => 
        prev.map(algo => 
          algo.id === algorithmId 
            ? { ...algo, enabled: !algo.enabled, status: !algo.enabled ? 'active' : 'inactive' } 
            : algo
        )
      );
    } else {
      setBatteryAlgorithms(prev => 
        prev.map(algo => 
          algo.id === algorithmId 
            ? { ...algo, enabled: !algo.enabled, status: !algo.enabled ? 'active' : 'inactive' } 
            : algo
        )
      );
    }
    setChanged(true);
  };
  
  const handleParamChange = (
    algorithmId: string,
    paramName: string,
    value: number,
    type: 'energy' | 'battery'
  ) => {
    if (type === 'energy') {
      setEnergyAlgorithms(prev => 
        prev.map(algo => 
          algo.id === algorithmId 
            ? { 
                ...algo, 
                parameters: algo.parameters?.map(param => 
                  param.name === paramName 
                    ? { ...param, value } 
                    : param
                ) 
              } 
            : algo
        )
      );
    } else {
      setBatteryAlgorithms(prev => 
        prev.map(algo => 
          algo.id === algorithmId 
            ? { 
                ...algo, 
                parameters: algo.parameters?.map(param => 
                  param.name === paramName 
                    ? { ...param, value } 
                    : param
                ) 
              } 
            : algo
        )
      );
    }
    setChanged(true);
  };
  
  const handlePriorityChange = (
    algorithmId: string,
    value: number,
    type: 'energy' | 'battery'
  ) => {
    if (type === 'energy') {
      setEnergyAlgorithms(prev => 
        prev.map(algo => 
          algo.id === algorithmId 
            ? { ...algo, priority: value } 
            : algo
        )
      );
    } else {
      setBatteryAlgorithms(prev => 
        prev.map(algo => 
          algo.id === algorithmId 
            ? { ...algo, priority: value } 
            : algo
        )
      );
    }
    setChanged(true);
  };
  
  const handleRunNow = (algorithmId: string, type: 'energy' | 'battery') => {
    toast.loading(`Running ${type === 'energy' ? 'energy' : 'battery'} algorithm...`);
    
    // Simulate algorithm execution
    setTimeout(() => {
      const now = new Date().toISOString();
      
      if (type === 'energy') {
        setEnergyAlgorithms(prev => 
          prev.map(algo => 
            algo.id === algorithmId 
              ? { ...algo, lastRun: now, status: 'active' } 
              : algo
          )
        );
      } else {
        setBatteryAlgorithms(prev => 
          prev.map(algo => 
            algo.id === algorithmId 
              ? { ...algo, lastRun: now, status: 'active' } 
              : algo
          )
        );
      }
      
      toast.success(`Algorithm executed successfully`);
    }, 2000);
  };
  
  const handleSaveChanges = () => {
    toast.loading("Saving algorithm configurations...");
    
    // Simulate saving to backend
    setTimeout(() => {
      toast.success("Algorithm settings saved successfully");
      setChanged(false);
    }, 1500);
  };

  const getStatusBadge = (status: 'active' | 'inactive' | 'warning' | 'error') => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Active
          </Badge>
        );
      case 'inactive':
        return (
          <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-800">
            <ToggleLeft className="w-3 h-3 mr-1" /> Inactive
          </Badge>
        );
      case 'warning':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800">
            <AlertTriangle className="w-3 h-3 mr-1" /> Warning
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
            <Info className="w-3 h-3 mr-1" /> Error
          </Badge>
        );
    }
  };

  const renderAlgorithmCard = (algorithm: AlgorithmProps, type: 'energy' | 'battery') => {
    return (
      <Card key={algorithm.id} className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
            <div>
              <CardTitle className="text-lg">{algorithm.name}</CardTitle>
              <CardDescription>{algorithm.description}</CardDescription>
            </div>
            <div className="flex gap-2 items-center">
              {getStatusBadge(algorithm.status)}
              <Badge variant="outline" className={
                algorithm.impact === 'high' 
                  ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800'
                  : algorithm.impact === 'medium'
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800'
                    : 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800'
              }>
                {algorithm.impact === 'high' ? 'High Impact' : algorithm.impact === 'medium' ? 'Medium Impact' : 'Low Impact'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Enable Algorithm</h4>
                <p className="text-xs text-muted-foreground">Turn on/off this optimization algorithm</p>
              </div>
              <Switch 
                checked={algorithm.enabled} 
                onCheckedChange={() => handleAlgorithmToggle(algorithm.id, type)}
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <div>
                  <h4 className="text-sm font-medium">Priority Level</h4>
                  <p className="text-xs text-muted-foreground">Set the execution priority of this algorithm</p>
                </div>
                <span className="text-sm font-medium">{algorithm.priority}%</span>
              </div>
              <Slider
                value={[algorithm.priority]}
                min={0}
                max={100}
                step={5}
                onValueChange={(value) => handlePriorityChange(algorithm.id, value[0], type)}
                disabled={!algorithm.enabled}
                className="h-2"
              />
            </div>
            
            {algorithm.parameters && algorithm.parameters.length > 0 && (
              <div className="mt-2">
                <h4 className="text-sm font-medium mb-3">Algorithm Parameters</h4>
                <div className="space-y-4">
                  {algorithm.parameters.map((param) => (
                    <div key={param.name} className="ml-2">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs">{param.name}</span>
                        <span className="text-xs font-medium">{param.value} {param.unit}</span>
                      </div>
                      <Slider
                        value={[param.value]}
                        min={param.min}
                        max={param.max}
                        step={(param.max - param.min) / 20}
                        onValueChange={(value) => handleParamChange(algorithm.id, param.name, value[0], type)}
                        disabled={!algorithm.enabled}
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <div className="text-xs text-muted-foreground">
            Last run: {new Date(algorithm.lastRun).toLocaleString()}
          </div>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => handleRunNow(algorithm.id, type)}
            disabled={!algorithm.enabled}
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1" />
            Run Now
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <SettingsPageTemplate 
      title="Optimization Algorithms" 
      description="Configure energy management algorithms and optimization strategies"
      headerIcon={<CircuitBoard size={20} />}
      actions={
        <Button 
          onClick={handleSaveChanges} 
          disabled={!changed}
          className="gap-2"
        >
          <Save size={16} />
          Save Changes
        </Button>
      }
    >
      <Tabs defaultValue="energy">
        <TabsList className="mb-6">
          <TabsTrigger value="energy" className="gap-2">
            <Settings2 size={14} />
            Energy Optimization
          </TabsTrigger>
          <TabsTrigger value="battery" className="gap-2">
            <ToggleLeft size={14} />
            Battery Management
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="energy" className="space-y-6">
          <div className="bg-primary/5 p-4 rounded-lg">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Settings2 size={18} />
              <span>Energy Optimization Algorithms</span>
            </h3>
            <p className="text-sm text-muted-foreground">Configure algorithms that optimize energy flow and consumption patterns</p>
          </div>
          
          <div className="grid gap-4">
            {energyAlgorithms.map(algorithm => renderAlgorithmCard(algorithm, 'energy'))}
          </div>
        </TabsContent>
        
        <TabsContent value="battery" className="space-y-6">
          <div className="bg-primary/5 p-4 rounded-lg">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <ToggleLeft size={18} />
              <span>Battery Management Algorithms</span>
            </h3>
            <p className="text-sm text-muted-foreground">Configure algorithms focused on battery health and performance optimization</p>
          </div>
          
          <div className="grid gap-4">
            {batteryAlgorithms.map(algorithm => renderAlgorithmCard(algorithm, 'battery'))}
          </div>
        </TabsContent>
      </Tabs>
      
      <Separator className="my-6" />
      
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4">Scheduling Settings</h3>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Enable Algorithm Scheduler</h4>
                  <p className="text-xs text-muted-foreground">Run algorithms on a set schedule</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Adaptive Learning</h4>
                  <p className="text-xs text-muted-foreground">Use AI to improve algorithm parameters over time</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Override User Settings</h4>
                  <p className="text-xs text-muted-foreground">Allow algorithms to override manual settings in critical situations</p>
                </div>
                <Switch />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SettingsPageTemplate>
  );
};

export default OptimizationAlgorithms;
