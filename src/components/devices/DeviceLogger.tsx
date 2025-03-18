
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Clock, 
  RefreshCw, 
  Download, 
  FileDown, 
  Play, 
  Pause, 
  AlertTriangle,
  InfoIcon,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getDeviceReadings } from '@/services/devices/readingsService';
import { Badge } from '@/components/ui/badge';
import GlassPanel from '@/components/ui/GlassPanel';

interface LogEntry {
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  message: string;
}

interface DeviceLoggerProps {
  deviceId: string;
}

const DeviceLogger: React.FC<DeviceLoggerProps> = ({ deviceId }) => {
  const [isPolling, setIsPolling] = useState(true);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [pollInterval, setPollInterval] = useState(60); // seconds
  
  const { data: deviceReadings, refetch } = useQuery({
    queryKey: ['deviceReadings', deviceId],
    queryFn: () => getDeviceReadings(deviceId, 10),
    enabled: !!deviceId && isPolling,
    refetchInterval: isPolling ? pollInterval * 1000 : false,
  });
  
  // Generate simulated logs based on readings
  useEffect(() => {
    if (deviceReadings && deviceReadings.length > 0) {
      const newLogs: LogEntry[] = [];
      
      // Create some simulated log entries based on the device readings
      deviceReadings.forEach(reading => {
        // Log power output
        newLogs.push({
          timestamp: reading.timestamp,
          level: 'info',
          message: `Power output: ${reading.power.toFixed(2)} kW`
        });
        
        // Log energy production
        newLogs.push({
          timestamp: reading.timestamp,
          level: 'info',
          message: `Energy production: ${reading.energy.toFixed(2)} kWh`
        });
        
        // Add some warning logs if values are outside normal ranges
        if (reading.power > 50) {
          newLogs.push({
            timestamp: reading.timestamp,
            level: 'warning',
            message: `High power output detected: ${reading.power.toFixed(2)} kW`
          });
        }
        
        if (reading.temperature && reading.temperature > 40) {
          newLogs.push({
            timestamp: reading.timestamp,
            level: 'warning',
            message: `High temperature detected: ${reading.temperature.toFixed(1)} °C`
          });
        }
        
        // Add some error logs randomly
        if (Math.random() < 0.1) {
          newLogs.push({
            timestamp: reading.timestamp,
            level: 'error',
            message: `Connection temporarily lost. Reconnected automatically.`
          });
        }
      });
      
      // Set the logs, newest first
      setLogs(newLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    }
  }, [deviceReadings]);
  
  const togglePolling = () => {
    setIsPolling(prevPolling => !prevPolling);
  };
  
  const handleManualRefresh = () => {
    refetch();
  };
  
  const handleDownloadLogs = () => {
    // Generate CSV content
    const csvContent = logs
      .map(log => `${new Date(log.timestamp).toISOString()},${log.level},"${log.message}"`)
      .join('\n');
    
    const csvHeader = 'Timestamp,Level,Message\n';
    const fullCsv = csvHeader + csvContent;
    
    // Create a blob and download link
    const blob = new Blob([fullCsv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `device_${deviceId}_logs_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const getLogIcon = (level: string) => {
    switch (level) {
      case 'info':
        return <InfoIcon size={14} className="text-blue-500" />;
      case 'warning':
        return <AlertTriangle size={14} className="text-amber-500" />;
      case 'error':
        return <XCircle size={14} className="text-red-500" />;
      default:
        return <InfoIcon size={14} />;
    }
  };
  
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">Device Logs</h3>
          {isPolling && (
            <Badge variant="outline" className="bg-green-500/10 text-green-500">
              <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-1 animate-pulse"></span>
              Live
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={togglePolling}
            title={isPolling ? "Pause log collection" : "Resume log collection"}
          >
            {isPolling ? <Pause size={16} /> : <Play size={16} />}
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleManualRefresh}
            title="Refresh logs"
          >
            <RefreshCw size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleDownloadLogs}
            title="Download logs"
          >
            <FileDown size={16} />
          </Button>
        </div>
      </div>
      
      <GlassPanel className="h-60 overflow-auto">
        {logs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
            No logs available
          </div>
        ) : (
          <div className="divide-y divide-border">
            {logs.map((log, index) => (
              <div key={index} className="px-3 py-2 text-xs flex items-start gap-2 hover:bg-secondary/10">
                <div className="mt-0.5">
                  {getLogIcon(log.level)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{log.level.toUpperCase()}</span>
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Clock size={12} />
                      {formatTimestamp(log.timestamp)}
                    </span>
                  </div>
                  <div className="mt-1">{log.message}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassPanel>
      
      <div className="flex justify-between text-xs text-muted-foreground px-2">
        <div>Polling every {pollInterval} seconds</div>
        <div>Device ID: {deviceId}</div>
      </div>
    </div>
  );
};

export default DeviceLogger;
