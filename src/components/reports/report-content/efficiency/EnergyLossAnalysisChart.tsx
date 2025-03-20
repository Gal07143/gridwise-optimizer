
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

interface EnergyLossAnalysisChartProps {
  lossData: Record<string, number>;
  colors: string[];
}

const EnergyLossAnalysisChart: React.FC<EnergyLossAnalysisChartProps> = ({ 
  lossData, 
  colors 
}) => {
  // Format data for loss analysis chart
  const formattedLossData = Object.entries(lossData).map(([name, value]) => ({
    name,
    value,
  }));

  // Type-safe label renderer function
  const renderLossLabel = (props: any): React.ReactNode => {
    const { name, percent } = props;
    if (!name || typeof percent !== 'number') return null;
    
    const formattedName = String(name);
    const formattedPercent = `${Math.round(percent * 100)}%`;
    
    return `${formattedName} ${formattedPercent}`;
  };

  return (
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
                data={formattedLossData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#FF8042"
                dataKey="value"
                label={renderLossLabel}
              >
                {formattedLossData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, 'Loss']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4">
          <h3 className="font-medium mb-2">Loss Distribution</h3>
          <div className="space-y-3">
            {Object.entries(lossData).map(([key, value]) => (
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
  );
};

export default EnergyLossAnalysisChart;
