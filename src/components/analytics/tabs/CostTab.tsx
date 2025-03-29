
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

interface CostTabProps {
  timeframe: string;
  showComparison: boolean;
}

// Sample data for demonstration
const costData = Array.from({ length: 12 }, (_, i) => ({
  time: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
  value: Math.floor(Math.random() * 500) + 200,
  comparison: Math.floor(Math.random() * 500) + 150,
}));

const costBreakdownData = [
  { name: 'Peak Hours', value: 45 },
  { name: 'Off-Peak', value: 25 },
  { name: 'Shoulder', value: 20 },
  { name: 'Demand Charges', value: 10 },
];

const COLORS = ['#8884d8', '#82ca9d', '#FFBB28', '#FF8042'];

const CostTab: React.FC<CostTabProps> = ({
  timeframe,
  showComparison
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Energy Costs ({timeframe})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={costData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                  {showComparison && (
                    <linearGradient id="colorComparison" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                    </linearGradient>
                  )}
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, 'Cost']} />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8884d8" 
                  fillOpacity={1} 
                  fill="url(#colorCost)" 
                  name="Current"
                />
                {showComparison && (
                  <Area 
                    type="monotone" 
                    dataKey="comparison" 
                    stroke="#82ca9d" 
                    fillOpacity={1} 
                    fill="url(#colorComparison)" 
                    name="Previous"
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Cost Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={costBreakdownData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {costBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value}%`, 'Percentage']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Billing Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={costData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']} />
                <Legend />
                <Bar dataKey="value" name="Cost" fill="#8884d8" />
                {showComparison && (
                  <Bar dataKey="comparison" name="Previous" fill="#82ca9d" />
                )}
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CostTab;
