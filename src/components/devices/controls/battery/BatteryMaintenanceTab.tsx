
import React from 'react';
import { toast } from 'sonner';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { 
  BatteryFull, 
  Activity, 
  Shield, 
  RefreshCw 
} from 'lucide-react';

interface BatteryMaintenanceTabProps {
  deviceId: string;
}

const BatteryMaintenanceTab: React.FC<BatteryMaintenanceTabProps> = ({ deviceId }) => {
  const [isActive, setIsActive] = React.useState(true);
  
  const handleBalanceCells = () => {
    toast.info('Starting cell balancing procedure...');
    setTimeout(() => {
      toast.success('Cell balancing complete');
    }, 3000);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Maintenance Actions</CardTitle>
        <CardDescription>
          Perform maintenance tasks on the battery system
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <Button 
          variant="outline" 
          className="h-auto py-4 flex flex-col items-center gap-2"
          onClick={handleBalanceCells}
          disabled={!isActive}
        >
          <BatteryFull className="h-8 w-8" />
          <div className="text-center">
            <p className="font-medium">Balance Cells</p>
            <p className="text-xs text-muted-foreground">Equalize cell charge</p>
          </div>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-auto py-4 flex flex-col items-center gap-2"
          onClick={() => toast.info('Running battery diagnostics...')}
          disabled={!isActive}
        >
          <Activity className="h-8 w-8" />
          <div className="text-center">
            <p className="font-medium">Diagnostics</p>
            <p className="text-xs text-muted-foreground">Check battery health</p>
          </div>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-auto py-4 flex flex-col items-center gap-2"
          onClick={() => toast.info('Checking for firmware updates...')}
          disabled={!isActive}
        >
          <Shield className="h-8 w-8" />
          <div className="text-center">
            <p className="font-medium">Update</p>
            <p className="text-xs text-muted-foreground">Check for updates</p>
          </div>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-auto py-4 flex flex-col items-center gap-2"
          onClick={() => toast.info('Resetting battery management system...')}
          disabled={!isActive}
        >
          <RefreshCw className="h-8 w-8" />
          <div className="text-center">
            <p className="font-medium">Reset BMS</p>
            <p className="text-xs text-muted-foreground">Battery Management</p>
          </div>
        </Button>
      </CardContent>
    </Card>
  );
};

export default BatteryMaintenanceTab;
