
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusCard } from './StatusCard';
import { SystemComponent } from '@/types/system';

interface SystemOverviewProps {
  components: SystemComponent[];
}

export const SystemOverview: React.FC<SystemOverviewProps> = ({ components }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">System Components</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {components.map((component) => (
            <StatusCard key={component.id} component={component} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
