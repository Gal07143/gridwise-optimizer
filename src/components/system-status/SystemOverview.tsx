
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { StatusCard } from './StatusCard';
import { SystemComponent } from '@/services/systemStatusService';
import { Activity, Battery, Cpu, Database, Server, Cloud } from 'lucide-react';

interface SystemOverviewProps {
  components: SystemComponent[];
  isLoading?: boolean;
}

// Helper function to get component icon based on type
const getComponentIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'controller':
      return <Cpu className="h-4 w-4" />;
    case 'service':
      return <Cloud className="h-4 w-4" />;
    case 'infrastructure':
      return <Server className="h-4 w-4" />;
    case 'monitor':
      return <Activity className="h-4 w-4" />;
    case 'storage':
      return <Database className="h-4 w-4" />;
    case 'power':
      return <Battery className="h-4 w-4" />;
    default:
      return <Server className="h-4 w-4" />;
  }
};

export const SystemOverview: React.FC<SystemOverviewProps> = ({ 
  components = [], 
  isLoading = false 
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>System Components</span>
          {!isLoading && (
            <Badge variant="outline" className="text-xs">
              Last updated: {new Date().toLocaleTimeString()}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-md" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {components.map((component) => (
              <StatusCard
                key={component.id}
                title={component.name}
                status={component.status}
                icon={getComponentIcon(component.type)}
                description={`${component.type.charAt(0).toUpperCase() + component.type.slice(1)} - Last updated: ${new Date(component.lastUpdated).toLocaleString()}`}
                metric={component.metrics ? Object.entries(component.metrics)[0][1].toString() : undefined}
                className="h-full"
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SystemOverview;
