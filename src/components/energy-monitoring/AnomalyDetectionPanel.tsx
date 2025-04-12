
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, Eye, Microscope, AlertCircle, BarChart4 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Anomaly {
  id: string;
  deviceId: string;
  deviceName: string;
  type: 'power' | 'voltage' | 'efficiency' | 'consumption';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  detectedAt: string;
  status: 'new' | 'investigating' | 'resolved';
  potentialImpact?: string;
  suggestedAction?: string;
}

const mockAnomalies: Anomaly[] = [
  {
    id: '1',
    deviceId: 'inv-001',
    deviceName: 'Main Inverter',
    type: 'efficiency',
    severity: 'high',
    description: 'Sudden drop in conversion efficiency detected (92% → 78%)',
    detectedAt: '2023-07-15T08:23:44Z',
    status: 'new',
    potentialImpact: 'Reduced energy production, potential component failure',
    suggestedAction: 'Check inverter cooling system, inspect for dust accumulation'
  },
  {
    id: '2',
    deviceId: 'batt-002',
    deviceName: 'Home Battery',
    type: 'power',
    severity: 'medium',
    description: 'Unusual charging pattern detected outside optimal window',
    detectedAt: '2023-07-14T22:45:12Z',
    status: 'investigating',
    potentialImpact: 'Reduced battery lifespan, suboptimal energy usage',
    suggestedAction: 'Review battery charge/discharge settings, check scheduling rules'
  },
  {
    id: '3',
    deviceId: 'pv-array-01',
    deviceName: 'Roof Solar Array',
    type: 'power',
    severity: 'critical',
    description: 'String #3 showing 45% lower output than expected for conditions',
    detectedAt: '2023-07-15T12:15:30Z',
    status: 'new',
    potentialImpact: 'Significant energy production loss, potential panel damage',
    suggestedAction: 'Inspect string #3 for physical damage, check connections'
  },
  {
    id: '4',
    deviceId: 'meter-001',
    deviceName: 'Smart Meter',
    type: 'consumption',
    severity: 'low',
    description: 'Unusual consumption pattern detected during night hours',
    detectedAt: '2023-07-13T03:22:15Z',
    status: 'resolved',
    potentialImpact: 'Minor energy wastage',
    suggestedAction: 'Check for devices operating overnight unnecessarily'
  }
];

const AnomalyDetectionPanel: React.FC = () => {
  const [anomalies, setAnomalies] = useState<Anomaly[]>(mockAnomalies);
  const [selectedAnomaly, setSelectedAnomaly] = useState<Anomaly | null>(null);
  
  const severityColor = {
    low: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    critical: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
  };

  const statusIcon = {
    new: <AlertTriangle className="h-4 w-4 text-amber-500" />,
    investigating: <Eye className="h-4 w-4 text-blue-500" />,
    resolved: <CheckCircle className="h-4 w-4 text-green-500" />
  };
  
  const handleResolve = (id: string) => {
    setAnomalies(prevAnomalies => 
      prevAnomalies.map(anomaly => 
        anomaly.id === id ? { ...anomaly, status: 'resolved' as const } : anomaly
      )
    );
    if (selectedAnomaly?.id === id) {
      setSelectedAnomaly({ ...selectedAnomaly, status: 'resolved' });
    }
  };
  
  const handleInvestigate = (id: string) => {
    setAnomalies(prevAnomalies => 
      prevAnomalies.map(anomaly => 
        anomaly.id === id ? { ...anomaly, status: 'investigating' as const } : anomaly
      )
    );
    if (selectedAnomaly?.id === id) {
      setSelectedAnomaly({ ...selectedAnomaly, status: 'investigating' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Microscope className="mr-2 h-5 w-5 text-primary" />
            Energy Anomaly Detection
          </h2>
          <p className="text-muted-foreground">
            AI-powered detection of unusual patterns and potential issues
          </p>
        </div>
        
        <Badge variant="outline" className="px-2 py-1">
          <AlertCircle className="h-4 w-4 mr-1 text-amber-500" />
          <span>{anomalies.filter(a => a.status !== 'resolved').length} active anomalies</span>
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Detected Anomalies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {anomalies.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No anomalies detected in the system
                </div>
              ) : (
                anomalies.map(anomaly => (
                  <div
                    key={anomaly.id}
                    className={`p-4 rounded-md border cursor-pointer transition-all ${
                      selectedAnomaly?.id === anomaly.id 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedAnomaly(anomaly)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{anomaly.deviceName}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {anomaly.description}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="capitalize flex items-center gap-1">
                          {statusIcon[anomaly.status]}
                          {anomaly.status}
                        </Badge>
                        <Badge
                          className={`capitalize ${severityColor[anomaly.severity]}`}
                        >
                          {anomaly.severity}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mt-2 flex justify-between items-center">
                      <div className="text-xs text-muted-foreground">
                        Detected: {new Date(anomaly.detectedAt).toLocaleString()}
                      </div>
                      {anomaly.status !== 'resolved' && (
                        <div className="flex space-x-2">
                          {anomaly.status !== 'investigating' && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleInvestigate(anomaly.id);
                              }}
                            >
                              Investigate
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleResolve(anomaly.id);
                            }}
                          >
                            Resolve
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart4 className="mr-2 h-5 w-5 text-blue-500" />
              Anomaly Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedAnomaly ? (
              <div className="space-y-6">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Device</div>
                  <div className="font-medium">{selectedAnomaly.deviceName}</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Description</div>
                  <div className="text-sm">{selectedAnomaly.description}</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Potential Impact</div>
                  <div className="text-sm">{selectedAnomaly.potentialImpact || 'Not assessed'}</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Suggested Action</div>
                  <div className="text-sm">{selectedAnomaly.suggestedAction || 'No action suggested'}</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Status</div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="secondary" className="capitalize">
                      {selectedAnomaly.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="pt-4 flex space-x-2">
                  {selectedAnomaly.status !== 'resolved' && (
                    <>
                      {selectedAnomaly.status !== 'investigating' && (
                        <Button variant="outline" onClick={() => handleInvestigate(selectedAnomaly.id)}>
                          <Eye className="mr-2 h-4 w-4" /> 
                          Investigate
                        </Button>
                      )}
                      <Button variant="default" onClick={() => handleResolve(selectedAnomaly.id)}>
                        <CheckCircle className="mr-2 h-4 w-4" /> 
                        Resolve Issue
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                Select an anomaly to view details
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Anomaly Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="trends">
            <TabsList className="mb-6">
              <TabsTrigger value="trends">Trends</TabsTrigger>
              <TabsTrigger value="devices">By Device</TabsTrigger>
              <TabsTrigger value="types">By Type</TabsTrigger>
            </TabsList>
            
            <TabsContent value="trends">
              <div className="h-60 bg-slate-100 dark:bg-slate-800 rounded-md flex items-center justify-center">
                Anomaly trends chart will be displayed here
              </div>
            </TabsContent>
            
            <TabsContent value="devices">
              <div className="h-60 bg-slate-100 dark:bg-slate-800 rounded-md flex items-center justify-center">
                Device anomaly distribution chart will be displayed here
              </div>
            </TabsContent>
            
            <TabsContent value="types">
              <div className="h-60 bg-slate-100 dark:bg-slate-800 rounded-md flex items-center justify-center">
                Anomaly type distribution chart will be displayed here
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnomalyDetectionPanel;
