
import React from 'react';
import { 
  Area, 
  AreaChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis,
  YAxis 
} from 'recharts';
import ForecastTooltip from './ForecastTooltip';

interface ForecastChartProps {
  data: any[];
  height?: number;
}

const ForecastChart = ({ data, height = 240 }: ForecastChartProps) => {
  if (data.length === 0) {
    return (
      <div className="flex justify-center items-center" style={{ height }}>
        <p className="text-muted-foreground">No forecast data available</p>
      </div>
    );
  }
  
  return (
    <div className="h-60">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
        >
          <defs>
            <linearGradient id="colorGen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="rgba(45, 211, 111, 0.8)" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="rgba(45, 211, 111, 0.1)" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorCons" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="rgba(122, 90, 248, 0.8)" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="rgba(122, 90, 248, 0.1)" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="hour" 
            tick={{ fontSize: 10 }} 
            tickLine={false}
            axisLine={{ stroke: 'rgba(100, 116, 139, 0.2)' }}
          />
          <YAxis 
            tick={{ fontSize: 10 }} 
            tickLine={false}
            axisLine={{ stroke: 'rgba(100, 116, 139, 0.2)' }}
            label={{ value: 'kW', angle: -90, position: 'insideLeft', fontSize: 10, dy: 50 }}
          />
          <Tooltip content={<ForecastTooltip />} />
          <Area 
            type="monotone" 
            dataKey="generation" 
            name="Generation"
            stroke="rgba(45, 211, 111, 1)" 
            fillOpacity={1} 
            fill="url(#colorGen)" 
          />
          <Area 
            type="monotone" 
            dataKey="consumption" 
            name="Consumption"
            stroke="rgba(122, 90, 248, 1)" 
            fillOpacity={1} 
            fill="url(#colorCons)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ForecastChart;
