import React, { ErrorInfo, Component } from 'react';
import { Device, TelemetryData } from '@/types/device';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Activity, Clock, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MLService } from '@/services/mlService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useMemo, useEffect, useState } from 'react';
import { deviceService } from '@/services/deviceService';
import { DeviceConnectivityService } from '@/services/deviceConnectivityService';

interface DeviceDetailsProps {
  device: Device;
  telemetry?: TelemetryData[];
  isLoading?: boolean;
  className?: string;
  onError?: (error: Error) => void;
}

interface DeviceDetailsState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary component for DeviceDetails
 */
class DeviceDetailsErrorBoundary extends Component<{ children: React.ReactNode }, DeviceDetailsState> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): DeviceDetailsState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('DeviceDetails Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {this.state.error?.message || 'An error occurred while displaying device details'}
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}

/**
 * DeviceInfo component for displaying basic device information
 */
const DeviceInfo = ({ device, isLoading }: { device: Device; isLoading?: boolean }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-28" />
      </div>
    );
  }

  try {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Type</span>
          <span className="font-medium">{device.type}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Protocol</span>
          <span className="font-medium">{device.protocol}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">MQTT Topic</span>
          <span className="font-medium font-mono">{device.mqtt_topic}</span>
        </div>
        {device.http_endpoint && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">HTTP Endpoint</span>
            <span className="font-medium font-mono">{device.http_endpoint}</span>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error in DeviceInfo:', error);
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to display device information</AlertDescription>
      </Alert>
    );
  }
};

/**
 * ConnectionDetails component for displaying connection information
 */
const ConnectionDetails = ({ device, isLoading }: { device: Device; isLoading?: boolean }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-28" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {device.ip_address && (
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">IP Address</span>
          <span className="font-medium font-mono">{device.ip_address}</span>
        </div>
      )}
      {device.port && (
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Port</span>
          <span className="font-medium">{device.port}</span>
        </div>
      )}
      {device.slave_id && (
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Slave ID</span>
          <span className="font-medium">{device.slave_id}</span>
        </div>
      )}
    </div>
  );
};

interface TelemetryDisplayProps {
  telemetry?: TelemetryData[];
  isLoading?: boolean;
  deviceId: string;
}

/**
 * TelemetryDisplay component for displaying telemetry data and predictions
 */
const TelemetryDisplay = ({ telemetry, isLoading, deviceId }: TelemetryDisplayProps) => {
  const [predictions, setPredictions] = useState<number[]>([]);
  const [anomalyScore, setAnomalyScore] = useState<number | null>(null);
  const [mlError, setMlError] = useState<string | null>(null);

  // Initialize ML service
  const mlService = useMemo(() => new MLService({
    modelPath: '/models/device_model.onnx',
    modelType: 'consumption',
    inputShape: [10, 5], // 10 time steps, 5 features
    outputShape: [1, 3], // anomaly score, prediction, confidence
    featureNames: ['temperature', 'humidity', 'pressure', 'voltage', 'current']
  }), []);

  // Process telemetry data when it changes
  useEffect(() => {
    if (!telemetry?.length) return;

    const processTelemetry = async () => {
      try {
        await mlService.initialize();
        
        // Detect anomalies
        const result = await mlService.detectAnomalies(telemetry);
        setAnomalyScore(result.anomalyScore);
        
        // Predict future behavior
        const futurePredictions = await mlService.predictBehavior(telemetry, 5);
        setPredictions(futurePredictions);
        
        setMlError(null);
      } catch (error) {
        console.error('ML processing error:', error);
        setMlError(error instanceof Error ? error.message : 'Failed to process telemetry data');
      }
    };

    processTelemetry();

    return () => {
      // Clean up ML service resources
      if (mlService && typeof mlService.cleanup === 'function') {
        mlService.cleanup();
      }
    };
  }, [telemetry, mlService]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (!telemetry || telemetry.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No telemetry data available
      </div>
    );
  }

  // Prepare chart data
  const chartData = telemetry.map((data, index) => ({
    timestamp: new Date(data.timestamp).toLocaleTimeString(),
    ...data.data,
    prediction: index < predictions.length ? predictions[index] : undefined
  }));

  return (
    <div className="space-y-6">
      {mlError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>ML Processing Error</AlertTitle>
          <AlertDescription>{mlError}</AlertDescription>
        </Alert>
      )}

      {anomalyScore !== null && (
        <Alert variant={anomalyScore > 0.7 ? "destructive" : "default"}>
          <Activity className="h-4 w-4" />
          <AlertTitle>Anomaly Detection</AlertTitle>
          <AlertDescription>
            {anomalyScore > 0.7 
              ? 'Potential anomaly detected in device behavior'
              : 'Device behavior is normal'}
          </AlertDescription>
        </Alert>
      )}

      <div className="h-[300px] w-full">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Legend />
          {Object.keys(telemetry[0]?.data || {}).map(key => (
            <Line 
              key={key}
              type="monotone"
              dataKey={key}
              stroke={`hsl(${Math.random() * 360}, 70%, 50%)`}
              dot={false}
            />
          ))}
          {predictions.length > 0 && (
            <Line
              type="monotone"
              dataKey="prediction"
              stroke="#8884d8"
              strokeDasharray="5 5"
              dot={false}
            />
          )}
        </LineChart>
      </div>

      <div className="space-y-4">
        {telemetry.map((data, index) => (
          <div 
            key={index} 
            className="flex justify-between items-center p-2 rounded-lg bg-muted/50"
          >
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">
                {new Date(data.timestamp).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              {Object.entries(data.data).map(([key, value]) => (
                <div key={key} className="text-sm">
                  <span className="text-muted-foreground">{key}:</span>{' '}
                  <span className="font-medium">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * DeviceDetails component for displaying detailed device information
 * @param device - The device to display details for
 * @param telemetry - Optional array of telemetry data
 * @param isLoading - Optional flag indicating if data is loading
 * @param className - Optional additional CSS classes
 */
export function DeviceDetails({ 
  device, 
  telemetry, 
  isLoading = false,
  className,
  onError 
}: DeviceDetailsProps) {
  const [telemetryData, setTelemetryData] = useState<TelemetryData[]>(telemetry || []);
  const [connectivityStatus, setConnectivityStatus] = useState<any>(null);
  const [connectivityMetrics, setConnectivityMetrics] = useState<any[]>([]);
  const [connectivityIssues, setConnectivityIssues] = useState<any[]>([]);
  const [isRepairing, setIsRepairing] = useState(false);

  // Subscribe to real-time updates
  useEffect(() => {
    const telemetrySubscription = deviceService.subscribeToDeviceTelemetry(device.id, (payload) => {
      const newData = payload.new as TelemetryData;
      setTelemetryData(prevData => {
        const updatedData = [...prevData, newData];
        // Keep only the most recent 100 data points
        return updatedData.slice(-100);
      });
    });

    return () => {
      telemetrySubscription.unsubscribe();
    };
  }, [device.id]);

  // Initialize connectivity service and fetch data
  useEffect(() => {
    const connectivityService = new DeviceConnectivityService();
    
    const fetchConnectivityData = async () => {
      try {
        await connectivityService.initialize();
        
        const status = await connectivityService.getDeviceStatus(device.id);
        setConnectivityStatus(status);
        
        const metrics = await connectivityService.getDeviceMetrics(device.id);
        setConnectivityMetrics(metrics);
        
        const issues = await connectivityService.runDiagnostics(device.id);
        setConnectivityIssues(issues);
      } catch (error) {
        console.error('Error fetching connectivity data:', error);
        onError?.(error instanceof Error ? error : new Error('Failed to fetch connectivity data'));
      }
    };
    
    fetchConnectivityData();
  }, [device.id, onError]);

  // Handle repair attempt
  const handleRepair = async () => {
    if (isRepairing) return;
    
    setIsRepairing(true);
    try {
      const connectivityService = new DeviceConnectivityService();
      await connectivityService.initialize();
      const fixed = await connectivityService.attemptRepair(device.id);
      
      // Refresh connectivity data
      const status = await connectivityService.getDeviceStatus(device.id);
      setConnectivityStatus(status);
      
      const issues = await connectivityService.runDiagnostics(device.id);
      setConnectivityIssues(issues);
      
      return fixed;
    } catch (error) {
      console.error('Error repairing device:', error);
      onError?.(error instanceof Error ? error : new Error('Failed to repair device'));
      return false;
    } finally {
      setIsRepairing(false);
    }
  };

  try {
    return (
      <DeviceDetailsErrorBoundary>
        <Card className={className}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{device.name}</CardTitle>
                <CardDescription>
                  Device ID: {device.id}
                </CardDescription>
              </div>
              <Badge 
                variant={device.status === 'online' ? 'success' : 'destructive'}
                className="ml-2"
              >
                {device.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="info" className="space-y-4">
              <TabsList>
                <TabsTrigger value="info">Information</TabsTrigger>
                <TabsTrigger value="connection">Connection</TabsTrigger>
                <TabsTrigger value="telemetry">Telemetry</TabsTrigger>
              </TabsList>

              <TabsContent value="info">
                <Card>
                  <CardHeader>
                    <CardTitle>Device Information</CardTitle>
                    <CardDescription>Basic details about the device</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DeviceInfo device={device} isLoading={isLoading} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="connection">
                <Card>
                  <CardHeader>
                    <CardTitle>Connection Details</CardTitle>
                    <CardDescription>Connection parameters for the device</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ConnectionDetails device={device} isLoading={isLoading} />
                    
                    {connectivityStatus && (
                      <div className="mt-4 space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Connection Status</span>
                          <Badge variant={
                            connectivityStatus.status === 'healthy' ? 'default' : 
                            connectivityStatus.status === 'degraded' ? 'default' : 
                            'destructive'
                          }>
                            {connectivityStatus.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Latency</span>
                          <span className="font-medium">{connectivityStatus.latency}ms</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Signal Strength</span>
                          <span className="font-medium">{connectivityStatus.signalStrength}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Last Ping</span>
                          <span className="font-medium">
                            {connectivityStatus.lastPing ? formatDistanceToNow(new Date(connectivityStatus.lastPing), { addSuffix: true }) : 'Never'}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {connectivityIssues.length > 0 && (
                      <div className="mt-4">
                        <h3 className="text-sm font-medium mb-2">Connection Issues</h3>
                        <div className="space-y-2">
                          {connectivityIssues.map((issue, index) => (
                            <Alert key={index} variant={
                              issue.severity === 'high' ? 'destructive' : 
                              issue.severity === 'medium' ? 'warning' : 'default'
                            }>
                              <AlertTriangle className="h-4 w-4" />
                              <AlertTitle>{issue.type}</AlertTitle>
                              <AlertDescription>
                                {issue.description}
                                {issue.autoFixAvailable && (
                                  <button 
                                    onClick={handleRepair}
                                    disabled={isRepairing}
                                    className="ml-2 text-sm font-medium text-primary hover:underline"
                                  >
                                    {isRepairing ? 'Repairing...' : 'Repair'}
                                  </button>
                                )}
                              </AlertDescription>
                            </Alert>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="telemetry">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Telemetry</CardTitle>
                    <CardDescription>Latest data from the device</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TelemetryDisplay telemetry={telemetryData} isLoading={isLoading} deviceId={device.id} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </DeviceDetailsErrorBoundary>
    );
  } catch (error) {
    const err = error instanceof Error ? error : new Error('Unknown error occurred');
    console.error('Error in DeviceDetails:', err);
    onError?.(err);
    
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to display device details</AlertDescription>
      </Alert>
    );
  }
} 