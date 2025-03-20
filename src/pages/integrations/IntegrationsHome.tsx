
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Battery, Zap, PlusCircle, ChevronRight, Search, Package, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';

const IntegrationsHome = () => {
  // Categories of integrations
  const integrationCategories = [
    {
      id: 'batteries',
      name: 'Battery Systems',
      description: 'Energy storage systems from various manufacturers',
      icon: <Battery className="h-5 w-5" />,
      count: 12,
      color: 'bg-blue-500/10 text-blue-500 border-blue-200'
    },
    {
      id: 'inverters',
      name: 'Inverters',
      description: 'Grid-tie, hybrid, and off-grid inverters',
      icon: <Zap className="h-5 w-5" />,
      count: 18,
      color: 'bg-green-500/10 text-green-500 border-green-200'
    },
    {
      id: 'ev-chargers',
      name: 'EV Chargers',
      description: 'Commercial and residential electric vehicle charging stations',
      icon: <Zap className="h-5 w-5" />,
      count: 9,
      color: 'bg-purple-500/10 text-purple-500 border-purple-200'
    },
    {
      id: 'meters',
      name: 'Energy Meters',
      description: 'Smart meters and monitoring devices',
      icon: <Settings className="h-5 w-5" />,
      count: 15,
      color: 'bg-orange-500/10 text-orange-500 border-orange-200'
    },
    {
      id: 'controllers',
      name: 'Microgrid Controllers',
      description: 'System control and management devices',
      icon: <Package className="h-5 w-5" />,
      count: 7,
      color: 'bg-red-500/10 text-red-500 border-red-200'
    }
  ];
  
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
          
          <Button asChild>
            <Link to="/integrations/add-device-model">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add New Device Model
            </Link>
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search device models, manufacturers, or protocols..." 
            className="pl-10 bg-background"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrationCategories.map((category) => (
            <Link key={category.id} to={`/integrations/${category.id}`}>
              <Card className="cursor-pointer hover:shadow-md transition-all h-full">
                <CardHeader className="pb-2">
                  <div className={`p-2 w-fit rounded-md ${category.color} mb-2`}>
                    {category.icon}
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
      </div>
    </AppLayout>
  );
};

export default IntegrationsHome;
