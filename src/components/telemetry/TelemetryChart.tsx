
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getMetricColor, getSourceColor } from './telemetryUtils';

interface TelemetryChartProps {
  data: any[];
  metric: string;
  unit: string;
  height?: number;
  showSource?: boolean;
  loading?: boolean;
  error?: Error | null;
}

const TelemetryChart: React.FC<TelemetryChartProps> = ({ 
  data, 
  metric, 
  unit, 
  height = 200,
  showSource = false,
  loading = false,
  error = null
}) => {
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

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500">
        No telemetry data available
      </div>
    );
  }

  // Group data by source if needed
  const sources = showSource 
    ? [...new Set(data.map(item => item.source || 'unknown'))]
    : ['combined'];

  // Get the latest value for the header
  const latestValue = data.length > 0 
    ? data[data.length - 1].value 
    : null;

  return (
    <div className="bg-background rounded-lg">
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
      
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
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
              data={data.filter(entry => entry.source === source)}
            />
          ))}
          
          {showSource && <Legend />}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TelemetryChart;
