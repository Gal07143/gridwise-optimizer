
import React from 'react';
import { Grid, Settings, BarChart3, PanelTop, History } from 'lucide-react';
import { 
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const MicrogridNavMenu: React.FC = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList className="w-full gap-1">
        <NavigationMenuItem>
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            asChild
          >
            <a href="#status">
              <Grid className="mr-2 h-4 w-4" />
              Status
            </a>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            asChild
          >
            <a href="#controls">
              <Settings className="mr-2 h-4 w-4" />
              Controls
            </a>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            asChild
          >
            <a href="#devices">
              <PanelTop className="mr-2 h-4 w-4" />
              Devices
            </a>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            asChild
          >
            <a href="#analysis">
              <BarChart3 className="mr-2 h-4 w-4" />
              Analysis
            </a>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            asChild
          >
            <a href="#history">
              <History className="mr-2 h-4 w-4" />
              History
            </a>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default MicrogridNavMenu;
