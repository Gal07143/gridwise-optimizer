
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Brain, BrainCircuit, ChevronRight, Clock, Code, CogIcon, Cpu, Database, Gauge, Info, LineChart as LineChartIcon, MessageCircle, Settings, TrendingUp, Zap } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { useToast } from '@/hooks/useToast';

// Sample data - in a real application, this would come from API endpoints
const modelPerformanceData = [
  { month: 'Jan', accuracy: 82, f1Score: 78, precision: 80 },
  { month: 'Feb', accuracy: 84, f1Score: 79, precision: 81 },
  { month: 'Mar', accuracy: 83, f1Score: 80, precision: 82 },
  { month: 'Apr', accuracy: 86, f1Score: 82, precision: 84 },
  { month: 'May', accuracy: 88, f1Score: 84, precision: 85 },
  { month: 'Jun', accuracy: 87, f1Score: 83, precision: 84 },
  { month: 'Jul', accuracy: 90, f1Score: 87, precision: 88 },
  { month: 'Aug', accuracy: 91, f1Score: 89, precision: 90 },
  { month: 'Sep', accuracy: 92, f1Score: 90, precision: 91 },
];

const optimizationData = [
  { name: 'Energy Cost', value: 65, color: '#8884d8' },
  { name: 'Carbon Reduction', value: 20, color: '#82ca9d' },
  { name: 'Self-Consumption', value: 15, color: '#ffc658' },
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

const predictiveAccuracyData = [
  { category: 'Production', real: 120, predicted: 125 },
  { category: 'Consumption', real: 180, predicted: 175 },
  { category: 'Battery', real: 70, predicted: 72 },
  { category: 'Grid Exchange', real: 40, predicted: 38 },
];

const recentOptimizations = [
  { id: 1, timestamp: '2025-04-11 09:30', type: 'Battery Charge', savings: '$2.45', impact: 'high' },
  { id: 2, timestamp: '2025-04-11 07:15', type: 'EV Charging', savings: '$1.78', impact: 'medium' },
  { id: 3, timestamp: '2025-04-10 18:45', type: 'Peak Shaving', savings: '$5.30', impact: 'high' },
  { id: 4, timestamp: '2025-04-10 14:20', type: 'Self-Consumption', savings: '$1.25', impact: 'low' },
  { id: 5, timestamp: '2025-04-10 10:05', type: 'Grid Export', savings: '$3.10', impact: 'medium' },
];

const AIOverview: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  const handleTrainModel = () => {
    toast.toast.info('Model training has been scheduled. You will be notified when it\'s complete.');
  };

  const handleOptimizationChange = () => {
    toast.toast.info('Optimization parameters updated successfully.');
  };

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">AI & Machine Learning</h1>
            <p className="text-muted-foreground">
              Intelligent optimization and forecasting for your energy system
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">Models: 5 Active</Badge>
            <Badge variant="outline" className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">Last Training: 2 days ago</Badge>
            <Badge variant="outline" className="bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800">Accuracy: 92%</Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-3 md:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="models">Models</TabsTrigger>
            <TabsTrigger value="optimization">Optimization</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Brain className="h-5 w-5 text-primary" />
                    AI Model Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-muted-foreground">Production Forecast</span>
                        <span className="text-sm font-medium">92%</span>
                      </div>
                      <Progress value={92} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-muted-foreground">Consumption Forecast</span>
                        <span className="text-sm font-medium">88%</span>
                      </div>
                      <Progress value={88} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-muted-foreground">Anomaly Detection</span>
                        <span className="text-sm font-medium">94%</span>
                      </div>
                      <Progress value={94} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-muted-foreground">Price Prediction</span>
                        <span className="text-sm font-medium">86%</span>
                      </div>
                      <Progress value={86} className="h-2" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    <LineChartIcon className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Zap className="h-5 w-5 text-primary" />
                    Recent Optimizations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentOptimizations.slice(0, 3).map((opt) => (
                      <div key={opt.id} className="flex items-center justify-between bg-accent/50 p-2 rounded-md">
                        <div>
                          <p className="text-sm font-medium">{opt.type}</p>
                          <p className="text-xs text-muted-foreground">{opt.timestamp}</p>
                        </div>
                        <div>
                          <Badge variant={opt.impact === 'high' ? 'default' : opt.impact === 'medium' ? 'secondary' : 'outline'}>
                            {opt.savings}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    <Clock className="mr-2 h-4 w-4" />
                    View All
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Gauge className="h-5 w-5 text-primary" />
                    Performance Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center h-48">
                    <div className="w-40 h-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={optimizationData}
                            innerRadius={30}
                            outerRadius={60}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {optimizationData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-3 gap-1 w-full text-xs text-center mt-2">
                      {optimizationData.map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                          <div className="w-3 h-3 mb-1 rounded-full" style={{ backgroundColor: item.color }}></div>
                          <span>{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  AI Model Performance Trends
                </CardTitle>
                <CardDescription>
                  Model performance metrics over the last 9 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={modelPerformanceData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[70, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="accuracy" name="Accuracy %" stroke="#8884d8" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="f1Score" name="F1 Score %" stroke="#82ca9d" />
                      <Line type="monotone" dataKey="precision" name="Precision %" stroke="#ffc658" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="models" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BrainCircuit className="h-5 w-5 text-primary" />
                      Forecasting Model
                    </CardTitle>
                    <Badge>Active</Badge>
                  </div>
                  <CardDescription>
                    Predicts energy production and consumption
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Accuracy</p>
                        <p className="text-lg font-medium">92%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Last Trained</p>
                        <p className="text-lg font-medium">2 days ago</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Type</p>
                        <p className="text-lg font-medium">LSTM</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Data Points</p>
                        <p className="text-lg font-medium">425K</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Features</p>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">Weather</Badge>
                        <Badge variant="outline" className="text-xs">Time</Badge>
                        <Badge variant="outline" className="text-xs">Historical</Badge>
                        <Badge variant="outline" className="text-xs">Seasonal</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">View Details</Button>
                  <Button size="sm" onClick={handleTrainModel}>Train Model</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BrainCircuit className="h-5 w-5 text-primary" />
                      Anomaly Detection
                    </CardTitle>
                    <Badge>Active</Badge>
                  </div>
                  <CardDescription>
                    Identifies unusual patterns in energy data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Precision</p>
                        <p className="text-lg font-medium">94%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Last Trained</p>
                        <p className="text-lg font-medium">5 days ago</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Type</p>
                        <p className="text-lg font-medium">Isolation Forest</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Alerts</p>
                        <p className="text-lg font-medium">12 / month</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Detects</p>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">Device Failures</Badge>
                        <Badge variant="outline" className="text-xs">Power Surges</Badge>
                        <Badge variant="outline" className="text-xs">Inefficiencies</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">View Details</Button>
                  <Button size="sm" onClick={handleTrainModel}>Train Model</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BrainCircuit className="h-5 w-5 text-primary" />
                      Optimization Engine
                    </CardTitle>
                    <Badge>Active</Badge>
                  </div>
                  <CardDescription>
                    Optimizes energy flows for cost savings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Savings</p>
                        <p className="text-lg font-medium">18.4%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Last Update</p>
                        <p className="text-lg font-medium">1 day ago</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Algorithm</p>
                        <p className="text-lg font-medium">Reinforcement</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Decisions</p>
                        <p className="text-lg font-medium">45 / day</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Optimizes</p>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">Battery Cycles</Badge>
                        <Badge variant="outline" className="text-xs">EV Charging</Badge>
                        <Badge variant="outline" className="text-xs">Grid Export</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">View Details</Button>
                  <Button size="sm">Configure</Button>
                </CardFooter>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Predictive Accuracy</CardTitle>
                    <CardDescription>
                      Comparison between real and predicted values
                    </CardDescription>
                  </div>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Info className="h-4 w-4" />
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="font-medium">About Predictive Accuracy</h4>
                        <p className="text-sm text-muted-foreground">
                          This chart shows the comparison between real observed values and what our model predicted. 
                          Closer bars indicate better prediction accuracy.
                        </p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={predictiveAccuracyData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="real" name="Actual Value (kWh)" fill="#8884d8" />
                      <Bar dataKey="predicted" name="Predicted Value (kWh)" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="optimization" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    Optimization Settings
                  </CardTitle>
                  <CardDescription>
                    Configure how the AI optimizes your energy system
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Optimization Priority</label>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" className="bg-primary text-primary-foreground">Cost</Button>
                      <Button variant="outline">Self-Consumption</Button>
                      <Button variant="outline">Carbon</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Battery Strategy</label>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline">Charge from Solar</Button>
                      <Button variant="outline" className="bg-primary text-primary-foreground">Time-of-Use</Button>
                      <Button variant="outline">Backup Only</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Peak Shaving</label>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Enable Grid Peak Shaving</span>
                      <div className="flex items-center h-5">
                        <input
                          id="peak-shaving"
                          aria-describedby="peak-shaving-description"
                          name="peak-shaving"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          defaultChecked
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Min. Battery SoC</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min={0}
                          max={100}
                          defaultValue={20}
                          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                        />
                        <span className="w-10 text-center text-sm font-medium">20%</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Max. Battery SoC</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min={0}
                          max={100}
                          defaultValue={90}
                          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                        />
                        <span className="w-10 text-center text-sm font-medium">90%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={handleOptimizationChange}>
                    Save Settings
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-primary" />
                    Data & Learning
                  </CardTitle>
                  <CardDescription>
                    Configure data sources and learning parameters
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Data Sources</label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Historical Energy Data</span>
                        <input
                          type="checkbox"
                          defaultChecked
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Weather Forecasts</span>
                        <input
                          type="checkbox"
                          defaultChecked
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Electricity Price Data</span>
                        <input
                          type="checkbox"
                          defaultChecked
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Grid Carbon Intensity</span>
                        <input
                          type="checkbox"
                          defaultChecked
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">User Behavior Patterns</span>
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Learning Schedule</label>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline">Daily</Button>
                      <Button variant="outline" className="bg-primary text-primary-foreground">Weekly</Button>
                      <Button variant="outline">Monthly</Button>
                      <Button variant="outline">Manual Only</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Data Retention (months)</label>
                      <span className="w-10 text-center text-sm font-medium">12</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={36}
                      defaultValue={12}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={handleOptimizationChange}>Reset to Defaults</Button>
                  <Button onClick={handleOptimizationChange}>Apply Changes</Button>
                </CardFooter>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-primary" />
                  AI Model Training & Deployment
                </CardTitle>
                <CardDescription>
                  Manage your AI models and training processes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="py-3">
                        <CardTitle className="text-base">Production Model</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Version</span>
                          <span className="text-sm font-medium">v2.4.1</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Deployed</span>
                          <span className="text-sm font-medium">5 days ago</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Status</span>
                          <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400">Active</Badge>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="py-3">
                        <CardTitle className="text-base">Training Model</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Version</span>
                          <span className="text-sm font-medium">v2.5.0</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Progress</span>
                          <span className="text-sm font-medium">68%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Status</span>
                          <Badge variant="outline" className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400">Training</Badge>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="py-3">
                        <CardTitle className="text-base">Last Evaluation</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">RMSE</span>
                          <span className="text-sm font-medium">0.124</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">F1 Score</span>
                          <span className="text-sm font-medium">0.92</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Performance</span>
                          <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400">Improved +2.4%</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 justify-end">
                    <Button variant="outline" onClick={handleTrainModel}>
                      <MessageCircle className="mr-2 h-4 w-4" />
                      View Logs
                    </Button>
                    <Button variant="outline" onClick={handleTrainModel}>
                      <Code className="mr-2 h-4 w-4" />
                      Model Parameters
                    </Button>
                    <Button onClick={handleTrainModel}>
                      <BrainCircuit className="mr-2 h-4 w-4" />
                      Train New Model
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default AIOverview;
