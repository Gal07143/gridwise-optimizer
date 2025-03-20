
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
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
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface EfficiencyOverTimeChartProps {
  data: any[];
}

const EfficiencyOverTimeChart: React.FC<EfficiencyOverTimeChartProps> = ({ data }) => {
  return (
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
              data={data}
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
  );
};

export default EfficiencyOverTimeChart;
