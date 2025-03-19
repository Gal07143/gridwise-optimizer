
import React from 'react';
import { Zap } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';

const DashboardLoading = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-4 ml-0 lg:ml-64 transition-all duration-300">
        <div className="flex items-center justify-center h-screen">
          <div className="glass-panel p-8 max-w-md text-center">
            <Zap className="mx-auto h-12 w-12 text-primary animate-pulse" />
            <h3 className="mt-4 text-2xl font-semibold">Loading Dashboard</h3>
            <p className="mt-2 text-muted-foreground">Please wait while we load your site data...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLoading;
