
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Main } from '@/components/ui/main';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CheckCircle } from 'lucide-react';

const IntegrationCategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  
  // Placeholder data - in a real app, this would come from your API/database
  const categoryMap: Record<string, { title: string; description: string }> = {
    'inverters': {
      title: 'Inverter Integrations',
      description: 'Connect and monitor solar and battery inverters'
    },
    'meters': {
      title: 'Energy Meter Integrations',
      description: 'Track energy usage with smart meters'
    },
    'protocols': {
      title: 'Protocol Integrations',
      description: 'Connect using standard energy protocols'
    },
    'ev-chargers': {
      title: 'EV Charger Integrations',
      description: 'Smart control for electric vehicle charging'
    },
    'api': {
      title: 'API Integrations',
      description: 'Connect to third-party services via API'
    },
    'weather': {
      title: 'Weather Service Integrations',
      description: 'Integrate weather data for energy forecasting'
    }
  };

  const categoryInfo = categoryMap[category || ''] || {
    title: 'Integrations',
    description: 'Connect your devices and services'
  };

  // Example integration items - in a real app, filter based on category
  const integrations = [
    {
      id: '1',
      name: 'SolarEdge',
      manufacturer: 'SolarEdge Technologies',
      model_number: 'API-v1',
      device_type: 'inverter',
      protocol: 'API',
      power_rating: 10,
      firmware_version: '3.2.1',
      support_level: 'full',
      has_manual: true
    },
    {
      id: '2',
      name: 'Fronius',
      manufacturer: 'Fronius International',
      model_number: 'Solar.API',
      device_type: 'inverter',
      protocol: 'API+Modbus',
      power_rating: 8,
      firmware_version: '2.0.4',
      support_level: 'full',
      has_manual: true
    },
    {
      id: '3',
      name: 'SMA',
      manufacturer: 'SMA Solar Technology',
      model_number: 'Sunny Family',
      device_type: 'inverter',
      protocol: 'Modbus',
      power_rating: 6,
      firmware_version: '1.8.5',
      support_level: 'partial',
      has_manual: false
    },
    {
      id: '4',
      name: 'Growatt',
      manufacturer: 'Growatt New Energy',
      model_number: 'ShineAPI',
      device_type: 'inverter',
      protocol: 'API',
      power_rating: 5,
      firmware_version: '2.2.0',
      support_level: 'beta',
      has_manual: true
    }
  ];

  return (
    <Main title={categoryInfo.title}>
      <div className="mb-6">
        <Link to="/integrations" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-700 mb-3">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Integrations
        </Link>
        
        <h1 className="text-2xl font-bold">{categoryInfo.title}</h1>
        <p className="text-gray-500 dark:text-gray-400">{categoryInfo.description}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map(integration => (
          <Card key={integration.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {integration.name}
                <span className={`text-xs px-2 py-1 rounded-full ${
                  integration.support_level === 'full' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                  integration.support_level === 'partial' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                  'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                }`}>
                  {integration.support_level.charAt(0).toUpperCase() + integration.support_level.slice(1)} Support
                </span>
              </CardTitle>
              <CardDescription>{integration.manufacturer}</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="divide-y divide-slate-100 dark:divide-slate-800">
                <div className="grid grid-cols-2 py-2">
                  <dt className="font-medium text-slate-500 dark:text-slate-400">Protocol</dt>
                  <dd className="text-slate-900 dark:text-slate-100">{integration.protocol}</dd>
                </div>
                <div className="grid grid-cols-2 py-2">
                  <dt className="font-medium text-slate-500 dark:text-slate-400">Rating</dt>
                  <dd className="text-slate-900 dark:text-slate-100">{integration.power_rating} kW</dd>
                </div>
              </dl>
              <ul className="mt-3 space-y-1">
                {integration.has_manual && (
                  <li className="flex items-center text-sm text-green-600 dark:text-green-400">
                    <CheckCircle className="h-3.5 w-3.5 mr-2" /> Documentation Available
                  </li>
                )}
              </ul>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Link to={`/integrations/${category}/${integration.id}`} className="w-full">
                <Button variant="outline" className="w-full">View Details</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </Main>
  );
};

export default IntegrationCategoryPage;
