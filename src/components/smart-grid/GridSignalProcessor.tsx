
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GridSignal } from '@/types/energy';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle2, Clock, Plug, Settings, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

// Mock API function - would be replaced with actual API call
const fetchGridSignals = async (): Promise<GridSignal[]> => {
  // In a real app, this would be an API call
  return [
    {
      id: "gs-1",
      timestamp: new Date().toISOString(),
      signal_type: "curtailment",
      value: 70, // 70% curtailment
      unit: "%",
      valid_from: new Date().toISOString(),
      valid_until: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
      source: "DSO",
      priority: "high",
      affected_devices: ["solar-1", "solar-2"],
      area_code: "DE12345",
      grid_operator: "Local Grid Operator"
    },
    {
      id: "gs-2",
      timestamp: new Date().toISOString(),
      signal_type: "price_signal",
      value: 0.12,
      unit: "€/kWh",
      valid_from: new Date().toISOString(),
      valid_until: new Date(Date.now() + 7200000).toISOString(), // 2 hours from now
      source: "Energy Market",
      priority: "medium",
      area_code: "DE12345",
      grid_operator: "Local Grid Operator"
    }
  ];
};

const GridSignalProcessor = () => {
  const [signals, setSignals] = useState<GridSignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [compliance, setCompliance] = useState<'compliant' | 'non-compliant' | 'pending'>('pending');
  const [autoResponse, setAutoResponse] = useState(true);
  
  useEffect(() => {
    const loadSignals = async () => {
      try {
        setLoading(true);
        const data = await fetchGridSignals();
        setSignals(data);
        // Assuming system is compliant if we have at least one signal
        setCompliance(data.length > 0 ? 'compliant' : 'pending');
      } catch (error) {
        console.error('Failed to fetch grid signals', error);
        toast.error('Failed to load grid signals');
        setCompliance('non-compliant');
      } finally {
        setLoading(false);
      }
    };
    
    loadSignals();
    
    // Set up polling every 5 minutes
    const intervalId = setInterval(loadSignals, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);
  
  const handleManualProcess = async () => {
    try {
      setProcessing(true);
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would call an API to process signals
      toast.success('Grid signals processed successfully');
      setCompliance('compliant');
    } catch (error) {
      console.error('Failed to process grid signals', error);
      toast.error('Failed to process grid signals');
      setCompliance('non-compliant');
    } finally {
      setProcessing(false);
    }
  };
  
  const getComplianceStatus = () => {
    switch (compliance) {
      case 'compliant':
        return (
          <Badge 
            variant="outline" 
            className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
          >
            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
            Compliant
          </Badge>
        );
      case 'non-compliant':
        return (
          <Badge 
            variant="outline" 
            className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800"
          >
            <AlertTriangle className="h-3.5 w-3.5 mr-1" />
            Non-Compliant
          </Badge>
        );
      default:
        return (
          <Badge 
            variant="outline" 
            className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800"
          >
            <Clock className="h-3.5 w-3.5 mr-1" />
            Pending
          </Badge>
        );
    }
  };
  
  const getSignalTypeIcon = (type: string) => {
    switch (type) {
      case 'curtailment':
        return <Zap className="h-4 w-4" />;
      case 'price_signal':
        return <Plug className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };
  
  const getSignalTypeName = (type: string) => {
    switch (type) {
      case 'curtailment':
        return 'Curtailment Signal';
      case 'demand_response':
        return 'Demand Response';
      case 'price_signal':
        return 'Price Signal';
      case 'grid_congestion':
        return 'Grid Congestion';
      default:
        return type;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <CardTitle className="text-lg">§14a Grid Signal Processor</CardTitle>
            <CardDescription>Manage and respond to grid operator signals</CardDescription>
          </div>
          {getComplianceStatus()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="auto-response"
                checked={autoResponse}
                onCheckedChange={setAutoResponse}
              />
              <Label htmlFor="auto-response">Automatic signal response</Label>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleManualProcess} 
              disabled={processing || loading || signals.length === 0}
            >
              {processing ? 'Processing...' : 'Process Signals'}
            </Button>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Active Grid Signals</h3>
            
            {loading ? (
              <div className="h-40 flex items-center justify-center">
                <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            ) : signals.length === 0 ? (
              <div className="h-40 flex flex-col items-center justify-center text-muted-foreground">
                <p>No active grid signals</p>
                <p className="text-xs mt-1">System is monitoring for new signals</p>
              </div>
            ) : (
              <div className="space-y-3">
                {signals.map((signal) => (
                  <div
                    key={signal.id}
                    className={cn(
                      "p-4 rounded-lg border",
                      signal.priority === 'high' || signal.priority === 'critical' 
                        ? "bg-red-50/50 dark:bg-red-900/10 border-red-200 dark:border-red-800/30"
                        : "bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800/30"
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "p-1.5 rounded-full",
                          signal.priority === 'high' || signal.priority === 'critical'
                            ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                            : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        )}>
                          {getSignalTypeIcon(signal.signal_type)}
                        </div>
                        <div>
                          <h4 className="font-medium">{getSignalTypeName(signal.signal_type)}</h4>
                          <p className="text-sm text-muted-foreground">{signal.grid_operator}</p>
                        </div>
                      </div>
                      
                      <Badge variant={signal.priority === 'high' || signal.priority === 'critical' ? "destructive" : "secondary"}>
                        {signal.priority.charAt(0).toUpperCase() + signal.priority.slice(1)} Priority
                      </Badge>
                    </div>
                    
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-muted-foreground">Value</p>
                        <p className="font-medium">{signal.value} {signal.unit}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Valid Until</p>
                        <p className="font-medium">
                          {new Date(signal.valid_until).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                    
                    {signal.affected_devices && signal.affected_devices.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground">Affected Devices</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {signal.affected_devices.map((device, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {device}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="bg-slate-100 dark:bg-slate-800/50 p-3 rounded-md text-sm text-slate-700 dark:text-slate-300">
            <p>§14a EnWG (German Energy Industry Act) requires grid operators to control energy assets during grid congestion events.</p>
            <p className="mt-1">This module ensures compliance by automatically processing and responding to grid signals.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GridSignalProcessor;
