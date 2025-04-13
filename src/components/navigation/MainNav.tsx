
import React from "react"; 
import { Link, useLocation } from "react-router-dom"; 
import { cn } from "@/lib/utils"; 
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu"; 

const MainNav: React.FC = () => { 
  const location = useLocation(); 
  const isActive = (path: string) => location.pathname.startsWith(path); 
  
  return ( 
    <NavigationMenu> 
      <NavigationMenuList> 
        <NavigationMenuItem> 
          <Link to="/dashboard"> 
            <NavigationMenuLink 
              className={cn(
                "px-4 py-2 hover:bg-accent hover:text-accent-foreground", 
                isActive("/dashboard") && "bg-accent text-accent-foreground"
              )}
            > 
              Dashboard 
            </NavigationMenuLink> 
          </Link> 
        </NavigationMenuItem> 
        
        <NavigationMenuItem> 
          <NavigationMenuTrigger>Equipment</NavigationMenuTrigger> 
          <NavigationMenuContent> 
            <div className="grid gap-3 p-4 w-[400px]"> 
              <Link to="/equipment"> 
                <NavigationMenuLink 
                  className={cn(
                    "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground", 
                    isActive("/equipment") && "bg-accent text-accent-foreground"
                  )}
                > 
                  <div className="text-sm font-medium leading-none">Equipment List</div> 
                  <p className="text-sm leading-snug text-muted-foreground"> 
                    View and manage all equipment 
                  </p> 
                </NavigationMenuLink> 
              </Link> 
              
              <Link to="/equipment-groups"> 
                <NavigationMenuLink 
                  className={cn(
                    "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground", 
                    isActive("/equipment-groups") && "bg-accent text-accent-foreground"
                  )}
                > 
                  <div className="text-sm font-medium leading-none">Equipment Groups</div> 
                  <p className="text-sm leading-snug text-muted-foreground"> 
                    Manage equipment groups and hierarchies 
                  </p> 
                </NavigationMenuLink> 
              </Link> 
            </div> 
          </NavigationMenuContent> 
        </NavigationMenuItem>
        
        <NavigationMenuItem> 
          <NavigationMenuTrigger>Devices</NavigationMenuTrigger> 
          <NavigationMenuContent> 
            <div className="grid gap-3 p-4 w-[400px]"> 
              <Link to="/devices"> 
                <NavigationMenuLink 
                  className={cn(
                    "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground", 
                    isActive("/devices") && "bg-accent text-accent-foreground"
                  )}
                > 
                  <div className="text-sm font-medium leading-none">Device Management</div> 
                  <p className="text-sm leading-snug text-muted-foreground"> 
                    View and manage connected devices 
                  </p> 
                </NavigationMenuLink> 
              </Link>
              
              <Link to="/devices/generation"> 
                <NavigationMenuLink 
                  className={cn(
                    "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground", 
                    isActive("/devices/generation") && "bg-accent text-accent-foreground"
                  )}
                > 
                  <div className="text-sm font-medium leading-none">Generation Devices</div> 
                  <p className="text-sm leading-snug text-muted-foreground"> 
                    Solar, wind, and other generators
                  </p> 
                </NavigationMenuLink> 
              </Link>
              
              <Link to="/devices/storage"> 
                <NavigationMenuLink 
                  className={cn(
                    "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground", 
                    isActive("/devices/storage") && "bg-accent text-accent-foreground"
                  )}
                > 
                  <div className="text-sm font-medium leading-none">Storage Devices</div> 
                  <p className="text-sm leading-snug text-muted-foreground"> 
                    Battery and storage systems
                  </p> 
                </NavigationMenuLink> 
              </Link>
            </div> 
          </NavigationMenuContent> 
        </NavigationMenuItem>
        
        <NavigationMenuItem> 
          <NavigationMenuTrigger>Analytics</NavigationMenuTrigger> 
          <NavigationMenuContent> 
            <div className="grid gap-3 p-4 w-[400px]"> 
              <Link to="/analytics"> 
                <NavigationMenuLink 
                  className={cn(
                    "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground", 
                    isActive("/analytics") && "bg-accent text-accent-foreground"
                  )}
                > 
                  <div className="text-sm font-medium leading-none">Analytics Overview</div> 
                  <p className="text-sm leading-snug text-muted-foreground"> 
                    System performance insights
                  </p> 
                </NavigationMenuLink> 
              </Link>
              
              <Link to="/analytics/energy"> 
                <NavigationMenuLink 
                  className={cn(
                    "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground", 
                    isActive("/analytics/energy") && "bg-accent text-accent-foreground"
                  )}
                > 
                  <div className="text-sm font-medium leading-none">Energy Analytics</div> 
                  <p className="text-sm leading-snug text-muted-foreground"> 
                    Energy consumption trends
                  </p> 
                </NavigationMenuLink> 
              </Link>
            </div> 
          </NavigationMenuContent> 
        </NavigationMenuItem>
        
        <NavigationMenuItem> 
          <NavigationMenuTrigger>Settings</NavigationMenuTrigger> 
          <NavigationMenuContent> 
            <div className="grid gap-3 p-4 w-[400px]"> 
              <Link to="/settings"> 
                <NavigationMenuLink 
                  className={cn(
                    "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground", 
                    isActive("/settings") && "bg-accent text-accent-foreground"
                  )}
                > 
                  <div className="text-sm font-medium leading-none">System Settings</div> 
                  <p className="text-sm leading-snug text-muted-foreground"> 
                    Configure system parameters
                  </p> 
                </NavigationMenuLink> 
              </Link>
              
              <Link to="/settings/users"> 
                <NavigationMenuLink 
                  className={cn(
                    "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground", 
                    isActive("/settings/users") && "bg-accent text-accent-foreground"
                  )}
                > 
                  <div className="text-sm font-medium leading-none">User Settings</div> 
                  <p className="text-sm leading-snug text-muted-foreground"> 
                    Manage user accounts and permissions
                  </p> 
                </NavigationMenuLink> 
              </Link>
            </div> 
          </NavigationMenuContent> 
        </NavigationMenuItem>
      </NavigationMenuList> 
    </NavigationMenu> 
  ); 
}; 

export default MainNav;
