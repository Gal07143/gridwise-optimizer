import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const EnergyAnalytics: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Energy Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Detailed energy consumption and generation analytics will be displayed here.</p>
      </CardContent>
    </Card>
  );
};

export default EnergyAnalytics; 