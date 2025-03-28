
import React from 'react';
import { Line, Area, LineChart, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export interface LiveChartProps {
  data?: { time: string; value: number }[];
  height?: number;
  type?: 'line' | 'area';
  color?: string;
  gradientFrom?: string;
  gradientTo?: string;
  showAxis?: boolean;
  showGrid?: boolean;
  animationDelay?: string;
}

const defaultData = [
  { time: '00:00', value: 2.5 },
  { time: '04:00', value: 1.8 },
  { time: '08:00', value: 4.2 },
  { time: '12:00', value: 6.5 },
  { time: '16:00', value: 5.3 },
  { time: '20:00', value: 3.2 },
  { time: '24:00', value: 2.8 },
];

const LiveChart: React.FC<LiveChartProps> = ({
  data = defaultData,
  height = 200,
  type = 'line',
  color = '#3b82f6',
  gradientFrom,
  gradientTo,
  showAxis = true,
  showGrid = true,
  animationDelay = '0ms',
}) => {
  const id = React.useId();
  const gradientId = `chart-gradient-${id}`;

  return (
    <div
      style={{ 
        animationDelay,
        height: `${height}px`,
      }}
      className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700 overflow-hidden"
    >
      <ResponsiveContainer width="100%" height="100%">
        {type === 'line' ? (
          <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />}
            {showAxis && (
              <>
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 10 }}
                  stroke="#9ca3af"
                  strokeOpacity={0.4}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 10 }}
                  stroke="#9ca3af"
                  strokeOpacity={0.4}
                  tickLine={false}
                  axisLine={false}
                />
              </>
            )}
            <Tooltip 
              contentStyle={{ 
                background: 'rgba(15, 23, 42, 0.9)',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                color: '#f8fafc'
              }}
              itemStyle={{ color: '#f8fafc' }}
              labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={color} 
              strokeWidth={2}
              dot={false}
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
          </LineChart>
        ) : (
          <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            {gradientFrom && gradientTo && (
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={gradientFrom} stopOpacity={1} />
                  <stop offset="100%" stopColor={gradientTo} stopOpacity={0.2} />
                </linearGradient>
              </defs>
            )}
            {showGrid && <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />}
            {showAxis && (
              <>
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 10 }}
                  stroke="#9ca3af"
                  strokeOpacity={0.4}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 10 }}
                  stroke="#9ca3af"
                  strokeOpacity={0.4}
                  tickLine={false}
                  axisLine={false}
                />
              </>
            )}
            <Tooltip 
              contentStyle={{ 
                background: 'rgba(15, 23, 42, 0.9)',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                color: '#f8fafc'
              }}
              itemStyle={{ color: '#f8fafc' }}
              labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={color} 
              strokeWidth={2}
              fill={gradientFrom && gradientTo ? `url(#${gradientId})` : color}
              fillOpacity={0.4}
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default LiveChart;
