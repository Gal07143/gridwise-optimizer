
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Zap, Thermometer, Battery, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useSiteContext } from '@/contexts/SiteContext';
import { useLiveTelemetry } from '@/hooks/useLiveTelemetry';
import { toast } from 'sonner';

// Sample data for the telemetry history chart
const mockTelemetryHistory = Array.from({ length: 24 }, (_, i) => {
  return {
    time: `${i}:00`,
    voltage: Math.random() * 10 + 235,
    current: Math.random() * 15 + 10,
    power: Math.random() * 5 + 3,
    temperature: Math.random() * 20 + 30
  };
});

const TelemetryPanel = () => {
  const { activeSite } = useSiteContext();
  
  // Use a default deviceId directly instead of trying to access site.devices
  const deviceId = activeSite?.id || 'device-1';
  const { telemetry, loading, error } = useLiveTelemetry(deviceId);

  const currentValues = {
    voltage: telemetry?.voltage || 240.2,
    current: telemetry?.current || 15.7,
    power: telemetry?.power || 3.8,
    temperature: telemetry?.temperature || 42.5
  };

  if (error) {
    // Only show this toast once when an error occurs
    React.useEffect(() => {
      toast.error("Couldn't fetch telemetry data. Using sample data instead.");
    }, [error]);
  }

  const handleRefresh = () => {
    toast.loading("Refreshing telemetry data...");
    // In a real app, you'd call a refresh function here
    setTimeout(() => {
      toast.success("Telemetry data refreshed");
    }, 1000);
  };

  return (
    <Card className="shadow-md h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium flex items-center">
            <Activity className="h-5 w-5 mr-2 text-blue-500" />
            Live Telemetry
          </CardTitle>
          <button 
            onClick={handleRefresh}
            className="text-xs text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 flex items-center"
          >
            Refresh
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex flex-col items-center justify-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Zap className="h-6 w-6 text-blue-500 mb-1" />
            <div className="text-xl font-semibold">{typeof currentValues.power === 'number' ? currentValues.power.toFixed(1) : currentValues.power} kW</div>
            <div className="text-xs text-muted-foreground">Current Power</div>
          </div>
          <div className="flex flex-col items-center justify-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <Battery className="h-6 w-6 text-amber-500 mb-1" />
            <div className="text-xl font-semibold">{typeof currentValues.voltage === 'number' ? currentValues.voltage.toFixed(1) : currentValues.voltage} V</div>
            <div className="text-xs text-muted-foreground">Voltage</div>
          </div>
          <div className="flex flex-col items-center justify-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <Activity className="h-6 w-6 text-green-500 mb-1" />
            <div className="text-xl font-semibold">{typeof currentValues.current === 'number' ? currentValues.current.toFixed(1) : currentValues.current} A</div>
            <div className="text-xs text-muted-foreground">Current</div>
          </div>
          <div className="flex flex-col items-center justify-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <Thermometer className="h-6 w-6 text-red-500 mb-1" />
            <div className="text-xl font-semibold">{typeof currentValues.temperature === 'number' ? currentValues.temperature.toFixed(1) : currentValues.temperature} °C</div>
            <div className="text-xs text-muted-foreground">Temperature</div>
          </div>
        </div>

        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockTelemetryHistory} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis dataKey="time" tickFormatter={(value) => value.split(':')[0]} tick={{ fontSize: 10 }} />
              <YAxis hide={true} />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border p-2 text-xs rounded-md shadow-md">
                        <p className="font-medium">{`Time: ${label}`}</p>
                        <p className="text-blue-500">{`Power: ${Number(payload[0].value).toFixed(1)} kW`}</p>
                        <p className="text-amber-500">{`Voltage: ${Number(payload[1].value).toFixed(1)} V`}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line type="monotone" dataKey="power" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="voltage" stroke="#f59e0b" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-2 text-xs text-center text-muted-foreground">
          {loading ? 'Loading telemetry data...' : '24-hour telemetry history'}
        </div>

        {error && (
          <div className="mt-2 text-xs flex items-center justify-center text-amber-500">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Using sample data
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TelemetryPanel;
