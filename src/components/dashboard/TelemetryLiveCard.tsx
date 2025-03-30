
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Activity, Battery, Zap, ThermometerIcon, WifiIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TelemetryData {
  device_id: string;
  timestamp: string;
  power?: number;
  voltage?: number;
  current?: number;
  frequency?: number;
  state_of_charge?: number;
  temperature?: number;
}

const TelemetryLiveCard: React.FC = () => {
  const [data, setData] = useState<TelemetryData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchLatestTelemetry = async () => {
    try {
      setLoading(true);
      const { data: latest, error } = await supabase
        .from('telemetry_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching telemetry:', error);
        return;
      }

      if (latest && latest.length > 0) {
        let result = { ...latest[0] };
        
        if (result.message) {
          if (typeof result.message === 'string') {
            try {
              const parsedMessage = JSON.parse(result.message);
              result = { ...result, ...parsedMessage };
            } catch (e) {
              console.warn('Could not parse message as JSON:', e);
            }
          } else if (typeof result.message === 'object') {
            result = { ...result, ...result.message };
          }
        }
        
        setData(result as TelemetryData);
      }
    } catch (error) {
      console.error('Error in fetchLatestTelemetry:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestTelemetry();

    const interval = setInterval(() => {
      fetchLatestTelemetry();
    }, 10000); // refresh every 10 seconds

    // Set up real-time subscription
    const subscription = supabase
      .channel('telemetry_changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'telemetry_log'
      }, () => {
        fetchLatestTelemetry();
      })
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(subscription);
    };
  }, []);
  
  // Format values for display
  const formatValue = (value: number | undefined, unit: string, decimals: number = 1) => {
    if (value === undefined || value === null) return '-';
    return `${value.toFixed(decimals)} ${unit}`;
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-md flex items-center">
          <Activity className="h-4 w-4 mr-2 text-primary" />
          Live Telemetry
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-5 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-md" />
            ))}
          </div>
        ) : data ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <TelemetryItem 
                icon={<Zap className="h-4 w-4 text-yellow-500" />}
                label="Power"
                value={formatValue(data.power, 'W')}
              />
              <TelemetryItem 
                icon={<Activity className="h-4 w-4 text-blue-500" />}
                label="Voltage"
                value={formatValue(data.voltage, 'V')}
              />
              <TelemetryItem 
                icon={<Activity className="h-4 w-4 text-green-500" />}
                label="Current"
                value={formatValue(data.current, 'A')}
              />
              <TelemetryItem 
                icon={<Activity className="h-4 w-4 text-purple-500" />}
                label="Frequency"
                value={formatValue(data.frequency, 'Hz')}
              />
              <TelemetryItem 
                icon={<Battery className="h-4 w-4 text-teal-500" />}
                label="SOC"
                value={formatValue(data.state_of_charge, '%', 0)}
              />
              <TelemetryItem 
                icon={<ThermometerIcon className="h-4 w-4 text-red-500" />}
                label="Temp"
                value={formatValue(data.temperature, '°C')}
              />
            </div>
            
            <div className="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground">
              <div className="flex items-center">
                <WifiIcon className="h-3 w-3 mr-1" />
                <span>Device: {data.device_id?.substring(0, 8) || 'Unknown'}</span>
              </div>
              <div>
                {data.timestamp ? new Date(data.timestamp).toLocaleTimeString() : 'Unknown time'}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <p>No telemetry data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface TelemetryItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const TelemetryItem: React.FC<TelemetryItemProps> = ({ icon, label, value }) => {
  return (
    <div className={cn(
      "flex items-center justify-between p-2 rounded-md",
      "bg-slate-50 dark:bg-slate-800/50"
    )}>
      <div className="flex items-center">
        {icon}
        <span className="ml-1.5 text-xs font-medium">{label}</span>
      </div>
      <span className="text-xs">{value}</span>
    </div>
  );
};

export default TelemetryLiveCard;
