
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Area, 
  AreaChart, 
  Bar, 
  BarChart, 
  CartesianGrid, 
  Cell, 
  Legend, 
  Line, 
  LineChart, 
  Pie, 
  PieChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from 'recharts';

interface ConsumptionTabProps {
  timeframe: string;
  showComparison: boolean;
}

// Sample data for demonstration
const weeklyEnergyData = Array.from({ length: 7 }, (_, i) => ({
  time: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
  value: Math.floor(Math.random() * 50) + 30,
  comparison: Math.floor(Math.random() * 50) + 25,
}));

const peakDemandData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  value: Math.floor(Math.random() * 15) + 5,
  comparison: Math.floor(Math.random() * 15) + 3,
}));

const energySourcesData = [
  { name: 'Solar', value: 45 },
  { name: 'Grid', value: 30 },
  { name: 'Battery', value: 15 },
  { name: 'Backup Generator', value: 10 },
];

const topConsumersData = [
  { device: 'HVAC System', consumption: 325, change: '+2.3%' },
  { device: 'EV Charger', consumption: 280, change: '-5.1%' },
  { device: 'Kitchen Appliances', consumption: 210, change: '+1.7%' },
  { device: 'Lighting', consumption: 165, change: '-0.8%' },
  { device: 'Office Equipment', consumption: 110, change: '+3.5%' },
];

const costBreakdownData = [
  { category: 'Peak Hours', cost: 180 },
  { category: 'Off-Peak', cost: 95 },
  { category: 'Mid-Peak', cost: 125 },
  { category: 'Demand Charges', cost: 75 },
];

const ConsumptionTab: React.FC<ConsumptionTabProps> = ({ 
  timeframe,
  showComparison
}) => {
  // Color constants
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Energy Consumption ({timeframe})</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={weeklyEnergyData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorConsumption" x1="0" y1="0" x2="0" y2="1">
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
                <XAxis dataKey="time" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8884d8" 
                  fillOpacity={1} 
                  fill="url(#colorConsumption)" 
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
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Peak Demand</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={peakDemandData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#8884d8" name="Demand" />
                {showComparison && (
                  <Line type="monotone" dataKey="comparison" stroke="#82ca9d" name="Previous" />
                )}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Energy Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  dataKey="value"
                  isAnimationActive={false}
                  data={energySourcesData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {energySourcesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Energy Consumers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Device
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Consumption
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Change
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {topConsumersData.map((consumer, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">{consumer.device}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{consumer.consumption} kWh</td>
                      <td className="px-6 py-4 whitespace-nowrap text-green-500">{consumer.change}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cost Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={costBreakdownData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip formatter={(value: number) => [`$${value}`, 'Cost']} />
              <Legend />
              <Bar dataKey="cost" fill="#8884d8" name="Cost" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsumptionTab;
