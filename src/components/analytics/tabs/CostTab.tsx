
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, TrendingUp, Activity, DollarSign } from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar
} from 'recharts';

interface CostTabProps {
  timeframe: string;
  showComparison: boolean;
}

// Sample data for demonstration
const monthlyCostData = Array.from({ length: 12 }, (_, i) => ({
  time: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
  value: Math.floor(Math.random() * 200) + 300,
  comparison: Math.floor(Math.random() * 200) + 350,
}));

const costBreakdownData = [
  { name: 'Peak Hours', value: 45 },
  { name: 'Off-Peak', value: 25 },
  { name: 'Mid-Peak', value: 20 },
  { name: 'Fixed Charges', value: 10 },
];

const CostTab: React.FC<CostTabProps> = ({
  timeframe,
  showComparison
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign size={18} className="mr-2" />
              Monthly Cost Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart 
                  data={monthlyCostData}
                  margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                >
                  <defs>
                    <linearGradient id="colorCostCurrent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="rgba(255, 99, 132, 0.8)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="rgba(255, 99, 132, 0.1)" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorCostPrevious" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="rgba(255, 99, 132, 0.3)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="rgba(255, 99, 132, 0)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value: number) => [`$${value}`, 'Cost']} />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    name="This Year"
                    stroke="rgba(255, 99, 132, 1)"
                    fillOpacity={1}
                    fill="url(#colorCostCurrent)"
                  />
                  {showComparison && (
                    <Area 
                      type="monotone" 
                      dataKey="comparison" 
                      name="Last Year"
                      stroke="rgba(255, 99, 132, 0.3)"
                      fillOpacity={1}
                      fill="url(#colorCostPrevious)"
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart size={18} className="mr-2" />
              Cost Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip formatter={(value: number) => [`${value}%`, 'Percentage']} />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                  <defs>
                    <linearGradient id="colorPeak" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff6384" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#ff6384" stopOpacity={0.8} />
                    </linearGradient>
                    <linearGradient id="colorOffPeak" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#36a2eb" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#36a2eb" stopOpacity={0.8} />
                    </linearGradient>
                    <linearGradient id="colorMidPeak" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ffce56" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#ffce56" stopOpacity={0.8} />
                    </linearGradient>
                    <linearGradient id="colorFixed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4bc0c0" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#4bc0c0" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  <Tooltip />
                  <Legend />
                  <Pie
                    data={costBreakdownData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    <defs>
                      <radialGradient id="grad1" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
                        <stop offset="0%" stopColor="#ff6384" stopOpacity="1" />
                        <stop offset="100%" stopColor="#ff6384" stopOpacity="0.7" />
                      </radialGradient>
                    </defs>
                    {costBreakdownData.map((entry, index) => {
                      const colors = ['url(#colorPeak)', 'url(#colorOffPeak)', 'url(#colorMidPeak)', 'url(#colorFixed)'];
                      return <Area key={`cell-${index}`} fill={colors[index % colors.length]} />;
                    })}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity size={18} className="mr-2" />
            Cost Optimization Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-100 dark:border-green-900/30">
            <h4 className="font-medium mb-2 flex items-center">
              <TrendingUp className="mr-2 h-4 w-4 text-green-500" />
              Potential Cost Savings
            </h4>
            <ul className="text-sm space-y-2">
              <li className="flex items-start">
                <div className="h-5 w-5 mr-2 flex items-center justify-center text-white bg-green-500 rounded-full text-xs">1</div>
                <span>Shift EV charging from 6-8PM (peak) to 12-4AM (off-peak) to save $38/month</span>
              </li>
              <li className="flex items-start">
                <div className="h-5 w-5 mr-2 flex items-center justify-center text-white bg-green-500 rounded-full text-xs">2</div>
                <span>Pre-cool/heat your home before peak hours to reduce HVAC usage during expensive periods</span>
              </li>
              <li className="flex items-start">
                <div className="h-5 w-5 mr-2 flex items-center justify-center text-white bg-green-500 rounded-full text-xs">3</div>
                <span>Enable battery discharge during peak hours (5-9PM) to avoid highest rates</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CostTab;
