
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
// Create a correct import for DeviceCategoryGrid
import DeviceCategoryGrid from '@/components/devices/DeviceCategoryGrid';
// Create a correct import for PageHeader
import PageHeader from '@/components/pages/PageHeader';

// Define props interface for DeviceCategoryGrid
interface DeviceCategoryGridProps {
  devices: any[];
  categories?: string; // Change from categoryId to categories based on error
}

const DeviceCategoryDetail = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState<any[]>([]);

  useEffect(() => {
    // Mock fetching devices for this category
    setTimeout(() => {
      setDevices([
        // Sample devices would be here
      ]);
      setLoading(false);
    }, 1000);
  }, [categoryId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${categoryId} Devices`}
        description={`View and manage your ${categoryId} devices`}
        backLink="/devices"
      />

      <Card>
        <CardContent className="p-6">
          <DeviceCategoryGrid categories={categoryId || ''} devices={devices} />
        </CardContent>
      </Card>
    </div>
  );
};

export default DeviceCategoryDetail;
