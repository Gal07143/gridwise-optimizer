
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Battery, Zap, PlusCircle, ChevronRight, Search, Package, Settings, Upload, Download, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const IntegrationsHome = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Categories of integrations
  const integrationCategories = [
    {
      id: 'batteries',
      name: 'Battery Systems',
      description: 'Energy storage systems from various manufacturers',
      icon: <Battery className="h-5 w-5" />,
      count: 12,
      color: 'bg-blue-500/10 text-blue-500 border-blue-200',
      new: false,
      updated: true
    },
    {
      id: 'inverters',
      name: 'Inverters',
      description: 'Grid-tie, hybrid, and off-grid inverters',
      icon: <Zap className="h-5 w-5" />,
      count: 18,
      color: 'bg-green-500/10 text-green-500 border-green-200',
      new: false,
      updated: false
    },
    {
      id: 'ev-chargers',
      name: 'EV Chargers',
      description: 'Commercial and residential electric vehicle charging stations',
      icon: <Zap className="h-5 w-5" />,
      count: 9,
      color: 'bg-purple-500/10 text-purple-500 border-purple-200',
      new: true,
      updated: false
    },
    {
      id: 'meters',
      name: 'Energy Meters',
      description: 'Smart meters and monitoring devices',
      icon: <Settings className="h-5 w-5" />,
      count: 15,
      color: 'bg-orange-500/10 text-orange-500 border-orange-200',
      new: false,
      updated: false
    },
    {
      id: 'controllers',
      name: 'Microgrid Controllers',
      description: 'System control and management devices',
      icon: <Package className="h-5 w-5" />,
      count: 7,
      color: 'bg-red-500/10 text-red-500 border-red-200',
      new: false,
      updated: false
    }
  ];
  
  // Filter categories based on search
  const filteredCategories = integrationCategories.filter(category => {
    if (searchQuery) {
      return (
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by tab
    if (activeTab === 'new') return category.new;
    if (activeTab === 'updated') return category.updated;
    
    return true;
  });
  
  const handleImportCatalog = () => {
    toast.info("Import device catalog dialog would open here");
  };
  
  const handleExportCatalog = () => {
    toast.success("Exporting device catalog...");
    setTimeout(() => {
      toast.info("Device catalog exported successfully");
    }, 1500);
  };
  
  return (
    <AppLayout>
      <div className="flex flex-col gap-6 p-6 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold mb-1">Device Integrations</h1>
            <p className="text-muted-foreground">
              Browse and manage device integrations by manufacturer
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleImportCatalog}>
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" onClick={handleExportCatalog}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button asChild>
              <Link to="/integrations/add-device-model">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Device
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search device categories or manufacturers..." 
              className="pl-10 bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="new">New</TabsTrigger>
              <TabsTrigger value="updated">Updated</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i} className="cursor-pointer hover:shadow-md transition-all h-full">
                <CardHeader className="pb-2">
                  <Skeleton className="h-10 w-10 rounded-md mb-2" />
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-32" />
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-4" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          filteredCategories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map((category) => (
                <Link key={category.id} to={`/integrations/${category.id}`}>
                  <Card className="cursor-pointer hover:shadow-md transition-all h-full">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className={`p-2 w-fit rounded-md ${category.color} mb-2`}>
                          {category.icon}
                        </div>
                        <div className="flex gap-1">
                          {category.new && (
                            <Badge className="bg-blue-500">New</Badge>
                          )}
                          {category.updated && (
                            <Badge variant="outline" className="border-green-500 text-green-500">Updated</Badge>
                          )}
                        </div>
                      </div>
                      <CardTitle>{category.name}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm font-medium">{category.count} device models available</p>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-4">
                      <span className="text-sm text-muted-foreground">View devices</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
              <HelpCircle className="mx-auto h-10 w-10 text-slate-400" />
              <h3 className="mt-4 text-lg font-medium">No matching categories</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                No device categories match your search criteria. Try adjusting your search or filters.
              </p>
              <Button 
                variant="outline" 
                className="mt-6" 
                onClick={() => {
                  setSearchQuery('');
                  setActiveTab('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
          )
        )}
      </div>
    </AppLayout>
  );
};

export default IntegrationsHome;
