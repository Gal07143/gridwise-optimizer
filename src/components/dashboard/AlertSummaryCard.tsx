import React, { useEffect, useState } from 'react';
import { AlertTriangle, Bell, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface AlertSummary {
  total: number;
  critical: number;
  unacknowledged: number;
}

export default function AlertSummaryCard() {
  const [summary, setSummary] = useState<AlertSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const res = await fetch('/api/alerts/summary'); // You’ll replace this with a Supabase query or API call
        const data = await res.json();
        setSummary(data);
      } catch (err) {
        console.error('Failed to fetch alert summary:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, []);

  if (loading || !summary) {
    return <Skeleton className="h-40 rounded-xl w-full" />;
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bell className="h-5 w-5 text-yellow-500" />
          Alert Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
      </CardContent>
    </Card>
  );
}
