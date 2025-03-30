// src/pages/AIOverview.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BatteryLifecycleChart from '@/components/ai/BatteryLifecycleChart';
import ROIChart from '@/components/ai/ROIChart';
import RealtimeDispatchAdvice from '@/components/ai/RealtimeDispatchAdvice';
import AnomalyAlerts from '@/components/ai/AnomalyAlerts';
import AIModelTrainer from '@/components/admin/AIModelTrainer';

const AIOverview = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 p-4">
      <div className="md:col-span-2 xl:col-span-1">
        <RealtimeDispatchAdvice />
      </div>
      <BatteryLifecycleChart />
      <ROIChart />
      <AnomalyAlerts />
      <div className="md:col-span-2 xl:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>Model Training</CardTitle>
          </CardHeader>
          <CardContent>
            <AIModelTrainer />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIOverview;
