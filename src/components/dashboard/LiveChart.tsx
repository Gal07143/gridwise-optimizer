
import React from 'react';
import { Area, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart } from 'recharts';
import { cn } from '@/lib/utils';

export interface LiveChartProps {
  data: Array<{
    time: string | number;
    value: number;
  }>;
  height?: number;
  color?: string;
  type?: 'line' | 'area' | 'bar';
  gradientFrom?: string;
  gradientTo?: string;
  className?: string;
  animationDelay?: string;
  xAxisDataKey?: string;
  yAxisDataKey?: string;
  animate?: boolean;
}

const LiveChart: React.FC<LiveChartProps> = ({
  data,
  height = 200,
  color = 'var(--color-primary)',
  type = 'line',
  gradientFrom,
  gradientTo,
  className,
  animationDelay = '0ms',
  xAxisDataKey = 'time',
  yAxisDataKey = 'value',
  animate = true
}) => {
  if (!data || data.length === 0) {
    return (
      <div 
        className={cn("flex items-center justify-center h-[200px] bg-muted/20 rounded-lg", className)}
        style={{ height }}
      >
        No data available
      </div>
    );
  }

  const renderChart = () => {
    const chartProps = {
      data,
      margin: { top: 10, right: 10, left: 0, bottom: 0 }
    };

    return (
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart {...chartProps}>
          <defs>
            {gradientFrom && gradientTo && (
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={gradientFrom} stopOpacity={0.8} />
                <stop offset="95%" stopColor={gradientTo} stopOpacity={0} />
              </linearGradient>
            )}
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
          <XAxis 
            dataKey={xAxisDataKey} 
            tick={{ fontSize: 12 }}
            axisLine={{ stroke: 'var(--border)' }}
            tickLine={false} 
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            axisLine={{ stroke: 'var(--border)' }}
            tickLine={false}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--background)',
              borderColor: 'var(--border)',
              borderRadius: '0.375rem',
              boxShadow: 'var(--shadow)'
            }} 
          />
          
          {type === 'area' && (
            <Area 
              type="monotone" 
              dataKey={yAxisDataKey} 
              stroke={color} 
              fill={gradientFrom && gradientTo ? "url(#colorGradient)" : color}
              fillOpacity={0.3}
              animationDuration={animate ? 1500 : 0}
              isAnimationActive={animate}
            />
          )}
          
          {type === 'line' && (
            <Line 
              type="monotone" 
              dataKey={yAxisDataKey} 
              stroke={color} 
              strokeWidth={2}
              dot={{ r: 2, fill: color }}
              activeDot={{ r: 4 }}
              animationDuration={animate ? 1500 : 0}
              isAnimationActive={animate}
            />
          )}
          
          {type === 'bar' && (
            <Bar 
              dataKey={yAxisDataKey} 
              fill={color} 
              radius={[4, 4, 0, 0]}
              animationDuration={animate ? 1500 : 0}
              isAnimationActive={animate}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div 
      className={cn("animate-in fade-in duration-500", className)}
      style={{ animationDelay }}
    >
      {renderChart()}
    </div>
  );
};

export default LiveChart;
