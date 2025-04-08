
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Main } from '@/components/ui/main';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ArrowLeft, Check, ExternalLink, FileDown } from 'lucide-react';

const IntegrationDetailPage = () => {
  const { category, id } = useParams<{ category: string; id: string }>();
  
  // In a real app, you'd fetch data based on category and id
  const integration = {
    id,
    name: 'SolarEdge',
    manufacturer: 'SolarEdge Technologies',
    model: 'API-v1',
    description: 'SolarEdge provides intelligent energy management solutions that drive future ready, clean energy power.',
    device_type: 'inverter',
    protocol: 'API',
    power_rating: 10,
    firmware_version: '3.2.1',
    support_level: 'full',
    has_manual: true,
    features: [
      "Real-time monitoring of power, voltage, current",
      "Historical data access",
      "Inverter control (on/off)",
      "Module-level monitoring",
      "Fault detection and reporting",
      "Power optimization"
    ],
    setup_steps: [
      "Create a SolarEdge monitoring account",
      "Obtain API key from SolarEdge portal",
      "Enter site ID and API key in the integration setup",
      "Verify connection and data retrieval",
      "Configure refresh intervals"
    ]
  };

  return (
    <Main title={integration.name}>
      <div className="mb-6">
        <Link 
          to={`/integrations/${category}`} 
          className="inline-flex items-center text-sm text-slate-500 hover:text-slate-700 mb-3"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to {category}
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{integration.name}</h1>
            <p className="text-gray-500 dark:text-gray-400">{integration.manufacturer}</p>
          </div>
          <Button>
            Setup Integration
          </Button>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <p>{integration.description}</p>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="setup">Setup Guide</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Technical Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="divide-y divide-slate-100 dark:divide-slate-800">
                <div className="grid grid-cols-1 md:grid-cols-2 py-3">
                  <dt className="font-medium text-slate-500 dark:text-slate-400">Model</dt>
                  <dd className="text-slate-900 dark:text-slate-100">{integration.model}</dd>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 py-3">
                  <dt className="font-medium text-slate-500 dark:text-slate-400">Device Type</dt>
                  <dd className="text-slate-900 dark:text-slate-100 capitalize">{integration.device_type}</dd>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 py-3">
                  <dt className="font-medium text-slate-500 dark:text-slate-400">Protocol</dt>
                  <dd className="text-slate-900 dark:text-slate-100">{integration.protocol}</dd>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 py-3">
                  <dt className="font-medium text-slate-500 dark:text-slate-400">Firmware Version</dt>
                  <dd className="text-slate-900 dark:text-slate-100">{integration.firmware_version}</dd>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 py-3">
                  <dt className="font-medium text-slate-500 dark:text-slate-400">Support Level</dt>
                  <dd className="text-slate-900 dark:text-slate-100 capitalize">{integration.support_level}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
              <CardDescription>Supported features and capabilities</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {integration.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="setup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Setup Instructions</CardTitle>
              <CardDescription>Follow these steps to set up the integration</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                {integration.setup_steps.map((step, index) => (
                  <li key={index} className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 flex items-center justify-center mr-3 shrink-0 font-medium">
                      {index + 1}
                    </div>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Documentation & Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li>
                  <Button variant="outline" className="w-full justify-start">
                    <FileDown className="h-4 w-4 mr-2" />
                    Integration Manual
                  </Button>
                </li>
                <li>
                  <Button variant="outline" className="w-full justify-start">
                    <FileDown className="h-4 w-4 mr-2" />
                    Device Datasheet
                  </Button>
                </li>
                <li>
                  <Button variant="outline" className="w-full justify-start">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Manufacturer Website
                  </Button>
                </li>
                <li>
                  <Button variant="outline" className="w-full justify-start">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    API Documentation
                  </Button>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Main>
  );
};

export default IntegrationDetailPage;
