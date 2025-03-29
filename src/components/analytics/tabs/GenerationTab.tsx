
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Activity, BarChart } from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface GenerationTabProps {
  timeframe: string;
  showComparison: boolean;
}

// Sample data for demonstration
const monthlyGenerationData = Array.from({ length: 12 }, (_, i) => ({
  time: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
  value: Math.floor(Math.random() * 300) + 200,
  comparison: Math.floor(Math.random() * 300) + 150,
}));

const GenerationTab: React.FC<GenerationTabProps> = ({
  timeframe,
  showComparison
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 size={18} className="mr-2" />
            Energy Generation ({timeframe})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart 
                data={monthlyGenerationData}
                margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="colorGenCurrent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgba(45, 211, 111, 0.8)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="rgba(45, 211, 111, 0.1)" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorGenPrevious" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgba(45, 211, 111, 0.3)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="rgba(45, 211, 111, 0)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  name="This Year"
                  stroke="rgba(45, 211, 111, 1)"
                  fillOpacity={1}
                  fill="url(#colorGenCurrent)"
                />
                {showComparison && (
                  <Area 
                    type="monotone" 
                    dataKey="comparison" 
                    name="Last Year"
                    stroke="rgba(45, 211, 111, 0.3)"
                    fillOpacity={1}
                    fill="url(#colorGenPrevious)"
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Card className="bg-white dark:bg-slate-800 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="text-3xl font-bold text-green-500 mb-2">+24.6%</div>
              <div className="text-sm text-muted-foreground mb-4">Year-over-year generation increase</div>
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-green-100 dark:bg-green-900/20 text-green-500">
                <TrendingUp size={28} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-slate-800 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="text-3xl font-bold mb-2">72.4%</div>
              <div className="text-sm text-muted-foreground mb-4">System efficiency rating</div>
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-blue-100 dark:bg-blue-900/20 text-blue-500">
                <Activity size={28} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-slate-800 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="text-3xl font-bold text-amber-500 mb-2">4.2 hrs</div>
              <div className="text-sm text-muted-foreground mb-4">Average daily peak production</div>
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-amber-100 dark:bg-amber-900/20 text-amber-500">
                <BarChart size={28} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GenerationTab;
