
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useTelemetryHistory } from '@/hooks/useTelemetryHistory';

interface Props {
  deviceId: string;
  metric: 'power' | 'voltage' | 'current' | 'temperature';
  unit: string;
}

const LiveTelemetryChart: React.FC<Props> = ({ deviceId, metric, unit }) => {
  const { data, loading, error } = useTelemetryHistory(deviceId, 60); // last 60 minutes

  if (loading) {
    return <div className="flex items-center justify-center h-48">Loading telemetry data...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-48 text-red-500">Error loading telemetry: {error.message}</div>;
  }

  const formatted = data.map(entry => ({
    time: new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    value: entry[metric] ?? 0,
  }));

  return (
    <div className="bg-background p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2 capitalize">{metric} (last hour)</h3>
      {formatted.length > 0 ? (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={formatted}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis unit={unit} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-48 text-gray-500">No telemetry data available</div>
      )}
    </div>
  );
};

export default LiveTelemetryChart;
