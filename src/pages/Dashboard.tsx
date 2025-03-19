
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSite } from '@/contexts/SiteContext';
import { useToast } from '@/hooks/use-toast';
import Sidebar from '@/components/layout/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSummary from '@/components/dashboard/DashboardSummary';
import DashboardCharts from '@/components/dashboard/DashboardCharts';
import DashboardLoading from '@/components/dashboard/DashboardLoading';

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
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-4 ml-0 lg:ml-64 transition-all duration-300">
        <div className="container mx-auto animate-in fade-in duration-500">
          <DashboardHeader siteName={currentSite.name} />
          <DashboardSummary />
          <DashboardCharts />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
