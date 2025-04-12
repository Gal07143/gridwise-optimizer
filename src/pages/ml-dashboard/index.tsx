import React, { useState, useEffect } from 'react';
import { AIAgentDecisions } from '@/components/AIAgentDecisions';
import { MLInsights } from '@/components/MLInsights';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Brain, Activity, Settings, RefreshCw, 
  AlertTriangle, LineChart, BarChart, PieChart
} from 'lucide-react';
import { MLService } from '@/services/mlService';
import { EnergyManagementService } from '@/services/energyManagementService';
import { Device } from '@/types/device';
import { TelemetryData } from '@/types/telemetry';

export default function MLDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [telemetryData, setTelemetryData] = useState<TelemetryData[]>([]);
  const [mlSettings, setMLSettings] = useState({
    enableAutonomousActions: false,
    confidenceThreshold: 0.7,
    enablePredictiveMaintenance: true,
    enableCostOptimization: true,
    enableUserBehaviorLearning: true
  });
  const [performanceMetrics, setPerformanceMetrics] = useState({
    accuracy: 0,
    precision: 0,
    recall: 0,
    f1Score: 0,
    latency: 0
  });

  // Initialize services
  const [mlService] = useState(() => new MLService({
    modelPath: '/models/energy_prediction',
    inputShape: [24, 10],
    outputShape: [24],
    featureNames: ['consumption', 'temperature', 'time', 'day_of_week'],
    modelType: 'consumption'
  }));

  const [energyService] = useState(() => new EnergyManagementService());

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Initialize services
        await mlService.initialize();
        await energyService.initialize();
        
        // Fetch devices
        const fetchedDevices = await energyService.getDevices();
        setDevices(fetchedDevices);
        
        // Fetch telemetry data
        const fetchedTelemetry = await energyService.getTelemetryData();
        setTelemetryData(fetchedTelemetry);
        
        // Calculate performance metrics
        const metrics = await mlService.calculatePerformanceMetrics();
        setPerformanceMetrics(metrics);
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading ML dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load ML dashboard data');
        setLoading(false);
      }
    };
    
    loadData();
    
    return () => {
      mlService.dispose();
      energyService.dispose();
    };
  }, [mlService, energyService]);

  // Handle ML settings changes
  const handleMLSettingsChange = async (newSettings: typeof mlSettings) => {
    try {
      setLoading(true);
      
      // Update settings
      setMLSettings(newSettings);
      
      // Re-initialize services with new settings
      await mlService.initialize();
      await energyService.initialize();
      
      // Recalculate performance metrics
      const metrics = await mlService.calculatePerformanceMetrics();
      setPerformanceMetrics(metrics);
      
      setLoading(false);
    } catch (err) {
      console.error('Error updating ML settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to update ML settings');
      setLoading(false);
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    try {
      setLoading(true);
      
      // Re-initialize services
      await mlService.initialize();
      await energyService.initialize();
      
      // Fetch latest data
      const fetchedDevices = await energyService.getDevices();
      setDevices(fetchedDevices);
      
      const fetchedTelemetry = await energyService.getTelemetryData();
      setTelemetryData(fetchedTelemetry);
      
      // Recalculate performance metrics
      const metrics = await mlService.calculatePerformanceMetrics();
      setPerformanceMetrics(metrics);
      
      setLoading(false);
    } catch (err) {
      console.error('Error refreshing ML dashboard:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh ML dashboard');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">ML Dashboard</h1>
          <p className="text-gray-500">Monitor and control machine learning operations</p>
        </div>
        <Button variant="outline" onClick={handleRefresh} className="flex items-center gap-1">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="overview" className="flex items-center gap-1">
            <Brain className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="models" className="flex items-center gap-1">
            <Activity className="h-4 w-4" />
            Models
          </TabsTrigger>
          <TabsTrigger value="decisions" className="flex items-center gap-1">
            <LineChart className="h-4 w-4" />
            Decisions
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-1">
            <BarChart className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-1">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-blue-500" />
                  ML Models
                </CardTitle>
                <CardDescription>Active machine learning models</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Demand Forecasting</span>
                    <Badge variant="success">Active</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Solar Generation</span>
                    <Badge variant="success">Active</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Energy Optimization</span>
                    <Badge variant="success">Active</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Battery Health</span>
                    <Badge variant="success">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-green-500" />
                  Performance
                </CardTitle>
                <CardDescription>Model performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Accuracy</span>
                    <span className="font-medium">{(performanceMetrics.accuracy * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Precision</span>
                    <span className="font-medium">{(performanceMetrics.precision * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Recall</span>
                    <span className="font-medium">{(performanceMetrics.recall * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>F1 Score</span>
                    <span className="font-medium">{(performanceMetrics.f1Score * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Latency</span>
                    <span className="font-medium">{performanceMetrics.latency.toFixed(2)}ms</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-purple-500" />
                  Settings
                </CardTitle>
                <CardDescription>Current ML configuration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Autonomous Actions</span>
                    <Badge variant={mlSettings.enableAutonomousActions ? "success" : "secondary"}>
                      {mlSettings.enableAutonomousActions ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Predictive Maintenance</span>
                    <Badge variant={mlSettings.enablePredictiveMaintenance ? "success" : "secondary"}>
                      {mlSettings.enablePredictiveMaintenance ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Cost Optimization</span>
                    <Badge variant={mlSettings.enableCostOptimization ? "success" : "secondary"}>
                      {mlSettings.enableCostOptimization ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>User Behavior Learning</span>
                    <Badge variant={mlSettings.enableUserBehaviorLearning ? "success" : "secondary"}>
                      {mlSettings.enableUserBehaviorLearning ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <MLInsights telemetryData={telemetryData} />
        </TabsContent>

        <TabsContent value="models" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Demand Forecasting Model</CardTitle>
                <CardDescription>Predicts energy consumption patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Model Type</span>
                    <span className="font-medium">LSTM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Input Features</span>
                    <span className="font-medium">24</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Output Features</span>
                    <span className="font-medium">24</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Updated</span>
                    <span className="font-medium">2 hours ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Training Data</span>
                    <span className="font-medium">30 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Solar Generation Model</CardTitle>
                <CardDescription>Predicts solar power generation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Model Type</span>
                    <span className="font-medium">Transformer</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Input Features</span>
                    <span className="font-medium">48</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Output Features</span>
                    <span className="font-medium">24</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Updated</span>
                    <span className="font-medium">1 day ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Training Data</span>
                    <span className="font-medium">90 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Energy Optimization Model</CardTitle>
                <CardDescription>Optimizes energy storage and consumption</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Model Type</span>
                    <span className="font-medium">Reinforcement Learning</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Input Features</span>
                    <span className="font-medium">36</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Output Features</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Updated</span>
                    <span className="font-medium">3 hours ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Training Data</span>
                    <span className="font-medium">60 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Battery Health Model</CardTitle>
                <CardDescription>Analyzes battery health and predicts maintenance needs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Model Type</span>
                    <span className="font-medium">Random Forest</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Input Features</span>
                    <span className="font-medium">18</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Output Features</span>
                    <span className="font-medium">6</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Updated</span>
                    <span className="font-medium">5 hours ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Training Data</span>
                    <span className="font-medium">180 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="decisions" className="space-y-6">
          <AIAgentDecisions />
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Model Performance</CardTitle>
                <CardDescription>Accuracy and error metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { name: 'Demand', accuracy: 0.92, error: 0.08 },
                      { name: 'Solar', accuracy: 0.88, error: 0.12 },
                      { name: 'Optimization', accuracy: 0.85, error: 0.15 },
                      { name: 'Battery', accuracy: 0.90, error: 0.10 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="accuracy" stroke="#2563eb" name="Accuracy" />
                      <Line type="monotone" dataKey="error" stroke="#dc2626" name="Error" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Prediction Latency</CardTitle>
                <CardDescription>Time taken for predictions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: 'Demand', latency: 45 },
                      { name: 'Solar', latency: 38 },
                      { name: 'Optimization', latency: 52 },
                      { name: 'Battery', latency: 41 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="latency" fill="#2563eb" name="Latency (ms)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resource Usage</CardTitle>
                <CardDescription>CPU and memory utilization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[
                      { time: '00:00', cpu: 45, memory: 60 },
                      { time: '04:00', cpu: 52, memory: 65 },
                      { time: '08:00', cpu: 48, memory: 62 },
                      { time: '12:00', cpu: 55, memory: 68 },
                      { time: '16:00', cpu: 50, memory: 64 },
                      { time: '20:00', cpu: 47, memory: 61 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="cpu" stroke="#2563eb" fill="#93c5fd" name="CPU (%)" />
                      <Area type="monotone" dataKey="memory" stroke="#059669" fill="#6ee7b7" name="Memory (%)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Training Progress</CardTitle>
                <CardDescription>Model training metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { epoch: 1, loss: 0.8, valLoss: 0.85 },
                      { epoch: 5, loss: 0.6, valLoss: 0.65 },
                      { epoch: 10, loss: 0.4, valLoss: 0.45 },
                      { epoch: 15, loss: 0.3, valLoss: 0.35 },
                      { epoch: 20, loss: 0.25, valLoss: 0.3 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="epoch" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="loss" stroke="#2563eb" name="Training Loss" />
                      <Line type="monotone" dataKey="valLoss" stroke="#dc2626" name="Validation Loss" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>ML Settings</CardTitle>
              <CardDescription>Configure machine learning behavior</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Autonomous Actions</h3>
                      <p className="text-sm text-gray-500">Allow AI to take actions without approval</p>
                    </div>
                    <Switch
                      checked={mlSettings.enableAutonomousActions}
                      onCheckedChange={(checked) => 
                        handleMLSettingsChange({ ...mlSettings, enableAutonomousActions: checked })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Confidence Threshold</h3>
                        <p className="text-sm text-gray-500">Minimum confidence required for actions</p>
                      </div>
                      <span className="text-sm font-medium">
                        {(mlSettings.confidenceThreshold * 100).toFixed(0)}%
                      </span>
                    </div>
                    <Slider
                      value={[mlSettings.confidenceThreshold * 100]}
                      onValueChange={([value]) => 
                        handleMLSettingsChange({ 
                          ...mlSettings, 
                          confidenceThreshold: value / 100 
                        })
                      }
                      min={0}
                      max={100}
                      step={1}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Predictive Maintenance</h3>
                      <p className="text-sm text-gray-500">Enable predictive maintenance alerts</p>
                    </div>
                    <Switch
                      checked={mlSettings.enablePredictiveMaintenance}
                      onCheckedChange={(checked) => 
                        handleMLSettingsChange({ 
                          ...mlSettings, 
                          enablePredictiveMaintenance: checked 
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Cost Optimization</h3>
                      <p className="text-sm text-gray-500">Optimize for cost savings</p>
                    </div>
                    <Switch
                      checked={mlSettings.enableCostOptimization}
                      onCheckedChange={(checked) => 
                        handleMLSettingsChange({ 
                          ...mlSettings, 
                          enableCostOptimization: checked 
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">User Behavior Learning</h3>
                      <p className="text-sm text-gray-500">Learn from user preferences</p>
                    </div>
                    <Switch
                      checked={mlSettings.enableUserBehaviorLearning}
                      onCheckedChange={(checked) => 
                        handleMLSettingsChange({ 
                          ...mlSettings, 
                          enableUserBehaviorLearning: checked 
                        })
                      }
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button 
                    onClick={handleRefresh}
                    className="w-full"
                  >
                    Apply Changes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 