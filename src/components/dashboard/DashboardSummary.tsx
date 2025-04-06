
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppStore } from '@/store/appStore';

interface DashboardSummaryProps {
  siteId: string;
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({ siteId }) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const { activeSite } = useAppStore();

  if (!activeSite) {
    return (
      <div className="flex flex-col space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>No Site Selected</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Please select a site to view dashboard data.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="production">Production</TabsTrigger>
          <TabsTrigger value="consumption">Consumption</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Energy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">4,382 kWh</div>
                <p className="text-sm text-muted-foreground mt-1">+5.3% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Self Consumption</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">76%</div>
                <p className="text-sm text-muted-foreground mt-1">+12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Grid Import</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">1,247 kWh</div>
                <p className="text-sm text-muted-foreground mt-1">-8.2% from last month</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="production">
          <Card>
            <CardHeader>
              <CardTitle>Energy Production</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Production data for {activeSite.name} will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="consumption">
          <Card>
            <CardHeader>
              <CardTitle>Energy Consumption</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Consumption data for {activeSite.name} will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="optimization">
          <Card>
            <CardHeader>
              <CardTitle>Energy Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Optimization data for {activeSite.name} will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardSummary;
