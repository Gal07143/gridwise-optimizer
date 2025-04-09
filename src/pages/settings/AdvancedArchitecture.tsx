
import React from 'react';
import SettingsPageTemplate from '@/components/settings/SettingsPageTemplate';
import HybridEdgeCloudSettings from '@/components/settings/HybridEdgeCloudSettings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Cloud, 
  Server, 
  Cpu, 
  Database, 
  Lock, 
  RefreshCw, 
  Timer, 
  LucideIcon,
  Globe,
  Shield,
  Workflow
} from 'lucide-react';
import { toast } from 'sonner';

interface ArchitectureFeatureProps {
  title: string;
  description: string;
  icon: LucideIcon;
  status: 'active' | 'inactive' | 'coming-soon';
  isNew?: boolean;
}

const ArchitectureFeature: React.FC<ArchitectureFeatureProps> = ({ title, description, icon: Icon, status, isNew }) => {
  return (
    <div className="flex gap-4 p-4 bg-slate-800/50 border border-slate-700/50 rounded-lg">
      <div className="mt-1">
        <Icon className="h-5 w-5 text-blue-400" />
      </div>
      <div className="flex-grow">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-white">{title}</h3>
          {isNew && (
            <Badge className="bg-blue-500 text-xs">New</Badge>
          )}
          {status === 'active' && (
            <Badge variant="outline" className="bg-green-900/20 text-green-400 border-green-500/30 text-xs">Active</Badge>
          )}
          {status === 'inactive' && (
            <Badge variant="outline" className="bg-slate-700/50 text-slate-300 border-slate-600/50 text-xs">Inactive</Badge>
          )}
          {status === 'coming-soon' && (
            <Badge variant="outline" className="bg-amber-900/20 text-amber-400 border-amber-500/30 text-xs">Coming Soon</Badge>
          )}
        </div>
        <p className="text-sm text-slate-400 mt-1">{description}</p>
      </div>
      <div className="flex items-center">
        <Button 
          variant={status === 'active' ? 'destructive' : 'default'} 
          size="sm"
          disabled={status === 'coming-soon'}
          onClick={() => {
            if (status === 'active') {
              toast.info(`${title} has been disabled`);
            } else {
              toast.success(`${title} has been activated`);
            }
          }}
        >
          {status === 'active' ? 'Disable' : 'Enable'}
        </Button>
      </div>
    </div>
  );
};

const AdvancedArchitecture = () => {
  return (
    <SettingsPageTemplate
      title="Advanced Architecture"
      description="Configure the hybrid edge-cloud architecture and system topology"
    >
      <div className="space-y-8">
        <HybridEdgeCloudSettings />
        
        <Card className="border border-slate-700/50 bg-slate-800/40 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Workflow className="h-5 w-5 text-blue-500" />
              <span>System Architecture Features</span>
            </CardTitle>
            <CardDescription>
              Enable or disable advanced architectural features
            </CardDescription>
          </CardHeader>
          
          <Tabs defaultValue="edge">
            <div className="px-6">
              <TabsList className="w-full grid grid-cols-3 mb-6 bg-slate-700/30">
                <TabsTrigger value="edge" className="flex items-center gap-2">
                  <Server className="h-4 w-4" />
                  Edge Computing
                </TabsTrigger>
                <TabsTrigger value="cloud" className="flex items-center gap-2">
                  <Cloud className="h-4 w-4" />
                  Cloud Services
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Security & Compliance
                </TabsTrigger>
              </TabsList>
            </div>
            
            <CardContent>
              <TabsContent value="edge" className="space-y-4">
                <ArchitectureFeature
                  title="Edge Autonomy"
                  description="Allow edge devices to operate independently when cloud connection is lost"
                  icon={Server}
                  status="active"
                />
                
                <ArchitectureFeature
                  title="Local Optimization Engine"
                  description="Run optimization algorithms directly on edge devices for faster response"
                  icon={Cpu}
                  status="active"
                  isNew
                />
                
                <ArchitectureFeature
                  title="Time-Series Edge Buffer"
                  description="Store high-resolution time-series data locally before cloud synchronization"
                  icon={Database}
                  status="active"
                />
                
                <ArchitectureFeature
                  title="Edge-to-Edge Mesh Communication"
                  description="Enable direct communication between edge devices without cloud relay"
                  icon={Globe}
                  status="coming-soon"
                />
              </TabsContent>
              
              <TabsContent value="cloud" className="space-y-4">
                <ArchitectureFeature
                  title="Real-time Data Streaming"
                  description="Stream telemetry data to the cloud in real-time for immediate analysis"
                  icon={RefreshCw}
                  status="active"
                />
                
                <ArchitectureFeature
                  title="Distributed Data Lake"
                  description="Store and process large volumes of historical energy data"
                  icon={Database}
                  status="active"
                />
                
                <ArchitectureFeature
                  title="Multi-Region Deployment"
                  description="Deploy cloud services across multiple geographic regions for redundancy"
                  icon={Globe}
                  status="inactive"
                />
                
                <ArchitectureFeature
                  title="Time-Travel Debugging"
                  description="Replay historical system states for debugging and analysis"
                  icon={Timer}
                  status="coming-soon"
                  isNew
                />
              </TabsContent>
              
              <TabsContent value="security" className="space-y-4">
                <ArchitectureFeature
                  title="End-to-End Encryption"
                  description="Encrypt all data in transit between edge devices and cloud"
                  icon={Lock}
                  status="active"
                />
                
                <ArchitectureFeature
                  title="Device Certificate Management"
                  description="Automatically manage and rotate security certificates for all devices"
                  icon={Shield}
                  status="active"
                />
                
                <ArchitectureFeature
                  title="Compliance Audit Logging"
                  description="Maintain comprehensive audit logs for regulatory compliance"
                  icon={Database}
                  status="active"
                />
                
                <ArchitectureFeature
                  title="Zero-Trust Architecture"
                  description="Implement zero-trust security model across all system components"
                  icon={Shield}
                  status="coming-soon"
                  isNew
                />
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </SettingsPageTemplate>
  );
};

export default AdvancedArchitecture;
