
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap } from 'lucide-react';

import MetricsCard from '@/components/dashboard/MetricsCard';
import StatusOverview from '@/components/dashboard/StatusOverview';
import LiveChart from '@/components/dashboard/LiveChart';
import EnergyForecastCard from '@/components/dashboard/EnergyForecastCard';
import EnergyFlowChart from '@/components/dashboard/EnergyFlowChart';
import PowerQualityCard from '@/components/dashboard/PowerQualityCard';
import AdvancedBatteryCard from '@/components/dashboard/AdvancedBatteryCard';
import { useSite } from '@/contexts/SiteContext';
import { useToast } from '@/hooks/use-toast';

// Define interfaces for components that are missing them
interface StatusOverviewProps {
  animationDelay?: string;
  className?: string;
}

// We don't need to redefine these interfaces as they're now properly defined in their respective files
// LiveChartProps, EnergyForecastCardProps, EnergyFlowChartProps are already defined in their components

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
        <div className="text-center">
          <Zap className="mx-auto h-12 w-12 text-primary animate-pulse" />
          <h3 className="mt-2 text-2xl font-semibold">Loading Dashboard</h3>
          <p className="text-muted-foreground">Please wait while we load your site data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 animate-in fade-in duration-500 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{currentSite.name} Dashboard</h1>
        <p className="text-muted-foreground">
          Real-time monitoring and control of your energy system
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <MetricsCard 
          title="Current Power Flow"
          value={42.8}
          unit="kW"
          changeValue={8.2}
          changeType="increase"
          description="Current power flow in the system"
          animationDelay="0ms"
        />
        <MetricsCard 
          title="Today's Generation" 
          value={215.6}
          unit="kWh"
          changeValue={24.3}
          changeType="increase"
          description="Energy generated today"
          animationDelay="100ms"
        />
        <MetricsCard 
          title="Battery Storage"
          value={68}
          unit="%"
          changeValue={3.5}
          changeType="decrease"
          description="Current battery storage level"
          animationDelay="200ms"
        />
      </div>

      {/* System Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <StatusOverview animationDelay="300ms" />
        </div>
        <div>
          <LiveChart animationDelay="400ms" />
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <EnergyForecastCard animationDelay="500ms" />
        <PowerQualityCard animationDelay="600ms" />
      </div>

      {/* Energy Flow Visualization */}
      <div className="mb-6">
        <EnergyFlowChart animationDelay="700ms" />
      </div>

      {/* Detailed Battery Card */}
      <div>
        <AdvancedBatteryCard animationDelay="800ms" />
      </div>
    </div>
  );
};

export default Dashboard;
