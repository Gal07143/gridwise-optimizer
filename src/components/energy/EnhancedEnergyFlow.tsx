
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Battery, Sun, Wind, Home, Zap, ArrowRight, Info, 
  RefreshCcw, Download, BarChart2, Maximize2, Calendar, Clock
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useSiteContext } from '@/contexts/SiteContext';
import { toast } from 'sonner';

interface EnhancedEnergyFlowProps {
  siteId?: string;
}

// Energy flow node with power values
interface EnergyNode {
  id: string;
  name: string;
  type: 'solar' | 'battery' | 'grid' | 'home' | 'wind' | 'ev';
  power: number;
  status: 'active' | 'inactive' | 'charging' | 'discharging' | 'exporting' | 'importing';
  details?: Record<string, any>;
}

// Connection between nodes
interface EnergyFlow {
  source: string;
  target: string;
  power: number;
  color: string;
  active: boolean;
}

const EnhancedEnergyFlow: React.FC<EnhancedEnergyFlowProps> = ({ siteId }) => {
  const { activeSite } = useSiteContext();
  const [view, setView] = useState<'live' | 'historical'>('live');
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month'>('day');
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Sample data - in a real app, this would come from your backend/API
  const [energyNodes, setEnergyNodes] = useState<EnergyNode[]>([
    { id: 'solar', name: 'Solar', type: 'solar', power: 4.2, status: 'active' },
    { id: 'battery', name: 'Battery', type: 'battery', power: 2.4, status: 'charging' },
    { id: 'grid', name: 'Grid', type: 'grid', power: 0, status: 'inactive' },
    { id: 'home', name: 'Home', type: 'home', power: 1.8, status: 'active' },
  ]);
  
  const [energyFlows, setEnergyFlows] = useState<EnergyFlow[]>([
    { source: 'solar', target: 'home', power: 1.8, color: 'text-green-500', active: true },
    { source: 'solar', target: 'battery', power: 2.4, color: 'text-amber-500', active: true },
    { source: 'battery', target: 'grid', power: 0, color: 'text-blue-500', active: false },
    { source: 'grid', target: 'home', power: 0, color: 'text-blue-500', active: false },
  ]);
  
  const [totalGeneration, setTotalGeneration] = useState(4.2);
  const [totalConsumption, setTotalConsumption] = useState(1.8);
  const [batteryPercentage, setbatteryPercentage] = useState(62);
  
  const fetchLiveData = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // In a real app, this would be a call to your Supabase backend or API
      const updatedSolar = 4.2 + (Math.random() * 0.6 - 0.3);
      const updatedHome = 1.8 + (Math.random() * 0.4 - 0.2);
      const updatedBattery = Math.max(0, updatedSolar - updatedHome);
      
      // Update nodes
      setEnergyNodes(prev => prev.map(node => {
        if (node.id === 'solar') return { ...node, power: parseFloat(updatedSolar.toFixed(1)) };
        if (node.id === 'home') return { ...node, power: parseFloat(updatedHome.toFixed(1)) };
        if (node.id === 'battery') return { ...node, power: parseFloat(updatedBattery.toFixed(1)) };
        return node;
      }));
      
      // Update flows
      setEnergyFlows(prev => prev.map(flow => {
        if (flow.source === 'solar' && flow.target === 'home') {
          return { ...flow, power: parseFloat(updatedHome.toFixed(1)) };
        }
        if (flow.source === 'solar' && flow.target === 'battery') {
          return { ...flow, power: parseFloat(updatedBattery.toFixed(1)) };
        }
        return flow;
      }));
      
      setTotalGeneration(parseFloat(updatedSolar.toFixed(1)));
      setTotalConsumption(parseFloat(updatedHome.toFixed(1)));
      setbatteryPercentage(prev => {
        const newValue = prev + (updatedBattery > 0 ? 1 : -0.5);
        return Math.min(100, Math.max(0, newValue));
      });
      
      setIsLoading(false);
      toast.success("Energy flow data updated");
    }, 1000);
  };
  
  useEffect(() => {
    fetchLiveData();
    
    // Set up polling for live data
    if (view === 'live') {
      const interval = setInterval(fetchLiveData, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, [view]);
  
  const toggleFullscreen = () => {
    const element = document.getElementById('energy-flow-container');
    
    if (!isFullscreen) {
      if (element?.requestFullscreen) {
        element.requestFullscreen().catch(err => {
          toast.error("Could not enable fullscreen mode");
        });
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(err => {
          toast.error("Could not exit fullscreen mode");
        });
      }
    }
    
    setIsFullscreen(!isFullscreen);
  };
  
  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);
  
  const renderNodeIcon = (type: EnergyNode['type']) => {
    switch (type) {
      case 'solar':
        return <Sun className="h-6 w-6 text-yellow-500" />;
      case 'battery':
        return <Battery className="h-6 w-6 text-green-500" />;
      case 'grid':
        return <Zap className="h-6 w-6 text-blue-500" />;
      case 'home':
        return <Home className="h-6 w-6 text-indigo-500" />;
      case 'wind':
        return <Wind className="h-6 w-6 text-cyan-500" />;
      case 'ev':
        return <Zap className="h-6 w-6 text-purple-500" />;
      default:
        return <Info className="h-6 w-6" />;
    }
  };
  
  const renderNodeStatus = (node: EnergyNode) => {
    switch (node.status) {
      case 'active':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">Active</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800">Inactive</Badge>;
      case 'charging':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800">Charging</Badge>;
      case 'discharging':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">Discharging</Badge>;
      case 'exporting':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">Exporting</Badge>;
      case 'importing':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800">Importing</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <Card className="shadow-md h-full" id="energy-flow-container">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Energy Flow</CardTitle>
        <div className="flex items-center gap-2">
          <Tabs value={view} onValueChange={(v) => setView(v as 'live' | 'historical')}>
            <TabsList className="h-8">
              <TabsTrigger value="live" className="text-xs px-3 h-7">Live</TabsTrigger>
              <TabsTrigger value="historical" className="text-xs px-3 h-7">Historical</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button variant="outline" size="sm" onClick={toggleFullscreen} className="ml-auto">
            <Maximize2 className="h-4 w-4 mr-1" />
            {isFullscreen ? "Exit" : "Fullscreen"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {view === 'live' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg text-center">
                <h3 className="text-sm text-muted-foreground mb-1">Total Generation</h3>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{totalGeneration} kW</p>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg text-center">
                <h3 className="text-sm text-muted-foreground mb-1">Total Consumption</h3>
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{totalConsumption} kW</p>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg text-center">
                <h3 className="text-sm text-muted-foreground mb-1">Battery</h3>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{batteryPercentage}%</p>
                <Progress 
                  value={batteryPercentage} 
                  className="h-2 mt-2" 
                  indicatorClassName={batteryPercentage > 80 ? "bg-green-500" : batteryPercentage > 20 ? "bg-amber-500" : "bg-red-500"}
                />
              </div>
            </div>
            
            <div className="relative py-6 mb-4">
              <div className="grid grid-cols-2 gap-8 md:gap-16">
                {/* Generation side */}
                <div className="flex flex-col space-y-6 items-center">
                  {energyNodes.filter(node => ['solar', 'wind', 'grid'].includes(node.id)).map(node => (
                    <div key={node.id} className="relative p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md w-full max-w-xs text-center flex flex-col items-center gap-2">
                      {renderNodeIcon(node.type)}
                      <h3 className="font-medium">{node.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold">{node.power} kW</span>
                        {renderNodeStatus(node)}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Consumption side */}
                <div className="flex flex-col space-y-6 items-center">
                  {energyNodes.filter(node => ['battery', 'home', 'ev'].includes(node.id)).map(node => (
                    <div key={node.id} className="relative p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md w-full max-w-xs text-center flex flex-col items-center gap-2">
                      {renderNodeIcon(node.type)}
                      <h3 className="font-medium">{node.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold">{node.power} kW</span>
                        {renderNodeStatus(node)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Flow arrows - simplified representation */}
              <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 pointer-events-none">
                {energyFlows.filter(flow => flow.active).map((flow, index) => (
                  <div 
                    key={`${flow.source}-${flow.target}`} 
                    className={`absolute h-0.5 ${flow.color} animate-pulse`}
                    style={{
                      top: `${index * 20}%`,
                      left: '45%',
                      width: '10%',
                      height: '2px'
                    }}
                  >
                    <ArrowRight 
                      className={`absolute right-0 top-1/2 -translate-y-1/2 ${flow.color}`} 
                      size={16}
                    />
                    <span className="absolute left-1/2 -translate-x-1/2 -top-5 text-xs font-medium">
                      {flow.power} kW
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-6 pt-2 border-t">
              <div className="text-xs text-muted-foreground flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                <span>Last updated: {new Date().toLocaleTimeString()}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchLiveData} 
                disabled={isLoading}
              >
                <RefreshCcw className={`h-3.5 w-3.5 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <Select value={timeframe} onValueChange={(value) => setTimeframe(value as 'day' | 'week' | 'month')}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Past 24 Hours</SelectItem>
                  <SelectItem value="week">Past Week</SelectItem>
                  <SelectItem value="month">Past Month</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
            
            <div className="h-[300px] flex items-center justify-center bg-slate-50 dark:bg-slate-900/50 rounded-lg">
              <div className="text-center">
                <BarChart2 className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Energy flow history will be displayed here</p>
                <p className="text-xs text-muted-foreground mt-1">Data visualization will include flow patterns over time</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedEnergyFlow;
