
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-mobile';
import { 
  LayoutDashboard, 
  BarChart2, 
  Activity, 
  Settings, 
  Menu, 
  X, 
  Shield, 
  BellRing, 
  FileText,
  Zap,
  Cpu,
  CircuitBoard,
  FileBarChart,
  Book,
  MonitorCheck,
  Wind
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import GlassPanel from '@/components/ui/GlassPanel';

const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);
  const isMobile = useMediaQuery('(max-width: 1024px)');
  const location = useLocation();
  
  React.useEffect(() => {
    if (isMobile) {
      setExpanded(false);
    } else {
      setExpanded(true);
    }
  }, [isMobile]);
  
  const toggleSidebar = () => {
    setExpanded(!expanded);
  };
  
  React.useEffect(() => {
    if (isMobile) {
      setExpanded(false);
    }
  }, [location.pathname, isMobile]);
  
  const NavItem = ({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) => {
    const isActive = location.pathname === href || location.pathname.startsWith(`${href}/`);
    
    return (
      <NavLink 
        to={href}
        className={cn(
          'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
          isActive 
            ? 'bg-primary text-primary-foreground' 
            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
        )}
      >
        {React.cloneElement(icon as React.ReactElement, {
          className: cn('mr-3 h-4 w-4', 
            isActive ? 'text-primary-foreground' : 'text-muted-foreground'
          ),
        })}
        <span className={cn('flex-1', !expanded && 'hidden')}>
          {children}
        </span>
      </NavLink>
    );
  };
  
  return (
    <>
      <div
        className={cn(
          "bg-secondary/20 backdrop-blur-sm h-screen fixed inset-0 z-40 transition-opacity lg:hidden",
          expanded ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={toggleSidebar}
      />
      <GlassPanel
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col w-64 transition-transform lg:translate-x-0 lg:z-0 lg:fixed lg:h-screen",
          !expanded && "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-2 text-primary font-semibold text-lg">
            <Zap size={24} />
            <span className={cn("font-semibold", !expanded && "hidden")}>Energy EMS</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="lg:hidden"
          >
            <X size={20} />
          </Button>
        </div>
        
        <ScrollArea className="flex-1 px-3 py-4">
          <div className="space-y-1">
            <NavItem href="/dashboard" icon={<LayoutDashboard size={16} />}>
              Dashboard
            </NavItem>
            <NavItem href="/analytics" icon={<BarChart2 size={16} />}>
              Analytics
            </NavItem>
            <NavItem href="/devices" icon={<Activity size={16} />}>
              Devices
            </NavItem>
            <NavItem href="/alerts" icon={<BellRing size={16} />}>
              Alerts
            </NavItem>
            <NavItem href="/reports" icon={<FileBarChart size={16} />}>
              Reports
            </NavItem>
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-1">
            <p className={cn("px-3 text-xs text-muted-foreground mb-2", !expanded && "hidden")}>
              System Control
            </p>
            <NavItem href="/energy-flow" icon={<CircuitBoard size={16} />}>
              Energy Flow
            </NavItem>
            <NavItem href="/microgrid" icon={<Cpu size={16} />}>
              Microgrid Control
            </NavItem>
            <NavItem href="/system-status" icon={<MonitorCheck size={16} />}>
              System Status
            </NavItem>
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-1">
            <p className={cn("px-3 text-xs text-muted-foreground mb-2", !expanded && "hidden")}>
              Administration
            </p>
            <NavItem href="/settings" icon={<Settings size={16} />}>
              Settings
            </NavItem>
            <NavItem href="/security" icon={<Shield size={16} />}>
              Security
            </NavItem>
            <NavItem href="/documentation" icon={<Book size={16} />}>
              Documentation
            </NavItem>
          </div>
        </ScrollArea>
        
        <div className="p-4">
          <Button 
            variant="outline" 
            size={expanded ? "default" : "icon"} 
            onClick={toggleSidebar}
            className="w-full lg:hidden"
          >
            {expanded ? (
              <>
                <X size={16} className="mr-2" />
                Close Menu
              </>
            ) : (
              <Menu size={16} />
            )}
          </Button>
          <Button 
            variant="outline" 
            size={expanded ? "default" : "icon"} 
            onClick={toggleSidebar}
            className="w-full hidden lg:flex"
          >
            {expanded ? (
              <>
                <Menu size={16} className="mr-2" />
                Collapse
              </>
            ) : (
              <Menu size={16} />
            )}
          </Button>
        </div>
      </GlassPanel>
      
      {!expanded && !isMobile && (
        <div className="fixed top-0 left-0 z-10 h-screen w-14 bg-transparent flex items-center justify-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="text-muted-foreground hover:text-foreground"
          >
            <Menu size={20} />
          </Button>
        </div>
      )}
      
      {isMobile && !expanded && (
        <div className="sticky top-0 z-30 bg-transparent py-3 px-4">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleSidebar}
          >
            <Menu size={20} />
          </Button>
        </div>
      )}
    </>
  );
};

export default Sidebar;
