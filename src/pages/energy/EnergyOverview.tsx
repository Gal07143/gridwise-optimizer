import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const EnergyOverview: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Energy Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Energy overview and statistics will be displayed here.</p>
      </CardContent>
    </Card>
  );
};

export default EnergyOverview; 