
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Battery, Sun, Wind, Grid, Activity } from 'lucide-react';

import MetricsCard from '@/components/dashboard/MetricsCard';
import StatusOverview from '@/components/dashboard/StatusOverview';
import LiveChart from '@/components/dashboard/LiveChart';
import EnergyForecastCard from '@/components/dashboard/EnergyForecastCard';
import EnergyFlowChart from '@/components/dashboard/EnergyFlowChart';
import PowerQualityCard from '@/components/dashboard/PowerQualityCard';
import AdvancedBatteryCard from '@/components/dashboard/AdvancedBatteryCard';
import { useSite } from '@/contexts/SiteContext';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';

// Define interfaces for components that are missing them
interface StatusOverviewProps {
  animationDelay?: string;
  className?: string;
}

// Ensure LiveChart has animationDelay prop
interface LiveChartProps {
  data?: { time: string; value: number }[];
  title?: string;
  color?: string;
  type?: 'line' | 'area';
  height?: number;
  yAxisLabel?: string;
  strokeWidth?: number;
  hideGrid?: boolean;
  hideAxis?: boolean;
  gradientFrom?: string;
  gradientTo?: string;
  animated?: boolean;
  className?: string;
  animationDelay?: string;
}

// Ensure EnergyForecastCard has animationDelay prop
interface EnergyForecastCardProps {
  className?: string;
  animationDelay?: string;
}

// Ensure EnergyFlowChart has animationDelay prop
interface EnergyFlowChartProps {
  className?: string;
  animationDelay?: string;
}

// Ensure PowerQualityCard has animationDelay prop
interface PowerQualityCardProps {
  frequency?: number;
  voltage?: number;
  powerFactor?: number;
  thd?: number;
  className?: string;
  animationDelay?: string;
}

// Ensure AdvancedBatteryCard has animationDelay prop
interface AdvancedBatteryCardProps {
  stateOfCharge?: number;
  stateOfHealth?: number;
  temperature?: number;
  cycleCount?: number;
  className?: string;
  animationDelay?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentSite } = useSite();

  useEffect(() => {
    if (!currentSite) {
      toast({
        title: "No site selected",
        description: "Please select or create a site to view the dashboard",
      });
      navigate("/settings/sites");
    }
  }, [currentSite, navigate, toast]);

  // Handle the case where we don't have a site yet
  if (!currentSite) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="glass-panel p-8 max-w-md text-center">
          <Zap className="mx-auto h-12 w-12 text-primary animate-pulse" />
          <h3 className="mt-4 text-2xl font-semibold">Loading Dashboard</h3>
          <p className="mt-2 text-muted-foreground">Please wait while we load your site data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
      <Card className="p-6 mb-8 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{currentSite.name} Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Real-time monitoring and control of your energy system
            </p>
          </div>
          <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg flex items-center">
            <Activity className="mr-2 h-5 w-5" />
            <span className="font-medium">System Status: Operational</span>
          </div>
        </div>
      </Card>

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricsCard 
          title="Current Power Flow"
          value={42.8}
          unit="kW"
          changeValue={8.2}
          changeType="increase"
          description="Current system power flow"
          icon={<Zap className="h-5 w-5" />}
          animationDelay="0ms"
          className="shadow-md"
        />
        <MetricsCard 
          title="Solar Generation" 
          value={215.6}
          unit="kWh"
          changeValue={24.3}
          changeType="increase"
          description="Energy generated today"
          icon={<Sun className="h-5 w-5" />}
          animationDelay="100ms"
          className="shadow-md"
        />
        <MetricsCard 
          title="Wind Generation" 
          value={118.3}
          unit="kWh"
          changeValue={12.5}
          changeType="increase"
          description="Wind power today"
          icon={<Wind className="h-5 w-5" />}
          animationDelay="150ms"
          className="shadow-md"
        />
        <MetricsCard 
          title="Battery Storage"
          value={68}
          unit="%"
          changeValue={3.5}
          changeType="decrease"
          description="Current battery level"
          icon={<Battery className="h-5 w-5" />}
          animationDelay="200ms"
          className="shadow-md"
        />
      </div>

      {/* System Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 glass-panel shadow-md p-4 rounded-xl">
          <StatusOverview animationDelay="300ms" />
        </div>
        <div className="glass-panel shadow-md p-4 rounded-xl">
          <h3 className="text-lg font-medium mb-3">Power Trend (24h)</h3>
          <LiveChart 
            animationDelay="400ms" 
            type="area" 
            gradientFrom="rgba(14, 165, 233, 0.5)" 
            gradientTo="rgba(14, 165, 233, 0.0)"
            color="var(--color-primary)"
          />
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="glass-panel shadow-md p-4 rounded-xl">
          <EnergyForecastCard animationDelay="500ms" />
        </div>
        <div className="glass-panel shadow-md p-4 rounded-xl">
          <PowerQualityCard animationDelay="600ms" />
        </div>
      </div>

      {/* Energy Flow Visualization */}
      <div className="glass-panel shadow-md p-4 rounded-xl mb-8">
        <h3 className="text-lg font-medium mb-3">Energy Flow Diagram</h3>
        <EnergyFlowChart animationDelay="700ms" />
      </div>

      {/* Detailed Battery Card */}
      <div className="glass-panel shadow-md p-4 rounded-xl">
        <AdvancedBatteryCard animationDelay="800ms" />
      </div>
    </div>
  );
};

export default Dashboard;
