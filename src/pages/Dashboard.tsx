
import React from 'react';
import { useAppStore } from '@/store/appStore';
import { SiteSelector } from '@/components/sites';
import { DashboardSummary } from '@/components/dashboard';
import { WeatherWidget } from '@/components/weather';
import { DateRange } from '@/types/site';

// Dashboard component with proper imports
const Dashboard = () => {
  const activeSite = useAppStore((state) => state.activeSite);
  
  // Create a proper DateRange object
  const dateRange: DateRange = { 
    from: new Date(), 
    to: new Date()
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-semibold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            {activeSite
              ? `Welcome to the ${activeSite.name} dashboard. Here's an overview of your site.`
              : 'Select a site to view its dashboard.'}
          </p>
        </div>
        <div className="w-full md:w-1/3 mt-4 md:mt-0">
          {/* Placeholder for SiteSelector - it would be provided real sites in a real app */}
          <SiteSelector 
            sites={[]}
            activeSite={activeSite}
            setActiveSite={() => {}}
            loading={false}
          />
        </div>
      </div>

      {activeSite ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Weather widget placeholder */}
          <div className="p-4 border border-gray-200 rounded-md md:col-span-3">
            <div className="font-medium">Weather data for site: {activeSite.id}</div>
            <div className="text-sm text-muted-foreground">Date range: {dateRange.from.toLocaleDateString()} - {dateRange.to.toLocaleDateString()}</div>
          </div>
          
          {/* Dashboard summary placeholder */}
          <div className="md:col-span-3">
            <DashboardSummary siteId={activeSite.id} />
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">Please select a site to view its dashboard.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
