
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { useTelemetryHistory } from '@/hooks/useTelemetryHistory';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Props {
  deviceId: string;
  metric: 'power' | 'voltage' | 'current' | 'temperature' | 'state_of_charge';
  unit: string;
  height?: number;
  showSource?: boolean;
}

const getMetricColor = (metric: string): string => {
  switch (metric) {
    case 'power': return '#4f46e5'; // indigo
    case 'voltage': return '#22c55e'; // green
    case 'current': return '#f97316'; // orange
    case 'temperature': return '#ef4444'; // red
    case 'state_of_charge': return '#8b5cf6'; // purple
    default: return '#3b82f6'; // blue
  }
};

const getSourceColor = (source: string): string => {
  switch (source?.toLowerCase()) {
    case 'mqtt': return '#22c55e'; // green
    case 'modbus': return '#f97316'; // orange
    default: return '#3b82f6'; // blue
  }
};

const LiveTelemetryChart: React.FC<Props> = ({ 
  deviceId, 
  metric, 
  unit, 
  height = 200,
  showSource = false
}) => {
  const { data, loading, error } = useTelemetryHistory(deviceId, 60); // last 60 minutes

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        <span>Loading telemetry data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-48 text-red-500">
        Error loading telemetry: {error.message}
      </div>
    );
  }

  // Group data by source if needed
  const sources = showSource 
    ? [...new Set(data.map(item => item.source || 'unknown'))]
    : ['combined'];

  // Format the data for the chart
  const formatted = data.map(entry => {
    const timeObj = new Date(entry.timestamp);
    return {
      time: timeObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: timeObj,
      value: entry[metric] ?? 0,
      source: entry.source || 'unknown'
    };
  }).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  // Get the latest value for the header
  const latestValue = formatted.length > 0 
    ? formatted[formatted.length - 1].value 
    : null;

  return (
    <div className="bg-background p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold capitalize">{metric.replace('_', ' ')}</h3>
        
        {latestValue !== null && (
          <div className="flex items-center">
            <span className="text-lg font-bold mr-1">
              {typeof latestValue === 'number' ? latestValue.toFixed(2) : latestValue}
            </span>
            <span className="text-muted-foreground">{unit}</span>
          </div>
        )}
      </div>
      
      {showSource && sources.length > 0 && (
        <div className="flex gap-2 mb-2">
          {sources.map((source) => (
            <Badge 
              key={source} 
              variant="outline" 
              style={{
                backgroundColor: `${getSourceColor(source)}20`,
                borderColor: getSourceColor(source),
                color: getSourceColor(source)
              }}
            >
              {source}
            </Badge>
          ))}
        </div>
      )}
      
      {formatted.length > 0 ? (
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={formatted} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="time" 
              minTickGap={30}
            />
            <YAxis 
              unit={unit} 
              domain={['auto', 'auto']}
            />
            <Tooltip
              formatter={(value: number) => [value.toFixed(2) + ' ' + unit, metric]}
              labelFormatter={(time) => `Time: ${time}`}
            />
            
            {!showSource && (
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={getMetricColor(metric)} 
                strokeWidth={2} 
                dot={false} 
                activeDot={{ r: 6 }}
                isAnimationActive={true}
              />
            )}
            
            {showSource && sources.map((source) => (
              <Line 
                key={source}
                type="monotone"
                dataKey="value"
                stroke={getSourceColor(source)}
                strokeWidth={2}
                dot={false}
                name={source}
                isAnimationActive={true}
                data={formatted.filter(entry => entry.source === source)}
              />
            ))}
            
            {showSource && <Legend />}
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-48 text-gray-500">
          No telemetry data available
        </div>
      )}
    </div>
  );
};

export default LiveTelemetryChart;
