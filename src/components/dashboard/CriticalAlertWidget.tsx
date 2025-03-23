import React, { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

const CriticalAlertWidget: React.FC = () => {
  const [criticalCount, setCriticalCount] = useState(0);

  useEffect(() => {
    const fetchCriticals = async () => {
      const { data } = await supabase
        .from('alerts')
        .select('id')
        .eq('severity', 'critical')
        .eq('acknowledged', false);
      setCriticalCount(data?.length ?? 0);
    };

    fetchCriticals();

    const channel = supabase
      .channel('critical-alerts')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'alerts' },
        (payload) => {
          if (payload.new.severity === 'critical') {
            setCriticalCount((prev) => prev + 1);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return criticalCount > 0 ? (
    <Badge variant="destructive" className="ml-2 animate-pulse">
      <AlertTriangle className="h-4 w-4 mr-1" />
      {criticalCount} Critical Alerts
    </Badge>
  ) : null;
};

export default CriticalAlertWidget;
