import React, { useEffect, useState } from 'react';
import { useEquipment } from '@/contexts/EquipmentContext';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PerformanceMonitoringProps {
  equipmentId: string;
}

export const PerformanceMonitoring: React.FC<PerformanceMonitoringProps> = ({
  equipmentId,
}) => {
  const {
    metrics,
    performanceScores,
    efficiencyRecommendations,
    fetchMetrics,
    fetchPerformanceScores,
    fetchEfficiencyRecommendations,
    loading,
    error,
  } = useEquipment();

  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date(),
  });

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchMetrics(equipmentId, dateRange.from, dateRange.to),
        fetchPerformanceScores(equipmentId),
        fetchEfficiencyRecommendations(equipmentId),
      ]);
    };
    loadData();
  }, [
    equipmentId,
    dateRange,
    fetchMetrics,
    fetchPerformanceScores,
    fetchEfficiencyRecommendations,
  ]);

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return 'text-green-600';
    if (efficiency >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRecommendationPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div>Loading performance data...</div>;
  if (error) return <div>Error loading performance data: {error}</div>;

  const latestMetrics = metrics[metrics.length - 1];
  const latestScore = performanceScores[0];

  const metricsData = metrics.map((metric) => ({
    date: format(new Date(metric.timestamp), 'MMM dd'),
    efficiency: metric.efficiency,
    load: metric.load,
    energyConsumption: metric.energyConsumption,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Current Performance</CardTitle>
            <CardDescription>Real-time metrics</CardDescription>
          </CardHeader>
          <CardContent>
            {latestMetrics && (
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500">Efficiency</div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-2xl font-bold ${getEfficiencyColor(
                        latestMetrics.efficiency
                      )}`}
                    >
                      {latestMetrics.efficiency}%
                    </span>
                    <Progress value={latestMetrics.efficiency} className="w-1/2" />
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Load</div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">
                      {latestMetrics.load}%
                    </span>
                    <Progress value={latestMetrics.load} className="w-1/2" />
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Energy Consumption</div>
                  <div className="text-2xl font-bold">
                    {latestMetrics.energyConsumption} kWh
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Score</CardTitle>
            <CardDescription>Overall equipment effectiveness</CardDescription>
          </CardHeader>
          <CardContent>
            {latestScore && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">
                    {latestScore.overallScore}%
                  </div>
                  <div className="text-sm text-gray-500">Overall Score</div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <div className="text-xl font-semibold">
                      {latestScore.efficiencyScore}%
                    </div>
                    <div className="text-xs text-gray-500">Efficiency</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-semibold">
                      {latestScore.reliabilityScore}%
                    </div>
                    <div className="text-xs text-gray-500">Reliability</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-semibold">
                      {latestScore.maintenanceScore}%
                    </div>
                    <div className="text-xs text-gray-500">Maintenance</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Efficiency Recommendations</CardTitle>
            <CardDescription>Suggested improvements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {efficiencyRecommendations.slice(0, 3).map((rec) => (
                <div
                  key={rec.id}
                  className="border-b pb-2 last:border-0 last:pb-0"
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex-1">
                      <h4 className="font-medium">{rec.title}</h4>
                      <p className="text-sm text-gray-500">{rec.description}</p>
                    </div>
                    <Badge
                      className={getRecommendationPriorityColor(rec.priority)}
                    >
                      {rec.priority}
                    </Badge>
                  </div>
                  <div className="text-sm">
                    <span className="text-green-600">
                      Potential Savings: ${rec.potentialSavings}
                    </span>
                    <span className="mx-2">•</span>
                    <span className="text-gray-500">
                      ROI: {rec.paybackPeriod} months
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
          <CardDescription>Historical performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="efficiency">
            <TabsList>
              <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
              <TabsTrigger value="load">Load</TabsTrigger>
              <TabsTrigger value="energy">Energy Consumption</TabsTrigger>
            </TabsList>

            <TabsContent value="efficiency">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metricsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="efficiency"
                      stroke="#8884d8"
                      name="Efficiency (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="load">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metricsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="load"
                      stroke="#82ca9d"
                      name="Load (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="energy">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={metricsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="energyConsumption"
                      stroke="#ffc658"
                      fill="#fff5cc"
                      name="Energy Consumption (kWh)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceMonitoring; 