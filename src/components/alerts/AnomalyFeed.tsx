
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Zap, Cpu, BatteryMedium, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface Anomaly {
  id: string;
  deviceId: string;
  deviceName: string;
  deviceType: string;
  message: string;
  confidence: number;
  timestamp: string;
  status: 'new' | 'investigating' | 'resolved' | 'false_positive';
}

const AnomalyFeed = () => {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      setAnomalies(getMockAnomalies());
      setLoading(false);
    }, 1500);
  }, []);
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-red-500">New</Badge>;
      case 'investigating':
        return <Badge className="bg-amber-500">Investigating</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="text-green-600 border-green-300">Resolved</Badge>;
      case 'false_positive':
        return <Badge variant="outline" className="text-slate-600 border-slate-300">False Positive</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };
  
  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'battery':
        return <BatteryMedium className="h-5 w-5 text-green-600" />;
      case 'inverter':
        return <Zap className="h-5 w-5 text-amber-600" />;
      case 'meter':
        return <Clock className="h-5 w-5 text-blue-600" />;
      default:
        return <Cpu className="h-5 w-5 text-slate-600" />;
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <LoadingSpinner size="lg" text="Loading anomalies..." />
      </div>
    );
  }
  
  if (anomalies.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-lg font-medium">No anomalies detected</h3>
        <p className="text-muted-foreground mt-2">
          The system is currently operating normally with no detected anomalies.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {anomalies.map((anomaly) => (
        <Card key={anomaly.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className={`p-4 ${anomaly.status === 'new' ? 'bg-red-50 dark:bg-red-900/10' : ''}`}>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-muted rounded-lg">
                  {getDeviceIcon(anomaly.deviceType)}
                </div>
                
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{anomaly.deviceName}</h3>
                      <p className="text-sm text-muted-foreground">{anomaly.deviceType}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-muted-foreground">
                        {new Date(anomaly.timestamp).toLocaleString()}
                      </div>
                      {getStatusBadge(anomaly.status)}
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-sm">
                      {anomaly.message}
                    </p>
                    <div className="mt-2 text-xs text-muted-foreground">
                      AI confidence: {anomaly.confidence}%
                    </div>
                  </div>
                  
                  {anomaly.status === 'new' && (
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline">Mark as Investigating</Button>
                      <Button size="sm" variant="outline">False Positive</Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Mock data for development purposes
function getMockAnomalies(): Anomaly[] {
  return [
    {
      id: '1',
      deviceId: 'batt-01',
      deviceName: 'Main Battery',
      deviceType: 'battery',
      message: 'Unusual discharge pattern detected. Battery discharge rate 15% higher than normal for current load conditions.',
      confidence: 87,
      timestamp: new Date().toISOString(),
      status: 'new'
    },
    {
      id: '2',
      deviceId: 'inv-02',
      deviceName: 'Inverter #2',
      deviceType: 'inverter',
      message: 'Efficiency drop detected. Current efficiency is 86% compared to expected 92% under similar conditions.',
      confidence: 94,
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      status: 'investigating'
    },
    {
      id: '3',
      deviceId: 'meter-01',
      deviceName: 'Main Meter',
      deviceType: 'meter',
      message: 'Inconsistent readings between phases. Phase B showing 8% higher consumption than historical patterns.',
      confidence: 76,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      status: 'resolved'
    },
    {
      id: '4',
      deviceId: 'inv-01',
      deviceName: 'Inverter #1',
      deviceType: 'inverter',
      message: 'Temperature anomaly detected. Operating temperature 12°C above expected range for current load and ambient conditions.',
      confidence: 89,
      timestamp: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
      status: 'new'
    },
    {
      id: '5',
      deviceId: 'meter-02',
      deviceName: 'Solar Production Meter',
      deviceType: 'meter',
      message: 'Possible sensor drift detected. Current readings 4-5% below expected values based on irradiance and temperature.',
      confidence: 72,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      status: 'false_positive'
    }
  ];
}

export default AnomalyFeed;
