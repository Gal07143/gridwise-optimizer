import React, { useEffect, useState } from 'react';
import { Main } from '@/components/ui/main';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/store/appStore';
import { EnergyFlowProvider } from '@/components/dashboard/energy-flow/EnergyFlowContext';
import HighTechEnergyFlow from '@/components/energy/HighTechEnergyFlow';
import { Button } from '@/components/ui/button';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  Battery, 
  CalendarDays, 
  ChevronsRight, 
  CircleDollarSign, 
  Clock,
  Download,
  Gauge,
  Home, 
  LineChart,
  RefreshCw, 
  Share2, 
  Sun, 
  Zap,
  Loader2
} from 'lucide-react';
import ErrorBoundary from '@/components/ErrorBoundary';
import { DashboardData } from '@/types/settings';
import { supabaseService } from '@/services/supabaseService';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { setDashboardView, currentSite } = useAppStore();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  
  useEffect(() => {
    setDashboardView('energy');
  }, [setDashboardView]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        if (!user?.id) {
          throw new Error('User not authenticated');
        }
        const data = await supabaseService.getDashboardData(user.id);
        if (data) {
          setDashboardData({
            gridSupply: data.grid_supply,
            pvProduction: data.pv_production,
            battery: data.battery,
            household: data.household,
            energyFlow: data.energy_flow
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      fetchDashboardData();
    }
  }, [user?.id]);

  if (isLoading) {
    return (
      <Main>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Main>
    );
  }

  if (error) {
    return (
      <Main>
        <div className="text-red-500 p-4">
          {error}
        </div>
      </Main>
    );
  }

  if (!dashboardData) {
    return (
      <Main>
        <div className="text-gray-500 p-4">
          No data available
        </div>
      </Main>
    );
  }

  return (
    <ErrorBoundary>
      <EnergyFlowProvider>
        <Main>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Energy Dashboard</h1>
              <p className="text-slate-600 dark:text-slate-400">
                {currentSite?.name || 'Main Site'} overview and real-time energy monitoring
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Share2 className="h-4 w-4" /> Share
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Download className="h-4 w-4" /> Export
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <RefreshCw className="h-4 w-4" /> Refresh
              </Button>
            </div>
          </div>
          
          {/* System Overview Tiles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800/30">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Grid Supply</p>
                  <h3 className="text-2xl font-bold">{dashboardData.gridSupply.power} kW</h3>
                  <p className="text-xs text-blue-500 dark:text-blue-400 flex items-center">
                    <ArrowDownToLine className="h-3 w-3 mr-1" /> 
                    {dashboardData.gridSupply.status === 'importing' ? 'Importing from grid' : 
                     dashboardData.gridSupply.status === 'exporting' ? 'Exporting to grid' : 'Neutral'}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-200 dark:bg-blue-700/30 flex items-center justify-center">
                  <Zap className="text-blue-600 dark:text-blue-300" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-800/30">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">PV Production</p>
                  <h3 className="text-2xl font-bold">{dashboardData.pvProduction.power} kW</h3>
                  <p className="text-xs text-yellow-500 dark:text-yellow-400 flex items-center">
                    <ArrowUpFromLine className="h-3 w-3 mr-1" /> {dashboardData.pvProduction.capacity}% capacity
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-yellow-200 dark:bg-yellow-700/30 flex items-center justify-center">
                  <Sun className="text-yellow-600 dark:text-yellow-300" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800/30">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Battery Level</p>
                  <h3 className="text-2xl font-bold">{dashboardData.battery.level}%</h3>
                  <p className="text-xs text-purple-500 dark:text-purple-400 flex items-center">
                    <ArrowUpFromLine className="h-3 w-3 mr-1" /> 
                    {dashboardData.battery.status === 'charging' ? 'Charging' : 
                     dashboardData.battery.status === 'discharging' ? 'Discharging' : 'Idle'} at {dashboardData.battery.power} kW
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-purple-200 dark:bg-purple-700/30 flex items-center justify-center">
                  <Battery className="text-purple-600 dark:text-purple-300" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800/30">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium">Household</p>
                  <h3 className="text-2xl font-bold">{dashboardData.household.consumption} kW</h3>
                  <p className="text-xs text-green-500 dark:text-green-400 flex items-center">
                    <ArrowDownToLine className="h-3 w-3 mr-1" /> Current consumption
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-green-200 dark:bg-green-700/30 flex items-center justify-center">
                  <Home className="text-green-600 dark:text-green-300" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Middle Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Energy Flow Diagram */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">
                    <div className="flex items-center gap-2">
                      <Gauge className="h-5 w-5 text-blue-500" />
                      Total Energy Management
                    </div>
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="flex items-center text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      Live view
                    </span>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 rounded-md">
                    <HighTechEnergyFlow 
                      siteId={currentSite?.id}
                      title="Live Energy Flow"
                      subtitle="Real-time power distribution"
                      variant="detailed"
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="flex flex-col items-center p-3 rounded-md bg-blue-50 dark:bg-blue-900/20">
                      <div className="text-blue-600 dark:text-blue-400 text-sm font-medium">Total Energy Today</div>
                      <div className="text-2xl font-bold">{dashboardData.energyFlow.totalEnergy} kWh</div>
                    </div>
                    <div className="flex flex-col items-center p-3 rounded-md bg-green-50 dark:bg-green-900/20">
                      <div className="text-green-600 dark:text-green-400 text-sm font-medium">Self-Consumption</div>
                      <div className="text-2xl font-bold">{dashboardData.energyFlow.selfConsumption}%</div>
                    </div>
                    <div className="flex flex-col items-center p-3 rounded-md bg-purple-50 dark:bg-purple-900/20">
                      <div className="text-purple-600 dark:text-purple-400 text-sm font-medium">Peak Demand</div>
                      <div className="text-2xl font-bold">{dashboardData.energyFlow.peakDemand} kW</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Main>
      </EnergyFlowProvider>
    </ErrorBoundary>
  );
};

export default Dashboard;
