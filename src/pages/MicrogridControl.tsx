
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BadgeExtended } from '@/components/ui/badge-extended';
import MicrogridHeader from '@/components/microgrid/MicrogridHeader';
import MicrogridTabContent from '@/components/microgrid/MicrogridTabContent';
import { MicrogridProvider } from '@/components/microgrid/MicrogridProvider';

const MicrogridControl = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <MicrogridProvider>
      <AppLayout>
        <div className="flex flex-col gap-6 p-6">
          <MicrogridHeader />
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="control">Control</TabsTrigger>
                <TabsTrigger value="flow">Energy Flow</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
              </TabsList>
            </div>
            
            <MicrogridTabContent activeTab={activeTab} />
          </Tabs>
        </div>
      </AppLayout>
    </MicrogridProvider>
  );
};

export default MicrogridControl;
