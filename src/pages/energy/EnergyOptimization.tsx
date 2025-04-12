import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const EnergyOptimization: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Energy Optimization</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Energy optimization recommendations and controls will be displayed here.</p>
      </CardContent>
    </Card>
  );
};

export default EnergyOptimization; 