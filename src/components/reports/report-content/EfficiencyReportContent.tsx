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
  Legend
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingDown, TrendingUp, Zap, Lightbulb, Battery } from 'lucide-react';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface EfficiencyReportContentProps {
  data: any;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const EfficiencyReportContent: React.FC<EfficiencyReportContentProps> = ({ data }) => {
  if (!data) return <div>No data available</div>;

  // Default dummy data if specific parts are missing
  const efficiencyData = data.efficiency_data || [];
  const byComponent = data.by_component || {
    'solar_panels': 85,
    'inverters': 92,
    'battery': 90,
    'distribution': 95
  };
  
  const lossAnalysis = data.loss_analysis || {
    'conversion': 40,
    'transmission': 25,
    'storage': 20,
    'other': 15
  };
  
  // Format data for pie chart
  const componentPieData = Object.entries(byComponent).map(([name, value]) => ({
    name,
    value,
  }));

  // Format data for loss analysis chart
  const lossData = Object.entries(lossAnalysis).map(([name, value]) => ({
    name,
    value,
  }));

  // Type-safe label renderer functions that ensure they return ReactNode values
  const renderComponentLabel = (props: any): React.ReactNode => {
    const { name, percent } = props;
    if (!name || typeof percent !== 'number') return null;
    
    const formattedName = String(name).replace(/_/g, ' ');
    const formattedPercent = `${Math.round(percent * 100)}%`;
    
    return `${formattedName} ${formattedPercent}`;
  };
  
  const renderLossLabel = (props: any): React.ReactNode => {
    const { name, percent } = props;
    if (!name || typeof percent !== 'number') return null;
    
    const formattedName = String(name);
    const formattedPercent = `${Math.round(percent * 100)}%`;
    
    return `${formattedName} ${formattedPercent}`;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">Overall Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <div className="text-2xl font-bold">
                {data.overall_efficiency || 85}%
              </div>
              {data.efficiency_trend && (
                <Badge 
                  className={`ml-2 ${data.efficiency_trend > 0 ? 'bg-green-500' : 'bg-red-500'}`}
                >
                  {data.efficiency_trend > 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(data.efficiency_trend)}%
                </Badge>
              )}
            </div>
            <Progress 
              value={data.overall_efficiency || 85} 
              className="h-2 mt-2"
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">Energy Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.energy_used?.toLocaleString() || 3500} kWh
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
            <CardTitle className="text-sm font-medium">Energy Lost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.energy_lost?.toLocaleString() || 450} kWh
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {data.efficiency_percentage || 85}% efficiency
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Efficiency Over Time</CardTitle>
          <CardDescription>System performance trends</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer 
            config={{
              efficiency: { theme: { light: "#8884d8", dark: "#9575CD" }, label: "Efficiency" },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={efficiencyData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="var(--color-efficiency)" 
                  fill="var(--color-efficiency)" 
                  fillOpacity={0.3}
                  name="Efficiency (%)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Efficiency by Component</CardTitle>
            <CardDescription>Performance breakdown by system part</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={componentPieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={renderComponentLabel}
                  >
                    {componentPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Efficiency']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-3 mt-4">
              {Object.entries(byComponent).map(([key, value], index) => (
                <div key={key} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{String(key).replace(/_/g, ' ')}</span>
                    <span className="font-medium">{value}%</span>
                  </div>
                  <Progress value={Number(value)} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Energy Loss Analysis</CardTitle>
            <CardDescription>Where energy is being lost</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={lossData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#FF8042"
                    dataKey="value"
                    label={renderLossLabel}
                  >
                    {lossData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Loss']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4">
              <h3 className="font-medium mb-2">Loss Distribution</h3>
              <div className="space-y-3">
                {Object.entries(lossAnalysis).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-3 gap-2 items-center">
                    <div className="text-sm capitalize">{key}</div>
                    <Progress value={Number(value)} max={100} className="h-2 col-span-1" />
                    <div className="text-sm text-right">{value}%</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {data.improvement_opportunities && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Improvement Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.improvement_opportunities.map((opp: any, index: number) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{opp.area}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{opp.description}</p>
                    </div>
                    <Badge className="bg-green-500">{opp.potential_gain} gain</Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <div className="flex items-center">
                      <Zap className="h-4 w-4 mr-1 text-amber-500" />
                      <span>Cost: {opp.cost_estimate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EfficiencyReportContent;
