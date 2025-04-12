import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PerformanceAnalytics: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <p>System performance metrics and analysis will be displayed here.</p>
      </CardContent>
    </Card>
  );
};

export default PerformanceAnalytics; 