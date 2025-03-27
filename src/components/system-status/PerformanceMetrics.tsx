
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const PerformanceMetrics: React.FC = () => {
  // Sample data for charts
  const cpuData = [
    { time: '00:00', value: 45 },
    { time: '01:00', value: 42 },
    { time: '02:00', value: 40 },
    { time: '03:00', value: 38 },
    { time: '04:00', value: 35 },
    { time: '05:00', value: 39 },
    { time: '06:00', value: 48 },
    { time: '07:00', value: 56 },
    { time: '08:00', value: 68 },
    { time: '09:00', value: 75 },
    { time: '10:00', value: 82 },
    { time: '11:00', value: 78 },
    { time: '12:00', value: 74 },
  ];

  const memoryData = [
    { time: '00:00', value: 62 },
    { time: '01:00', value: 64 },
    { time: '02:00', value: 63 },
    { time: '03:00', value: 61 },
    { time: '04:00', value: 58 },
    { time: '05:00', value: 60 },
    { time: '06:00', value: 65 },
    { time: '07:00', value: 72 },
    { time: '08:00', value: 78 },
    { time: '09:00', value: 82 },
    { time: '10:00', value: 85 },
    { time: '11:00', value: 81 },
    { time: '12:00', value: 76 },
  ];

  const networkData = [
    { time: '00:00', value: 15 },
    { time: '01:00', value: 12 },
    { time: '02:00', value: 8 },
    { time: '03:00', value: 5 },
    { time: '04:00', value: 6 },
    { time: '05:00', value: 14 },
    { time: '06:00', value: 28 },
    { time: '07:00', value: 45 },
    { time: '08:00', value: 65 },
    { time: '09:00', value: 75 },
    { time: '10:00', value: 72 },
    { time: '11:00', value: 68 },
    { time: '12:00', value: 62 },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="cpu">
          <TabsList className="mb-4">
            <TabsTrigger value="cpu">CPU</TabsTrigger>
            <TabsTrigger value="memory">Memory</TabsTrigger>
            <TabsTrigger value="network">Network</TabsTrigger>
          </TabsList>
          
          <TabsContent value="cpu" className="space-y-4">
            <div className="flex justify-between">
              <div>
                <div className="text-2xl font-bold">74%</div>
                <div className="text-sm text-muted-foreground">Current usage</div>
              </div>
              <div>
                <div className="text-2xl font-bold">82%</div>
                <div className="text-sm text-muted-foreground">Peak (last 24h)</div>
              </div>
              <div>
                <div className="text-2xl font-bold">53%</div>
                <div className="text-sm text-muted-foreground">Average (last 24h)</div>
              </div>
            </div>
            
            <div className="h-[200px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cpuData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="time" />
                  <YAxis domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} />
                  <Tooltip formatter={(value) => [`${value}%`, 'CPU']} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="memory" className="space-y-4">
            <div className="flex justify-between">
              <div>
                <div className="text-2xl font-bold">76%</div>
                <div className="text-sm text-muted-foreground">Current usage</div>
              </div>
              <div>
                <div className="text-2xl font-bold">85%</div>
                <div className="text-sm text-muted-foreground">Peak (last 24h)</div>
              </div>
              <div>
                <div className="text-2xl font-bold">68%</div>
                <div className="text-sm text-muted-foreground">Average (last 24h)</div>
              </div>
            </div>
            
            <div className="h-[200px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={memoryData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="time" />
                  <YAxis domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Memory']} />
                  <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="network" className="space-y-4">
            <div className="flex justify-between">
              <div>
                <div className="text-2xl font-bold">62%</div>
                <div className="text-sm text-muted-foreground">Current usage</div>
              </div>
              <div>
                <div className="text-2xl font-bold">75%</div>
                <div className="text-sm text-muted-foreground">Peak (last 24h)</div>
              </div>
              <div>
                <div className="text-2xl font-bold">42%</div>
                <div className="text-sm text-muted-foreground">Average (last 24h)</div>
              </div>
            </div>
            
            <div className="h-[200px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={networkData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="time" />
                  <YAxis domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Network']} />
                  <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PerformanceMetrics;
