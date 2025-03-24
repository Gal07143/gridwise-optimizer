
import React from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface LiveChartProps {
  data: Array<{
    time: string;
    value: number;
    [key: string]: any;
  }>;
  height?: number;
  width?: string | number;
  color?: string;
  type?: 'line' | 'area' | 'bar';
  showGrid?: boolean;
  showTooltip?: boolean;
  showAxis?: boolean;
  animated?: boolean;
  gradientFrom?: string;
  gradientTo?: string;
  className?: string;
  children?: React.ReactNode;
  animationDelay?: string;
}

const LiveChart: React.FC<LiveChartProps> = ({
  data,
  height = 200,
  width = '100%',
  color = 'rgba(14, 165, 233, 1)',
  type = 'line',
  showGrid = false, // Changed default to false
  showTooltip = true,
  showAxis = true,
  animated = true,
  gradientFrom,
  gradientTo,
  className,
  children,
  animationDelay
}) => {
  const renderChart = () => {
    const commonProps = {
      width: typeof width === 'string' ? undefined : width,
      height,
      data,
      margin: { top: 10, right: 10, left: 10, bottom: 10 }
    };

    // Common props for all chart types
    const chartContent = (
      <>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" opacity={0.5} />}
        {showAxis && (
          <>
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 10 }} 
              tickLine={false} 
              axisLine={{ stroke: 'rgba(0,0,0,0.1)' }} 
            />
            <YAxis 
              tick={{ fontSize: 10 }} 
              tickLine={false} 
              axisLine={{ stroke: 'rgba(0,0,0,0.1)' }} 
              width={30}
            />
          </>
        )}
        {showTooltip && <Tooltip />}

        {children}
      </>
    );

    // Render appropriate chart type
    switch (type) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            {gradientFrom && gradientTo && (
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={gradientFrom} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={gradientTo} stopOpacity={0}/>
                </linearGradient>
              </defs>
            )}
            {chartContent}
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              fill={gradientFrom ? "url(#colorGradient)" : color}
              fillOpacity={gradientFrom ? 1 : 0.2}
              isAnimationActive={animated}
            />
          </AreaChart>
        );
      case 'bar':
        return (
          <BarChart {...commonProps}>
            {chartContent}
            <Bar
              dataKey="value"
              fill={color}
              isAnimationActive={animated}
            />
          </BarChart>
        );
      case 'line':
      default:
        return (
          <LineChart {...commonProps}>
            {chartContent}
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={false}
              isAnimationActive={animated}
            />
          </LineChart>
        );
    }
  };

  return (
    <div className={className} style={animationDelay ? { animationDelay } : undefined}>
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export default LiveChart;
