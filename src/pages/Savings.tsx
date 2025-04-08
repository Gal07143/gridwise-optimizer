
import React from 'react';
import { Main } from '@/components/ui/main';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { DateRange } from '@/types/site';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { subDays } from 'date-fns';
import { useAppStore } from '@/store/appStore';

const Savings = () => {
  const { currentSite } = useAppStore();
  const [dateRange, setDateRange] = React.useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  
  // Placeholder data - in a real app, this would come from your API
  const savingsData = [
    { date: '2025-03-01', cost: 10.5, savings: 5.2, optimized: 15.7 },
    { date: '2025-03-02', cost: 9.2, savings: 6.1, optimized: 15.3 },
    { date: '2025-03-03', cost: 8.7, savings: 4.9, optimized: 13.6 },
    { date: '2025-03-04', cost: 11.3, savings: 7.2, optimized: 18.5 },
    { date: '2025-03-05', cost: 10.1, savings: 5.8, optimized: 15.9 },
    { date: '2025-03-06', cost: 9.8, savings: 6.5, optimized: 16.3 },
    { date: '2025-03-07', cost: 8.4, savings: 5.1, optimized: 13.5 },
  ];
  
  const totalSavings = savingsData.reduce((sum, item) => sum + item.savings, 0).toFixed(2);
  const averageSavings = (savingsData.reduce((sum, item) => sum + item.savings, 0) / savingsData.length).toFixed(2);
  const savingsPercentage = ((savingsData.reduce((sum, item) => sum + item.savings, 0) / 
                            savingsData.reduce((sum, item) => sum + item.cost, 0)) * 100).toFixed(1);

  return (
    <Main title="Energy Savings">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Energy Savings</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Track your energy cost savings over time
          </p>
        </div>
        <DateRangePicker 
          dateRange={dateRange} 
          onUpdate={setDateRange}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Savings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{totalSavings}</div>
            <p className="text-xs text-muted-foreground">
              From {dateRange.from.toLocaleDateString()} to {dateRange.to.toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Daily Average
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{averageSavings}</div>
            <p className="text-xs text-muted-foreground">
              Average savings per day
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Savings Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{savingsPercentage}%</div>
            <p className="text-xs text-muted-foreground">
              Percentage of costs saved
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="costs">
        <TabsList className="mb-4">
          <TabsTrigger value="costs">Cost Breakdown</TabsTrigger>
          <TabsTrigger value="sources">Savings Sources</TabsTrigger>
        </TabsList>
        
        <TabsContent value="costs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cost Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={savingsData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(date) => new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [`€${value.toFixed(2)}`, '']}
                      labelFormatter={(date) => new Date(date).toLocaleDateString()}
                    />
                    <Legend />
                    <Bar name="Actual Cost" dataKey="cost" fill="#ef4444" />
                    <Bar name="Savings" dataKey="savings" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Savings by Source</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { source: 'Self-consumption', value: 3.8 },
                    { source: 'Battery', value: 2.5 },
                    { source: 'Time-shifting', value: 1.9 },
                    { source: 'EV charging', value: 1.2 },
                    { source: 'Other', value: 0.5 },
                  ]} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                    <XAxis dataKey="source" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => [`€${value.toFixed(2)}`, 'Savings']} />
                    <Bar name="Savings (€)" dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Main>
  );
};

export default Savings;
