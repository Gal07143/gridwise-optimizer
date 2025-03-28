
import React from 'react';
import { Main } from '@/components/ui/main';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSiteContext } from '@/contexts/SiteContext';

// Import a simpler placeholder component that doesn't have errors
const EnergyFlowPlaceholder = ({ siteId }: { siteId: string }) => {
  return (
    <div className="p-4 bg-background border rounded-md">
      <h3 className="text-lg font-medium mb-2">Energy Flow Visualization</h3>
      <p className="text-muted-foreground mb-4">Site ID: {siteId}</p>
      <div className="h-[300px] bg-muted/20 rounded-md flex items-center justify-center">
        <p className="text-muted-foreground">Energy flow visualization will be displayed here.</p>
      </div>
    </div>
  );
};

const EnergyFlow: React.FC = () => {
  const { activeSite } = useSiteContext();

  return (
    <Main title="Energy Flow">
      <Tabs defaultValue="realtime" className="w-full">
        <TabsList>
          <TabsTrigger value="realtime">Realtime Flow</TabsTrigger>
          <TabsTrigger value="historical">Historical Data</TabsTrigger>
          <TabsTrigger value="optimization">Optimization Strategies</TabsTrigger>
        </TabsList>
        <TabsContent value="realtime" className="space-y-4">
          <Card>
            <CardContent>
              {activeSite ? (
                <EnergyFlowPlaceholder siteId={activeSite.id} />
              ) : (
                <p>No active site selected.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="historical">
          <Card>
            <CardContent>
              <p>Historical energy flow data will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="optimization">
          <Card>
            <CardContent>
              <p>Energy flow optimization strategies will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Main>
  );
};

export default EnergyFlow;
