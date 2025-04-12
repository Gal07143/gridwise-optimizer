import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DeviceAnalytics: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Device Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Device performance and health analytics will be displayed here.</p>
      </CardContent>
    </Card>
  );
};

export default DeviceAnalytics; 