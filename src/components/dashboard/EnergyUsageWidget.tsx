
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface EnergyUsageWidgetProps {
  data?: any[];
  period?: 'day' | 'week' | 'month' | 'year';
  title?: string;
  className?: string;
}

const sampleData = [
  { name: '00:00', consumption: 15, generation: 0 },
  { name: '04:00', consumption: 13, generation: 0 },
  { name: '08:00', consumption: 25, generation: 18 },
  { name: '12:00', consumption: 30, generation: 30 },
  { name: '16:00', consumption: 42, generation: 25 },
  { name: '20:00', consumption: 35, generation: 5 },
];

const EnergyUsageWidget = ({ 
  data = sampleData, 
  period = 'day',
  title = 'Energy Usage',
  className = '' 
}: EnergyUsageWidgetProps) => {
  const periodText = {
    'day': 'Today',
    'week': 'This Week',
    'month': 'This Month',
    'year': 'This Year'
  };

  // Calculate totals
  const totalConsumption = data.reduce((sum, item) => sum + item.consumption, 0);
  const totalGeneration = data.reduce((sum, item) => sum + item.generation, 0);
  const netUsage = totalConsumption - totalGeneration;
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          {title}
          <span className="text-sm font-normal text-muted-foreground">{periodText[period]}</span>
        </CardTitle>
        <CardDescription>Energy consumption and generation</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Consumption</p>
            <p className="text-2xl font-semibold">{totalConsumption} kWh</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Generation</p>
            <p className="text-2xl font-semibold">{totalGeneration} kWh</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Net Usage</p>
            <p className={`text-2xl font-semibold ${netUsage >= 0 ? 'text-orange-500' : 'text-green-500'}`}>
              {netUsage >= 0 ? '+' : ''}{netUsage} kWh
            </p>
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 5,
                left: -20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="consumption" name="Consumption" fill="#f97316" />
              <Bar dataKey="generation" name="Generation" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnergyUsageWidget;
