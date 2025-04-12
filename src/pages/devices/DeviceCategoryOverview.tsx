import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DeviceCategoryOverviewProps {
  category: string;
}

const DeviceCategoryOverview: React.FC<DeviceCategoryOverviewProps> = ({ category }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{category} Devices Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Overview of {category.toLowerCase()} devices will be displayed here.</p>
      </CardContent>
    </Card>
  );
};

export default DeviceCategoryOverview; 