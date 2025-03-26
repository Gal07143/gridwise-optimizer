
import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SystemStatus {
  category: string;
  status: 'operational' | 'maintenance' | 'issue' | 'critical';
  lastUpdated: string;
  details?: string;
}

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
  
  const getStatusIcon = (status: SystemStatus['status']) => {
    switch (status) {
      case 'operational':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'maintenance':
        return <Clock size={16} className="text-blue-500" />;
      case 'issue':
        return <AlertTriangle size={16} className="text-amber-500" />;
      case 'critical':
        return <AlertTriangle size={16} className="text-red-500" />;
      default:
        return null;
    }
  };
  
  const getStatusColor = (status: SystemStatus['status']) => {
    switch (status) {
      case 'operational':
        return 'bg-green-100 text-green-600 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30';
      case 'maintenance':
        return 'bg-blue-100 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30';
      case 'issue':
        return 'bg-amber-100 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/30';
      case 'critical':
        return 'bg-red-100 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30';
      default:
        return '';
    }
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
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-lg"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-3 staggered-fade-in">
          {statuses.map((item, index) => (
            <div 
              key={index} 
              className="bg-gradient-to-br from-white/80 to-slate-50/80 dark:from-slate-800/50 dark:to-slate-900/50 p-3 rounded-lg border border-slate-200/50 dark:border-slate-700/30 backdrop-blur-sm flex items-center justify-between transition-all hover:shadow-md group"
            >
              <div className="flex-1">
                <div className="text-sm font-medium">{item.category}</div>
                <div className="text-xs text-muted-foreground mt-1">{item.details}</div>
              </div>
              
              <div className="flex items-center">
                <div className={cn(
                  "py-1 px-2 rounded-full text-xs font-medium flex items-center mr-3",
                  getStatusColor(item.status)
                )}>
                  {getStatusIcon(item.status)}
                  <span className="ml-1.5 capitalize">{item.status}</span>
                </div>
                <div className="text-xs text-muted-foreground">{item.lastUpdated}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatusOverview;
