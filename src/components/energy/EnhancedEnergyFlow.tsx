
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Battery, Zap, Wind, Home, Sun, Maximize2, RefreshCw, Info } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { handleApiError } from '@/services/apiErrorHandler';
import axios from 'axios';
import { toast } from 'sonner';

interface EnergyNode {
  id: string;
  label: string;
  type: 'source' | 'storage' | 'consumption';
  power: number;
  status: 'active' | 'inactive' | 'warning' | 'error';
  deviceType: string;
  batteryLevel?: number;
}

interface EnergyConnection {
  from: string;
  to: string;
  value: number;
  active: boolean;
}

interface EnhancedEnergyFlowProps {
  siteId: string;
}

const EnhancedEnergyFlow: React.FC<EnhancedEnergyFlowProps> = ({ siteId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [nodes, setNodes] = useState<EnergyNode[]>([]);
  const [connections, setConnections] = useState<EnergyConnection[]>([]);
  const [selectedNode, setSelectedNode] = useState<EnergyNode | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [view, setView] = useState<'live' | 'historic'>('live');
  const [timeframe, setTimeframe] = useState('day');

  // Calculate metrics
  const totalGeneration = useMemo(() => {
    return nodes
      .filter(node => node.type === 'source')
      .reduce((sum, node) => sum + node.power, 0);
  }, [nodes]);
    
  const totalConsumption = useMemo(() => {
    return nodes
      .filter(node => node.type === 'consumption')
      .reduce((sum, node) => sum + node.power, 0);
  }, [nodes]);
    
  const batteryNode = useMemo(() => {
    return nodes.find(n => n.deviceType === 'battery');
  }, [nodes]);
  
  const batteryPercentage = batteryNode?.batteryLevel || 0;
  
  // Self-consumption rate: how much of generated energy is used directly
  const selfConsumptionRate = useMemo(() => {
    return totalGeneration > 0 
      ? Math.min(100, (Math.min(totalGeneration, totalConsumption) / totalGeneration) * 100)
      : 0;
  }, [totalGeneration, totalConsumption]);
    
  // Grid dependency rate: how much energy comes from the grid
  const gridNode = useMemo(() => {
    return nodes.find(n => n.deviceType === 'grid');
  }, [nodes]);
  
  const gridPower = gridNode?.power || 0;
  const gridDependencyRate = useMemo(() => {
    return totalConsumption > 0 
      ? Math.min(100, (gridPower / totalConsumption) * 100)
      : 0;
  }, [totalConsumption, gridPower]);

  // Load energy flow data
  const fetchEnergyFlowData = async () => {
    if (!siteId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, fetch from the actual API
      // For now, simulate with mock data
      // const response = await axios.get(`/api/sites/${siteId}/energy-flow`);
      // const data = response.data;
      
      // Mock data
      const mockNodes: EnergyNode[] = [
        {
          id: 'solar',
          label: 'Solar Panels',
          type: 'source',
          power: 5.5 + Math.random() * 1,
          status: 'active',
          deviceType: 'solar'
        },
        {
          id: 'wind',
          label: 'Wind Turbine',
          type: 'source',
          power: 2.1 + Math.random() * 0.5,
          status: 'active',
          deviceType: 'wind'
        },
        {
          id: 'battery',
          label: 'Battery Storage',
          type: 'storage',
          power: 3.2 + Math.random() * 0.7,
          status: 'active',
          deviceType: 'battery',
          batteryLevel: Math.floor(60 + Math.random() * 20)
        },
        {
          id: 'grid',
          label: 'Power Grid',
          type: 'source',
          power: 1.5 + Math.random() * 0.3,
          status: 'active',
          deviceType: 'grid'
        },
        {
          id: 'home',
          label: 'Household',
          type: 'consumption',
          power: 4.2 + Math.random() * 0.8,
          status: 'active',
          deviceType: 'load'
        },
        {
          id: 'ev',
          label: 'EV Charger',
          type: 'consumption',
          power: 3.8 + Math.random() * 0.6,
          status: 'active',
          deviceType: 'ev'
        }
      ];

      const mockConnections: EnergyConnection[] = [
        { from: 'solar', to: 'battery', value: 3.2, active: true },
        { from: 'solar', to: 'home', value: 2.3, active: true },
        { from: 'wind', to: 'battery', value: 0.8, active: true },
        { from: 'wind', to: 'home', value: 1.3, active: true },
        { from: 'battery', to: 'ev', value: 3.8, active: true },
        { from: 'grid', to: 'home', value: 0.6, active: true }
      ];
      
      setNodes(mockNodes);
      setConnections(mockConnections);
      
      if (mockNodes.length > 0 && !selectedNode) {
        setSelectedNode(mockNodes[0]);
      }
      
    } catch (error) {
      console.error('Failed to fetch energy flow data:', error);
      setError(error instanceof Error ? error : new Error('Failed to fetch energy flow data'));
      handleApiError(error, {
        context: 'Energy Flow Data',
        showToast: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchEnergyFlowData();
    // Set up refresh interval
    const intervalId = setInterval(fetchEnergyFlowData, 30000);
    
    return () => clearInterval(intervalId);
  }, [siteId]);

  // Handle fullscreen mode
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Effect to handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleNodeClick = (node: EnergyNode) => {
    setSelectedNode(node);
    toast.info(`Selected ${node.label}`);
  };

  const handleViewChange = (newView: 'live' | 'historic') => {
    setView(newView);
    if (newView === 'historic') {
      toast.info('Historical view selected. Data may be delayed.');
    }
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'solar':
        return <Sun className="h-6 w-6 text-yellow-500" />;
      case 'wind':
        return <Wind className="h-6 w-6 text-blue-500" />;
      case 'battery':
        return <Battery className="h-6 w-6 text-green-500" />;
      case 'grid':
        return <Zap className="h-6 w-6 text-purple-500" />;
      case 'load':
      case 'home':
        return <Home className="h-6 w-6 text-orange-500" />;
      default:
        return <Zap className="h-6 w-6 text-gray-500" />;
    }
  };

  // Return visualization
  return (
    <div className={`space-y-4 ${isFullscreen ? 'p-4 bg-background' : ''}`}>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Energy Flow Visualization</h2>
          <p className="text-muted-foreground text-sm">Real-time view of energy flow across all components</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchEnergyFlowData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={toggleFullscreen}>
            <Maximize2 className="h-4 w-4 mr-2" />
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </Button>
        </div>
      </div>
      
      <Tabs value={view} onValueChange={(v) => handleViewChange(v as 'live' | 'historic')} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="live">Live View</TabsTrigger>
          <TabsTrigger value="historic">Historical</TabsTrigger>
        </TabsList>
        
        <TabsContent value="live" className="space-y-4">
          {isLoading ? (
            <Card>
              <CardContent className="py-10">
                <LoadingSpinner text="Loading energy flow data..." />
              </CardContent>
            </Card>
          ) : error ? (
            <Card className="border-red-200">
              <CardContent className="py-6">
                <div className="flex flex-col items-center text-center">
                  <Info className="h-8 w-8 text-red-500 mb-2" />
                  <p className="mb-2 font-medium">Failed to load energy flow data</p>
                  <p className="text-muted-foreground text-sm mb-4">{error.message}</p>
                  <Button onClick={fetchEnergyFlowData}>Try Again</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Main visualization */}
              <Card className="lg:col-span-2 min-h-[400px]">
                <CardContent className="p-6">
                  <div className="flex justify-center items-center h-full text-center">
                    <p className="text-muted-foreground">
                      Energy flow visualization will be rendered here
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              {/* Selected component details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {selectedNode && getNodeIcon(selectedNode.deviceType)}
                    {selectedNode?.label || 'Component Details'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedNode ? (
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium mb-1">Status</p>
                        <div className={`px-2 py-1 rounded-full text-xs inline-flex items-center ${
                          selectedNode.status === 'active' ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                          selectedNode.status === 'warning' ? 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                          selectedNode.status === 'error' ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                          'bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
                        }`}>
                          <span className={`w-2 h-2 rounded-full mr-1.5 ${
                            selectedNode.status === 'active' ? 'bg-green-500' :
                            selectedNode.status === 'warning' ? 'bg-yellow-500' :
                            selectedNode.status === 'error' ? 'bg-red-500' :
                            'bg-gray-500'
                          }`}></span>
                          {selectedNode.status.charAt(0).toUpperCase() + selectedNode.status.slice(1)}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium mb-1">Current Power</p>
                        <p className="text-2xl font-semibold">{selectedNode.power.toFixed(1)} kW</p>
                      </div>
                      
                      {selectedNode.deviceType === 'battery' && (
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <p className="font-medium">Battery Level</p>
                            <p>{selectedNode.batteryLevel}%</p>
                          </div>
                          <Progress 
                            value={selectedNode.batteryLevel} 
                            className="h-3"
                            variant={
                              selectedNode.batteryLevel <= 20 ? 'danger' :
                              selectedNode.batteryLevel <= 40 ? 'warning' :
                              'success'
                            }
                          />
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="rounded-lg bg-muted/50 p-3">
                          <p className="text-xs text-muted-foreground mb-1">Type</p>
                          <p className="font-medium">{selectedNode.type.charAt(0).toUpperCase() + selectedNode.type.slice(1)}</p>
                        </div>
                        <div className="rounded-lg bg-muted/50 p-3">
                          <p className="text-xs text-muted-foreground mb-1">ID</p>
                          <p className="font-medium">{selectedNode.id}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">Select a component to view details</p>
                  )}
                </CardContent>
              </Card>
              
              {/* System metrics */}
              <Card className="lg:col-span-3">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Total Generation</p>
                      <p className="text-2xl font-semibold">{totalGeneration.toFixed(1)} kW</p>
                      <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                        <Zap className="h-4 w-4 mr-1" />
                        From all sources
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Total Consumption</p>
                      <p className="text-2xl font-semibold">{totalConsumption.toFixed(1)} kW</p>
                      <div className="flex items-center text-sm text-orange-600 dark:text-orange-400">
                        <Home className="h-4 w-4 mr-1" />
                        All devices
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Battery Status</p>
                      <p className="text-2xl font-semibold">{batteryPercentage}%</p>
                      <Progress 
                        value={batteryPercentage} 
                        className="h-2"
                        variant={
                          batteryPercentage <= 20 ? 'danger' :
                          batteryPercentage <= 40 ? 'warning' :
                          'success'
                        }
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Self-Consumption Rate</p>
                      <p className="text-2xl font-semibold">{selfConsumptionRate.toFixed(0)}%</p>
                      <Progress value={selfConsumptionRate} className="h-2" variant="success" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="historic">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <p className="text-lg font-medium mb-2">Historical Energy Flow</p>
                <p className="text-muted-foreground mb-6">
                  View energy flow patterns over time to identify trends and optimize your system
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <Button variant="outline" className={timeframe === 'day' ? 'bg-primary/10' : ''} onClick={() => setTimeframe('day')}>
                    Day
                  </Button>
                  <Button variant="outline" className={timeframe === 'week' ? 'bg-primary/10' : ''} onClick={() => setTimeframe('week')}>
                    Week
                  </Button>
                  <Button variant="outline" className={timeframe === 'month' ? 'bg-primary/10' : ''} onClick={() => setTimeframe('month')}>
                    Month
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedEnergyFlow;
