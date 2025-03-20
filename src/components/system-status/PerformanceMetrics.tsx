
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const PerformanceMetrics: React.FC = () => {
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">System Load</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">System load chart will appear here</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Response Times</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">Response time metrics will appear here</p>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Resource Utilization</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">Resource utilization metrics will appear here</p>
        </CardContent>
      </Card>
    </div>
  );
};
