
import React from 'react';
import { useSiteContext } from '@/contexts/SiteContext';
import { Button } from '@/components/ui/button';
import { RefreshCw, Settings, Info, Clock, Calendar, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { formatDistanceToNow } from 'date-fns';

interface DashboardHeaderProps {
  title?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title }) => {
  const { activeSite, refreshSites, loading } = useSiteContext();
  const navigate = useNavigate();

  const handleRefresh = () => {
    refreshSites();
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  const lastUpdated = activeSite?.updated_at ? new Date(activeSite.updated_at) : new Date();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-6 mb-6 border-b border-gray-100 dark:border-gray-800/30">
      <div>
        <h1 className="text-2xl font-bold text-gridx-navy dark:text-white">
          {title || `Dashboard: ${activeSite?.name || 'Main Site'}`}
        </h1>
        <div className="flex items-center flex-wrap gap-2 mt-1">
          <p className="text-gridx-gray dark:text-gray-400 text-sm">
            Monitor and manage your energy system in real-time
          </p>
          <HoverCard>
            <HoverCardTrigger asChild>
              <Info size={14} className="text-gridx-gray/60 cursor-help" />
            </HoverCardTrigger>
            <HoverCardContent side="bottom" className="w-80 p-4 text-sm">
              <p>View your current energy production, consumption, and system status. All metrics update in real-time.</p>
            </HoverCardContent>
          </HoverCard>
          
          {activeSite && (
            <div className="flex items-center gap-3 ml-auto md:ml-0">
              {activeSite.location && (
                <div className="hidden md:flex items-center text-xs text-muted-foreground">
                  <MapPin size={12} className="mr-1" />
                  {activeSite.location}
                </div>
              )}
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock size={12} className="mr-1" />
                Updated {formatDistanceToNow(lastUpdated, { addSuffix: true })}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-2 mt-4 md:mt-0">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh} 
          className="border-gridx-blue/20 text-gridx-blue hover:bg-gridx-blue/5"
          disabled={loading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleSettings}
          className="border-gridx-blue/20 text-gridx-blue hover:bg-gridx-blue/5"
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
