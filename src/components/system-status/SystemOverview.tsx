
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { StatusCard } from './StatusCard';
import { SystemComponent } from '@/services/systemStatusService';

interface SystemOverviewProps {
  components: SystemComponent[];
  isLoading?: boolean;
}

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
              <div key={component.id} className="border rounded-md p-4 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{component.name}</h3>
                  <Badge 
                    className={
                      component.status === 'healthy' ? 'bg-green-500' :
                      component.status === 'degraded' ? 'bg-yellow-500' :
                      component.status === 'critical' ? 'bg-red-500' :
                      component.status === 'maintenance' ? 'bg-blue-500' :
                      'bg-gray-500'
                    }
                  >
                    {component.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {component.type.charAt(0).toUpperCase() + component.type.slice(1)}
                </p>
                
                {component.metrics && (
                  <div className="mt-auto grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(component.metrics).map(([key, value]) => (
                      <div key={key} className="flex flex-col">
                        <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="text-xs text-muted-foreground mt-2">
                  Updated: {new Date(component.lastUpdated).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SystemOverview;
