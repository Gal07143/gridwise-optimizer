
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BadgeCheck, Clock, ArrowRight, Zap, Lightbulb } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useSiteContext } from '@/contexts/SiteContext';

// Mock optimization events
const optimizationEvents = [
  {
    id: 'opt-1',
    title: 'Battery charge scheduled',
    description: 'Scheduled charging during off-peak rate period',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    savings: 12.8,
    type: 'schedule'
  },
  {
    id: 'opt-2',
    title: 'Solar excess sold to grid',
    description: 'Exported 8.2 kWh to grid during peak rate period',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    savings: 4.3,
    type: 'export'
  },
  {
    id: 'opt-3',
    title: 'Load shifted',
    description: 'Delayed EV charging to utilize forecasted solar production',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    savings: 8.5,
    type: 'shift'
  },
  {
    id: 'opt-4',
    title: 'Peak shaving activated',
    description: 'Used battery to reduce grid consumption during demand peak',
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    savings: 15.2,
    type: 'peak'
  }
];

const OptimizationLog = () => {
  const { activeSite } = useSiteContext();
  
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffMins < 1440) {
      return `${Math.floor(diffMins / 60)}h ago`;
    } else {
      return `${Math.floor(diffMins / 1440)}d ago`;
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'schedule':
        return <Clock className="h-4 w-4 text-green-500" />;
      case 'export':
        return <ArrowRight className="h-4 w-4 text-blue-500" />;
      case 'shift':
        return <Zap className="h-4 w-4 text-amber-500" />;
      case 'peak':
        return <Lightbulb className="h-4 w-4 text-purple-500" />;
      default:
        return <BadgeCheck className="h-4 w-4 text-green-500" />;
    }
  };

  // Calculate total savings
  const totalSavings = optimizationEvents.reduce((sum, event) => sum + event.savings, 0);
  
  return (
    <Card className="shadow-md h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center justify-between">
          <div className="flex items-center">
            <BadgeCheck className="h-5 w-5 mr-2 text-green-500" />
            Optimization Log
          </div>
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300">
            ${totalSavings.toFixed(2)} saved
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
          {optimizationEvents.map(event => (
            <div 
              key={event.id} 
              className="p-3 border rounded-lg flex items-start gap-3 bg-white dark:bg-gray-800"
            >
              <div className="flex-shrink-0 mt-1">
                {getEventIcon(event.type)}
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-sm line-clamp-1">{event.title}</h4>
                  <span className="text-xs text-green-600 font-medium ml-2">
                    ${event.savings.toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {event.description}
                </p>
                <div className="mt-2">
                  <span className="text-xs text-muted-foreground">
                    {formatTimestamp(event.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-sm text-muted-foreground">
          {activeSite ? `Optimization events for ${activeSite.name}` : 'Select a site to view optimization events'}
        </div>
      </CardContent>
    </Card>
  );
};

export default OptimizationLog;
