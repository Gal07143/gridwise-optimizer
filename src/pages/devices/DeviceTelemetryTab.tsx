
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Device } from '@/types/device';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from '@/integrations/supabase/client';

interface DeviceTelemetryTabProps {
  device: Device;
}

const DeviceTelemetryTab: React.FC<DeviceTelemetryTabProps> = ({ device }) => {
  const [telemetryData, setTelemetryData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTelemetryData = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('energy_readings')
          .select('*')
          .eq('device_id', device.id)
          .order('timestamp', { ascending: false })
          .limit(100);

        if (error) throw error;
        
        // Process data for chart format
        const processedData = data?.map(item => ({
          timestamp: new Date(item.timestamp).toLocaleTimeString(),
          power: item.power,
          energy: item.energy,
          voltage: item.voltage,
          current: item.current,
          temperature: item.temperature
        })) || [];
        
        setTelemetryData(processedData.reverse());
      } catch (error) {
        console.error('Error fetching telemetry data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (device?.id) {
      fetchTelemetryData();
    }
  }, [device.id]);

  // Generate sample data if no real data exists
  useEffect(() => {
    if (telemetryData.length === 0 && !isLoading) {
      // Create sample data for demonstration
      const sampleData = Array.from({ length: 24 }, (_, i) => {
        const time = new Date();
        time.setHours(time.getHours() - (24 - i));
        
        return {
          timestamp: time.toLocaleTimeString(),
          power: Math.random() * 5 + 2,
          energy: Math.random() * 10 + 10,
          voltage: Math.random() * 20 + 220,
          current: Math.random() * 5 + 2,
          temperature: Math.random() * 10 + 25
        };
      });
      
      setTelemetryData(sampleData);
    }
  }, [telemetryData, isLoading]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Power Output</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={telemetryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="power" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Energy Generation</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={telemetryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="energy" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Device Temperature</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={telemetryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="temperature" stroke="#ff7300" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DeviceTelemetryTab;
