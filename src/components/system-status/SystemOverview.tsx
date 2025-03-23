import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { StatusCard } from './StatusCard';
import { SystemComponent } from '@/types/system';
import { getSystemComponents } from '@/services/systemService';

export const SystemOverview: React.FC = () => {
  const [components, setComponents] = useState<SystemComponent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const data = await getSystemComponents(); // <-- Fetch from backend/service
        setComponents(data);
      } catch (error) {
        console.error('Failed to load system components', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComponents();
    const interval = setInterval(fetchComponents, 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>System Components</span>
          {!loading && (
            <Badge variant="outline" className="text-xs">
              Last updated: {new Date().toLocaleTimeString()}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-md" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {components.map((component) => (
              <StatusCard key={component.id} component={component} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SystemOverview;
