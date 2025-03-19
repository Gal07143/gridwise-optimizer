
import React, { useState, useEffect } from 'react';
import SettingsPageTemplate from '@/components/settings/SettingsPageTemplate';
import { Brain, BarChart3, Settings2, Clock, Zap, CloudRain, DollarSign, Save, RotateCw, Share2, Lightbulb, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface AlgorithmProps {
  id: string;
  name: string;
  description: string;
  active: boolean;
  icon: React.ReactNode;
  trainingProgress?: number;
  trainingStatus?: 'idle' | 'training' | 'complete' | 'error';
  lastTrainedAt?: string;
  confidence?: number;
  settings: {
    aggressiveness: number;
    weatherInfluence: number;
    economicWeight: number;
    learningRate?: number;
    adaptiveControl?: boolean;
  };
}

interface TrainingParams {
  datapoints: number;
  epochs: number;
  includeHistoricalData: boolean;
  includeForecastData: boolean;
  includeWeatherData: boolean;
}

const OptimizationAlgorithms = () => {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState('balanced');
  const [runSimulation, setRunSimulation] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeTab, setActiveTab] = useState('algorithms');
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  
  const [trainingParams, setTrainingParams] = useState<TrainingParams>({
    datapoints: 1000,
    epochs: 10,
    includeHistoricalData: true,
    includeForecastData: true,
    includeWeatherData: true
  });
  
  const [algorithms, setAlgorithms] = useState<AlgorithmProps[]>([
    {
      id: 'battery_optimization',
      name: 'Battery Optimization',
      description: 'Optimizes battery charging and discharging cycles based on usage patterns',
      active: true,
      icon: <Zap size={18} />,
      trainingProgress: 100,
      trainingStatus: 'complete',
      lastTrainedAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
      confidence: 87,
      settings: {
        aggressiveness: 65,
        weatherInfluence: 80,
        economicWeight: 70,
        learningRate: 0.01,
        adaptiveControl: true
      }
    },
    {
      id: 'load_prediction',
      name: 'Load Prediction',
      description: 'Predicts future energy consumption patterns using time-series forecasting',
      active: true,
      icon: <BarChart3 size={18} />,
      trainingProgress: 100,
      trainingStatus: 'complete',
      lastTrainedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      confidence: 91,
      settings: {
        aggressiveness: 50,
        weatherInfluence: 60,
        economicWeight: 80,
        learningRate: 0.005,
        adaptiveControl: true
      }
    },
    {
      id: 'weather_adaptation',
      name: 'Weather Adaptation',
      description: 'Adjusts energy strategy based on weather forecasts and historical correlations',
      active: true,
      icon: <CloudRain size={18} />,
      trainingProgress: 100,
      trainingStatus: 'complete',
      lastTrainedAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
      confidence: 84,
      settings: {
        aggressiveness: 75,
        weatherInfluence: 90,
        economicWeight: 60,
        learningRate: 0.008,
        adaptiveControl: true
      }
    },
    {
      id: 'economic_optimization',
      name: 'Economic Optimization',
      description: 'Minimizes energy costs based on time-of-use rates and market conditions',
      active: true,
      icon: <DollarSign size={18} />,
      trainingProgress: 100,
      trainingStatus: 'complete',
      lastTrainedAt: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
      confidence: 89,
      settings: {
        aggressiveness: 80,
        weatherInfluence: 40,
        economicWeight: 95,
        learningRate: 0.01,
        adaptiveControl: false
      }
    },
    {
      id: 'ai_coordinator',
      name: 'AI Coordinator',
      description: 'Meta-algorithm that coordinates all optimization systems using reinforcement learning',
      active: true,
      icon: <Brain size={18} />,
      trainingProgress: 75,
      trainingStatus: 'training',
      lastTrainedAt: new Date().toISOString(),
      confidence: 78,
      settings: {
        aggressiveness: 70,
        weatherInfluence: 70,
        economicWeight: 70,
        learningRate: 0.02,
        adaptiveControl: true
      }
    }
  ]);
  
  const [changed, setChanged] = useState(false);
  
  useEffect(() => {
    // Check if we have real data to train on
    const checkDataAvailability = async () => {
      try {
        const { count, error } = await supabase
          .from('energy_readings')
          .select('*', { count: 'exact', head: true });
        
        if (error) throw error;
        
        if (count === 0) {
          toast.info("No energy readings found", {
            description: "To train algorithms, you'll need to collect real device data first."
          });
        }
      } catch (error) {
        console.error("Error checking data availability:", error);
      }
    };
    
    checkDataAvailability();
  }, []);
  
  // Simulate AI Coordinator training progress
  useEffect(() => {
    const aiCoordinatorAlgo = algorithms.find(algo => algo.id === 'ai_coordinator');
    
    if (aiCoordinatorAlgo && aiCoordinatorAlgo.trainingStatus === 'training') {
      const interval = setInterval(() => {
        setAlgorithms(prevAlgos => {
          return prevAlgos.map(algo => {
            if (algo.id === 'ai_coordinator') {
              const newProgress = Math.min(100, (algo.trainingProgress || 0) + 5);
              return {
                ...algo,
                trainingProgress: newProgress,
                trainingStatus: newProgress === 100 ? 'complete' : 'training',
                confidence: newProgress === 100 ? 92 : algo.confidence
              };
            }
            return algo;
          });
        });
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [algorithms]);
  
  const handleAlgorithmToggle = (index: number) => {
    const updatedAlgorithms = [...algorithms];
    updatedAlgorithms[index].active = !updatedAlgorithms[index].active;
    setAlgorithms(updatedAlgorithms);
    setChanged(true);
  };
  
  const handleSettingChange = (
    index: number, 
    setting: 'aggressiveness' | 'weatherInfluence' | 'economicWeight' | 'learningRate' | 'adaptiveControl',
    value: number | boolean
  ) => {
    const updatedAlgorithms = [...algorithms];
    
    if (setting === 'adaptiveControl') {
      updatedAlgorithms[index].settings.adaptiveControl = value as boolean;
    } else {
      updatedAlgorithms[index].settings[setting] = value as number;
    }
    
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
          ...algo.settings,
          aggressiveness: 65,
          weatherInfluence: 65,
          economicWeight: 65
        }
      }));
    } else if (value === 'adaptive') {
      updatedAlgorithms = updatedAlgorithms.map(algo => ({
        ...algo,
        settings: {
          ...algo.settings,
          adaptiveControl: true,
          learningRate: Math.max(algo.settings.learningRate || 0.01, 0.01)
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
          ...algo.settings,
          aggressiveness: Math.min(Math.max(algo.settings.aggressiveness + Math.floor(Math.random() * 10) - 5, 0), 100),
          weatherInfluence: Math.min(Math.max(algo.settings.weatherInfluence + Math.floor(Math.random() * 10) - 5, 0), 100),
          economicWeight: Math.min(Math.max(algo.settings.economicWeight + Math.floor(Math.random() * 10) - 5, 0), 100)
        }
      }));
      
      setAlgorithms(calibratedAlgorithms);
      setChanged(true);
    }, 5000);
  };
  
  const handleTrainingParamChange = (param: keyof TrainingParams, value: number | boolean) => {
    setTrainingParams(prev => ({
      ...prev,
      [param]: value
    }));
  };
  
  const startTraining = () => {
    setIsTraining(true);
    setTrainingProgress(0);
    
    // Mock training process
    const interval = setInterval(() => {
      setTrainingProgress(prev => {
        const newProgress = prev + (10 - Math.floor(Math.random() * 5));
        if (newProgress >= 100) {
          clearInterval(interval);
          
          // Update all algorithms to show newly trained
          setAlgorithms(prevAlgos => 
            prevAlgos.map(algo => ({
              ...algo,
              trainingProgress: 100,
              trainingStatus: 'complete',
              lastTrainedAt: new Date().toISOString(),
              confidence: Math.min(Math.max(algo.confidence || 80, 0) + Math.floor(Math.random() * 8) - 2, 100)
            }))
          );
          
          setTimeout(() => {
            setIsTraining(false);
            toast.success("AI training completed successfully!", {
              description: "The optimization algorithms have been updated with new machine learning models."
            });
          }, 500);
          
          return 100;
        }
        return newProgress;
      });
    }, 1000);
    
    toast.info("Starting AI model training", {
      description: `Training with ${trainingParams.datapoints} datapoints over ${trainingParams.epochs} epochs`
    });
  };
  
  const handleViewMetrics = () => {
    navigate('/analytics');
    toast.info("Navigating to analytics to view algorithm performance metrics");
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
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="algorithms">Algorithm Settings</TabsTrigger>
            <TabsTrigger value="training">AI Training</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="algorithms">
            <div className="bg-primary/5 p-4 rounded-lg">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Brain size={18} />
                <span>AI Optimization Algorithms</span>
              </h3>
              <p className="text-sm text-muted-foreground">Configure machine learning algorithms for energy system optimization</p>
            </div>
            
            <Card className="p-5 mt-6">
              <h3 className="text-base font-medium mb-4">Optimization Mode</h3>
              
              <RadioGroup 
                value={selectedMode} 
                onValueChange={handleModeChange} 
                className="grid grid-cols-1 md:grid-cols-4 gap-4"
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
                
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="adaptive" id="adaptive" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="adaptive" className="font-medium cursor-pointer">Adaptive AI</Label>
                    <p className="text-sm text-muted-foreground">Let AI continuously adapt and optimize</p>
                  </div>
                </div>
              </RadioGroup>
            </Card>
            
            <div className="grid gap-4 mt-6">
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
                          
                          {algorithm.trainingStatus === 'training' && (
                            <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <span className="animate-pulse">⦿</span> Training
                            </span>
                          )}
                          
                          {algorithm.confidence && algorithm.trainingStatus === 'complete' && (
                            <span className="text-xs bg-blue-50 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-2 py-0.5 rounded-full">
                              {algorithm.confidence}% Confidence
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{algorithm.description}</p>
                        
                        {algorithm.lastTrainedAt && algorithm.trainingStatus === 'complete' && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Last trained: {new Date(algorithm.lastTrainedAt).toLocaleString()}
                          </p>
                        )}
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
                      
                      {showAdvanced && (
                        <>
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm">Learning Rate</span>
                              <span className="text-sm font-medium">{algorithm.settings.learningRate || 0.01}</span>
                            </div>
                            <Slider
                              value={[algorithm.settings.learningRate ? algorithm.settings.learningRate * 100 : 1]}
                              min={0.1}
                              max={5}
                              step={0.1}
                              onValueChange={(value) => handleSettingChange(index, 'learningRate', value[0] / 100)}
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              Controls how quickly the algorithm adapts to new data
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-sm">Adaptive Control</h4>
                              <p className="text-xs text-muted-foreground">Allow algorithm to self-adjust parameters</p>
                            </div>
                            <Switch 
                              checked={algorithm.settings.adaptiveControl || false} 
                              onCheckedChange={(checked) => handleSettingChange(index, 'adaptiveControl', checked)} 
                            />
                          </div>
                        </>
                      )}
                    </div>
                  )}
                  
                  {algorithm.trainingStatus === 'training' && (
                    <div className="mt-4 pl-12">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Training Progress</span>
                        <span>{algorithm.trainingProgress}%</span>
                      </div>
                      <Progress value={algorithm.trainingProgress} className="h-2" />
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="training">
            <div className="bg-blue-500/10 border border-blue-200 dark:border-blue-900 p-4 rounded-lg mb-6">
              <div className="flex gap-3">
                <Lightbulb className="h-10 w-10 text-blue-500 shrink-0" />
                <div>
                  <h3 className="text-lg font-medium text-blue-700 dark:text-blue-300">AI Model Training</h3>
                  <p className="text-sm mt-1">
                    Train machine learning models on your actual energy data to improve prediction accuracy and optimization 
                    efficiency. Regular training helps the system adapt to changing patterns and conditions.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-5">
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <Database size={18} />
                  Training Data Settings
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>Data Points for Training</Label>
                      <span className="text-sm font-medium">{trainingParams.datapoints}</span>
                    </div>
                    <Slider
                      value={[trainingParams.datapoints]}
                      min={100}
                      max={10000}
                      step={100}
                      onValueChange={(value) => handleTrainingParamChange('datapoints', value[0])}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Number of historical data points to use for training
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>Training Epochs</Label>
                      <span className="text-sm font-medium">{trainingParams.epochs}</span>
                    </div>
                    <Slider
                      value={[trainingParams.epochs]}
                      min={1}
                      max={50}
                      step={1}
                      onValueChange={(value) => handleTrainingParamChange('epochs', value[0])}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Number of complete passes through the training dataset
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Include Historical Data</Label>
                      <p className="text-xs text-muted-foreground">Use past energy consumption and production data</p>
                    </div>
                    <Switch 
                      checked={trainingParams.includeHistoricalData} 
                      onCheckedChange={(checked) => handleTrainingParamChange('includeHistoricalData', checked)} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Include Forecast Data</Label>
                      <p className="text-xs text-muted-foreground">Use energy forecast data for training</p>
                    </div>
                    <Switch 
                      checked={trainingParams.includeForecastData} 
                      onCheckedChange={(checked) => handleTrainingParamChange('includeForecastData', checked)} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Include Weather Data</Label>
                      <p className="text-xs text-muted-foreground">Incorporate weather patterns in training</p>
                    </div>
                    <Switch 
                      checked={trainingParams.includeWeatherData} 
                      onCheckedChange={(checked) => handleTrainingParamChange('includeWeatherData', checked)} 
                    />
                  </div>
                </div>
              </Card>
              
              <Card className="p-5">
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <Brain size={18} />
                  AI Training Status
                </h3>
                
                {isTraining ? (
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Training Progress</span>
                      <span>{trainingProgress}%</span>
                    </div>
                    <Progress value={trainingProgress} className="h-3" />
                    
                    <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-md">
                      <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        Training algorithms with {trainingParams.datapoints} data points over {trainingParams.epochs} epochs
                      </p>
                      <p className="text-xs mt-1 text-blue-600 dark:text-blue-400">
                        This process may take several minutes to complete. You can continue using other parts of the application.
                      </p>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button variant="outline" disabled>Training in Progress...</Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-md">
                        <h4 className="text-sm font-medium mb-1">Last Trained</h4>
                        <p className="text-base">
                          {algorithms.some(a => a.lastTrainedAt) 
                            ? new Date(algorithms.sort((a, b) => 
                                new Date(b.lastTrainedAt || '').getTime() - 
                                new Date(a.lastTrainedAt || '').getTime())[0].lastTrainedAt || '').toLocaleDateString()
                            : 'Never'}
                        </p>
                      </div>
                      
                      <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-md">
                        <h4 className="text-sm font-medium mb-1">Average Confidence</h4>
                        <p className="text-base">
                          {algorithms.filter(a => a.confidence).length > 0
                            ? `${Math.floor(algorithms.reduce((acc, a) => acc + (a.confidence || 0), 0) / 
                                algorithms.filter(a => a.confidence).length)}%`
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-md">
                      <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        Regular training improves performance
                      </p>
                      <p className="text-xs mt-1 text-blue-600 dark:text-blue-400">
                        For best results, train algorithms at least once per week or whenever significant changes occur in your energy patterns.
                      </p>
                    </div>
                    
                    <div className="flex justify-between">
                      <Button variant="outline" onClick={handleViewMetrics}>
                        View Metrics
                      </Button>
                      <Button onClick={startTraining}>
                        Start Training
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </div>
            
            <Card className="p-5 mt-6">
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <Share2 size={18} />
                Knowledge Sharing
              </h3>
              
              <div className="space-y-4">
                <p className="text-sm">
                  Contribute to the collective intelligence network by safely sharing anonymized insights from your system.
                  This helps improve the performance of all participating systems.
                </p>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Share Anonymous Insights</Label>
                    <p className="text-xs text-muted-foreground">Contribute to collective intelligence (no personal data shared)</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Receive Network Insights</Label>
                    <p className="text-xs text-muted-foreground">Benefit from insights shared by other systems</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="advanced">
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
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-medium">Show Advanced Parameters</h4>
                  <p className="text-sm text-muted-foreground">Display additional technical parameters for fine-tuning</p>
                </div>
                <Switch checked={showAdvanced} onCheckedChange={setShowAdvanced} />
              </div>
              
              <Separator className="my-6" />
              
              <h3 className="text-lg font-medium">Model Configuration</h3>
              
              <div className="space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-medium">Reinforcement Learning</h4>
                    <p className="text-sm text-muted-foreground">Use reinforcement learning for policy optimization</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-medium">Ensemble Models</h4>
                    <p className="text-sm text-muted-foreground">Combine multiple models for improved accuracy</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-medium">Transfer Learning</h4>
                    <p className="text-sm text-muted-foreground">Apply knowledge from pre-trained models</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="flex justify-end">
                <Button variant="destructive" onClick={() => {
                  toast.info("Resetting all algorithms to default settings...");
                  setTimeout(() => {
                    toast.success("All algorithms reset to factory defaults");
                    setAlgorithms(algorithms.map(algo => ({
                      ...algo,
                      settings: {
                        aggressiveness: 65,
                        weatherInfluence: 65,
                        economicWeight: 65,
                        learningRate: 0.01,
                        adaptiveControl: true
                      }
                    })));
                    setChanged(true);
                  }, 1500);
                }}>
                  Reset to Defaults
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </SettingsPageTemplate>
  );
};

export default OptimizationAlgorithms;
