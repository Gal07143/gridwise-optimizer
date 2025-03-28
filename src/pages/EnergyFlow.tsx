
import React from 'react';
import { Main } from '@/components/ui/main';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSiteContext } from '@/contexts/SiteContext';
import MinimalistEnergyFlow from '@/components/energy/MinimalistEnergyFlow';

const EnergyFlow: React.FC = () => {
  const { activeSite } = useSiteContext();

  return (
    <Main title="Energy Flow">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gridx-navy dark:text-white mb-2">Energy Flow</h1>
        <p className="text-gridx-gray dark:text-gray-400 text-sm">
          Visualize and analyze the energy flow through your system in real-time
        </p>
      </div>
      
      <Tabs defaultValue="realtime" className="w-full space-y-6">
        <TabsList className="bg-white dark:bg-gridx-dark-gray/80 border border-gray-100 dark:border-gray-700/20">
          <TabsTrigger value="realtime" className="data-[state=active]:bg-gridx-blue data-[state=active]:text-white">Realtime Flow</TabsTrigger>
          <TabsTrigger value="historical" className="data-[state=active]:bg-gridx-blue data-[state=active]:text-white">Historical Data</TabsTrigger>
          <TabsTrigger value="optimization" className="data-[state=active]:bg-gridx-blue data-[state=active]:text-white">Optimization</TabsTrigger>
        </TabsList>
        
        <TabsContent value="realtime" className="space-y-4 mt-4">
          {activeSite ? (
            <MinimalistEnergyFlow siteId={activeSite.id} />
          ) : (
            <Card className="bg-white dark:bg-gridx-dark-gray/90 border border-gray-100 dark:border-gray-700/30 shadow-sm">
              <CardContent className="py-6">
                <p className="text-gridx-gray dark:text-gray-400">No active site selected.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="historical" className="mt-4">
          <Card className="bg-white dark:bg-gridx-dark-gray/90 border border-gray-100 dark:border-gray-700/30 shadow-sm">
            <CardContent className="py-6">
              <p className="text-gridx-gray dark:text-gray-400">Historical energy flow data will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="optimization" className="mt-4">
          <Card className="bg-white dark:bg-gridx-dark-gray/90 border border-gray-100 dark:border-gray-700/30 shadow-sm">
            <CardContent className="py-6">
              <p className="text-gridx-gray dark:text-gray-400">Energy flow optimization strategies will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Main>
  );
};

export default EnergyFlow;
