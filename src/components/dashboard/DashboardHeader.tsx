
import React from 'react';
import { useSiteContext } from '@/contexts/SiteContext';
import { Button } from '@/components/ui/button';
import { RefreshCw, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardHeaderProps {
  title?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title }) => {
  const { activeSite, refreshSites } = useSiteContext();
  const navigate = useNavigate();

  const handleRefresh = () => {
    refreshSites();
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-4 gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {title || `Dashboard: ${activeSite?.name || 'Main Site'}`}
        </h1>
        <p className="text-muted-foreground">
          Monitor and manage your energy system in real-time
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
        <Button variant="outline" size="sm" onClick={handleSettings}>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
