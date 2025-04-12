
import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface BarChartProps {
  data: any[];
  margin?: { top: number; right: number; left: number; bottom: number };
  children?: React.ReactNode;
}

const BarChart: React.FC<BarChartProps> = ({ data, margin = { top: 20, right: 30, left: 20, bottom: 5 }, children }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsBarChart
        data={data}
        margin={margin}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {children}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export default BarChart;
