
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { EnergyNode as EnergyNodeType } from './types';
import { 
  Popover,
  PopoverTrigger,
  PopoverContent 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Settings, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ControlDialog from '@/components/devices/controls/ControlDialog';

interface EnergyNodeProps {
  node: EnergyNodeType;
  className?: string;
}

export const getNodeColor = (type: string, status: string) => {
  if (status !== 'active') return 'bg-energy-orange/50 border-energy-orange';
  
  switch (type) {
    case 'source': 
      return 'bg-gradient-to-br from-energy-green/10 to-energy-green/20 border-energy-green/50';
    case 'storage': 
      return 'bg-gradient-to-br from-energy-blue/10 to-energy-blue/20 border-energy-blue/50';
    case 'consumption': 
      return 'bg-gradient-to-br from-energy-purple/10 to-energy-purple/20 border-energy-purple/50';
    default: 
      return 'bg-white dark:bg-slate-800';
  }
};

const getDeviceTypeFromNode = (node: EnergyNodeType) => {
  if (node.deviceType) return node.deviceType;
  
  // Fallback mapping if deviceType is not directly provided
  if (node.label.toLowerCase().includes('solar')) return 'solar';
  if (node.label.toLowerCase().includes('wind')) return 'wind';
  if (node.label.toLowerCase().includes('battery')) return 'battery';
  if (node.label.toLowerCase().includes('grid')) return 'grid';
  if (node.label.toLowerCase().includes('ev')) return 'ev_charger';
  return 'load';
};

const EnergyNode: React.FC<EnergyNodeProps> = ({ node, className }) => {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const deviceType = node.deviceType || getDeviceTypeFromNode(node);
  const deviceId = node.deviceId || `${deviceType}-1`;

  const handleQuickControl = () => {
    setDialogOpen(true);
    toast.info(`Opening controls for ${node.label}`);
  };
  
  const handleViewDetails = () => {
    // Navigate to device details page
    navigate(`/devices/edit/${deviceId}`);
    toast.info(`Navigating to ${node.label} details`);
  };

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <div 
            className={cn(
              "p-3 rounded-lg border shadow-sm backdrop-blur-sm transition-all cursor-pointer hover:shadow-md",
              getNodeColor(node.type, node.status),
              className
            )}
          >
            <div className="text-sm font-medium">{node.label}</div>
            <div className="text-lg font-semibold flex items-center gap-1 mt-1">
              <div className={cn(
                "w-2 h-2 rounded-full animate-pulse",
                node.status === 'active' ? 
                  node.type === 'source' ? 'bg-energy-green' : 
                  node.type === 'storage' ? 'bg-energy-blue' : 'bg-energy-purple' 
                  : 'bg-energy-orange'
              )}></div>
              {node.power.toFixed(1)} kW
            </div>
            {node.type === 'storage' && (
              <div className="mt-2 bg-slate-100 dark:bg-slate-700/50 rounded-full h-2 overflow-hidden">
                <div className="bg-energy-blue h-full animate-pulse" style={{ width: '68%' }}></div>
              </div>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-56">
          <div className="space-y-2">
            <h3 className="font-medium">{node.label}</h3>
            <p className="text-sm text-muted-foreground">
              Status: <span className={node.status === 'active' ? 'text-green-500' : 'text-orange-500'}>
                {node.status === 'active' ? 'Active' : node.status === 'warning' ? 'Warning' : 'Inactive'}
              </span>
            </p>
            <p className="text-sm text-muted-foreground">Power: {node.power.toFixed(1)} kW</p>
            
            <div className="flex flex-col gap-2 pt-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full justify-start" 
                onClick={handleQuickControl}
              >
                <Settings className="mr-2 h-4 w-4" />
                Control {node.label}
              </Button>
              
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full justify-start"
                onClick={handleViewDetails}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View Details
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <ControlDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        deviceType={deviceType}
        deviceId={deviceId}
      />
    </>
  );
};

export default EnergyNode;
