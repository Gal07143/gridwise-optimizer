import React from 'react';
import { SiteSelector } from '@/components/sites';
import { DashboardSummary } from '@/components/dashboard';
import { useAppStore } from '@/store/appStore';
import { WeatherWidget } from '@/components/weather';
import { DateRange } from '@/types/site';

const Dashboard = () => {
  const activeSite = useAppStore((state) => state.activeSite);

  // Change this code:
  // const dateRange = new Date();
  
  // To this:
  const dateRange = { from: new Date(), to: new Date() };

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
          <SiteSelector />
        </div>
      </div>

      {activeSite ? (
        <>
          <WeatherWidget siteId={activeSite.id} dateRange={dateRange as DateRange} />
          <DashboardSummary />
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">Please select a site to view its dashboard.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
