
import React, { useState, useEffect } from 'react';
import { Shield, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import StatusItem, { SystemStatus } from './StatusItem';
import StatusSkeleton from './StatusSkeleton';

interface StatusOverviewProps {
  className?: string;
  animationDelay?: string;
}

const StatusOverview = ({ className, animationDelay }: StatusOverviewProps = {}) => {
  const [statuses, setStatuses] = useState<SystemStatus[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const fetchSystemStatus = async () => {
    try {
      setLoading(true);
      // Fetch system status from database
      const { data, error } = await supabase
        .from('system_status')
        .select('*')
        .order('category', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        setStatuses(data.map(item => ({
          category: item.category,
          status: item.status,
          lastUpdated: new Date(item.updated_at).toLocaleString(),
          details: item.details
        })));
      } else {
        // Fallback to default statuses if no data
        setStatuses([
          { 
            category: 'Microgrid Controller', 
            status: 'operational', 
            lastUpdated: '2 minutes ago',
            details: 'All systems operational'
          },
          { 
            category: 'Energy Storage', 
            status: 'operational', 
            lastUpdated: '5 minutes ago',
            details: 'Battery at 68% capacity'
          },
          { 
            category: 'Solar Production', 
            status: 'operational', 
            lastUpdated: '2 minutes ago',
            details: 'Producing at 92% efficiency'
          },
          { 
            category: 'Grid Connection', 
            status: 'maintenance', 
            lastUpdated: '15 minutes ago',
            details: 'Scheduled maintenance in progress'
          },
          { 
            category: 'EV Charging', 
            status: 'operational', 
            lastUpdated: '3 minutes ago',
            details: '3/5 charging stations in use'
          },
          { 
            category: 'Building Distribution', 
            status: 'operational', 
            lastUpdated: '7 minutes ago',
            details: 'All circuits normal'
          }
        ]);
      }
    } catch (err) {
      console.error('Error fetching system status:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch status on mount
  useEffect(() => {
    fetchSystemStatus();
    
    // Set up subscription for real-time updates
    const subscription = supabase
      .channel('system_status_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'system_status' 
      }, () => {
        fetchSystemStatus();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchSystemStatus();
    setRefreshing(false);
    toast.success('System status refreshed');
  };
  
  return (
    <div 
      className={cn("w-full", className)} 
      style={animationDelay ? { animationDelay } : undefined}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Shield size={18} className="mr-2 text-primary" />
          <h3 className="font-medium">System Status</h3>
        </div>
        <button 
          onClick={handleRefresh}
          className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          disabled={refreshing || loading}
        >
          <RefreshCw size={16} className={`text-slate-500 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      {loading ? (
        <StatusSkeleton />
      ) : (
        <div className="space-y-3 staggered-fade-in">
          {statuses.map((item, index) => (
            <StatusItem key={index} status={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default StatusOverview;
