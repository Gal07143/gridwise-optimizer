
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { AlertTriangle, CheckCircle, Info, Tool, Zap } from 'lucide-react';

interface PerformanceReportContentProps {
  data: any;
}

const PerformanceReportContent: React.FC<PerformanceReportContentProps> = ({ data }) => {
  if (!data) return <div>No data available</div>;

  // Helper function to get color based on value
  const getHealthColor = (value: number) => {
    if (value >= 90) return 'bg-green-100 text-green-700';
    if (value >= 75) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  const getProgressColor = (value: number) => {
    if (value >= 90) return 'bg-green-500';
    if (value >= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">
              {data.system_health || 92}%
            </div>
            <Progress 
              value={data.system_health || 92} 
              className="h-2"
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {data.total_alerts || 0}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {data.period || 'Last 7 days'}
                </div>
              </div>
              <div className="flex gap-2">
                {data.critical_alerts > 0 && (
                  <Badge variant="destructive" className="flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {data.critical_alerts}
                  </Badge>
                )}
                {data.warning_alerts > 0 && (
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 flex items-center">
                    <Info className="h-3 w-3 mr-1" />
                    {data.warning_alerts}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">Overall Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">
              {data.overall_rating || 93}/100
            </div>
            <Progress 
              value={data.overall_rating || 93} 
              className="h-2"
            />
          </CardContent>
        </Card>
      </div>

      {data.devices && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Device Performance</CardTitle>
            <CardDescription>Efficiency and uptime of system components</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.devices.map((device, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-3">
                    <div>
                      <h3 className="font-medium">{device.name}</h3>
                      <Badge className={getHealthColor(device.efficiency)}>
                        {device.efficiency}% Efficiency
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-2 md:mt-0">
                      <div className="text-sm">
                        Uptime: <span className="font-medium">{device.uptime}%</span>
                      </div>
                      <div className="text-sm">
                        Energy: <span className="font-medium">{device.energy_produced} kWh</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Efficiency</span>
                      <span>{device.efficiency}%</span>
                    </div>
                    <Progress 
                      value={device.efficiency} 
                      className="h-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {data.performance_history && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performance History</CardTitle>
            <CardDescription>Tracking efficiency and uptime over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer 
              config={{
                efficiency: { theme: { light: "#4285F4", dark: "#82B1FF" }, label: "Efficiency" },
                uptime: { theme: { light: "#34A853", dark: "#66BB6A" }, label: "Uptime" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.performance_history}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar 
                    dataKey="efficiency" 
                    fill="var(--color-efficiency)" 
                    name="Efficiency (%)" 
                  />
                  <Bar 
                    dataKey="uptime" 
                    fill="var(--color-uptime)" 
                    name="Uptime (%)" 
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">System Component Health</CardTitle>
            <CardDescription>Health status of major system components</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Solar</span>
                    <span className="font-medium">{data.solar_health || 90}%</span>
                  </div>
                  <Progress 
                    value={data.solar_health || 90} 
                    className="h-2"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Battery</span>
                    <span className="font-medium">{data.battery_health || 85}%</span>
                  </div>
                  <Progress 
                    value={data.battery_health || 85} 
                    className="h-2"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Inverter</span>
                    <span className="font-medium">{data.inverter_health || 92}%</span>
                  </div>
                  <Progress 
                    value={data.inverter_health || 92} 
                    className="h-2"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Control System</span>
                    <span className="font-medium">{data.control_system_health || 95}%</span>
                  </div>
                  <Progress 
                    value={data.control_system_health || 95} 
                    className="h-2"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">System Performance Metrics</CardTitle>
            <CardDescription>Key metrics and reliability scores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <ChartContainer className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius={90} data={[
                    { 
                      subject: 'Solar', 
                      value: data.solar_health || 90, 
                      fullMark: 100 
                    },
                    { 
                      subject: 'Battery', 
                      value: data.battery_health || 85, 
                      fullMark: 100 
                    },
                    { 
                      subject: 'Inverter', 
                      value: data.inverter_health || 92, 
                      fullMark: 100 
                    },
                    { 
                      subject: 'Control', 
                      value: data.control_system_health || 95, 
                      fullMark: 100 
                    },
                    { 
                      subject: 'Monitoring', 
                      value: data.monitoring_health || 96, 
                      fullMark: 100 
                    },
                  ]}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis domain={[0, 100]} />
                    <Radar 
                      name="Health %" 
                      dataKey="value" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.6} 
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Reliability Score</span>
                <span className="font-medium">{data.reliability_score || 93}%</span>
              </div>
              <Progress 
                value={data.reliability_score || 93} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {data.maintenance_items && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Maintenance Items</CardTitle>
            <CardDescription>Scheduled and recommended maintenance tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.maintenance_items.map((item, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                    </div>
                    <Badge 
                      className={
                        item.priority === 'high' ? 'bg-red-100 text-red-800 border-red-200' :
                        item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                        'bg-green-100 text-green-800 border-green-200'
                      }
                    >
                      {item.priority} priority
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <div className="flex items-center">
                      <Tool className="h-4 w-4 mr-1" />
                      <span>Due: {item.due_date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PerformanceReportContent;
