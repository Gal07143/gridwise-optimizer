
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar,
  Legend
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface GeneralReportContentProps {
  data: any;
}

const GeneralReportContent: React.FC<GeneralReportContentProps> = ({ data }) => {
  if (!data) return <div>No data available</div>;

  // Format data for the chart if available
  const chartData = data.chart_data || [];
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(data)
          .filter(([key]) => !['chart_data', 'by_source', 'period'].includes(key))
          .map(([key, value]) => (
            <Card key={key}>
              <CardHeader className="py-4">
                <CardTitle className="text-sm font-medium">
                  {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {typeof value === 'number' ? value.toLocaleString() : value.toString()}
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {data.period && (
        <div className="mb-2">
          <Badge variant="outline" className="text-sm">
            Period: {data.period}
          </Badge>
        </div>
      )}

      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Energy Metrics Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer 
              config={{
                value: { theme: { light: "#4285F4", dark: "#82B1FF" } },
              }}
              className="h-[300px] mt-4"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="var(--color-value)" 
                    fill="var(--color-value)" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {data.by_source && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Breakdown by Source</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer 
              config={{
                solar: { theme: { light: "#F9A825", dark: "#FFD54F" }, label: "Solar" },
                wind: { theme: { light: "#66BB6A", dark: "#81C784" }, label: "Wind" },
                grid: { theme: { light: "#7E57C2", dark: "#9575CD" }, label: "Grid" },
                battery: { theme: { light: "#26A69A", dark: "#4DB6AC" }, label: "Battery" },
              }}
              className="h-[300px] mt-4"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={Object.entries(data.by_source).map(([key, value]) => ({
                    name: key,
                    value: value,
                  }))}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar 
                    dataKey="value" 
                    fill="var(--color-solar)" 
                    name="value" 
                    className="fill-[var(--color-solar)]"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GeneralReportContent;
