
import React, { useState } from 'react';
import { useModbusData } from '@/hooks/useModbusData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowPathIcon, PauseIcon, PlayIcon } from 'lucide-react'; // Adjust import based on your icon library
import { ModbusRegister } from '@/types/modbus';

interface ModbusMonitorProps {
  deviceId: string;
  register: ModbusRegister;
  label?: string;
  refreshInterval?: number;
  showRefreshButton?: boolean;
  showPauseButton?: boolean;
  showTimestamp?: boolean;
  showRawValue?: boolean;
  showUnit?: boolean;
  showTabs?: boolean;
}

const ModbusMonitor: React.FC<ModbusMonitorProps> = ({
  deviceId,
  register,
  label,
  refreshInterval = 5000,
  showRefreshButton = true,
  showPauseButton = true,
  showTimestamp = true,
  showRawValue = false,
  showUnit = true,
  showTabs = true,
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [activeTab, setActiveTab] = useState<'value' | 'chart' | 'history'>('value');
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  const {
    value,
    formattedValue,
    isLoading,
    error,
    lastUpdated,
    refresh
  } = useModbusData({
    deviceId,
    register,
    pollingInterval: refreshInterval,
    enabled: !isPaused,
  });

  const handleRefresh = async () => {
    setLastRefreshed(new Date());
    await refresh();
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const displayValue = showRawValue ? value : formattedValue;
  const displayUnit = showUnit && register.unit ? register.unit : '';
  const registerName = label || register.register_name || `Register ${register.register_address}`;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">{registerName}</CardTitle>
        <div className="flex items-center space-x-2">
          {showPauseButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={togglePause}
              title={isPaused ? 'Resume' : 'Pause'}
            >
              {isPaused ? <PlayIcon className="h-4 w-4" /> : <PauseIcon className="h-4 w-4" />}
            </Button>
          )}
          {showRefreshButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={isLoading}
              title="Refresh"
            >
              <ArrowPathIcon className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {showTabs ? (
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList className="mb-2">
              <TabsTrigger value="value">Current Value</TabsTrigger>
              <TabsTrigger value="chart">Chart</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            <TabsContent value="value">
              <div className="py-2">
                {error ? (
                  <div className="text-destructive">Error: {error}</div>
                ) : isLoading ? (
                  <div className="animate-pulse flex space-x-2">
                    <div className="h-6 bg-muted rounded w-12"></div>
                    <div className="h-6 bg-muted rounded w-8"></div>
                  </div>
                ) : (
                  <div className="flex items-baseline">
                    <span className="text-2xl font-semibold">{displayValue}</span>
                    {displayUnit && (
                      <span className="text-sm text-muted-foreground ml-1">{displayUnit}</span>
                    )}
                  </div>
                )}
                {showTimestamp && lastUpdated && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="chart">
              <div className="h-40 bg-muted/20 flex items-center justify-center">
                <span className="text-sm text-muted-foreground">Chart view not implemented</span>
              </div>
            </TabsContent>
            <TabsContent value="history">
              <div className="h-40 bg-muted/20 flex items-center justify-center">
                <span className="text-sm text-muted-foreground">History view not implemented</span>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="py-2">
            {error ? (
              <div className="text-destructive">Error: {error}</div>
            ) : isLoading ? (
              <div className="animate-pulse flex space-x-2">
                <div className="h-6 bg-muted rounded w-12"></div>
                <div className="h-6 bg-muted rounded w-8"></div>
              </div>
            ) : (
              <div className="flex items-baseline">
                <span className="text-2xl font-semibold">{displayValue}</span>
                {displayUnit && (
                  <span className="text-sm text-muted-foreground ml-1">{displayUnit}</span>
                )}
              </div>
            )}
            {showTimestamp && lastUpdated && (
              <div className="text-xs text-muted-foreground mt-1">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ModbusMonitor;
