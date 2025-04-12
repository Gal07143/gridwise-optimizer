import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AnalyticsOverview: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <p>System-wide analytics and insights will be displayed here.</p>
      </CardContent>
    </Card>
  );
};

export default AnalyticsOverview; 