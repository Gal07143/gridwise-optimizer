import React, { useState } from 'react';
import { BarChart3, Calendar, TrendingUp, Zap, Activity, Download, PieChart, BarChart, History, BarChartHorizontal } from 'lucide-react';
import DashboardCard from '@/components/dashboard/DashboardCard';
import LiveChart from '@/components/dashboard/LiveChart';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import MetricsCard from '@/components/dashboard/MetricsCard';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  AreaChart as RechartsAreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Toggle } from '@/components/ui/toggle';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';

const weeklyEnergyData = [
  { time: 'Mon', value: 320, comparison: 290 },
  { time: 'Tue', value: 350, comparison: 310 },
  { time: 'Wed', value: 410, comparison: 380 },
  { time: 'Thu', value: 390, comparison: 410 },
  { time: 'Fri', value: 450, comparison: 420 },
  { time: 'Sat', value: 380, comparison: 370 },
  { time: 'Sun', value: 290, comparison: 280 },
];

const monthlyGenerationData = [
  { time: 'Jan', value: 4200, comparison: 3800 },
  { time: 'Feb', value: 4500, comparison: 4100 },
  { time: 'Mar', value: 5100, comparison: 4700 },
  { time: 'Apr', value: 5400, comparison: 4900 },
  { time: 'May', value: 6200, comparison: 5400 },
  { time: 'Jun', value: 6800, comparison: 5900 },
  { time: 'Jul', value: 7100, comparison: 6200 },
  { time: 'Aug', value: 7000, comparison: 6300 },
  { time: 'Sep', value: 6300, comparison: 5700 },
  { time: 'Oct', value: 5600, comparison: 5100 },
  { time: 'Nov', value: 4900, comparison: 4400 },
  { time: 'Dec', value: 4100, comparison: 3900 },
];

const peakDemandData = [
  { time: '00:00', value: 86, comparison: 82 },
  { time: '03:00', value: 72, comparison: 70 },
  { time: '06:00', value: 91, comparison: 85 },
  { time: '09:00', value: 132, comparison: 120 },
  { time: '12:00', value: 145, comparison: 138 },
  { time: '15:00', value: 156, comparison: 145 },
  { time: '18:00', value: 168, comparison: 152 },
  { time: '21:00', value: 120, comparison: 115 },
  { time: '24:00', value: 94, comparison: 90 },
];

const energySourcesData = [
  { name: 'Solar', value: 45 },
  { name: 'Wind', value: 30 },
  { name: 'Grid', value: 15 },
  { name: 'Battery', value: 10 },
];

const topConsumersData = [
  { device: 'Heat Pump', consumption: 1240, change: '+5%' },
  { device: 'EV Charger', consumption: 950, change: '+12%' },
  { device: 'Air Conditioning', consumption: 820, change: '-3%' },
  { device: 'Kitchen Appliances', consumption: 480, change: '+1%' },
  { device: 'Lighting', consumption: 320, change: '-8%' },
];

const costBreakdownData = [
  { category: 'Peak Hours', cost: 182.50, percentage: 45 },
  { category: 'Off-Peak Hours', cost: 78.30, percentage: 20 },
  { category: 'Shoulder Hours', cost: 142.20, percentage: 35 },
];

const Analytics = () => {
  const [timeframe, setTimeframe] = useState('week');
  const [dataComparisonEnabled, setDataComparisonEnabled] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-900 animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold mb-1">Energy Analytics</h1>
              <p className="text-muted-foreground">Comprehensive data analysis and performance insights</p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Last 24 Hours</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                  <SelectItem value="year">Last 12 Months</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="comparison-toggle"
                    checked={dataComparisonEnabled}
                    onCheckedChange={setDataComparisonEnabled}
                  />
                  <label 
                    htmlFor="comparison-toggle" 
                    className="text-sm font-medium cursor-pointer"
                  >
                    Compare with previous {timeframe}
                  </label>
                </div>
              </div>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Download size={16} />
                <span>Export</span>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <MetricsCard 
              title="Total Energy Consumption" 
              value={2483} 
              unit="kWh"
              changeValue={8.2}
              changeType="increase"
              description="Last 30 days"
              icon={<Zap className="h-5 w-5" />}
            />
            <MetricsCard 
              title="Energy Cost" 
              value={403} 
              unit="$"
              changeValue={5.7}
              changeType="increase"
              description="Last 30 days"
              icon={<Activity className="h-5 w-5" />}
            />
            <MetricsCard 
              title="Carbon Footprint" 
              value={628} 
              unit="kg"
              changeValue={12.4}
              changeType="decrease"
              description="Last 30 days"
              icon={<BarChart className="h-5 w-5" />}
            />
          </div>
          
          <Tabs defaultValue="consumption" className="mb-6">
            <TabsList className="mb-4">
              <TabsTrigger value="consumption">Consumption</TabsTrigger>
              <TabsTrigger value="generation">Generation</TabsTrigger>
              <TabsTrigger value="cost">Cost Analysis</TabsTrigger>
              <TabsTrigger value="insights">Key Insights</TabsTrigger>
            </TabsList>
            
            <TabsContent value="consumption" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DashboardCard 
                  title="Daily Energy Consumption (kWh)"
                  icon={<Calendar size={18} />}
                >
                  <div className="h-[250px]">
                    <ChartContainer
                      config={{
                        current: { 
                          label: "This Week", 
                          color: "rgba(122, 90, 248, 1)" 
                        },
                        previous: { 
                          label: "Last Week", 
                          color: "rgba(122, 90, 248, 0.3)" 
                        },
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsAreaChart 
                          data={weeklyEnergyData}
                          margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                        >
                          <defs>
                            <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="rgba(122, 90, 248, 0.8)" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="rgba(122, 90, 248, 0.1)" stopOpacity={0.1}/>
                            </linearGradient>
                            <linearGradient id="colorPrevious" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="rgba(122, 90, 248, 0.3)" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="rgba(122, 90, 248, 0)" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                          <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip content={<ChartTooltipContent />} />
                          <Legend content={<ChartLegendContent />} />
                          <Area 
                            type="monotone" 
                            dataKey="value" 
                            name="current"
                            stroke="rgba(122, 90, 248, 1)"
                            fillOpacity={1}
                            fill="url(#colorCurrent)"
                          />
                          {dataComparisonEnabled && (
                            <Area 
                              type="monotone" 
                              dataKey="comparison" 
                              name="previous"
                              stroke="rgba(122, 90, 248, 0.3)"
                              fillOpacity={1}
                              fill="url(#colorPrevious)"
                            />
                          )}
                        </RechartsAreaChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </DashboardCard>
                
                <DashboardCard 
                  title="Peak Power Demand (kW)"
                  icon={<TrendingUp size={18} />}
                >
                  <LiveChart
                    data={peakDemandData}
                    height={250}
                    color="rgba(255, 153, 0, 1)"
                    type="area"
                    gradientFrom="rgba(255, 153, 0, 0.5)"
                    gradientTo="rgba(255, 153, 0, 0)"
                    animated={false}
                  />
                </DashboardCard>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <DashboardCard
                  title="Energy Sources Breakdown"
                  icon={<PieChart size={18} />}
                >
                  <div className="flex flex-col items-center justify-center h-[220px] pt-4">
                    <div className="w-40 h-40 relative">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        {/* Solar - 45% */}
                        <circle
                          className="fill-[#fbbf24]"
                          cx="50"
                          cy="50"
                          r="40"
                          strokeWidth="0"
                          strokeDasharray="251.2"
                          strokeDashoffset="0"
                          transform="rotate(-90 50 50)"
                        />
                        {/* Wind - 30% */}
                        <circle
                          className="fill-[#22c55e]"
                          cx="50"
                          cy="50"
                          r="40"
                          strokeWidth="0"
                          strokeDasharray="251.2"
                          strokeDashoffset="138.2"
                          transform="rotate(-90 50 50)"
                        />
                        {/* Grid - 15% */}
                        <circle
                          className="fill-[#3b82f6]"
                          cx="50"
                          cy="50"
                          r="40"
                          strokeWidth="0"
                          strokeDasharray="251.2"
                          strokeDashoffset="188.4"
                          transform="rotate(-90 50 50)"
                        />
                        {/* Battery - 10% */}
                        <circle
                          className="fill-[#8b5cf6]"
                          cx="50"
                          cy="50"
                          r="40"
                          strokeWidth="0"
                          strokeDasharray="251.2"
                          strokeDashoffset="213.5"
                          transform="rotate(-90 50 50)"
                        />
                        <circle
                          className="fill-white dark:fill-slate-800"
                          cx="50"
                          cy="50"
                          r="25"
                        />
                      </svg>
                    </div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-4">
                      {energySourcesData.map((source) => (
                        <div key={source.name} className="flex items-center gap-2">
                          <div 
                            className={`w-3 h-3 rounded-full ${
                              source.name === 'Solar' ? 'bg-[#fbbf24]' : 
                              source.name === 'Wind' ? 'bg-[#22c55e]' : 
                              source.name === 'Grid' ? 'bg-[#3b82f6]' : 
                              'bg-[#8b5cf6]'
                            }`}
                          />
                          <span className="text-xs">{source.name}: {source.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </DashboardCard>
                
                <DashboardCard
                  title="Top Consumers"
                  icon={<Zap size={18} />}
                >
                  <div className="h-[220px] overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Device</TableHead>
                          <TableHead className="text-right">kWh</TableHead>
                          <TableHead className="text-right">Change</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {topConsumersData.map((consumer) => (
                          <TableRow key={consumer.device}>
                            <TableCell className="font-medium">{consumer.device}</TableCell>
                            <TableCell className="text-right">{consumer.consumption}</TableCell>
                            <TableCell className={`text-right ${
                              consumer.change.startsWith('+') ? 'text-energy-red' : 'text-energy-green'
                            }`}>
                              {consumer.change}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </DashboardCard>
                
                <DashboardCard
                  title="Consumption by Time"
                  icon={<History size={18} />}
                >
                  <div className="h-[220px] flex flex-col justify-center">
                    {costBreakdownData.map((item) => (
                      <div key={item.category} className="mb-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span>{item.category}</span>
                          <span className="font-medium">{item.cost.toFixed(2)} $ ({item.percentage}%)</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${
                              item.category === 'Peak Hours' ? 'bg-energy-red' : 
                              item.category === 'Off-Peak Hours' ? 'bg-energy-green' : 
                              'bg-energy-blue'
                            }`} 
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </DashboardCard>
              </div>
            </TabsContent>
            
            <TabsContent value="generation">
              <DashboardCard 
                title="Monthly Energy Generation (kWh)"
                icon={<BarChart3 size={18} />}
              >
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsAreaChart 
                      data={monthlyGenerationData}
                      margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                    >
                      <defs>
                        <linearGradient id="colorGenCurrent" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="rgba(45, 211, 111, 0.8)" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="rgba(45, 211, 111, 0.1)" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorGenPrevious" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="rgba(45, 211, 111, 0.3)" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="rgba(45, 211, 111, 0)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        name="This Year"
                        stroke="rgba(45, 211, 111, 1)"
                        fillOpacity={1}
                        fill="url(#colorGenCurrent)"
                      />
                      {dataComparisonEnabled && (
                        <Area 
                          type="monotone" 
                          dataKey="comparison" 
                          name="Last Year"
                          stroke="rgba(45, 211, 111, 0.3)"
                          fillOpacity={1}
                          fill="url(#colorGenPrevious)"
                        />
                      )}
                    </RechartsAreaChart>
                  </ResponsiveContainer>
                </div>
              </DashboardCard>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <Card className="bg-white dark:bg-slate-800 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="text-3xl font-bold text-energy-green mb-2">+24.6%</div>
                      <div className="text-sm text-muted-foreground mb-4">Year-over-year generation increase</div>
                      <div className="w-16 h-16 rounded-full flex items-center justify-center bg-energy-green/10 text-energy-green">
                        <TrendingUp size={28} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white dark:bg-slate-800 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="text-3xl font-bold mb-2">72.4%</div>
                      <div className="text-sm text-muted-foreground mb-4">System efficiency rating</div>
                      <div className="w-16 h-16 rounded-full flex items-center justify-center bg-primary/10 text-primary">
                        <Activity size={28} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white dark:bg-slate-800 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="text-3xl font-bold text-amber-500 mb-2">4.2 hrs</div>
                      <div className="text-sm text-muted-foreground mb-4">Average daily peak production</div>
                      <div className="w-16 h-16 rounded-full flex items-center justify-center bg-amber-500/10 text-amber-500">
                        <BarChart size={28} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="cost">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <DashboardCard 
                  title="Energy Cost Distribution"
                  icon={<PieChart size={18} />}
                >
                  <div className="flex flex-col h-64">
                    <div className="flex-1 flex items-center justify-center">
                      <div className="relative w-40 h-40">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          {/* Peak - 45% */}
                          <circle
                            className="fill-energy-red"
                            cx="50"
                            cy="50"
                            r="40"
                            strokeWidth="0"
                            strokeDasharray="251.2"
                            strokeDashoffset="0"
                            transform="rotate(-90 50 50)"
                          />
                          {/* Shoulder - 35% */}
                          <circle
                            className="fill-energy-blue"
                            cx="50"
                            cy="50"
                            r="40"
                            strokeWidth="0"
                            strokeDasharray="251.2"
                            strokeDashoffset="113.04"
                            transform="rotate(-90 50 50)"
                          />
                          {/* Off-Peak - 20% */}
                          <circle
                            className="fill-energy-green"
                            cx="50"
                            cy="50"
                            r="40"
                            strokeWidth="0"
                            strokeDasharray="251.2"
                            strokeDashoffset="200.96"
                            transform="rotate(-90 50 50)"
                          />
                          <circle
                            className="fill-white dark:fill-slate-800"
                            cx="50"
                            cy="50"
                            r="25"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-xl font-bold">$403</div>
                            <div className="text-xs text-muted-foreground">Total</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      <div className="flex flex-col items-center p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="flex items-center mb-1">
                          <div className="w-3 h-3 rounded-full bg-energy-red mr-1"></div>
                          <span className="text-xs">Peak</span>
                        </div>
                        <div className="text-sm font-semibold">$182.50</div>
                      </div>
                      <div className="flex flex-col items-center p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="flex items-center mb-1">
                          <div className="w-3 h-3 rounded-full bg-energy-blue mr-1"></div>
                          <span className="text-xs">Shoulder</span>
                        </div>
                        <div className="text-sm font-semibold">$142.20</div>
                      </div>
                      <div className="flex flex-col items-center p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="flex items-center mb-1">
                          <div className="w-3 h-3 rounded-full bg-energy-green mr-1"></div>
                          <span className="text-xs">Off-Peak</span>
                        </div>
                        <div className="text-sm font-semibold">$78.30</div>
                      </div>
                    </div>
                  </div>
                </DashboardCard>
                
                <DashboardCard 
                  title="Monthly Cost Trend"
                  icon={<TrendingUp size={18} />}
                >
                  <div className="h-64">
                    <LiveChart
                      data={monthlyGenerationData.map(d => ({ time: d.time, value: d.value * 0.09 }))}
                      height={250}
                      color="rgba(255, 99, 132, 1)"
                      type="area"
                      gradientFrom="rgba(255, 99, 132, 0.5)"
                      gradientTo="rgba(255, 99, 132, 0)"
                      animated={false}
                    />
                  </div>
                </DashboardCard>
              </div>
              
              <DashboardCard 
                title="Potential Cost Savings with Time of Use Optimization"
                icon={<Activity size={18} />}
              >
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      <div className="text-muted-foreground text-sm mb-2">Current Monthly Cost</div>
                      <div className="text-2xl font-bold mb-1">$403.00</div>
                      <div className="text-xs text-muted-foreground">Based on current usage patterns</div>
                    </div>
                    
                    <div className="flex flex-col p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      <div className="text-muted-foreground text-sm mb-2">Optimized Cost</div>
                      <div className="text-2xl font-bold text-energy-green mb-1">$312.50</div>
                      <div className="text-xs text-muted-foreground">With ToU optimization</div>
                    </div>
                    
                    <div className="flex flex-col p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      <div className="text-muted-foreground text-sm mb-2">Annual Savings</div>
                      <div className="text-2xl font-bold text-energy-green mb-1">$1,086</div>
                      <div className="text-xs text-muted-foreground">22.5% reduction in costs</div>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-100 dark:border-green-900/30">
                    <h4 className="font-medium mb-2 flex items-center">
                      <TrendingUp className="mr-2 h-4 w-4 text-energy-green" />
                      Optimization Recommendations
                    </h4>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-start">
                        <div className="h-5 w-5 mr-2 flex items-center justify-center text-white bg-energy-green rounded-full text-xs">1</div>
                        <span>Shift EV charging from 6-8PM (peak) to 12-4AM (off-peak) to save $38/month</span>
                      </li>
                      <li className="flex items-start">
                        <div className="h-5 w-5 mr-2 flex items-center justify-center text-white bg-energy-green rounded-full text-xs">2</div>
                        <span>Pre-cool/heat your home before peak hours to reduce HVAC usage during expensive periods</span>
                      </li>
                      <li className="flex items-start">
                        <div className="h-5 w-5 mr-2 flex items-center justify-center text-white bg-energy-green rounded-full text-xs">3</div>
                        <span>Enable battery discharge during peak hours (5-9PM) to avoid highest rates</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </DashboardCard>
            </TabsContent>
            
            <TabsContent value="insights">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <DashboardCard
                  title="Key Performance Indicators"
                  icon={<Activity size={18} />}
                >
                  <div className="space-y-4 p-2">
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">System Efficiency</div>
                        <div className="text-xs text-muted-foreground">Energy out vs energy in</div>
                      </div>
                      <div className="text-xl font-bold">94.3%</div>
                    </div>
                    
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">Self-Consumption Rate</div>
                        <div className="text-xs text-muted-foreground">Energy used on-site</div>
                      </div>
                      <div className="text-xl font-bold">68.7%</div>
                    </div>
                    
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">Grid Independence</div>
                        <div className="text-xs text-muted-foreground">Energy from renewable sources</div>
                      </div>
                      <div className="text-xl font-bold">82.4%</div>
                    </div>
                    
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">Carbon Offset</div>
                        <div className="text-xs text-muted-foreground">CO2 emissions avoided</div>
                      </div>
                      <div className="text-xl font-bold">3.8 tons</div>
                    </div>
                  </div>
                </DashboardCard>
                
                <DashboardCard
                  title="System Insights"
                  icon={<BarChart3 size={18} />}
                >
                  <div className="space-y-4 p-2">
                    <div className="p-3 rounded-lg border border-amber-100 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900/30">
                      <div className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-1">Peak Usage Alert</div>
                      <div className="text-xs">Your energy consumption peaks between 5-7PM, which coincides with the highest electricity rates. Consider shifting some usage to off-peak hours.</div>
                    </div>
                    
                    <div className="p-3 rounded-lg border border-green-100 bg-green-50 dark:bg-green-950/20 dark:border-green-900/30">
                      <div className="text-sm font-medium text-green-800 dark:text-green-300 mb-1">Efficiency Improvement</div>
                      <div className="text-xs">Your solar panel efficiency has increased by 5% compared to last month, possibly due to recent cleaning or favorable weather conditions.</div>
                    </div>
                    
                    <div className="p-3 rounded-lg border border-blue-100 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900/30">
                      <div className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">Battery Optimization</div>
                      <div className="text-xs">Your battery storage is only utilized at 65% capacity. Optimizing charge/discharge cycles could improve your energy independence by up to 15%.</div>
                    </div>
                    
                    <div className="p-3 rounded-lg border border-purple-100 bg-purple-50 dark:bg-purple-950/20 dark:border-purple-900/30">
                      <div className="text-sm font-medium text-purple-800 dark:text-purple-300 mb-1">Seasonal Pattern</div>
                      <div className="text-xs">Energy production has increased 18% month-over-month, following the expected seasonal pattern as we move toward summer months.</div>
                    </div>
                  </div>
                </DashboardCard>
              </div>
              
              <DashboardCard
                title="Comparative Analysis"
                icon={<BarChart size={18} />}
              >
                <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                    <h4 className="text-sm font-medium mb-2">vs. Similar Households</h4>
                    <div className="flex items-center justify-center py-4">
                      <div className="relative w-32 h-32">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          <circle
                            className="text-slate-200 dark:text-slate-700 stroke-current"
                            strokeWidth="8"
                            fill="transparent"
                            r="42"
                            cx="50"
                            cy="50"
                          />
                          <circle
                            className="text-energy-green stroke-current"
                            strokeWidth="8"
                            strokeLinecap="round"
                            fill="transparent"
                            r="42"
                            cx="50"
                            cy="50"
                            strokeDasharray="263.89"
                            strokeDashoffset="66"
                            transform="rotate(-90 50 50)"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center text-center">
                          <div>
                            <div className="text-2xl font-bold">75%</div>
                            <div className="text-xs text-muted-foreground">More efficient</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-center text-muted-foreground mt-2">
                      You use 25% less energy than similar homes in your area
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                    <h4 className="text-sm font-medium mb-2">vs. Previous Year</h4>
                    <div className="flex items-center justify-center py-4">
                      <div className="relative w-32 h-32">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          <circle
                            className="text-slate-200 dark:text-slate-700 stroke-current"
                            strokeWidth="8"
                            fill="transparent"
                            r="42"
                            cx="50"
                            cy="50"
                          />
                          <circle
                            className="text-energy-blue stroke-current"
                            strokeWidth="8"
                            strokeLinecap="round"
                            fill="transparent"
                            r="42"
                            cx="50"
                            cy="50"
                            strokeDasharray="263.89"
                            strokeDashoffset="92.4"
                            transform="rotate(-90 50 50)"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center text-center">
                          <div>
                            <div className="text-2xl font-bold">65%</div>
                            <div className="text-xs text-muted-foreground">Cost reduction</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-center text-muted-foreground mt-2">
                      Your energy costs are 35% lower than last year
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                    <h4 className="text-sm font-medium mb-2">vs. Optimal Performance</h4>
                    <div className="flex items-center justify-center py-4">
                      <div className="relative w-32 h-32">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          <circle
                            className="text-slate-200 dark:text-slate-700 stroke-current"
                            strokeWidth="8"
                            fill="transparent"
                            r="42"
                            cx="50"
                            cy="50"
                          />
                          <circle
                            className="text-amber-500 stroke-current"
                            strokeWidth="8"
                            strokeLinecap="round"
                            fill="transparent"
                            r="42"
                            cx="50"
                            cy="50"
                            strokeDasharray="263.89"
                            strokeDashoffset="79.2"
                            transform="rotate(-90 50 50)"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center text-center">
                          <div>
                            <div className="text-2xl font-bold">70%</div>
                            <div className="text-xs text-muted-foreground">Optimization</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-center text-muted-foreground mt-2">
                      You're at 70% of optimal performance for your system
                    </div>
                  </div>
                </div>
              </DashboardCard>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
