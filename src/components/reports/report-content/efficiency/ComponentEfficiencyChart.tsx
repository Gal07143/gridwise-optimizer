
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts';
import { Progress } from '@/components/ui/progress';

interface ComponentEfficiencyChartProps {
  componentData: Record<string, number>;
  colors: string[];
}

const ComponentEfficiencyChart: React.FC<ComponentEfficiencyChartProps> = ({ 
  componentData, 
  colors 
}) => {
  // Format data for pie chart
  const componentPieData = Object.entries(componentData).map(([name, value]) => ({
    name,
    value,
  }));

  // Type-safe label renderer function
  const renderComponentLabel = (props: any): React.ReactNode => {
    const { name, percent } = props;
    if (!name || typeof percent !== 'number') return null;
    
    const formattedName = String(name).replace(/_/g, ' ');
    const formattedPercent = `${Math.round(percent * 100)}%`;
    
    return `${formattedName} ${formattedPercent}`;
  };

  return (
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
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, 'Efficiency']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="space-y-3 mt-4">
          {Object.entries(componentData).map(([key, value], index) => (
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
  );
};

export default ComponentEfficiencyChart;
