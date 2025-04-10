
import React, { useState, useEffect } from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { supabase } from '@/integrations/supabase/client';
import { 
  Battery,
  Sun,
  BarChart4,
  Calendar,
  DollarSign,
  Leaf,
  Lightbulb,
  Radio,
  Zap,
  Settings,
  PlugZap
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const mockHistoricalData = [
  { time: '00:00', load: 2.3, solar: 0, battery: 1.5, grid: 0.8 },
  { time: '03:00', load: 1.8, solar: 0, battery: 1.8, grid: 0 },
  { time: '06:00', load: 2.5, solar: 0.7, battery: 1.3, grid: 0.5 },
  { time: '09:00', load: 4.2, solar: 3.2, battery: 0, grid: 1.0 },
  { time: '12:00', load: 5.1, solar: 5.5, battery: -1.2, grid: 0.8 },
  { time: '15:00', load: 4.8, solar: 4.1, battery: -0.5, grid: 1.2 },
  { time: '18:00', load: 6.2, solar: 1.8, battery: 2.1, grid: 2.3 },
  { time: '21:00', load: 4.5, solar: 0, battery: 2.8, grid: 1.7 }
];

const mockForecastData = [
  { time: '00:00', predicted_load: 2.1, predicted_solar: 0, optimized_battery: 1.3, optimized_grid: 0.8 },
  { time: '03:00', predicted_load: 1.7, predicted_solar: 0, optimized_battery: 1.7, optimized_grid: 0 },
  { time: '06:00', predicted_load: 2.4, predicted_solar: 0.8, optimized_battery: 1.6, optimized_grid: 0 },
  { time: '09:00', predicted_load: 3.9, predicted_solar: 3.5, optimized_battery: -1.1, optimized_grid: 1.5 },
  { time: '12:00', predicted_load: 4.8, predicted_solar: 5.8, optimized_battery: -2.5, optimized_grid: 1.5 },
  { time: '15:00', predicted_load: 4.5, predicted_solar: 4.3, optimized_battery: -1.8, optimized_grid: 2.0 },
  { time: '18:00', predicted_load: 5.9, predicted_solar: 1.5, optimized_battery: 2.4, optimized_grid: 2.0 },
  { time: '21:00', predicted_load: 4.2, predicted_solar: 0, optimized_battery: 2.5, optimized_grid: 1.7 }
];

const mockDevices = [
  { id: '1', name: 'Home Battery', type: 'battery', status: 'online', capacity: 10, current_output: 2.4, soc: 78 },
  { id: '2', name: 'Solar Inverter', type: 'inverter', status: 'online', capacity: 8, current_output: 5.2 },
  { id: '3', name: 'EV Charger', type: 'ev_charger', status: 'online', capacity: 7.4, current_output: 0 },
  { id: '4', name: 'Grid Meter', type: 'meter', status: 'online', current_output: 1.2 }
];

const mockRecommendations = [
  { 
    id: '1',
    title: 'Shift EV charging to midday',
    description: 'Charging your EV between 11am and 3pm would save approximately 23 kWh from solar production.',
    savings: 4.2, // $ per day
    icon: <PlugZap className="h-8 w-8 text-primary" />,
    priority: 'high',
    confidence: 92
  },
  { 
    id: '2',
    title: 'Optimize battery for lower tariffs',
    description: 'Adjusting battery charge to prioritize off-peak hours could save $45 per month.',
    savings: 1.5, // $ per day
    icon: <Battery className="h-8 w-8 text-primary" />,
    priority: 'medium',
    confidence: 85
  },
  { 
    id: '3',
    title: 'Increase self-consumption',
    description: 'Running your washing machine during solar peak hours could increase self-consumption by 8%.',
    savings: 0.8, // $ per day
    icon: <Sun className="h-8 w-8 text-primary" />,
    priority: 'low',
    confidence: 78
  }
];

const EnergyOptimization = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [optimizationMode, setOptimizationMode] = useState('balanced');
  const [isAutoOptimize, setIsAutoOptimize] = useState(true);
  const [batterySoc, setBatterySoc] = useState(78);
  const [minSoc, setMinSoc] = useState(20);
  const [maxSoc, setMaxSoc] = useState(90);
  const [isLoading, setIsLoading] = useState(true);
  const [devices, setDevices] = useState(mockDevices);
  const [recommendations, setRecommendations] = useState(mockRecommendations);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, []);

  const handleRunOptimization = () => {
    console.log("Running optimization with settings:", {
      mode: optimizationMode,
      minSoc,
      maxSoc,
      isAutoOptimize
    });
    
    // In a real implementation, this would trigger an API call to run the optimization algorithm
    alert("Optimization calculation triggered. Check the forecast tab for results.");
  };

  const prioritizeSolar = () => {
    setOptimizationMode('solar_first');
    setMinSoc(30);
    setMaxSoc(100);
  };

  const prioritizeSavings = () => {
    setOptimizationMode('cost');
    setMinSoc(20);
    setMaxSoc(80);
  };

  const prioritizeBackup = () => {
    setOptimizationMode('backup');
    setMinSoc(60);
    setMaxSoc(100);
  };

  const applyRecommendation = (recommendationId: string) => {
    // Here you would apply the recommendation via API
    console.log(`Applying recommendation ${recommendationId}`);
    
    // Update state to reflect it has been applied
    setRecommendations(prevRecs => 
      prevRecs.map(rec => 
        rec.id === recommendationId ? { ...rec, applied: true } : rec
      )
    );
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <PageHeader 
        title="Energy Optimization" 
        description="Intelligently optimize your energy usage and storage"
      />
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full md:w-[600px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="forecast">Forecast & Plan</TabsTrigger>
          <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <Battery className="mr-2 h-4 w-4" />
                    Battery Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center">
                    <div className="relative w-32 h-32 flex items-center justify-center">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle
                          className="text-gray-200 dark:text-gray-700"
                          strokeWidth="10"
                          stroke="currentColor"
                          fill="transparent"
                          r="40"
                          cx="50"
                          cy="50"
                        />
                        <circle
                          className="text-primary"
                          strokeWidth="10"
                          strokeDasharray={251.2}
                          strokeDashoffset={251.2 * (1 - batterySoc / 100)}
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                          r="40"
                          cx="50"
                          cy="50"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold">{batterySoc}%</span>
                        <span className="text-xs text-muted-foreground">State of Charge</span>
                      </div>
                    </div>
                    
                    <div className="w-full mt-4">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>{minSoc}% Min</span>
                        <span>{maxSoc}% Max</span>
                      </div>
                      <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="bg-primary h-full rounded-full" 
                          style={{width: `${batterySoc}%`}}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-sm text-center">
                      <p>Current Output: <span className="font-semibold">2.4 kW</span></p>
                      <p>Mode: <span className="font-semibold capitalize">{optimizationMode.replace('_', ' ')}</span></p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <Sun className="mr-2 h-4 w-4" />
                    Today's Energy Flow
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[210px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockHistoricalData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis unit="kW" />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="solar" stroke="#FFC107" name="Solar" />
                      <Line type="monotone" dataKey="battery" stroke="#4CAF50" name="Battery" />
                      <Line type="monotone" dataKey="grid" stroke="#2196F3" name="Grid" />
                      <Line type="monotone" dataKey="load" stroke="#F44336" name="Load" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <BarChart4 className="mr-2 h-4 w-4" />
                    Energy Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Sun className="h-4 w-4 mr-2 text-amber-500" />
                        <span>Solar Production</span>
                      </div>
                      <span className="font-medium">25.4 kWh</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Lightbulb className="h-4 w-4 mr-2 text-red-500" />
                        <span>Home Consumption</span>
                      </div>
                      <span className="font-medium">18.7 kWh</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Radio className="h-4 w-4 mr-2 text-blue-500" />
                        <span>Grid Import</span>
                      </div>
                      <span className="font-medium">6.2 kWh</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Radio className="h-4 w-4 mr-2 text-green-500" />
                        <span>Grid Export</span>
                      </div>
                      <span className="font-medium">8.4 kWh</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Leaf className="h-4 w-4 mr-2 text-emerald-500" />
                        <span>Self-Consumption</span>
                      </div>
                      <span className="font-medium">78%</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-emerald-500" />
                        <span>Savings Today</span>
                      </div>
                      <span className="font-medium">$5.47</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Choose a preset optimization mode</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={prioritizeSolar} 
                    variant={optimizationMode === 'solar_first' ? 'default' : 'outline'}
                    className="h-auto py-4 flex flex-col items-center"
                  >
                    <Sun className="h-8 w-8 mb-2" />
                    <div className="text-center">
                      <div className="font-medium">Maximize Self-Consumption</div>
                      <div className="text-xs text-muted-foreground mt-1">Prioritize solar energy usage</div>
                    </div>
                  </Button>
                  
                  <Button 
                    onClick={prioritizeSavings} 
                    variant={optimizationMode === 'cost' ? 'default' : 'outline'}
                    className="h-auto py-4 flex flex-col items-center"
                  >
                    <DollarSign className="h-8 w-8 mb-2" />
                    <div className="text-center">
                      <div className="font-medium">Reduce Costs</div>
                      <div className="text-xs text-muted-foreground mt-1">Optimize for lowest energy bills</div>
                    </div>
                  </Button>
                  
                  <Button 
                    onClick={prioritizeBackup} 
                    variant={optimizationMode === 'backup' ? 'default' : 'outline'}
                    className="h-auto py-4 flex flex-col items-center"
                  >
                    <Zap className="h-8 w-8 mb-2" />
                    <div className="text-center">
                      <div className="font-medium">Backup Readiness</div>
                      <div className="text-xs text-muted-foreground mt-1">Keep battery charged for outages</div>
                    </div>
                  </Button>
                </div>
                
                <div className="mt-6">
                  <Button onClick={handleRunOptimization} className="w-full">
                    Run Optimization
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="forecast" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Energy Forecast & Optimization Plan
                </CardTitle>
                <CardDescription>
                  24-hour prediction and recommended dispatch schedule
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockForecastData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis unit="kW" />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="predicted_solar" stroke="#FFC107" strokeWidth={2} name="Solar Production" />
                      <Line type="monotone" dataKey="predicted_load" stroke="#F44336" strokeWidth={2} name="Home Consumption" />
                      <Line type="monotone" dataKey="optimized_battery" stroke="#4CAF50" strokeWidth={2} name="Battery Plan" />
                      <Line type="monotone" dataKey="optimized_grid" stroke="#2196F3" strokeWidth={2} name="Grid Exchange" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-6 space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Optimization Summary</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Predicted savings: $3.24 compared to standard operation</li>
                      <li>• Battery will charge from 10:00 to 14:00 using excess solar</li>
                      <li>• Evening peak shaving from 18:00 to 21:00</li>
                      <li>• Maintains minimum 20% battery reserve at all times</li>
                      <li>• Grid import during off-peak rates only (00:00 - 05:00)</li>
                    </ul>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Auto-Apply Optimization</h4>
                      <p className="text-sm text-muted-foreground">Automatically apply this schedule</p>
                    </div>
                    <Switch 
                      checked={isAutoOptimize} 
                      onCheckedChange={setIsAutoOptimize} 
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button onClick={() => console.log("Applying optimization plan")}>
                      Apply Plan
                    </Button>
                    <Button variant="outline" onClick={() => console.log("Adjusting optimization parameters")}>
                      Adjust Parameters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="recommendations" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {recommendations.map(rec => (
                <Card key={rec.id} className={rec.applied ? "opacity-70" : ""}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="rounded-full bg-primary/10 p-2">
                        {rec.icon}
                      </div>
                      <Badge 
                        variant={
                          rec.priority === 'high' ? 'destructive' : 
                          rec.priority === 'medium' ? 'default' : 
                          'outline'
                        }
                      >
                        {rec.priority} priority
                      </Badge>
                    </div>
                    <CardTitle className="mt-4">{rec.title}</CardTitle>
                    <CardDescription>{rec.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Potential savings</p>
                        <p className="text-xl font-bold">${rec.savings.toFixed(2)}/day</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Confidence</p>
                        <p className="text-lg font-semibold">{rec.confidence}%</p>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full"
                      variant={rec.applied ? "outline" : "default"}
                      disabled={rec.applied}
                      onClick={() => applyRecommendation(rec.id)}
                    >
                      {rec.applied ? "Applied" : "Apply Recommendation"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>AI Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-medium mb-2 flex items-center">
                      <Leaf className="mr-2 h-4 w-4 text-green-500" />
                      Efficiency Analysis
                    </h3>
                    <p className="text-sm">
                      Your system is currently operating at 84% efficiency compared to optimal settings.
                      The main areas for improvement are evening consumption patterns and battery cycling.
                    </p>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-medium mb-2 flex items-center">
                      <BarChart4 className="mr-2 h-4 w-4 text-blue-500" />
                      Consumption Patterns
                    </h3>
                    <p className="text-sm">
                      We've detected significant consumption between 6-8pm which coincides with
                      high electricity prices. Consider shifting appliance usage to midday when
                      solar production is at its peak.
                    </p>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-medium mb-2 flex items-center">
                      <Battery className="mr-2 h-4 w-4 text-amber-500" />
                      Battery Health
                    </h3>
                    <p className="text-sm">
                      Your battery cycling patterns are optimal. Current settings maintain health
                      while maximizing utilization. Estimated battery lifespan: 12+ years.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  Optimization Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Optimization Mode</Label>
                    <Select value={optimizationMode} onValueChange={setOptimizationMode}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="balanced">Balanced</SelectItem>
                        <SelectItem value="solar_first">Solar First</SelectItem>
                        <SelectItem value="cost">Cost Optimization</SelectItem>
                        <SelectItem value="backup">Backup Readiness</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      Determines the primary goal for the optimization algorithm.
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label>Battery Settings</Label>
                    
                    <div className="space-y-6 pt-2">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label>Minimum State of Charge</Label>
                          <span className="font-medium">{minSoc}%</span>
                        </div>
                        <Slider 
                          value={[minSoc]}
                          min={10}
                          max={50}
                          step={5}
                          onValueChange={(values) => setMinSoc(values[0])}
                        />
                        <p className="text-xs text-muted-foreground">
                          Battery will not discharge below this level.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label>Maximum State of Charge</Label>
                          <span className="font-medium">{maxSoc}%</span>
                        </div>
                        <Slider 
                          value={[maxSoc]}
                          min={60}
                          max={100}
                          step={5}
                          onValueChange={(values) => setMaxSoc(values[0])}
                        />
                        <p className="text-xs text-muted-foreground">
                          Battery will not charge above this level.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Automatic Time-of-Use Optimization</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically adjust battery usage based on electricity rates
                        </p>
                      </div>
                      <Switch checked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Weather-Aware Forecasting</Label>
                        <p className="text-sm text-muted-foreground">
                          Use weather forecasts to improve solar predictions
                        </p>
                      </div>
                      <Switch checked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Grid Export Limiting</Label>
                        <p className="text-sm text-muted-foreground">
                          Limit exports to grid when prices are low
                        </p>
                      </div>
                      <Switch checked={false} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Peak Demand Shaving</Label>
                        <p className="text-sm text-muted-foreground">
                          Use battery to reduce peak demand charges
                        </p>
                      </div>
                      <Switch checked={true} />
                    </div>
                  </div>
                  
                  <Button onClick={handleRunOptimization} className="w-full">
                    Save Settings & Run Optimization
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>AI-Assisted Optimization</Label>
                      <p className="text-sm text-muted-foreground">
                        Use AI models to improve forecasting and recommendations
                      </p>
                    </div>
                    <Switch checked={true} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Edge AI Fallback</Label>
                      <p className="text-sm text-muted-foreground">
                        Use local AI models when cloud connectivity is unavailable
                      </p>
                    </div>
                    <Switch checked={true} />
                  </div>
                  
                  <div>
                    <Label>Forecast Horizon</Label>
                    <Select defaultValue="24h">
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select horizon" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12h">12 Hours</SelectItem>
                        <SelectItem value="24h">24 Hours</SelectItem>
                        <SelectItem value="48h">48 Hours</SelectItem>
                        <SelectItem value="7d">7 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Optimization Recalculation Frequency</Label>
                    <Select defaultValue="1h">
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15m">Every 15 minutes</SelectItem>
                        <SelectItem value="30m">Every 30 minutes</SelectItem>
                        <SelectItem value="1h">Every hour</SelectItem>
                        <SelectItem value="2h">Every 2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default EnergyOptimization;
