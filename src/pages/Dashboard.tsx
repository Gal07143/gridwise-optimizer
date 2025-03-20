
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSite } from '@/contexts/SiteContext';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/components/layout/AppLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSummary from '@/components/dashboard/DashboardSummary';
import DashboardCharts from '@/components/dashboard/DashboardCharts';
import DashboardLoading from '@/components/dashboard/DashboardLoading';
import ErrorBoundary from '@/components/ui/ErrorBoundary';

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
    return <DashboardLoading />;
  }

  return (
    <AppLayout>
      <ErrorBoundary>
        <div className="animate-in fade-in duration-500">
          <DashboardHeader siteName={currentSite.name} />
          <DashboardSummary />
          <DashboardCharts />
        </div>
      </ErrorBoundary>
    </AppLayout>
  );
};

export default Dashboard;
