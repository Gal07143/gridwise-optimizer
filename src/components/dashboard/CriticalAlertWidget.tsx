
import React, { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { subscribeToTable } from '@/services/supabaseRealtimeService';

const CriticalAlertWidget: React.FC = () => {
  const [criticalCount, setCriticalCount] = useState<number | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCriticals = async () => {
      try {
        const { data, error } = await supabase
          .from('alerts')
          .select('*')
          .eq('severity', 'critical')
          .eq('acknowledged', false);
          
        if (error) throw error;
        
        setCriticalCount(data?.length ?? 0);
        setError(null);
      } catch (err) {
        console.error('Error fetching critical alerts:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch critical alerts'));
        // Don't show toast on initial load error to prevent UI disruption
      }
    };

    fetchCriticals();

    // Set up real-time subscription
    const unsubscribe = subscribeToTable(
      'alerts',
      '*',
      (payload) => {
        // Handle different event types
        if (payload.eventType === 'INSERT' && payload.new.severity === 'critical') {
          setCriticalCount((prev) => (prev ?? 0) + 1);
          toast.error(`New critical alert: ${payload.new.title || 'System issue detected'}`);
        } else if (payload.eventType === 'UPDATE') {
          // Refresh count on any update to ensure accuracy
          fetchCriticals();
        } else if (payload.eventType === 'DELETE') {
          setCriticalCount((prev) => Math.max(0, (prev ?? 1) - 1));
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // While loading, don't show anything to prevent layout shifts
  if (criticalCount === null) return null;
  
  // If there's an error but we've previously loaded a count, show the last known count
  // If there's an error and no previous count, don't show anything
  if (error && criticalCount === null) return null;

  return criticalCount > 0 ? (
    <Badge variant="destructive" className="ml-2 animate-pulse">
      <AlertTriangle className="h-4 w-4 mr-1" />
      {criticalCount} Critical Alert{criticalCount !== 1 ? 's' : ''}
    </Badge>
  ) : null;
};

export default CriticalAlertWidget;
