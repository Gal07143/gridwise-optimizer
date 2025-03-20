
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend,
  LineChart,
  Line
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  TrendingDown, 
  TrendingUp, 
  AlertCircle,
  Zap,
  Lightbulb,
  Home
} from 'lucide-react';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Separator } from '@/components/ui/separator';

interface CostReportContentProps {
  data: any;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const CostReportContent: React.FC<CostReportContentProps> = ({ data }) => {
  if (!data) return <div>No data available</div>;

  // Default dummy data if specific parts are missing
  const costData = data.cost_data || data.chart_data || [];
  const bySource = data.by_source || {
    'grid': 68,
    'solar': 0,
    'battery': 12,
    'other': 20
  };
  
  const byCostCategory = data.by_category || {
    'demand_charges': 35,
    'energy_charges': 45,
    'fixed_charges': 15,
    'taxes': 5
  };

  const totalCost = data.total_cost || 
    Object.values(bySource).reduce((a: number, b: number) => a + b, 0);
  
  const previousTotal = data.previous_total || totalCost * 1.08;
  const percentChange = ((totalCost - previousTotal) / previousTotal * 100).toFixed(1);

  // Format data for pie chart
  const sourcePieData = Object.entries(bySource).map(([name, value]) => ({
    name,
    value,
  }));

  // Format data for time of day chart
  const categoriesData = Object.entries(byCostCategory).map(([name, value]) => ({
    name: name.replace('_', ' '),
    value,
  }));

  const savingTips = data.saving_tips || [
    "Shift energy-intensive activities to off-peak hours",
    "Consider adding additional solar capacity to reduce grid dependency",
    "Optimize battery charging to minimize peak demand charges",
    "Replace older appliances with energy-efficient models"
  ];

  const forecasts = data.cost_forecast || [
    { month: "Jan", projected: 150, previous: 165 },
    { month: "Feb", projected: 145, previous: 160 },
    { month: "Mar", projected: 155, previous: 155 },
    { month: "Apr", projected: 162, previous: 170 },
    { month: "May", projected: 168, previous: 175 },
    { month: "Jun", projected: 175, previous: 180 }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">Total Energy Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <div className="text-2xl font-bold flex items-center">
                <DollarSign className="h-5 w-5 text-primary mr-1" />
                {totalCost.toLocaleString()}
              </div>
              <Badge 
                className={`ml-2 ${Number(percentChange) > 0 ? 'bg-red-500' : 'bg-green-500'}`}
              >
                {Number(percentChange) > 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {Math.abs(Number(percentChange))}%
              </Badge>
            </div>
            {data.period && (
              <p className="text-xs text-muted-foreground mt-1">
                Period: {data.period}
              </p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">Average Cost per Day</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              <DollarSign className="h-5 w-5 text-primary mr-1" />
              {data.average_daily ? data.average_daily.toLocaleString() : (totalCost / 30).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Based on {data.days_in_period || 30} days
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">Cost per kWh</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              <DollarSign className="h-5 w-5 text-primary mr-1" />
              {data.cost_per_kwh ? data.cost_per_kwh.toFixed(2) : "0.22"}
            </div>
            {data.national_average && (
              <p className="text-xs mt-1">
                {data.cost_per_kwh > data.national_average ? 'Above' : 'Below'} national average
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cost Trends</CardTitle>
          <CardDescription>Monthly energy cost analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer 
            config={{
              cost: { theme: { light: "#FF5722", dark: "#FF8A65" }, label: "Cost" },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={costData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  content={<ChartTooltipContent />} 
                  formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Cost']}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="var(--color-cost)" 
                  fill="var(--color-cost)" 
                  fillOpacity={0.3}
                  name="Cost ($)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cost by Energy Source</CardTitle>
            <CardDescription>Breakdown of costs by source</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourcePieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {sourcePieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Cost']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 flex-wrap mt-4">
              {Object.keys(bySource).map((source, index) => (
                <div key={source} className="flex items-center">
                  <div 
                    className="h-3 w-3 rounded-full mr-1" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-xs capitalize">{source}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Breakdown by Cost Category</CardTitle>
            <CardDescription>Where your money is going</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer 
              config={{
                value: { theme: { light: "#9C27B0", dark: "#BA68C8" }, label: "Amount" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoriesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="var(--color-value)"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoriesData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={`hsl(${270 + index * 30}, 70%, ${50 + index * 10}%)`} 
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Amount']} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cost Saving Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {savingTips.map((tip, index) => (
                <li key={index} className="flex gap-2">
                  <div className="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 p-1 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">
                    {index % 3 === 0 ? <Zap className="h-3 w-3" /> : 
                     index % 3 === 1 ? <Lightbulb className="h-3 w-3" /> : 
                     <Home className="h-3 w-3" />}
                  </div>
                  <div className="text-sm">{tip}</div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">6-Month Cost Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer 
              config={{
                projected: { theme: { light: "#2196F3", dark: "#64B5F6" }, label: "Projected" },
                previous: { theme: { light: "#9E9E9E", dark: "#BDBDBD" }, label: "Previous Year" },
              }}
              className="h-[250px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={forecasts}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="projected" 
                    stroke="var(--color-projected)" 
                    name="Projected"
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="previous" 
                    stroke="var(--color-previous)" 
                    name="Previous Year" 
                    strokeDasharray="3 3"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tariff Analysis</CardTitle>
          <CardDescription>Current tariff insights and optimization opportunities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Current Tariff Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plan Type:</span>
                  <span className="font-medium">{data.tariff_plan || "Time-of-Use"}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base Rate:</span>
                  <span className="font-medium">${data.base_rate || "0.15"}/kWh</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Peak Rate:</span>
                  <span className="font-medium">${data.peak_rate || "0.24"}/kWh</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Off-Peak Rate:</span>
                  <span className="font-medium">${data.off_peak_rate || "0.10"}/kWh</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Demand Charge:</span>
                  <span className="font-medium">${data.demand_charge || "12.50"}/kW</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Optimization Recommendations</h4>
              <div className="p-3 border rounded-md bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 mb-3">
                <div className="flex gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0" />
                  <p className="text-sm">
                    {data.tariff_insight || "You could save approximately 15% by switching to our recommended Time-of-Use plan and shifting consumption to off-peak hours."}
                  </p>
                </div>
              </div>
              
              <div className="text-sm space-y-2">
                <p className="font-medium">Alternative Plans:</p>
                {(data.alternative_plans || [
                  { name: "Green Energy Plan", savings: "10%", note: "100% renewable sources" },
                  { name: "Budget Saver", savings: "8%", note: "Fixed rates, no time restrictions" }
                ]).map((plan, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <span>{plan.name}</span>
                      <p className="text-xs text-muted-foreground">{plan.note}</p>
                    </div>
                    <Badge className="bg-green-500">{plan.savings} savings</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CostReportContent;
