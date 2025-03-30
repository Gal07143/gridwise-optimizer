
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import StatusOverview from '@/components/dashboard/StatusOverview';
import LiveChart from '@/components/dashboard/LiveChart';
import EnergyForecastCard from '@/components/dashboard/EnergyForecastCard';
import EnergyFlowChart from '@/components/dashboard/EnergyFlowChart';
import PowerQualityCard from '@/components/dashboard/PowerQualityCard';
import AdvancedBatteryCard from '@/components/dashboard/AdvancedBatteryCard';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ExclamationTriangleIcon, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from 'axios';

// Sample data for the power trend chart
const powerTrendData = [
  { time: '00:00', value: 2.5 },
  { time: '04:00', value: 1.8 },
  { time: '08:00', value: 4.2 },
  { time: '12:00', value: 6.5 },
  { time: '16:00', value: 5.3 },
  { time: '20:00', value: 3.2 },
  { time: '24:00', value: 2.8 },
];

// Function to fetch dashboard data
const fetchDashboardData = async () => {
  try {
    const res = await axios.get('/api/dashboard');
    return res.data;
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    // Return fallback data to prevent UI errors
    return {
      powerTrend: powerTrendData,
      systemStatus: 'operational'
    };
  }
};

const DashboardCharts = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboard-data'],
    queryFn: fetchDashboardData,
    refetchInterval: 30000, // Refresh every 30 seconds
    refetchOnWindowFocus: true,
  });

  // Loading state
  if (isLoading) {
    return (
      <>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <Skeleton className="h-[300px] w-full" />
          </div>
          <div>
            <Skeleton className="h-[300px] w-full" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Skeleton className="h-[250px] w-full" />
          <Skeleton className="h-[250px] w-full" />
        </div>
        <Skeleton className="h-[300px] w-full mb-8" />
        <Skeleton className="h-[300px] w-full" />
      </>
    );
  }

  // Error state with retry button
  if (error) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>Error Loading Dashboard</AlertTitle>
          <AlertDescription>
            Failed to load dashboard data. Please try again later.
          </AlertDescription>
        </Alert>
        <div className="flex justify-center">
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Get the data to use - either from API or fallback
  const powerTrendToUse = data?.powerTrend || powerTrendData;
  
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white dark:bg-gridx-dark-gray/90 shadow-sm p-6 rounded-xl border border-gray-100 dark:border-gray-700/30">
          <h3 className="text-base font-medium mb-4 text-gridx-navy dark:text-white">System Status Overview</h3>
          <StatusOverview animationDelay="300ms" />
        </div>
        <div className="bg-white dark:bg-gridx-dark-gray/90 shadow-sm p-6 rounded-xl border border-gray-100 dark:border-gray-700/30">
          <h3 className="text-base font-medium mb-4 text-gridx-navy dark:text-white">Power Trend (24h)</h3>
          <LiveChart 
            data={powerTrendToUse}
            animationDelay="400ms" 
            type="area" 
            gradientFrom="rgba(45, 78, 245, 0.4)" 
            gradientTo="rgba(45, 78, 245, 0.0)"
            color="#2D4EF5"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gridx-dark-gray/90 shadow-sm p-6 rounded-xl border border-gray-100 dark:border-gray-700/30">
          <h3 className="text-base font-medium mb-4 text-gridx-navy dark:text-white">Energy Forecast</h3>
          <EnergyForecastCard animationDelay="500ms" />
        </div>
        <div className="bg-white dark:bg-gridx-dark-gray/90 shadow-sm p-6 rounded-xl border border-gray-100 dark:border-gray-700/30">
          <h3 className="text-base font-medium mb-4 text-gridx-navy dark:text-white">Power Quality</h3>
          <PowerQualityCard animationDelay="600ms" />
        </div>
      </div>

      <div className="bg-white dark:bg-gridx-dark-gray/90 shadow-sm p-6 rounded-xl border border-gray-100 dark:border-gray-700/30 mb-8">
        <h3 className="text-base font-medium mb-4 text-gridx-navy dark:text-white">Energy Flow Diagram</h3>
        <EnergyFlowChart animationDelay="700ms" />
      </div>

      <div className="bg-white dark:bg-gridx-dark-gray/90 shadow-sm p-6 rounded-xl border border-gray-100 dark:border-gray-700/30">
        <h3 className="text-base font-medium mb-4 text-gridx-navy dark:text-white">Battery System</h3>
        <AdvancedBatteryCard animationDelay="800ms" />
      </div>
    </>
  );
};

export default DashboardCharts;
