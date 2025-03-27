
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
  noDataText?: string;
  labelKey?: string;
  valueKey?: string;
  secondaryValueKey?: string;
  secondaryColor?: string;
}

const LiveChart: React.FC<LiveChartProps> = ({
  data = [],
  height = 200,
  width = '100%',
  color = 'rgba(14, 165, 233, 1)',
  type = 'line',
  showGrid = false,
  showTooltip = true,
  showAxis = true,
  animated = true,
  gradientFrom,
  gradientTo,
  className,
  children,
  animationDelay,
  noDataText = 'No data available',
  labelKey = 'time',
  valueKey = 'value',
  secondaryValueKey,
  secondaryColor = 'rgba(239, 68, 68, 1)'
}) => {
  // Generate placeholder data if data is empty
  const chartData = data.length > 0 ? data : [
    { time: '00:00', value: 0 },
    { time: '06:00', value: 0 },
    { time: '12:00', value: 0 },
    { time: '18:00', value: 0 },
    { time: '24:00', value: 0 }
  ];

  // Check if we actually have meaningful data
  const hasRealData = data.length > 0 && data.some(item => item[valueKey] !== 0 && item[valueKey] !== null && item[valueKey] !== undefined);

  // If we don't have any real data, show a no data message
  if (!hasRealData && data.length === 0) {
    return (
      <div className={`flex items-center justify-center h-[${height}px] ${className}`} style={animationDelay ? { animationDelay } : undefined}>
        <div className="text-muted-foreground text-sm">{noDataText}</div>
      </div>
    );
  }

  const renderChart = () => {
    const commonProps = {
      width: typeof width === 'string' ? undefined : width,
      height,
      data: chartData,
      margin: { top: 10, right: 10, left: 10, bottom: 10 }
    };

    // Common props for all chart types
    const chartContent = (
      <>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" opacity={0.5} />}
        {showAxis && (
          <>
            <XAxis 
              dataKey={labelKey} 
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
              dataKey={valueKey}
              stroke={color}
              fill={gradientFrom ? "url(#colorGradient)" : color}
              fillOpacity={gradientFrom ? 1 : 0.2}
              isAnimationActive={animated}
            />
            {secondaryValueKey && (
              <Area
                type="monotone"
                dataKey={secondaryValueKey}
                stroke={secondaryColor}
                fill={secondaryColor}
                fillOpacity={0.1}
                isAnimationActive={animated}
              />
            )}
          </AreaChart>
        );
      case 'bar':
        return (
          <BarChart {...commonProps}>
            {chartContent}
            <Bar
              dataKey={valueKey}
              fill={color}
              isAnimationActive={animated}
            />
            {secondaryValueKey && (
              <Bar
                dataKey={secondaryValueKey}
                fill={secondaryColor}
                isAnimationActive={animated}
              />
            )}
          </BarChart>
        );
      case 'line':
      default:
        return (
          <LineChart {...commonProps}>
            {chartContent}
            <Line
              type="monotone"
              dataKey={valueKey}
              stroke={color}
              strokeWidth={2}
              dot={!hasRealData ? false : { r: 3 }}
              isAnimationActive={animated}
            />
            {secondaryValueKey && (
              <Line
                type="monotone"
                dataKey={secondaryValueKey}
                stroke={secondaryColor}
                strokeWidth={2}
                dot={!hasRealData ? false : { r: 3 }}
                isAnimationActive={animated}
              />
            )}
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
