
import React, { useState } from 'react';
import SettingsPageTemplate from '@/components/settings/SettingsPageTemplate';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Code, Brain, ChartLine, Sparkles, Calendar, BarChart, Cpu } from 'lucide-react';

const AlgorithmsSettings = () => {
  const [batteryOptimization, setBatteryOptimization] = useState({
    enabled: true,
    algorithm: "reinforcement",
    prioritizeSelfConsumption: true,
    learningRate: 0.1,
    explorationRate: 0.2
  });
  
  const [loadForecasting, setLoadForecasting] = useState({
    enabled: true,
    algorithm: "lstm",
    historicalDataPoints: 14,
    predictionHorizon: 24,
    updateFrequency: "hourly"
  });
  
  const [economicOptimization, setEconomicOptimization] = useState({
    enabled: true,
    algorithm: "milp",
    objectives: ["cost", "emissions"],
    timeHorizon: 24,
    intradayReoptimization: true
  });
  
  const handleSave = () => {
    // In a real application, you would save these values to the database
    toast.success("Optimization algorithms updated successfully");
  };

  return (
    <SettingsPageTemplate 
      title="Optimization Algorithms" 
      description="Configure AI optimization algorithms for the energy management system"
      headerIcon={<Brain size={24} />}
    >
      <Tabs defaultValue="battery" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="battery">Battery Optimization</TabsTrigger>
          <TabsTrigger value="forecasting">Load Forecasting</TabsTrigger>
          <TabsTrigger value="economic">Economic Optimization</TabsTrigger>
        </TabsList>
        
        <TabsContent value="battery" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="mr-2 h-5 w-5 text-primary" />
                Battery Optimization Algorithm
              </CardTitle>
              <CardDescription>
                Configure the AI algorithm that optimizes battery charging and discharging
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="battery-algorithm-enabled">Battery Optimization</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable AI-based battery charging/discharging optimization
                  </p>
                </div>
                <Switch 
                  id="battery-algorithm-enabled" 
                  checked={batteryOptimization.enabled}
                  onCheckedChange={(checked) => setBatteryOptimization({...batteryOptimization, enabled: checked})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="battery-algorithm">Optimization Algorithm</Label>
                <Select 
                  id="battery-algorithm"
                  value={batteryOptimization.algorithm}
                  onValueChange={(value) => setBatteryOptimization({...batteryOptimization, algorithm: value})}
                  disabled={!batteryOptimization.enabled}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select algorithm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reinforcement">Reinforcement Learning</SelectItem>
                    <SelectItem value="mpc">Model Predictive Control</SelectItem>
                    <SelectItem value="rule">Rule-based Heuristics</SelectItem>
                    <SelectItem value="hybrid">Hybrid (RL+MPC)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Algorithm used to optimize battery operations
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="prioritize-self-consumption">Prioritize Self-Consumption</Label>
                  <p className="text-sm text-muted-foreground">
                    Prioritize self-consumption of generated energy
                  </p>
                </div>
                <Switch 
                  id="prioritize-self-consumption" 
                  checked={batteryOptimization.prioritizeSelfConsumption}
                  onCheckedChange={(checked) => setBatteryOptimization({...batteryOptimization, prioritizeSelfConsumption: checked})}
                  disabled={!batteryOptimization.enabled}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="learning-rate">Learning Rate: {batteryOptimization.learningRate}</Label>
                </div>
                <Slider 
                  id="learning-rate" 
                  min={0.01} 
                  max={0.5} 
                  step={0.01} 
                  value={[batteryOptimization.learningRate]}
                  onValueChange={(value) => setBatteryOptimization({...batteryOptimization, learningRate: value[0]})}
                  disabled={!batteryOptimization.enabled || batteryOptimization.algorithm !== "reinforcement"}
                />
                <p className="text-xs text-muted-foreground">
                  Rate at which the algorithm learns from new data
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="exploration-rate">Exploration Rate: {batteryOptimization.explorationRate}</Label>
                </div>
                <Slider 
                  id="exploration-rate" 
                  min={0.01} 
                  max={0.5} 
                  step={0.01} 
                  value={[batteryOptimization.explorationRate]}
                  onValueChange={(value) => setBatteryOptimization({...batteryOptimization, explorationRate: value[0]})}
                  disabled={!batteryOptimization.enabled || batteryOptimization.algorithm !== "reinforcement"}
                />
                <p className="text-xs text-muted-foreground">
                  Rate at which the algorithm explores new actions
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center text-sm text-muted-foreground">
                <Cpu className="h-4 w-4 mr-2" />
                <span>Algorithm runs every 15 minutes</span>
              </div>
              <Button variant="outline" size="sm" disabled={!batteryOptimization.enabled}>
                Reset to Defaults
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="forecasting" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ChartLine className="mr-2 h-5 w-5 text-primary" />
                Load Forecasting Algorithm
              </CardTitle>
              <CardDescription>
                Configure the AI algorithm that predicts future energy consumption
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="forecasting-enabled">Load Forecasting</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable AI-based load forecasting
                  </p>
                </div>
                <Switch 
                  id="forecasting-enabled" 
                  checked={loadForecasting.enabled}
                  onCheckedChange={(checked) => setLoadForecasting({...loadForecasting, enabled: checked})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="forecasting-algorithm">Forecasting Algorithm</Label>
                <Select 
                  id="forecasting-algorithm"
                  value={loadForecasting.algorithm}
                  onValueChange={(value) => setLoadForecasting({...loadForecasting, algorithm: value})}
                  disabled={!loadForecasting.enabled}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select algorithm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lstm">LSTM Neural Network</SelectItem>
                    <SelectItem value="prophet">Prophet</SelectItem>
                    <SelectItem value="arima">ARIMA</SelectItem>
                    <SelectItem value="ensemble">Ensemble Model</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Algorithm used to forecast future load
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="historical-data">Historical Data Points (days): {loadForecasting.historicalDataPoints}</Label>
                </div>
                <Slider 
                  id="historical-data" 
                  min={1} 
                  max={30} 
                  step={1} 
                  value={[loadForecasting.historicalDataPoints]}
                  onValueChange={(value) => setLoadForecasting({...loadForecasting, historicalDataPoints: value[0]})}
                  disabled={!loadForecasting.enabled}
                />
                <p className="text-xs text-muted-foreground">
                  Number of days of historical data used for prediction
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="prediction-horizon">Prediction Horizon (hours): {loadForecasting.predictionHorizon}</Label>
                </div>
                <Slider 
                  id="prediction-horizon" 
                  min={1} 
                  max={48} 
                  step={1} 
                  value={[loadForecasting.predictionHorizon]}
                  onValueChange={(value) => setLoadForecasting({...loadForecasting, predictionHorizon: value[0]})}
                  disabled={!loadForecasting.enabled}
                />
                <p className="text-xs text-muted-foreground">
                  How far into the future to predict
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="update-frequency">Update Frequency</Label>
                <Select 
                  id="update-frequency"
                  value={loadForecasting.updateFrequency}
                  onValueChange={(value) => setLoadForecasting({...loadForecasting, updateFrequency: value})}
                  disabled={!loadForecasting.enabled}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15min">Every 15 minutes</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="6hours">Every 6 hours</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  How often the forecast is updated
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex items-center text-blue-600 text-sm">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Weather data is automatically incorporated</span>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="economic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart className="mr-2 h-5 w-5 text-primary" />
                Economic Optimization Algorithm
              </CardTitle>
              <CardDescription>
                Configure the AI algorithm that optimizes energy costs and revenue
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="economic-enabled">Economic Optimization</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable AI-based economic optimization
                  </p>
                </div>
                <Switch 
                  id="economic-enabled" 
                  checked={economicOptimization.enabled}
                  onCheckedChange={(checked) => setEconomicOptimization({...economicOptimization, enabled: checked})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="economic-algorithm">Optimization Algorithm</Label>
                <Select 
                  id="economic-algorithm"
                  value={economicOptimization.algorithm}
                  onValueChange={(value) => setEconomicOptimization({...economicOptimization, algorithm: value})}
                  disabled={!economicOptimization.enabled}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select algorithm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="milp">Mixed Integer Linear Programming</SelectItem>
                    <SelectItem value="dp">Dynamic Programming</SelectItem>
                    <SelectItem value="ga">Genetic Algorithm</SelectItem>
                    <SelectItem value="custom">Custom Algorithm</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Algorithm used for economic optimization
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="optimization-objectives">Optimization Objectives</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="cost-objective" 
                      checked={economicOptimization.objectives.includes("cost")}
                      onCheckedChange={(checked) => {
                        const newObjectives = checked 
                          ? [...economicOptimization.objectives, "cost"] 
                          : economicOptimization.objectives.filter(obj => obj !== "cost");
                        setEconomicOptimization({...economicOptimization, objectives: newObjectives});
                      }}
                      disabled={!economicOptimization.enabled}
                    />
                    <Label htmlFor="cost-objective">Cost Minimization</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="revenue-objective" 
                      checked={economicOptimization.objectives.includes("revenue")}
                      onCheckedChange={(checked) => {
                        const newObjectives = checked 
                          ? [...economicOptimization.objectives, "revenue"] 
                          : economicOptimization.objectives.filter(obj => obj !== "revenue");
                        setEconomicOptimization({...economicOptimization, objectives: newObjectives});
                      }}
                      disabled={!economicOptimization.enabled}
                    />
                    <Label htmlFor="revenue-objective">Revenue Maximization</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="emissions-objective" 
                      checked={economicOptimization.objectives.includes("emissions")}
                      onCheckedChange={(checked) => {
                        const newObjectives = checked 
                          ? [...economicOptimization.objectives, "emissions"] 
                          : economicOptimization.objectives.filter(obj => obj !== "emissions");
                        setEconomicOptimization({...economicOptimization, objectives: newObjectives});
                      }}
                      disabled={!economicOptimization.enabled}
                    />
                    <Label htmlFor="emissions-objective">Emissions Reduction</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="self-consumption-objective" 
                      checked={economicOptimization.objectives.includes("self-consumption")}
                      onCheckedChange={(checked) => {
                        const newObjectives = checked 
                          ? [...economicOptimization.objectives, "self-consumption"] 
                          : economicOptimization.objectives.filter(obj => obj !== "self-consumption");
                        setEconomicOptimization({...economicOptimization, objectives: newObjectives});
                      }}
                      disabled={!economicOptimization.enabled}
                    />
                    <Label htmlFor="self-consumption-objective">Self-Consumption</Label>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Select one or more optimization objectives
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="time-horizon">Time Horizon (hours): {economicOptimization.timeHorizon}</Label>
                </div>
                <Slider 
                  id="time-horizon" 
                  min={1} 
                  max={48} 
                  step={1} 
                  value={[economicOptimization.timeHorizon]}
                  onValueChange={(value) => setEconomicOptimization({...economicOptimization, timeHorizon: value[0]})}
                  disabled={!economicOptimization.enabled}
                />
                <p className="text-xs text-muted-foreground">
                  Planning horizon for optimization
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="intraday-reoptimization">Intraday Re-optimization</Label>
                  <p className="text-sm text-muted-foreground">
                    Re-optimize during the day as conditions change
                  </p>
                </div>
                <Switch 
                  id="intraday-reoptimization" 
                  checked={economicOptimization.intradayReoptimization}
                  onCheckedChange={(checked) => setEconomicOptimization({...economicOptimization, intradayReoptimization: checked})}
                  disabled={!economicOptimization.enabled}
                />
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex items-center text-green-600 text-sm">
                <Code className="h-4 w-4 mr-2" />
                <span>Algorithm uses real-time electricity market data</span>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end mt-8">
        <Button onClick={handleSave}>Save Algorithm Settings</Button>
      </div>
    </SettingsPageTemplate>
  );
};

export default AlgorithmsSettings;
