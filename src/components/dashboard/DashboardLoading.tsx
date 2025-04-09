
import React from 'react';
import { Zap } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

const DashboardLoading: React.FC = () => {
  return (
    <AppLayout>
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="glass-panel p-8 max-w-md text-center">
          <Zap className="mx-auto h-12 w-12 text-primary animate-pulse" />
          <h3 className="mt-4 text-2xl font-semibold">Loading Dashboard</h3>
          <p className="mt-2 text-muted-foreground">Please wait while we load your site data...</p>
        </div>
      </div>
    </AppLayout>
  );
};

export default DashboardLoading;
