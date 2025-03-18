
import React, { useState } from 'react';
import SettingsPageTemplate from '@/components/settings/SettingsPageTemplate';
import { Brain, BarChart3, Settings2, Clock, Zap, CloudRain, DollarSign, Save, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';

interface AlgorithmProps {
  id: string;
  name: string;
  description: string;
  active: boolean;
  icon: React.ReactNode;
  settings: {
    aggressiveness: number;
    weatherInfluence: number;
    economicWeight: number;
  };
}

const OptimizationAlgorithms = () => {
  const [selectedMode, setSelectedMode] = useState('balanced');
  const [runSimulation, setRunSimulation] = useState(false);
  const [algorithms, setAlgorithms] = useState<AlgorithmProps[]>([
    {
      id: 'battery_optimization',
      name: 'Battery Optimization',
      description: 'Optimizes battery charging and discharging cycles',
      active: true,
      icon: <Zap size={18} />,
      settings: {
        aggressiveness: 65,
        weatherInfluence: 80,
        economicWeight: 70
      }
    },
    {
      id: 'load_prediction',
      name: 'Load Prediction',
      description: 'Predicts future energy consumption patterns',
      active: true,
      icon: <BarChart3 size={18} />,
      settings: {
        aggressiveness: 50,
        weatherInfluence: 60,
        economicWeight: 80
      }
    },
    {
      id: 'weather_adaptation',
      name: 'Weather Adaptation',
      description: 'Adjusts energy strategy based on weather forecasts',
      active: true,
      icon: <CloudRain size={18} />,
      settings: {
        aggressiveness: 75,
        weatherInfluence: 90,
        economicWeight: 60
      }
    },
    {
      id: 'economic_optimization',
      name: 'Economic Optimization',
      description: 'Minimizes energy costs based on time-of-use rates',
      active: true,
      icon: <DollarSign size={18} />,
      settings: {
        aggressiveness: 80,
        weatherInfluence: 40,
        economicWeight: 95
      }
    }
  ]);
  
  const [changed, setChanged] = useState(false);
  
  const handleAlgorithmToggle = (index: number) => {
    const updatedAlgorithms = [...algorithms];
    updatedAlgorithms[index].active = !updatedAlgorithms[index].active;
    setAlgorithms(updatedAlgorithms);
    setChanged(true);
  };
  
  const handleSettingChange = (
    index: number, 
    setting: 'aggressiveness' | 'weatherInfluence' | 'economicWeight',
    value: number
  ) => {
    const updatedAlgorithms = [...algorithms];
    updatedAlgorithms[index].settings[setting] = value;
    setAlgorithms(updatedAlgorithms);
    setChanged(true);
  };
  
  const handleModeChange = (value: string) => {
    setSelectedMode(value);
    
    let updatedAlgorithms = [...algorithms];
    
    if (value === 'economic') {
      updatedAlgorithms = updatedAlgorithms.map(algo => ({
        ...algo,
        settings: {
          ...algo.settings,
          economicWeight: Math.min(algo.settings.economicWeight + 20, 100),
          aggressiveness: algo.id === 'economic_optimization' ? 90 : 60
        }
      }));
    } else if (value === 'eco') {
      updatedAlgorithms = updatedAlgorithms.map(algo => ({
        ...algo,
        settings: {
          ...algo.settings,
          weatherInfluence: Math.min(algo.settings.weatherInfluence + 15, 100),
          economicWeight: Math.max(algo.settings.economicWeight - 10, 0)
        }
      }));
    } else if (value === 'balanced') {
      updatedAlgorithms = updatedAlgorithms.map(algo => ({
        ...algo,
        settings: {
          aggressiveness: 65,
          weatherInfluence: 65,
          economicWeight: 65
        }
      }));
    }
    
    setAlgorithms(updatedAlgorithms);
    setChanged(true);
    
    toast.success(`Switched to ${value.charAt(0).toUpperCase() + value.slice(1)} optimization mode`);
  };
  
  const handleSaveChanges = () => {
    toast.success("Algorithm settings saved successfully");
    
    if (runSimulation) {
      toast.info("Running simulation with new settings...");
      
      // Simulate a delay
      setTimeout(() => {
        toast.success("Simulation complete! Predicted improvement: 12% efficiency gain");
      }, 2000);
    }
    
    setChanged(false);
  };
  
  const handleRunCalibration = () => {
    toast.info("Starting algorithm calibration...");
    
    // Simulate a delay for calibration
    const interval = setInterval(() => {
      toast.info("Calibrating algorithms based on historical data...");
    }, 1500);
    
    // Simulate completion
    setTimeout(() => {
      clearInterval(interval);
      toast.success("Calibration complete! Parameters optimized for current conditions");
      
      // Update algorithms with "calibrated" settings
      const calibratedAlgorithms = algorithms.map(algo => ({
        ...algo,
        settings: {
          aggressiveness: Math.min(Math.max(algo.settings.aggressiveness + Math.floor(Math.random() * 10) - 5, 0), 100),
          weatherInfluence: Math.min(Math.max(algo.settings.weatherInfluence + Math.floor(Math.random() * 10) - 5, 0), 100),
          economicWeight: Math.min(Math.max(algo.settings.economicWeight + Math.floor(Math.random() * 10) - 5, 0), 100)
        }
      }));
      
      setAlgorithms(calibratedAlgorithms);
      setChanged(true);
    }, 5000);
  };

  return (
    <SettingsPageTemplate 
      title="Optimization Algorithms" 
      description="Configure AI and machine learning algorithms for energy optimization"
      headerIcon={<Brain size={20} />}
      actions={
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleRunCalibration}
            className="gap-2"
          >
            <RotateCw size={16} />
            Run Calibration
          </Button>
          <Button 
            onClick={handleSaveChanges} 
            disabled={!changed}
            className="gap-2"
          >
            <Save size={16} />
            Save Changes
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="bg-primary/5 p-4 rounded-lg">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Brain size={18} />
            <span>AI Optimization Algorithms</span>
          </h3>
          <p className="text-sm text-muted-foreground">Configure machine learning algorithms for energy system optimization</p>
        </div>
        
        <Card className="p-5">
          <h3 className="text-base font-medium mb-4">Optimization Mode</h3>
          
          <RadioGroup 
            value={selectedMode} 
            onValueChange={handleModeChange} 
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="economic" id="economic" />
              <div className="grid gap-1.5">
                <Label htmlFor="economic" className="font-medium cursor-pointer">Economic Priority</Label>
                <p className="text-sm text-muted-foreground">Prioritize cost savings and economic efficiency</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="balanced" id="balanced" />
              <div className="grid gap-1.5">
                <Label htmlFor="balanced" className="font-medium cursor-pointer">Balanced Optimization</Label>
                <p className="text-sm text-muted-foreground">Balance between cost, efficiency, and sustainability</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="eco" id="eco" />
              <div className="grid gap-1.5">
                <Label htmlFor="eco" className="font-medium cursor-pointer">Eco Priority</Label>
                <p className="text-sm text-muted-foreground">Prioritize environmental impact and sustainability</p>
              </div>
            </div>
          </RadioGroup>
        </Card>
        
        <div className="grid gap-4">
          {algorithms.map((algorithm, index) => (
            <Card key={algorithm.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <div className="rounded-full p-2 bg-primary/10 text-primary mt-1">
                    {algorithm.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-medium">{algorithm.name}</h4>
                      {algorithm.active ? (
                        <span className="text-xs bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 px-2 py-0.5 rounded-full">
                          Active
                        </span>
                      ) : (
                        <span className="text-xs bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100 px-2 py-0.5 rounded-full">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{algorithm.description}</p>
                  </div>
                </div>
                <Switch 
                  checked={algorithm.active} 
                  onCheckedChange={() => handleAlgorithmToggle(index)} 
                />
              </div>
              
              {algorithm.active && (
                <div className="mt-6 space-y-6 pl-12">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Aggressiveness</span>
                      <span className="text-sm font-medium">{algorithm.settings.aggressiveness}%</span>
                    </div>
                    <Slider
                      value={[algorithm.settings.aggressiveness]}
                      min={0}
                      max={100}
                      step={5}
                      onValueChange={(value) => handleSettingChange(index, 'aggressiveness', value[0])}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      How aggressively the algorithm responds to changing conditions
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Weather Influence</span>
                      <span className="text-sm font-medium">{algorithm.settings.weatherInfluence}%</span>
                    </div>
                    <Slider
                      value={[algorithm.settings.weatherInfluence]}
                      min={0}
                      max={100}
                      step={5}
                      onValueChange={(value) => handleSettingChange(index, 'weatherInfluence', value[0])}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      How much weather forecasts affect algorithm decisions
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Economic Weight</span>
                      <span className="text-sm font-medium">{algorithm.settings.economicWeight}%</span>
                    </div>
                    <Slider
                      value={[algorithm.settings.economicWeight]}
                      min={0}
                      max={100}
                      step={5}
                      onValueChange={(value) => handleSettingChange(index, 'economicWeight', value[0])}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Priority given to economic factors in decisions
                    </p>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Advanced Settings</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-medium">Run Simulation Before Applying</h4>
              <p className="text-sm text-muted-foreground">Simulate changes before applying them to production</p>
            </div>
            <Switch checked={runSimulation} onCheckedChange={setRunSimulation} />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-medium">Auto-calibration</h4>
              <p className="text-sm text-muted-foreground">Automatically calibrate algorithms weekly</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-medium">Learning Mode</h4>
              <p className="text-sm text-muted-foreground">Continuously improve algorithms based on actual data</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>
    </SettingsPageTemplate>
  );
};

export default OptimizationAlgorithms;
