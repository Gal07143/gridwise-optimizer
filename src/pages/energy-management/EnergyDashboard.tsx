
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import SpaceHierarchy from '@/components/spaces/SpaceHierarchy';
import EnergyCategoryList from '@/components/energy-categories/EnergyCategoryList';
import ProjectList from '@/components/energy-savings/ProjectList';
import BenchmarkComparison from '@/components/benchmarking/BenchmarkComparison';
import EmissionsCalculator from '@/components/carbon-emissions/EmissionsCalculator';
import type { Space } from '@/types/myems';
import type { EnergyCategory } from '@/types/myems';

const EnergyDashboard: React.FC = () => {
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<EnergyCategory | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Energy Management Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <SpaceHierarchy 
            onSelectSpace={setSelectedSpace}
            selectedSpaceId={selectedSpace?.id}
          />
          
          <EnergyCategoryList
            onSelectCategory={setSelectedCategory}
            selectedCategoryId={selectedCategory?.id}
          />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs
            defaultValue="overview"
            value={activeTab}
            onValueChange={setActiveTab}
            className="mb-6"
          >
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="saving-projects">Saving Projects</TabsTrigger>
              <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
              <TabsTrigger value="carbon">Carbon Emissions</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {selectedSpace ? selectedSpace.name : 'All Spaces'} Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {selectedSpace?.description || 'Select a space from the sidebar to see detailed information.'}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-sm text-muted-foreground">Total Energy</p>
                        <p className="text-2xl font-bold">1,245 kWh</p>
                        <p className="text-xs text-green-500">↑ 12% vs. last month</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-sm text-muted-foreground">Energy Cost</p>
                        <p className="text-2xl font-bold">$289.45</p>
                        <p className="text-xs text-red-500">↓ 5% vs. last month</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-sm text-muted-foreground">Efficiency Score</p>
                        <p className="text-2xl font-bold">78/100</p>
                        <p className="text-xs text-green-500">↑ 3 points improvement</p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Energy Consumption</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px] flex items-center justify-center">
                    <p className="text-muted-foreground">
                      Energy consumption chart will be displayed here
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Energy Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px] flex items-center justify-center">
                    <p className="text-muted-foreground">
                      Energy distribution pie chart will be displayed here
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Saving Projects Tab */}
            <TabsContent value="saving-projects">
              <ProjectList />
            </TabsContent>

            {/* Benchmarks Tab */}
            <TabsContent value="benchmarks" className="space-y-6">
              <BenchmarkComparison 
                category={selectedCategory?.name?.toLowerCase()} 
                currentValue={125}
                unit={selectedCategory?.unit ? `${selectedCategory.unit}/m²` : 'kWh/m²'}
                spaceType={selectedSpace?.type}
              />
            </TabsContent>

            {/* Carbon Emissions Tab */}
            <TabsContent value="carbon">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EmissionsCalculator />
                
                <Card>
                  <CardHeader>
                    <CardTitle>Carbon Footprint History</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[400px] flex items-center justify-center">
                    <p className="text-muted-foreground">
                      Carbon emission history chart will be displayed here
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default EnergyDashboard;
