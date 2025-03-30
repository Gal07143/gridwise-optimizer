
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Grid3X3, Battery, ChevronRight, Zap, Calendar, Activity, AreaChart, ListChecks, Gauge, RefreshCw } from 'lucide-react';
import TelemetryPanel from './TelemetryPanel';
import AlertsFeed from './AlertsFeed';
import { useSiteContext } from '@/contexts/SiteContext';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// Function to fetch EMS overview data
const fetchEmsOverview = async () => {
  try {
    const response = await axios.get('/api/ems/overview');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch EMS overview:', error);
    // Return fallback data
    return {
      status: 'operational',
      batteryLevel: 78,
      batteryStatus: 'Discharging',
      powerFlow: 2.4,
      estimatedCapacity: 15.8,
      healthStatus: 'Excellent'
    };
  }
};

const EnergyManagementDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { activeSite, loading: siteLoading } = useSiteContext();
  const { toast } = useToast();

  const { data: emsData, isLoading, error, refetch } = useQuery({
    queryKey: ['ems-overview'],
    queryFn: fetchEmsOverview,
    refetchInterval: 30000, // Refresh every 30 seconds
    enabled: !!activeSite, // Only run query if site is selected
  });

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Refreshing Data",
      description: "Energy management data is being updated.",
    });
  };

  // Loading state when site context is loading or EMS data is loading
  if (siteLoading || (isLoading && !emsData)) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[150px] w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-[100px] w-full" />
          <Skeleton className="h-[100px] w-full" />
          <Skeleton className="h-[100px] w-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-[200px] w-full md:col-span-2" />
          <Skeleton className="h-[200px] w-full" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-[250px] w-full" />
          <Skeleton className="h-[250px] w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-3 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/30">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h2 className="text-2xl font-bold mb-2">Energy Management System</h2>
                <p className="text-muted-foreground max-w-2xl">
                  Monitor, analyze, and optimize your energy usage across all connected systems and devices.
                  View real-time data, track performance metrics, and receive intelligent recommendations.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Button onClick={() => navigate('/analytics')}>
                  View Analytics
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={() => navigate('/energy-optimization')}>
                  Optimize Energy Usage
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors" onClick={() => navigate('/analytics')}>
          <CardContent className="p-6 flex items-center">
            <div className="mr-4 h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <AreaChart className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h3 className="font-medium">Energy Analytics</h3>
              <p className="text-sm text-muted-foreground">Comprehensive analytics and insights</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors" onClick={() => navigate('/energy-optimization')}>
          <CardContent className="p-6 flex items-center">
            <div className="mr-4 h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Gauge className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <h3 className="font-medium">Energy Optimization</h3>
              <p className="text-sm text-muted-foreground">AI-powered energy efficiency</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors" onClick={() => navigate('/battery-management')}>
          <CardContent className="p-6 flex items-center">
            <div className="mr-4 h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Battery className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <h3 className="font-medium">Battery Management</h3>
              <p className="text-sm text-muted-foreground">Storage control and monitoring</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center">
              <Grid3X3 className="h-5 w-5 mr-2 text-blue-500" />
              Energy Subsystems
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={handleRefresh} className="h-8 w-8" title="Refresh data">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button variant="outline" className="justify-start h-auto py-3" onClick={() => navigate('/microgrid-control')}>
                <Zap className="h-5 w-5 mr-3 text-purple-500" />
                <div className="flex flex-col items-start">
                  <span>Microgrid Control</span>
                  <span className="text-xs text-muted-foreground">Manage energy flow and control systems</span>
                </div>
              </Button>
              
              <Button variant="outline" className="justify-start h-auto py-3" onClick={() => navigate('/reports')}>
                <Calendar className="h-5 w-5 mr-3 text-blue-500" />
                <div className="flex flex-col items-start">
                  <span>Energy Reports</span>
                  <span className="text-xs text-muted-foreground">Generate and schedule reports</span>
                </div>
              </Button>
              
              <Button variant="outline" className="justify-start h-auto py-3" onClick={() => navigate('/energy-flow')}>
                <Activity className="h-5 w-5 mr-3 text-green-500" />
                <div className="flex flex-col items-start">
                  <span>Energy Flow</span>
                  <span className="text-xs text-muted-foreground">Visualize power distribution</span>
                </div>
              </Button>
              
              <Button variant="outline" className="justify-start h-auto py-3" onClick={() => navigate('/devices')}>
                <ListChecks className="h-5 w-5 mr-3 text-amber-500" />
                <div className="flex flex-col items-start">
                  <span>Device Management</span>
                  <span className="text-xs text-muted-foreground">Control connected devices</span>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="md:col-span-1">
          <AlertsFeed limit={3} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TelemetryPanel />
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Battery className="h-5 w-5 mr-2 text-amber-500" />
              Storage Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Battery Charge Level</span>
                  <span className="text-sm font-medium">{emsData?.batteryLevel || 78}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div 
                    className="h-2 bg-green-500 rounded-full" 
                    style={{ width: `${emsData?.batteryLevel || 78}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Current Status</div>
                  <div className="font-medium text-blue-500">{emsData?.batteryStatus || 'Discharging'}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Power Flow</div>
                  <div className="font-medium">{emsData?.powerFlow || 2.4} kW</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Estimated Capacity</div>
                  <div className="font-medium">{emsData?.estimatedCapacity || 15.8} kWh</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Health Status</div>
                  <div className="font-medium text-green-500">{emsData?.healthStatus || 'Excellent'}</div>
                </div>
              </div>
              
              <Button variant="outline" className="w-full" onClick={() => navigate('/battery-management')}>
                View Battery Management
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
          <CardFooter className="text-xs text-muted-foreground pt-0">
            Last updated: {new Date().toLocaleTimeString()}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default EnergyManagementDashboard;
