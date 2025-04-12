
import React from 'react';
import { Main } from '@/components/ui/main';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { DownloadCloud, Filter, RefreshCw, Share2 } from 'lucide-react';
import GridTransformerVisualization from '@/components/energy/GridTransformerVisualization';
import SmartGridVisualization from '@/components/energy/SmartGridVisualization';

const SystemTopology: React.FC = () => {
  return (
    <Main>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">System Topology</h1>
          <p className="text-muted-foreground">
            Visualize and manage your energy system's physical and logical structure
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <DownloadCloud className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="transformer" className="space-y-6">
        <TabsList>
          <TabsTrigger value="transformer">Grid Transformer View</TabsTrigger>
          <TabsTrigger value="smartGrid">Smart Grid View</TabsTrigger>
          <TabsTrigger value="logical">Logical Topology</TabsTrigger>
          <TabsTrigger value="physical">Physical Layout</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transformer">
          <GridTransformerVisualization />
        </TabsContent>
        
        <TabsContent value="smartGrid">
          <SmartGridVisualization />
        </TabsContent>
        
        <TabsContent value="logical">
          <div className="h-[600px] flex items-center justify-center border rounded-lg p-4">
            <div className="text-center">
              <p className="text-muted-foreground">Logical system topology will be displayed here.</p>
              <p className="text-sm text-muted-foreground mt-2">
                This view shows the logical relationships between components, systems, and subsystems.
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="physical">
          <div className="h-[600px] flex items-center justify-center border rounded-lg p-4">
            <div className="text-center">
              <p className="text-muted-foreground">Physical system layout will be displayed here.</p>
              <p className="text-sm text-muted-foreground mt-2">
                This view shows the actual physical locations and installations of system components.
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="communications">
          <div className="h-[600px] flex items-center justify-center border rounded-lg p-4">
            <div className="text-center">
              <p className="text-muted-foreground">Communication network topology will be displayed here.</p>
              <p className="text-sm text-muted-foreground mt-2">
                This view shows how system components communicate, including protocols and connection types.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Main>
  );
};

export default SystemTopology;
