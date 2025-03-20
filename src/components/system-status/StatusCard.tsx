
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, Cpu, Database, Radio, Shield, FileText, Cloud } from 'lucide-react';
import { ComponentStatus } from '@/types/system';

interface StatusCardProps {
  component: {
    id: string;
    component_name: string;
    status: ComponentStatus;
    details: string;
    latency: number;
    last_restart: string;
    updated_at: string;
  };
}

export const StatusCard: React.FC<StatusCardProps> = ({ component }) => {
  const getComponentIcon = (name: string) => {
    if (name.includes('Controller')) return <Cpu className="h-5 w-5" />;
    if (name.includes('Database')) return <Database className="h-5 w-5" />;
    if (name.includes('Communication')) return <Radio className="h-5 w-5" />;
    if (name.includes('Authentication')) return <Shield className="h-5 w-5" />;
    if (name.includes('Logging')) return <FileText className="h-5 w-5" />;
    if (name.includes('API')) return <Shield className="h-5 w-5" />;
    if (name.includes('Reporting')) return <FileText className="h-5 w-5" />;
    if (name.includes('Weather')) return <Cloud className="h-5 w-5" />;
    return <Activity className="h-5 w-5" />;
  };

  const getStatusBadge = (status: ComponentStatus) => {
    switch (status) {
      case 'operational':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Operational</Badge>;
      case 'degraded':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Degraded</Badge>;
      case 'down':
        return <Badge variant="destructive">Down</Badge>;
      case 'maintenance':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Maintenance</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card key={component.id} className="overflow-hidden">
      <div className={`h-1 ${
        component.status === 'operational' ? 'bg-green-500' : 
        component.status === 'degraded' ? 'bg-amber-500' : 
        component.status === 'down' ? 'bg-red-500' : 'bg-blue-500'
      }`} />
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              {getComponentIcon(component.component_name)}
            </div>
            <div>
              <h3 className="font-medium">{component.component_name}</h3>
              <p className="text-xs text-muted-foreground">
                Last updated: {new Date(component.updated_at).toLocaleString()}
              </p>
            </div>
          </div>
          {getStatusBadge(component.status)}
        </div>
        
        <div className="mt-3 text-sm">
          {component.details}
        </div>
        
        <div className="mt-2 text-xs text-muted-foreground flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Activity size={12} />
            Latency: {component.latency}ms
          </span>
          <span className="flex items-center gap-1">
            <Activity size={12} className="rotate-90" />
            Last restart: {new Date(component.last_restart).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
