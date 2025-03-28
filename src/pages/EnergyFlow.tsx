import React from 'react';
import { Main } from '@/components/ui/main';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSiteContext } from '@/contexts/SiteContext';
import { EnhancedEnergyFlow } from '@/components/energy/EnhancedEnergyFlow';

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
                <EnhancedEnergyFlow siteId={activeSite.id} />
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
