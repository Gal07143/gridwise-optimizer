
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Battery, Activity } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

// Sample battery health data
const batteryhealthData = [
  { month: 'Jan', health: 98 },
  { month: 'Feb', health: 98 },
  { month: 'Mar', health: 97 },
  { month: 'Apr', health: 97 },
  { month: 'May', health: 96 },
  { month: 'Jun', health: 96 },
  { month: 'Jul', health: 95 },
  { month: 'Aug', health: 95 },
  { month: 'Sep', health: 94 },
  { month: 'Oct', health: 94 },
  { month: 'Nov', health: 93 },
  { month: 'Dec', health: 93 },
];

const AIBatteryHealthChart = () => {
  return (
    <Card className="col-span-1">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Battery className="h-4 w-4 text-blue-500" />
          Battery Health Prediction
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-2">
          <div>
            <div className="text-2xl font-bold">93%</div>
            <div className="text-xs text-muted-foreground">Current Health</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-500">-5%</div>
            <div className="text-xs text-muted-foreground">Annual Degradation</div>
          </div>
        </div>
        
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={batteryhealthData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 10 }}
                tickLine={false}
              />
              <YAxis 
                domain={[85, 100]} 
                tickCount={4} 
                tick={{ fontSize: 10 }}
                tickLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Health']}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="health" 
                stroke="#3b82f6" 
                strokeWidth={2} 
                dot={false}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="text-xs text-muted-foreground mt-2">
          Predictive analysis shows battery is aging normally. Expected replacement: 7-9 years.
        </div>
      </CardContent>
    </Card>
  );
};

export default AIBatteryHealthChart;
