
import React from 'react';
import { Main } from '@/components/ui/main';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const IntegrationCategory = ({ title, description, icon: Icon, count, link }: any) => (
  <Card className="overflow-hidden">
    <CardHeader className="pb-2">
      <CardTitle className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-primary" />
        {title}
      </CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-sm">{count} available</p>
    </CardContent>
    <CardFooter className="border-t pt-4">
      <Link to={link} className="w-full">
        <Button variant="outline" className="w-full">
          Explore
        </Button>
      </Link>
    </CardFooter>
  </Card>
);

const Integrations = () => {
  // Integration categories with icons, descriptions and count
  const categories = [
    {
      id: 'inverters',
      title: 'Inverters',
      description: 'Connect solar and battery inverters',
      icon: ({ className }: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M6 7v10c0 .6.4 1 1 1h10c.6 0 1-.4 1-1V7c0-.6-.4-1-1-1H7c-.6 0-1 .4-1 1z" />
          <path d="M9 17v4" />
          <path d="M15 17v4" />
          <path d="M5 13h14" />
        </svg>
      ),
      count: 16,
      link: '/integrations/inverters'
    },
    {
      id: 'meters',
      title: 'Energy Meters',
      description: 'Connect smart meters and energy monitors',
      icon: ({ className }: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M12 2v5" />
          <path d="M19.07 7.93l-3.54 3.54" />
          <path d="M19.07 16.07l-3.54-3.54" />
          <path d="M12 22v-5" />
          <path d="M4.93 16.07l3.54-3.54" />
          <path d="M4.93 7.93l3.54 3.54" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
      count: 12,
      link: '/integrations/meters'
    },
    {
      id: 'protocols',
      title: 'Protocols',
      description: 'Connect via Modbus, OCPP, MQTT, and more',
      icon: ({ className }: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M4 9h16" />
          <path d="M4 15h16" />
          <path d="M8 5v14" />
          <path d="M16 5v14" />
        </svg>
      ),
      count: 8,
      link: '/integrations/protocols'
    },
    {
      id: 'ev-chargers',
      title: 'EV Chargers',
      description: 'Connect electric vehicle charging stations',
      icon: ({ className }: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M19 7h-3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z" />
          <path d="M13 7H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
          <path d="M11 7V4a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v3" />
          <path d="M9 17v4" />
          <path d="M9 12h7" />
          <path d="M16 16h1" />
        </svg>
      ),
      count: 10,
      link: '/integrations/ev-chargers'
    },
    {
      id: 'api',
      title: 'API & Webhooks',
      description: 'Connect via API and custom integrations',
      icon: ({ className }: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M15 7h2a5 5 0 0 1 0 10h-2m-6 0H7A5 5 0 0 1 7 7h2" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      ),
      count: 4,
      link: '/integrations/api'
    },
    {
      id: 'weather',
      title: 'Weather Services',
      description: 'Connect to weather data providers',
      icon: ({ className }: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
          <path d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" />
        </svg>
      ),
      count: 5,
      link: '/integrations/weather'
    }
  ];

  return (
    <Main title="Integrations">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Integrations</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Connect your energy system to external devices and services
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Integration
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(category => (
          <IntegrationCategory key={category.id} {...category} />
        ))}
      </div>
    </Main>
  );
};

export default Integrations;
