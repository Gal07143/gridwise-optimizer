
import React from 'react';
import { useSiteContext } from '@/contexts/SiteContext';
import { Button } from '@/components/ui/button';
import { RefreshCw, Settings, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

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
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-6 mb-4 border-b border-gray-100 dark:border-gray-800">
      <div>
        <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          {title || `Dashboard: ${activeSite?.name || 'Main Site'}`}
        </h1>
        <div className="flex items-center gap-2">
          <p className="text-muted-foreground text-sm">
            Monitor and manage your energy system in real-time
          </p>
          <HoverCard>
            <HoverCardTrigger asChild>
              <Info size={14} className="text-muted-foreground/60 cursor-help" />
            </HoverCardTrigger>
            <HoverCardContent side="bottom" className="w-80 p-4 text-sm">
              <p>View your current energy production, consumption, and system status. All metrics update in real-time.</p>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>
      <div className="flex gap-2 mt-4 md:mt-0">
        <Button variant="outline" size="sm" onClick={handleRefresh} className="glass-button">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
        <Button variant="outline" size="sm" onClick={handleSettings} className="glass-button">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
