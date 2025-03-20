
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart2, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Calendar, 
  Settings,
  BarChart
} from 'lucide-react';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

interface PerformanceReportContentProps {
  data: any;
}

const PerformanceReportContent: React.FC<PerformanceReportContentProps> = ({ data }) => {
  if (!data) return <div>No data available</div>;

  // Access or provide default data
  const devices = data.devices || [];
  const performanceHistory = data.performance_history || [];
  const period = data.period || 'Last 7 days';
  
  // Calculate averages across devices
  const avgEfficiency = devices.length > 0 
    ? devices.reduce((sum, device) => sum + device.efficiency, 0) / devices.length 
    : 0;
    
  const avgUptime = devices.length > 0 
    ? devices.reduce((sum, device) => sum + device.uptime, 0) / devices.length 
    : 0;
  
  // Format data for radar chart
  const radarData = [
    { subject: 'Efficiency', A: avgEfficiency, fullMark: 100 },
    { subject: 'Uptime', A: avgUptime, fullMark: 100 },
    { subject: 'Response Time', A: data.avg_response_time || 85, fullMark: 100 },
    { subject: 'Reliability', A: data.reliability || 92, fullMark: 100 },
    { subject: 'Energy Output', A: data.energy_output_rating || 88, fullMark: 100 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              {data.system_health || ((avgEfficiency + avgUptime) / 2).toFixed(1)}%
              <Badge 
                className={`${Number(data.system_health || avgEfficiency) > 85 ? 'bg-green-500' : 'bg-yellow-500'}`}
              >
                {Number(data.system_health || avgEfficiency) > 85 ? 'Good' : 'Average'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              <Calendar className="inline h-3 w-3 mr-1" />
              Period: {period}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">Average Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {avgUptime.toFixed(1)}%
            </div>
            <Progress 
              value={avgUptime} 
              className="h-2 mt-2"
              indicatorClassName={avgUptime > 95 ? "bg-green-500" : avgUptime > 85 ? "bg-yellow-500" : "bg-red-500"}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">System Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              {data.total_alerts || "3"}
              <Badge className={`${data.critical_alerts > 0 ? 'bg-red-500' : 'bg-green-500'}`}>
                {data.critical_alerts > 0 ? `${data.critical_alerts} Critical` : 'All Clear'}
              </Badge>
            </div>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                {data.warning_alerts || "2"} Warning
              </Badge>
              <Badge variant="outline" className="text-blue-500 border-blue-500">
                {data.info_alerts || "1"} Info
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performance Metrics</CardTitle>
            <CardDescription>System performance overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={90} data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name="Performance"
                    dataKey="A"
                    stroke="#4F46E5"
                    fill="#4F46E5"
                    fillOpacity={0.3}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performance Trend</CardTitle>
            <CardDescription>Daily performance history</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer 
              config={{
                efficiency: { theme: { light: "#4F46E5", dark: "#6366F1" }, label: "Efficiency" },
                uptime: { theme: { light: "#10B981", dark: "#34D399" }, label: "Uptime" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={performanceHistory.length > 0 ? performanceHistory : [
                    { date: '06/01', efficiency: 88, uptime: 99 },
                    { date: '06/02', efficiency: 89, uptime: 98 },
                    { date: '06/03', efficiency: 87, uptime: 98 },
                    { date: '06/04', efficiency: 90, uptime: 99 },
                    { date: '06/05', efficiency: 92, uptime: 100 },
                    { date: '06/06', efficiency: 91, uptime: 99 },
                    { date: '06/07', efficiency: 93, uptime: 99 },
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="efficiency"
                    stroke="var(--color-efficiency)"
                    name="Efficiency (%)"
                  />
                  <Line
                    type="monotone"
                    dataKey="uptime"
                    stroke="var(--color-uptime)"
                    name="Uptime (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Device Performance</CardTitle>
          <CardDescription>Individual device metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {devices.length > 0 ? (
              devices.map((device, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <BarChart className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">{device.name}</h3>
                      <Badge variant="outline" className="ml-2">
                        {device.id}
                      </Badge>
                    </div>
                    <Badge className={
                      device.efficiency > 90 ? 'bg-green-500' : 
                      device.efficiency > 75 ? 'bg-yellow-500' : 
                      'bg-red-500'
                    }>
                      {device.efficiency > 90 ? 'Excellent' : 
                       device.efficiency > 75 ? 'Good' : 
                       'Poor'}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Efficiency</span>
                        <span className="font-medium">{device.efficiency}%</span>
                      </div>
                      <Progress 
                        value={device.efficiency} 
                        className="h-2"
                        indicatorClassName={
                          device.efficiency > 90 ? "bg-green-500" : 
                          device.efficiency > 75 ? "bg-yellow-500" : 
                          "bg-red-500"
                        }
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Uptime</span>
                        <span className="font-medium">{device.uptime}%</span>
                      </div>
                      <Progress 
                        value={device.uptime} 
                        className="h-2"
                        indicatorClassName={
                          device.uptime > 95 ? "bg-green-500" : 
                          device.uptime > 85 ? "bg-yellow-500" : 
                          "bg-red-500"
                        }
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Energy</span>
                        <span className="font-medium">{device.energy_produced} kWh</span>
                      </div>
                      <Progress 
                        value={device.energy_produced / 10} 
                        className="h-2"
                        indicatorClassName="bg-blue-500"
                      />
                    </div>
                  </div>
                  
                  {index < devices.length - 1 && <Separator className="mt-4" />}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="bg-primary/10 text-primary p-2 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-4">
                  <Settings className="h-6 w-6" />
                </div>
                <p className="text-muted-foreground">No device performance data available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Maintenance Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.maintenance_items ? (
              data.maintenance_items.map((item, index) => (
                <div key={index} className="flex items-start gap-2 p-3 border rounded-md">
                  <div className={`p-1 rounded-full ${
                    item.priority === 'high' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                    item.priority === 'medium' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                  } h-6 w-6 flex items-center justify-center flex-shrink-0`}>
                    {item.priority === 'high' ? (
                      <AlertTriangle className="h-3 w-3" />
                    ) : item.priority === 'medium' ? (
                      <Clock className="h-3 w-3" />
                    ) : (
                      <CheckCircle className="h-3 w-3" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">{item.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                    {item.due_date && (
                      <div className="mt-2 text-xs">
                        <span className="font-medium">Due date:</span> {item.due_date}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="space-y-3">
                <div className="flex items-start gap-2 p-3 border rounded-md">
                  <div className="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 p-1 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="h-3 w-3" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Solar Inverter Inspection</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Efficiency dropping below optimal levels. Schedule inspection of inverter settings and connections.
                    </p>
                    <div className="mt-2 text-xs">
                      <span className="font-medium">Due date:</span> Within 7 days
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 p-3 border rounded-md">
                  <div className="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400 p-1 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-3 w-3" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Panel Cleaning</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Recommended panel cleaning to restore optimal efficiency. Current dust build-up reducing output by 5-8%.
                    </p>
                    <div className="mt-2 text-xs">
                      <span className="font-medium">Due date:</span> Within 30 days
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 p-3 border rounded-md">
                  <div className="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 p-1 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-3 w-3" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Routine Battery Inspection</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Scheduled routine maintenance for battery system. All metrics currently within normal parameters.
                    </p>
                    <div className="mt-2 text-xs">
                      <span className="font-medium">Due date:</span> Within 90 days
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">System Health Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-3">Overall Performance Rating</h4>
                <div className="flex items-center justify-center">
                  <div className="relative w-40 h-40">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-3xl font-bold">
                        {data.overall_rating || Math.round((avgEfficiency + avgUptime) / 2)}%
                      </div>
                    </div>
                    <svg width="160" height="160" viewBox="0 0 160 160">
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="12"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        fill="none"
                        stroke={
                          (data.overall_rating || (avgEfficiency + avgUptime) / 2) > 85 
                            ? "#10b981" 
                            : (data.overall_rating || (avgEfficiency + avgUptime) / 2) > 70 
                              ? "#f59e0b" 
                              : "#ef4444"
                        }
                        strokeWidth="12"
                        strokeDasharray="440"
                        strokeDashoffset={440 - (440 * (data.overall_rating || ((avgEfficiency + avgUptime) / 2))) / 100}
                        transform="rotate(-90, 80, 80)"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <h4 className="text-sm font-medium mb-2">Component Health Status</h4>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <span>Solar System</span>
                    </div>
                    <span className="font-medium">{data.solar_health || "92"}%</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                      <span>Battery Storage</span>
                    </div>
                    <span className="font-medium">{data.battery_health || "87"}%</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                      <span>Inverters</span>
                    </div>
                    <span className="font-medium">{data.inverter_health || "94"}%</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                      <span>Control Systems</span>
                    </div>
                    <span className="font-medium">{data.control_system_health || "98"}%</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-cyan-500"></div>
                      <span>Monitoring Equipment</span>
                    </div>
                    <span className="font-medium">{data.monitoring_health || "99"}%</span>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="text-sm font-medium mb-2">Reliability Score</h4>
                <div className="flex justify-between items-center gap-4">
                  <Progress 
                    value={data.reliability_score || 96} 
                    className="h-3"
                    indicatorClassName={
                      (data.reliability_score || 96) > 90 ? "bg-green-500" : 
                      (data.reliability_score || 96) > 75 ? "bg-yellow-500" : 
                      "bg-red-500"
                    }
                  />
                  <span className="font-bold text-sm">{data.reliability_score || 96}/100</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {(data.reliability_score || 96) > 90 
                    ? "Excellent - System performing with high reliability" 
                    : (data.reliability_score || 96) > 75 
                      ? "Good - Generally reliable with occasional issues" 
                      : "Needs attention - System experiencing reliability issues"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PerformanceReportContent;
