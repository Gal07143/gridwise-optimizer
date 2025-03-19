
import React from 'react';
import { Server, Activity, CheckCircle } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

const SystemStatus = () => {
  return (
    <AppLayout>
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-1">System Status</h1>
          <p className="text-muted-foreground">Monitor the operational status of all system components</p>
        </div>
        
        <div className="max-w-4xl mx-auto text-center py-12">
          <Server className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold mb-4">System Status Coming Soon</h2>
          <p className="text-muted-foreground mb-6">
            We're currently building out our system status monitoring tools. Check back soon for 
            detailed component status, health metrics, and system analytics.
          </p>
          <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900 max-w-md mx-auto">
            <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-400">
              <CheckCircle />
              <span className="font-medium">All Systems Operational</span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default SystemStatus;
