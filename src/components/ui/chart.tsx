
import React from 'react';
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart as RechartsAreaChart,
  Area,
} from 'recharts';
import { cn } from '@/lib/utils';

interface ChartProps {
  children: React.ReactNode;
  className?: string;
}

export function ChartContainer({ children, className }: ChartProps) {
  return (
    <div className={cn("w-full h-[300px] p-1", className)}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}

export function ChartLegend({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap gap-4 py-2", className)}>
      <div className="flex items-center gap-2">
        <div className="h-3 w-3 rounded-full bg-primary" />
        <span className="text-sm text-muted-foreground">Actual</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-3 w-3 rounded-full bg-blue-500" />
        <span className="text-sm text-muted-foreground">Predicted</span>
      </div>
    </div>
  );
}

interface LineChartProps {
  data: any[];
  xKey?: string;
  yKey?: string;
  className?: string;
  showLegend?: boolean;
  showGrid?: boolean;
  showTooltip?: boolean;
  lineColor?: string;
  strokeWidth?: number;
  children?: React.ReactNode;
}

export function LineChart({
  data,
  xKey = "timestamp",
  yKey = "value",
  className,
  showLegend = false,
  showGrid = true,
  showTooltip = true,
  lineColor = "hsl(var(--primary))",
  strokeWidth = 2,
  children,
}: LineChartProps) {
  return (
    <RechartsLineChart data={data} className={className}>
      {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.2} />}
      <XAxis dataKey={xKey} stroke="hsl(var(--muted-foreground))" opacity={0.5} />
      <YAxis stroke="hsl(var(--muted-foreground))" opacity={0.5} />
      {showTooltip && <Tooltip contentStyle={{ backgroundColor: "hsl(var(--background))", borderColor: "hsl(var(--border))" }} />}
      {showLegend && <Legend />}
      <Line 
        type="monotone" 
        dataKey={yKey} 
        stroke={lineColor} 
        strokeWidth={strokeWidth} 
        activeDot={{ r: 8 }} 
      />
      {children}
    </RechartsLineChart>
  );
}

interface AreaChartProps {
  data: any[];
  xKey?: string;
  yKey?: string;
  className?: string;
  showLegend?: boolean;
  showGrid?: boolean;
  showTooltip?: boolean;
  areaColor?: string;
  gradientId?: string;
  strokeWidth?: number;
  children?: React.ReactNode;
}

export function AreaChart({
  data,
  xKey = "timestamp",
  yKey = "value",
  className,
  showLegend = false,
  showGrid = true,
  showTooltip = true,
  areaColor = "hsl(var(--primary))",
  gradientId = "colorValue",
  strokeWidth = 2,
  children,
}: AreaChartProps) {
  return (
    <RechartsAreaChart data={data} className={className}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={areaColor} stopOpacity={0.8}/>
          <stop offset="95%" stopColor={areaColor} stopOpacity={0}/>
        </linearGradient>
      </defs>
      {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.2} />}
      <XAxis dataKey={xKey} stroke="hsl(var(--muted-foreground))" opacity={0.5} />
      <YAxis stroke="hsl(var(--muted-foreground))" opacity={0.5} />
      {showTooltip && <Tooltip contentStyle={{ backgroundColor: "hsl(var(--background))", borderColor: "hsl(var(--border))" }} />}
      {showLegend && <Legend />}
      <Area 
        type="monotone" 
        dataKey={yKey} 
        stroke={areaColor} 
        strokeWidth={strokeWidth} 
        fillOpacity={1} 
        fill={`url(#${gradientId})`} 
      />
      {children}
    </RechartsAreaChart>
  );
}
