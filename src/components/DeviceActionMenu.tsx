
import React from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Play, Pause, RefreshCw, Settings, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DeviceActionMenuProps {
  deviceId: string;
}

export const DeviceActionMenu: React.FC<DeviceActionMenuProps> = ({ deviceId }) => {
  const { toast } = useToast();

  const handleAction = (action: string) => {
    toast({
      title: `${action} command sent`,
      description: `Device ${deviceId.slice(0, 8)}... will ${action.toLowerCase()} soon.`,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Device Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleAction("Start")}>
          <Play className="mr-2 h-4 w-4" />
          <span>Start</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction("Stop")}>
          <Pause className="mr-2 h-4 w-4" />
          <span>Stop</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction("Restart")}>
          <RefreshCw className="mr-2 h-4 w-4" />
          <span>Restart</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleAction("Configure")}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Configure</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction("Diagnose")}>
          <AlertTriangle className="mr-2 h-4 w-4" />
          <span>Diagnose</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DeviceActionMenu;
