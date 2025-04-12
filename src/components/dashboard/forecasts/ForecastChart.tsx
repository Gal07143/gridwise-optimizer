
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ForecastChartProps {
  data: Array<{
    timestamp: string;
    production: number;
    consumption: number;
    balance?: number;
  }>;
}

const formatTimestamp = (timestamp: string) => {
  try {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return timestamp;
  }
};

const ForecastChart = ({ data }: ForecastChartProps) => {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="timestamp" 
            tickFormatter={formatTimestamp} 
            tick={{ fontSize: 12 }} 
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `${value} kW`}
          />
          <Tooltip
            formatter={(value: number) => [`${value.toFixed(2)} kW`, '']}
            labelFormatter={formatTimestamp}
          />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="production" 
            name="Generation" 
            stroke="#FCD34D" 
            fill="#FCD34D" 
            fillOpacity={0.6}
          />
          <Area 
            type="monotone" 
            dataKey="consumption" 
            name="Consumption" 
            stroke="#10B981" 
            fill="#10B981" 
            fillOpacity={0.6}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ForecastChart;
