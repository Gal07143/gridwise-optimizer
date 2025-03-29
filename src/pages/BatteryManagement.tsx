
import React, { useState } from 'react';
import { Main } from '@/components/ui/main';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Battery, BatteryCharging, ChevronDown, ChevronUp, BarChart2, PieChart, Zap, Bolt } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area } from 'recharts';
import { useSiteContext } from '@/contexts/SiteContext';

const batteryHistory = [
  { time: '00:00', level: 48, charging: 0, discharging: 1.2 },
  { time: '02:00', level: 45, charging: 0, discharging: 1.5 },
  { time: '04:00', level: 40, charging: 0, discharging: 2.5 },
  { time: '06:00', level: 38, charging: 0, discharging: 1.0 },
  { time: '08:00', level: 42, charging: 2.5, discharging: 0 },
  { time: '10:00', level: 55, charging: 4.2, discharging: 0 },
  { time: '12:00', level: 72, charging: 5.1, discharging: 0 },
  { time: '14:00', level: 85, charging: 4.8, discharging: 0 },
  { time: '16:00', level: 90, charging: 2.2, discharging: 0 },
  { time: '18:00', level: 85, charging: 0, discharging: 3.5 },
  { time: '20:00', level: 75, charging: 0, discharging: 4.2 },
  { time: '22:00', level: 65, charging: 0, discharging: 3.8 },
];

const batteryDetails = {
  type: 'Lithium-Ion',
  capacity: 13.5,
  currentLevel: 65,
  chargeRate: 3.5,
  dischargeRate: 4.2,
  voltage: 48.3,
  temperature: 32.5,
  cycles: 485,
  efficiency: 92,
  peakPower: 7.0,
  warrantyDate: '2030-12-31',
  firmware: 'v4.2.1',
  status: 'Discharging',
  mode: 'Self-Consumption'
};

const BatteryManagement: React.FC = () => {
  const { activeSite } = useSiteContext();
  const [reserveLevel, setReserveLevel] = useState([20]);
  const [chargeLimit, setChargeLimit] = useState([90]); 
  const [chargeEnabled, setChargeEnabled] = useState(true);
  const [dischargeEnabled, setDischargeEnabled] = useState(true);
  const [selfConsumption, setSelfConsumption] = useState(true);
  const [economicMode, setEconomicMode] = useState(false);
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  
  return (
    <Main containerSize="default" className="max-w-[1600px] mx-auto pt-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Battery Management</h1>
          <p className="text-muted-foreground">
            {activeSite ? `Managing battery storage for ${activeSite.name}` : 'Select a site to manage batteries'}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Battery className="h-5 w-5 mr-2 text-green-500" />
              Battery Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 mb-4">
                <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="10"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={batteryDetails.currentLevel > 50 ? "#22c55e" : batteryDetails.currentLevel > 20 ? "#f59e0b" : "#ef4444"}
                    strokeWidth="10"
                    strokeDasharray={`${batteryDetails.currentLevel * 2.83} 283`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">{batteryDetails.currentLevel}%</span>
                  <span className="text-xs text-muted-foreground">{
                    batteryDetails.status === 'Charging' 
                      ? <span className="flex items-center text-green-500"><BatteryCharging className="h-3 w-3 mr-1" /> Charging</span>
                      : batteryDetails.status === 'Discharging'
                      ? <span className="flex items-center text-amber-500"><Zap className="h-3 w-3 mr-1" /> Discharging</span>
                      : 'Idle'
                  }</span>
                </div>
              </div>
              
              <div className="w-full space-y-2 mt-2">
                <div className="flex justify-between text-sm">
                  <span>Power Flow:</span>
                  <span className="font-medium">{
                    batteryDetails.status === 'Charging' 
                      ? `+${batteryDetails.chargeRate.toFixed(1)} kW` 
                      : batteryDetails.status === 'Discharging'
                      ? `-${batteryDetails.dischargeRate.toFixed(1)} kW`
                      : '0.0 kW'
                  }</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Capacity:</span>
                  <span className="font-medium">{batteryDetails.capacity} kWh</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Available:</span>
                  <span className="font-medium">
                    {((batteryDetails.capacity * batteryDetails.currentLevel) / 100).toFixed(1)} kWh
                  </span>
                </div>
              </div>
              
              <button 
                className="flex items-center text-sm text-blue-600 mt-4"
                onClick={() => setDetailsExpanded(!detailsExpanded)}
              >
                {detailsExpanded ? (
                  <>Less details <ChevronUp className="h-4 w-4 ml-1" /></>
                ) : (
                  <>More details <ChevronDown className="h-4 w-4 ml-1" /></>
                )}
              </button>
              
              {detailsExpanded && (
                <div className="w-full mt-4 pt-4 border-t space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Battery Type:</span>
                    <span>{batteryDetails.type}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Voltage:</span>
                    <span>{batteryDetails.voltage} V</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Temperature:</span>
                    <span>{batteryDetails.temperature} °C</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Cycle Count:</span>
                    <span>{batteryDetails.cycles}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Efficiency:</span>
                    <span>{batteryDetails.efficiency}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Peak Power:</span>
                    <span>{batteryDetails.peakPower} kW</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Firmware:</span>
                    <span>{batteryDetails.firmware}</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <BarChart2 className="h-5 w-5 mr-2 text-blue-500" />
              Battery Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={batteryHistory}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="time" />
                  <YAxis yAxisId="left" orientation="left" label={{ value: 'Battery Level (%)', angle: -90, position: 'insideLeft' }} />
                  <YAxis yAxisId="right" orientation="right" label={{ value: 'Power (kW)', angle: 90, position: 'insideRight' }} />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-background border p-3 rounded-md shadow-md">
                            <p className="font-medium mb-1">{`Time: ${label}`}</p>
                            <p style={{ color: "#10b981" }}>
                              {`Battery Level: ${payload[0].value}%`}
                            </p>
                            {payload[1].value > 0 && (
                              <p style={{ color: "#3b82f6" }}>
                                {`Charging: ${payload[1].value} kW`}
                              </p>
                            )}
                            {payload[2].value > 0 && (
                              <p style={{ color: "#f59e0b" }}>
                                {`Discharging: ${payload[2].value} kW`}
                              </p>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Area yAxisId="left" type="monotone" dataKey="level" name="Battery Level (%)" fill="#10b981" stroke="#10b981" fillOpacity={0.2} />
                  <Area yAxisId="right" type="monotone" dataKey="charging" name="Charging (kW)" fill="#3b82f6" stroke="#3b82f6" fillOpacity={0.2} />
                  <Area yAxisId="right" type="monotone" dataKey="discharging" name="Discharging (kW)" fill="#f59e0b" stroke="#f59e0b" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Bolt className="h-5 w-5 mr-2 text-purple-500" />
              Battery Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Enable Charging</label>
                  <Switch 
                    checked={chargeEnabled} 
                    onCheckedChange={setChargeEnabled} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Enable Discharging</label>
                  <Switch 
                    checked={dischargeEnabled} 
                    onCheckedChange={setDischargeEnabled} 
                  />
                </div>
              </div>
              
              <div className="space-y-3 pt-4 border-t">
                <label className="text-sm font-medium">Charge Limit ({chargeLimit}%)</label>
                <Slider
                  disabled={!chargeEnabled}
                  value={chargeLimit}
                  min={50}
                  max={100}
                  step={5}
                  onValueChange={setChargeLimit}
                />
                
                <label className="text-sm font-medium mt-4">Reserve Level ({reserveLevel}%)</label>
                <Slider
                  disabled={!dischargeEnabled}
                  value={reserveLevel}
                  min={5}
                  max={50}
                  step={5}
                  onValueChange={setReserveLevel}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-blue-500" />
              Operating Modes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Self-Consumption Mode</label>
                    <p className="text-xs text-muted-foreground">Prioritize using solar energy before grid</p>
                  </div>
                  <Switch 
                    checked={selfConsumption} 
                    onCheckedChange={setSelfConsumption} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Economic Mode</label>
                    <p className="text-xs text-muted-foreground">Charge when rates are low, discharge when high</p>
                  </div>
                  <Switch 
                    checked={economicMode} 
                    onCheckedChange={setEconomicMode} 
                  />
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <Button className="w-full">Apply Settings</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Zap className="h-5 w-5 mr-2 text-amber-500" />
              Battery Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Overall Health</span>
                  <span className="text-sm font-medium text-green-600">Good</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '88%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Estimated Lifespan</span>
                  <span className="text-sm font-medium">92%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Charging Efficiency</span>
                  <span className="text-sm font-medium">95%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '95%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Next Maintenance</span>
                  <span className="text-sm font-medium">95 days</span>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <Button variant="outline" className="w-full">Run Diagnostics</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Main>
  );
};

export default BatteryManagement;
