
import React, { useEffect, useState } from 'react';
import { AlertTriangle, Bell, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface AlertSummary {
  total: number;
  critical: number;
  unacknowledged: number;
}

export default function AlertSummaryCard() {
  const [summary, setSummary] = useState<AlertSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchAlertSummary() {
      try {
        setLoading(true);
        
        // Get total active alerts
        const { data: totalData, error: totalError } = await supabase
          .from('alerts')
          .select('id', { count: 'exact' })
          .eq('resolved', false);
          
        if (totalError) throw totalError;
        
        // Get critical alerts
        const { data: criticalData, error: criticalError } = await supabase
          .from('alerts')
          .select('id', { count: 'exact' })
          .eq('severity', 'critical')
          .eq('resolved', false);
          
        if (criticalError) throw criticalError;
        
        // Get unacknowledged alerts
        const { data: unacknowledgedData, error: unacknowledgedError } = await supabase
          .from('alerts')
          .select('id', { count: 'exact' })
          .eq('acknowledged', false)
          .eq('resolved', false);
          
        if (unacknowledgedError) throw unacknowledgedError;
        
        setSummary({
          total: totalData.length,
          critical: criticalData.length,
          unacknowledged: unacknowledgedData.length
        });
        
        setError(null);
      } catch (err) {
        console.error('Failed to fetch alert summary:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch alert summary'));
        // Set default values so UI can still render
        setSummary({
          total: 0,
          critical: 0,
          unacknowledged: 0
        });
      } finally {
        setLoading(false);
      }
    }

    fetchAlertSummary();
    const interval = setInterval(fetchAlertSummary, 15000); // refresh every 15s
    
    // Setup realtime subscription for alerts table
    const channel = supabase
      .channel('alert-summary-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'alerts'
      }, () => {
        fetchAlertSummary();
      })
      .subscribe();
      
    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return <Skeleton className="h-40 rounded-xl w-full" />;
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bell className="h-5 w-5 text-yellow-500" />
          Alert Summary
          {error && (
            <Badge variant="outline" className="bg-red-50 text-red-700 ml-2 text-xs">
              Error loading data
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {summary ? (
          <>
            <div className="flex items-center justify-between">
              <span>Total Active</span>
              <Badge variant="secondary" className="text-md font-semibold">{summary.total}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-destructive flex items-center gap-1">
                <AlertTriangle size={14} /> Critical
              </span>
              <Badge variant="destructive">{summary.critical}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1">
                <CheckCircle2 size={14} /> Unacknowledged
              </span>
              <Badge variant="outline">{summary.unacknowledged}</Badge>
            </div>
          </>
        ) : (
          <div className="text-center text-muted-foreground py-4">
            No alert data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
