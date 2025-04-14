
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartLegend, AreaChart, LineChart } from '@/components/ui/chart';
import { AlertTriangle, Activity, Battery, Download, TrendingUp, TrendingDown } from 'lucide-react';
import { format } from 'date-fns';

import { Device, TelemetryData } from '@/types/device';
import { MLService, MLServiceConfig } from '@/types/mlService';
import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Area, Line } from 'recharts';
import { ErrorBoundary as DeviceDetailsErrorBoundary } from 'react';

interface DeviceDetailsProps {
  deviceId: string;
}

const sampleTelemetryData = [
  { timestamp: '2023-04-14T08:00:00', value: 45, parameter: 'power', deviceId: 'demo-device', unit: 'kW' },
  { timestamp: '2023-04-14T09:00:00', value: 52, parameter: 'power', deviceId: 'demo-device', unit: 'kW' },
  { timestamp: '2023-04-14T10:00:00', value: 58, parameter: 'power', deviceId: 'demo-device', unit: 'kW' },
  { timestamp: '2023-04-14T11:00:00', value: 63, parameter: 'power', deviceId: 'demo-device', unit: 'kW' },
  { timestamp: '2023-04-14T12:00:00', value: 72, parameter: 'power', deviceId: 'demo-device', unit: 'kW' },
  { timestamp: '2023-04-14T13:00:00', value: 68, parameter: 'power', deviceId: 'demo-device', unit: 'kW' },
  { timestamp: '2023-04-14T14:00:00', value: 65, parameter: 'power', deviceId: 'demo-device', unit: 'kW' },
  { timestamp: '2023-04-14T15:00:00', value: 61, parameter: 'power', deviceId: 'demo-device', unit: 'kW' },
];

const sampleDevice: Device = {
  id: 'demo-device',
  name: 'Smart Meter',
  type: 'meter',
  status: 'online',
  manufacturer: 'EnergyTech',
  model: 'PowerMeter Pro',
  location: 'Main Building',
  lastSeen: '2023-04-14T15:30:00',
  firmware: 'v2.1.5',
  capacity: 100,
  description: 'Main power meter for building A'
};

// Mock class to handle React component error boundary
class ErrorBoundary extends DeviceDetailsErrorBoundary {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Error in DeviceDetails component:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 text-red-800 rounded-md">
          <h3 className="font-bold">Something went wrong</h3>
          <p>{this.state.error?.message || 'An unknown error occurred'}</p>
          <Button onClick={() => this.setState({ hasError: false, error: null })}>Try again</Button>
        </div>
      );
    }

    return this.props.children;
  }
}

const DeviceDetails: React.FC<DeviceDetailsProps> = ({ deviceId }) => {
  const [device, setDevice] = useState<Device | null>(null);
  const [telemetry, setTelemetry] = useState<TelemetryData[]>([]);
  const [consumermlService, setConsumerMLService] = useState<MLService | null>(null);
  const [generationmlService, setGenerationMLService] = useState<MLService | null>(null);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Configuration for the ML services
  const consumerConfig: MLServiceConfig = {
    modelPath: '/models/consumer-prediction',
    inputShape: [24, 5],
    outputShape: [24, 1],
    featureNames: ['time', 'temperature', 'humidity', 'occupancy', 'day_of_week'],
    modelType: 'timeseries' // Changed from 'consumption' to a valid model type
  };

  const generationConfig: MLServiceConfig = {
    modelPath: '/models/generation-prediction',
    inputShape: [24, 7],
    outputShape: [24, 1],
    featureNames: ['time', 'solar_irradiance', 'temperature', 'cloud_cover', 'panel_efficiency', 'panel_age', 'day_of_year'],
    modelType: 'regression'
  };

  // Fetch device data
  useEffect(() => {
    // Mock API call
    setTimeout(() => {
      setDevice(sampleDevice);
      setTelemetry(sampleTelemetryData);
      setLoading(false);
    }, 500);
  }, [deviceId]);

  // Initialize ML services
  useEffect(() => {
    const initML = async () => {
      try {
        const consumerService = new MLService(consumerConfig);
        await consumerService.initialize();
        setConsumerMLService(consumerService);

        const generationService = new MLService(generationConfig);
        await generationService.initialize();
        setGenerationMLService(generationService);

        // Generate sample predictions and anomalies
        if (telemetry.length > 0) {
          const anomalyData = consumerService.detectAnomalies(telemetry);
          setAnomalies(anomalyData.filter(item => item.isAnomaly));
          
          const behaviorPredictions = generationService.predictBehavior(telemetry);
          setPredictions(behaviorPredictions);
        }
      } catch (error) {
        console.error('Error initializing ML services:', error);
      }
    };

    if (telemetry.length > 0 && !consumermlService) {
      initML();
    }

    // Cleanup function
    return () => {
      if (consumermlService) {
        consumermlService.cleanup();
      }
      if (generationmlService) {
        generationmlService.cleanup();
      }
    };
  }, [telemetry]);

  if (loading || !device) {
    return <div>Loading device details...</div>;
  }

  return (
    <div className="space-y-6">
      <ErrorBoundary>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{device.name}</CardTitle>
              <Badge variant={device.status === 'online' ? 'success' : 'destructive'}>
                {device.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><span className="text-gray-500">Type:</span> {device.type}</p>
                <p><span className="text-gray-500">Manufacturer:</span> {device.manufacturer}</p>
                <p><span className="text-gray-500">Model:</span> {device.model}</p>
              </div>
              <div>
                <p><span className="text-gray-500">Location:</span> {device.location}</p>
                <p><span className="text-gray-500">Firmware:</span> {device.firmware}</p>
                <p><span className="text-gray-500">Last Seen:</span> {new Date(device.lastSeen || '').toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="telemetry">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="telemetry">Telemetry</TabsTrigger>
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
            <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
            <TabsTrigger value="health">Device Health</TabsTrigger>
          </TabsList>
          
          <TabsContent value="telemetry" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Power Consumption</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={telemetry}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="timestamp" 
                        tickFormatter={(value) => {
                          const date = new Date(value);
                          return format(date, 'HH:mm');
                        }}
                      />
                      <YAxis />
                      <Tooltip 
                        labelFormatter={(value) => {
                          const date = new Date(value);
                          return format(date, 'PPpp');
                        }}
                      />
                      <Area type="monotone" dataKey="value" stroke="#82ca9d" fillOpacity={1} fill="url(#colorValue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md">
                    <p className="text-sm text-gray-500">Current Power</p>
                    <p className="text-xl font-bold">{telemetry[telemetry.length - 1]?.value} kW</p>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md">
                    <p className="text-sm text-gray-500">Daily Average</p>
                    <p className="text-xl font-bold">
                      {(telemetry.reduce((sum, item) => sum + item.value, 0) / telemetry.length).toFixed(1)} kW
                    </p>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md">
                    <p className="text-sm text-gray-500">Peak Power</p>
                    <p className="text-xl font-bold">
                      {Math.max(...telemetry.map(item => item.value))} kW
                    </p>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md">
                    <p className="text-sm text-gray-500">Last Reading</p>
                    <p className="text-xl font-bold">
                      {format(new Date(telemetry[telemetry.length - 1]?.timestamp || new Date()), 'HH:mm')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="predictions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Energy Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                {predictions.length > 0 ? (
                  <>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={predictions}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="timestamp" 
                            tickFormatter={(value) => {
                              const date = new Date(value);
                              return format(date, 'HH:mm');
                            }}
                          />
                          <YAxis />
                          <Tooltip 
                            labelFormatter={(value) => {
                              const date = new Date(value);
                              return format(date, 'PPpp');
                            }}
                          />
                          <Line type="monotone" dataKey="prediction" stroke="#8884d8" activeDot={{ r: 8 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-medium">Expected Energy Pattern</p>
                        <Badge variant="secondary">AI Generated</Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Based on historical data and current conditions, we predict that energy consumption will
                        peak at {format(new Date(), 'HH:mm')} with an estimated value of 
                        {Math.max(...predictions.map(p => p.prediction)).toFixed(1)} kW.
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-40">
                    <p>No prediction data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="anomalies" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Detected Anomalies</CardTitle>
              </CardHeader>
              <CardContent>
                {anomalies.length > 0 ? (
                  <div className="space-y-4">
                    {anomalies.map((anomaly, index) => (
                      <div key={index} className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md border-l-4 border-red-500">
                        <div className="flex items-start">
                          <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
                          <div>
                            <h4 className="font-medium">Anomaly Detected</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                              Unusual value of {anomaly.value} {anomaly.unit} detected at {
                                format(new Date(anomaly.timestamp), 'PPpp')
                              }
                            </p>
                            <div className="mt-2">
                              <p className="text-xs text-gray-500">
                                Confidence: {(anomaly.anomalyScore * 100).toFixed(0)}%
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md border-l-4 border-green-500">
                    <div className="flex items-center">
                      <Activity className="h-5 w-5 text-green-500 mr-2" />
                      <div>
                        <h4 className="font-medium">No Anomalies Detected</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          Device is operating within expected parameters
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="health" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Device Health Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Connectivity</span>
                      <span className="text-green-500">Excellent</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Data Quality</span>
                      <span className="text-green-500">Good</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '87%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Battery</span>
                      <span className="text-amber-500">Fair</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '68%' }}></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md">
                      <p className="text-sm text-gray-500">Uptime</p>
                      <p className="text-xl font-bold">99.8%</p>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md">
                      <p className="text-sm text-gray-500">Firmware</p>
                      <p className="text-xl font-bold">{device.firmware}</p>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md">
                      <p className="text-sm text-gray-500">Signal Strength</p>
                      <p className="text-xl font-bold">-67 dBm</p>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md">
                      <p className="text-sm text-gray-500">Last Check</p>
                      <p className="text-xl font-bold">2 mins ago</p>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
                    <h4 className="font-medium flex items-center">
                      <Battery className="h-4 w-4 mr-2" />
                      Maintenance Recommendation
                    </h4>
                    <p className="text-sm mt-2">
                      Battery replacement recommended within the next 3 months. Current degradation is at 32%.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </ErrorBoundary>
    </div>
  );
};

export default DeviceDetails;
