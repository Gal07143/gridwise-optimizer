
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight } from 'lucide-react';
import { useSiteContext } from '@/contexts/SiteContext';

const data = [
  { name: 'Mon', value: 420 },
  { name: 'Tue', value: 380 },
  { name: 'Wed', value: 450 },
  { name: 'Thu', value: 410 },
  { name: 'Fri', value: 520 },
  { name: 'Sat', value: 480 },
  { name: 'Sun', value: 390 },
];

const AnalyticsCard = () => {
  const { activeSite } = useSiteContext();
  
  return (
    <Card className="shadow-md h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center justify-between">
          Energy Analytics
          <span className="text-sm font-normal text-muted-foreground">
            <ArrowUpRight className="h-4 w-4 inline mr-1" />
            +12% this week
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis hide={true} />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border p-2 text-sm rounded-md shadow-md">
                        <p className="font-medium">{`${payload[0].payload.name}: ${payload[0].value} kWh`}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="value" fill="#4F46E5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 text-sm text-muted-foreground">
          {activeSite ? `Analytics for ${activeSite.name}` : 'Select a site to view detailed analytics'}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsCard;
