
import React from 'react';
import {
  AreaChart as RechartsAreaChart,
  LineChart as RechartsLineChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export const ChartContainer = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`w-full h-[300px] ${className || ""}`}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
};

export const AreaChart = ({ 
  data, 
  children 
}: { 
  data: any[]; 
  children: React.ReactNode;
}) => {
  return (
    <RechartsAreaChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      {children}
    </RechartsAreaChart>
  );
};

export const LineChart = ({ 
  data, 
  children 
}: { 
  data: any[]; 
  children: React.ReactNode;
}) => {
  return (
    <RechartsLineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      {children}
    </RechartsLineChart>
  );
};

export const ChartLegend = () => {
  return <Legend />;
};

export { Area, Line };
