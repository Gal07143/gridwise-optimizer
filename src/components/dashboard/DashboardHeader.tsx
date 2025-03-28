
import React, { useEffect, useState } from 'react';
import { Activity, Bell } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useSite } from '@/contexts/SiteContext';
import { useAlertSubscription } from '@/hooks/useAlertSubscription';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { AlertItem } from '@/components/microgrid/types';

interface DashboardHeaderProps {
  siteName?: string;
}

const DashboardHeader = ({ siteName }: DashboardHeaderProps) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const { currentSite } = useSite();

  // 🔁 Load unacknowledged alerts on first render
  useEffect(() => {
    // Mock logic to count alerts - in a real implementation, fetch from a data source
    const mockUnacknowledgedCount = 3;
    setUnreadCount(mockUnacknowledgedCount);
  }, []);

  // 🔴 Mock Live alert subscription
  useAlertSubscription((alert: AlertItem) => {
    toast.warning(`🔔 ${alert.title}`, {
      description: alert.message,
    });

    setUnreadCount((prev) => prev + 1);
  });

  const displayName = siteName || currentSite?.name || 'Main Dashboard';

  return (
    <Card className="p-6 mb-8 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 shadow-md">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{displayName}</h1>
          <p className="text-muted-foreground mt-1">
            Real-time monitoring and control of your energy system
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* 🔔 Bell icon with count */}
          <button
            className="relative focus:outline-none"
            onClick={() => navigate('/alerts')}
            aria-label="Go to alerts"
          >
            <Bell className="h-6 w-6 text-muted-foreground" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* System status */}
          <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg flex items-center">
            <Activity className="mr-2 h-5 w-5" />
            <span className="font-medium">System Status: Operational</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DashboardHeader;
