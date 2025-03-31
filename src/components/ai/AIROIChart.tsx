
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart2, DollarSign } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';

// Sample ROI data
const roiData = [
  { year: 'Year 1', value: 1250, roi: 7 },
  { year: 'Year 2', value: 2600, roi: 14 },
  { year: 'Year 3', value: 3950, roi: 22 },
  { year: 'Year 4', value: 5300, roi: 29 },
  { year: 'Year 5', value: 6650, roi: 37 },
  { year: 'Year 6', value: 8000, roi: 44 },
  { year: 'Year 7', value: 9350, roi: 52 },
  { year: 'Year 8', value: 10700, roi: 59 },
  { year: 'Year 9', value: 12050, roi: 67 },
  { year: 'Year 10', value: 13400, roi: 74 },
];

const AIROIChart = () => {
  const breakEvenYear = roiData.findIndex(item => item.roi >= 100);
  const projectedBreakEven = breakEvenYear >= 0 ? breakEvenYear + 1 : '> 10';
  
  return (
    <Card className="col-span-1">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-green-500" />
          Financial ROI Projection
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-2">
          <div>
            <div className="text-2xl font-bold">{projectedBreakEven} years</div>
            <div className="text-xs text-muted-foreground">Projected Break-even</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-500">$13,400</div>
            <div className="text-xs text-muted-foreground">10-Year Savings</div>
          </div>
        </div>
        
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={roiData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis 
                dataKey="year" 
                tick={{ fontSize: 10 }}
                tickLine={false}
                interval={1}
              />
              <YAxis 
                tickCount={5} 
                tick={{ fontSize: 10 }}
                tickLine={false}
                tickFormatter={(value) => `$${value/1000}k`}
              />
              <Tooltip 
                formatter={(value) => [`$${value}`, 'Cumulative Savings']}
                labelFormatter={(label) => label}
              />
              <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]}>
                {roiData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === breakEvenYear ? '#3b82f6' : '#10b981'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="text-xs text-muted-foreground mt-2">
          AI analysis based on current energy prices, system performance, and usage patterns.
        </div>
      </CardContent>
    </Card>
  );
};

export default AIROIChart;
