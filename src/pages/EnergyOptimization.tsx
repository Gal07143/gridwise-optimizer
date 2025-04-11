
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import OptimizationControls from '@/components/dashboard/energy-optimization/OptimizationControls';
import { useEnergyOptimization } from '@/hooks/useEnergyOptimization';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAppStore } from '@/store/appStore';
import { toast } from 'sonner';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Download, Calendar, Clock, Battery, Zap, TrendingDown, Leaf, Rocket } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getEnergyOptimizationScenarios, saveOptimizationSettings } from '@/services/energyOptimizationService';
import ReferenceLine from '@/components/charts/ReferenceLine';
import Label from '@/components/charts/Label';

// Mock data for energy optimization scenarios
const energyCostData = [
  { time: '00:00', withOptimization: 2.1, withoutOptimization: 2.5, gridPrice: 'low' },
  { time: '03:00', withOptimization: 1.5, withoutOptimization: 1.8, gridPrice: 'low' },
  { time: '06:00', withOptimization: 1.0, withoutOptimization: 2.2, gridPrice: 'low' },
  { time: '09:00', withOptimization: 1.2, withoutOptimization: 3.8, gridPrice: 'medium' },
  { time: '12:00', withOptimization: 1.0, withoutOptimization: 4.7, gridPrice: 'high' },
  { time: '15:00', withOptimization: 1.5, withoutOptimization: 4.0, gridPrice: 'high' },
  { time: '18:00', withOptimization: 3.0, withoutOptimization: 5.2, gridPrice: 'high' },
  { time: '21:00', withOptimization: 2.5, withoutOptimization: 4.2, gridPrice: 'medium' },
];

const batteryScheduleData = [
  { time: '00:00', soc: 30, action: 'idle' },
  { time: '03:00', soc: 20, action: 'idle' },
  { time: '06:00', soc: 15, action: 'charging' },
  { time: '09:00', soc: 35, action: 'charging' },
  { time: '12:00', soc: 70, action: 'charging' },
  { time: '15:00', soc: 90, action: 'discharging' },
  { time: '18:00', soc: 60, action: 'discharging' },
  { time: '21:00', soc: 40, action: 'idle' },
];

const solarUtilizationData = [
  { time: '00:00', value: 0, exported: 0, stored: 0, used: 0 },
  { time: '03:00', value: 0, exported: 0, stored: 0, used: 0 },
  { time: '06:00', value: 1.2, exported: 0, stored: 1.0, used: 0.2 },
  { time: '09:00', value: 3.5, exported: 0.5, stored: 2.0, used: 1.0 },
  { time: '12:00', value: 5.8, exported: 1.8, stored: 2.0, used: 2.0 },
  { time: '15:00', value: 4.2, exported: 0.7, stored: 1.5, used: 2.0 },
  { time: '18:00', value: 2.0, exported: 0, stored: 0.5, used: 1.5 },
  { time: '21:00', value: 0, exported: 0, stored: 0, used: 0 },
];

interface OptimizationMetrics {
  costSavings: number;
  co2Reduction: number;
  selfConsumptionIncrease: number;
  peakReduction: number;
}

const EnergyOptimization: React.FC = () => {
  const { currentSite } = useAppStore();
  const siteId = currentSite?.id || '';
  
  const [activeTab, setActiveTab] = useState('cost');
  const [selectedScenario, setSelectedScenario] = useState('default');
  const [peakPowerLimit, setPeakPowerLimit] = useState(10);
  
  const {
    currentSettings,
    updateSettings,
    runOptimization,
    optimizationResult,
    isOptimizing
  } = useEnergyOptimization(siteId);
  
  // Fetch optimization scenarios
  const { data: scenarios = [], isLoading: scenariosLoading } = useQuery({
    queryKey: ['optimization-scenarios', siteId],
    queryFn: () => getEnergyOptimizationScenarios(siteId),
    enabled: !!siteId,
  });
  
  // Calculate metrics based on optimized vs. non-optimized data
  const metrics: OptimizationMetrics = {
    costSavings: 9.2, // $ per day
    co2Reduction: 5.8, // kg per day
    selfConsumptionIncrease: 23, // percentage points
    peakReduction: 34, // percentage reduction
  };
  
  const handleRunOptimization = () => {
    if (!siteId) {
      toast.error('No site selected');
      return;
    }
    
    runOptimization(['battery-1', 'battery-2']);
  };
  
  const handleSaveSettings = async () => {
    try {
      await saveOptimizationSettings(siteId, currentSettings);
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    }
  };
  
  const handleApplyScenario = () => {
    try {
      // Apply the selected scenario to current settings
      const scenario = scenarios.find(s => s.id === selectedScenario);
      if (scenario) {
        updateSettings(scenario.settings);
        toast.success(`Applied scenario: ${scenario.name}`);
      }
    } catch (error) {
      toast.error('Failed to apply scenario');
    }
  };
  
  return (
    <AppLayout>
      <div className="container mx-auto p-4 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">Energy Optimization</h1>
            <p className="text-muted-foreground">Optimize your energy usage to maximize savings and efficiency</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Schedule
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/30 dark:to-emerald-900/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Cost Savings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-2xl font-bold">${metrics.costSavings.toFixed(2)}</div>
                  <div className="text-xs text-emerald-600">per day</div>
                </div>
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                  <TrendingDown className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/30 dark:to-indigo-900/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">CO₂ Reduction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-2xl font-bold">{metrics.co2Reduction.toFixed(1)} kg</div>
                  <div className="text-xs text-blue-600">per day</div>
                </div>
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <Leaf className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-950/30 dark:to-amber-900/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Self-Consumption</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-2xl font-bold">+{metrics.selfConsumptionIncrease}%</div>
                  <div className="text-xs text-amber-600">increase</div>
                </div>
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                  <Sun className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-fuchsia-100 dark:from-purple-950/30 dark:to-fuchsia-900/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Peak Reduction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-2xl font-bold">{metrics.peakReduction}%</div>
                  <div className="text-xs text-purple-600">reduction</div>
                </div>
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                  <Zap className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Optimization Results</CardTitle>
                <CardDescription>Compare optimized vs. non-optimized energy usage</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Tabs defaultValue="cost" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="cost">Cost</TabsTrigger>
                    <TabsTrigger value="battery">Battery Schedule</TabsTrigger>
                    <TabsTrigger value="solar">Solar Utilization</TabsTrigger>
                    <TabsTrigger value="load">Load Management</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="cost" className="space-y-4">
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={energyCostData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <ReferenceLine label="Peak Price Period" segment={[{ x: '15:00', y: 0 }, { x: '21:00', y: 0 }]} stroke="red" strokeDasharray="5 5" />
                          <Label value="Peak Price Period" position="right" />
                          <ReferenceLine label="Medium Price Period" segment={[{ x: '09:00', y: 0 }, { x: '15:00', y: 0 }]} stroke="orange" strokeDasharray="5 5" />
                          <Label value="Medium Price Period" position="right" />
                          <Bar dataKey="withoutOptimization" name="Without Optimization ($)" fill="#8884d8" />
                          <Bar dataKey="withOptimization" name="With Optimization ($)" fill="#82ca9d" />
                          <ReferenceLine y={4} label="Peak Cost Target" stroke="red" strokeDasharray="3 3" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="rounded-md border p-4">
                      <h4 className="text-sm font-medium mb-2">Cost Breakdown</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Without Optimization</p>
                          <p className="font-medium">$28.40 / day</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">With Optimization</p>
                          <p className="font-medium">$19.20 / day</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Monthly Savings</p>
                          <p className="font-medium text-green-600">$276.00</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Annual Savings</p>
                          <p className="font-medium text-green-600">$3,358.00</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="battery" className="space-y-4">
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={batteryScheduleData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis unit="%" domain={[0, 100]} />
                          <Tooltip />
                          <Legend />
                          <defs>
                            <linearGradient id="batteryGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#2563eb" stopOpacity={0.2}/>
                            </linearGradient>
                          </defs>
                          <Line 
                            type="monotone" 
                            dataKey="soc" 
                            stroke="#2563eb" 
                            name="Battery State of Charge (%)"
                            strokeWidth={2}
                            dot={{ r: 5, fill: (data) => data.action === 'charging' ? '#22c55e' : data.action === 'discharging' ? '#ef4444' : '#6b7280' }}
                            fill="url(#batteryGradient)"
                          />
                          <ReferenceLine y={20} label="Min SoC" stroke="#ef4444" strokeDasharray="3 3" />
                          <ReferenceLine y={90} label="Max SoC" stroke="#22c55e" strokeDasharray="3 3" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="rounded-md border p-4 space-y-4">
                      <h4 className="text-sm font-medium mb-2">Battery Optimization Strategy</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-green-500"></div>
                          <p className="text-xs">Charging</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-red-500"></div>
                          <p className="text-xs">Discharging</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-gray-500"></div>
                          <p className="text-xs">Idle</p>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Charge/Discharge Schedule</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-green-600">Charge: 06:00 - 14:00</span>
                            <span>Solar-optimized</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-red-600">Discharge: 15:00 - 20:00</span>
                            <span>Peak price avoidance</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="solar" className="space-y-4">
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={solarUtilizationData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="used" name="Directly Used" stackId="a" fill="#22c55e" />
                          <Bar dataKey="stored" name="Stored in Battery" stackId="a" fill="#3b82f6" />
                          <Bar dataKey="exported" name="Exported to Grid" stackId="a" fill="#f59e0b" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="rounded-md border p-4">
                      <h4 className="text-sm font-medium mb-2">Solar Utilization</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Total Generated</p>
                          <p className="font-medium">16.7 kWh</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Self-consumed</p>
                          <p className="font-medium">13.8 kWh (82%)</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Stored</p>
                          <p className="font-medium">7.0 kWh (42%)</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Exported</p>
                          <p className="font-medium">3.0 kWh (18%)</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="load">
                    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
                      <Rocket className="h-16 w-16 text-slate-300" />
                      <h3 className="text-lg font-medium">Load Management Coming Soon</h3>
                      <p className="text-sm text-muted-foreground">
                        Automatic load shifting and smart appliance controls are coming in a future update.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            {activeTab === 'cost' && (
              <Card>
                <CardHeader>
                  <CardTitle>Peak Management Settings</CardTitle>
                  <CardDescription>Control your maximum power draw from the grid</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-sm font-medium">Peak Power Limit</label>
                        <span className="text-sm">{peakPowerLimit} kW</span>
                      </div>
                      <Slider
                        value={[peakPowerLimit]}
                        min={5}
                        max={20}
                        step={0.5}
                        onValueChange={(value) => setPeakPowerLimit(value[0])}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>5 kW</span>
                        <span>20 kW</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Peak Avoidance Strategy</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <Button variant="outline" size="sm" className="h-auto py-2 justify-start">
                          <Battery className="h-4 w-4 mr-2" /> Battery First
                        </Button>
                        <Button variant="outline" size="sm" className="h-auto py-2 justify-start">
                          <Zap className="h-4 w-4 mr-2" /> Load Reduction
                        </Button>
                        <Button variant="default" size="sm" className="h-auto py-2 justify-start">
                          <div className="flex items-center"><Battery className="h-3 w-3 mr-1" />+<Zap className="h-3 w-3 mx-1" /></div>
                          Hybrid
                        </Button>
                        <Button variant="outline" size="sm" className="h-auto py-2 justify-start">
                          <Clock className="h-4 w-4 mr-2" /> Schedule Based
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          <div className="space-y-6">
            <OptimizationControls />
            
            <Card>
              <CardHeader>
                <CardTitle>Optimization Actions</CardTitle>
                <CardDescription>Apply scenarios or run optimization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Load Scenario</label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={selectedScenario}
                    onChange={(e) => setSelectedScenario(e.target.value)}
                  >
                    <option value="default">Default Scenario</option>
                    <option value="cost-saving">Maximum Cost Saving</option>
                    <option value="eco">Eco-friendly Mode</option>
                    <option value="self-consumption">Self-consumption Mode</option>
                    <option value="backup-ready">Always Backup Ready</option>
                  </select>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Button onClick={handleApplyScenario}>
                    Apply Scenario
                  </Button>
                  <Button onClick={handleSaveSettings} variant="outline">
                    Save Current Settings
                  </Button>
                  <Button 
                    onClick={handleRunOptimization} 
                    className="gap-2"
                    disabled={isOptimizing}
                  >
                    {isOptimizing ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                        Running Optimization...
                      </>
                    ) : (
                      'Run Optimization Now'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default EnergyOptimization;
