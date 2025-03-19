
import React, { useEffect, useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { cn } from '@/lib/utils';

interface DataPoint {
  time: string;
  value: number;
}

interface LiveChartProps {
  data?: DataPoint[];
  title?: string;
  color?: string;
  type?: 'line' | 'area';
  height?: number;
  yAxisLabel?: string;
  strokeWidth?: number;
  hideGrid?: boolean;
  hideAxis?: boolean;
  gradientFrom?: string;
  gradientTo?: string;
  animated?: boolean;
  className?: string;
  animationDelay?: string;
}

const LiveChart = ({
  data = [
    { time: '00:00', value: 45 },
    { time: '01:00', value: 42 },
    { time: '02:00', value: 40 },
    { time: '03:00', value: 38 },
    { time: '04:00', value: 35 },
    { time: '05:00', value: 37 },
    { time: '06:00', value: 42 },
    { time: '07:00', value: 48 },
    { time: '08:00', value: 55 },
    { time: '09:00', value: 60 },
    { time: '10:00', value: 64 },
    { time: '11:00', value: 68 },
    { time: '12:00', value: 70 },
  ],
  title,
  color = 'var(--color-primary)',
  type = 'line',
  height = 200,
  yAxisLabel,
  strokeWidth = 2,
  hideGrid = false,
  hideAxis = false,
  gradientFrom,
  gradientTo,
  animated = true,
  className,
  animationDelay
}: LiveChartProps) => {
  const [chartData, setChartData] = useState([...data]);
  
  // If animated, update data points slightly every interval to simulate live data
  useEffect(() => {
    if (!animated) return;
    
    const interval = setInterval(() => {
      setChartData(prevData => {
        const newData = [...prevData];
        // Randomly adjust values slightly up or down
        return newData.map(point => ({
          ...point,
          value: point.value * (1 + (Math.random() - 0.5) * 0.02) // +/- 1% change
        }));
      });
    }, 2000);
    
    return () => clearInterval(interval);
  }, [animated]);

  const gradientId = React.useId();
  
  const renderChart = () => {
    if (type === 'area') {
      return (
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          {!hideGrid && <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />}
          {!hideAxis && <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />}
          {!hideAxis && (
            <YAxis 
              tick={{ fontSize: 10 }} 
              stroke="var(--muted-foreground)"
              label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 10 } } : undefined}
            />
          )}
          <Tooltip 
            contentStyle={{ 
              borderRadius: '8px', 
              backgroundColor: 'var(--card)', 
              borderColor: 'var(--border)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              fontSize: '12px'
            }} 
          />
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={gradientFrom || color} stopOpacity={0.8} />
              <stop offset="95%" stopColor={gradientTo || color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            strokeWidth={strokeWidth}
            fillOpacity={1}
            fill={`url(#${gradientId})`}
            activeDot={{ r: 6, strokeWidth: 0 }}
            animationDuration={700} 
          />
        </AreaChart>
      );
    }
    
    return (
      <LineChart
        data={chartData}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        {!hideGrid && <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />}
        {!hideAxis && <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />}
        {!hideAxis && (
          <YAxis 
            tick={{ fontSize: 10 }} 
            stroke="var(--muted-foreground)"
            label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 10 } } : undefined}
          />
        )}
        <Tooltip 
          contentStyle={{ 
            borderRadius: '8px', 
            backgroundColor: 'var(--card)', 
            borderColor: 'var(--border)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            fontSize: '12px'
          }} 
        />
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke={color} 
          strokeWidth={strokeWidth}
          dot={false}
          activeDot={{ r: 6, strokeWidth: 0 }}
          animationDuration={700} 
        />
      </LineChart>
    );
  };

  return (
    <div className={cn(className)}>
      {title && (
        <div className="mb-2 text-sm font-medium">{title}</div>
      )}
      <div className="w-full" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LiveChart;
