
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
            ? 'bg-primary/10 text-primary' 
            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
        )}
      >
        {React.cloneElement(icon as React.ReactElement, {
          className: cn('mr-3 h-5 w-5', 
            isActive ? 'text-primary' : 'text-slate-500 dark:text-slate-400'
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
          "bg-black/20 backdrop-blur-sm h-screen fixed inset-0 z-40 transition-opacity lg:hidden",
          expanded ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={toggleSidebar}
      />
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700/50 transition-transform lg:translate-x-0 lg:z-10 lg:fixed lg:h-screen",
          !expanded && "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200 dark:border-slate-700/50">
          <div className="flex items-center gap-2 text-primary font-semibold text-lg">
            <Zap size={24} className="text-primary" />
            <span className={cn("font-semibold", !expanded && "hidden")}>GridWise</span>
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
        
        <ScrollArea className="flex-1 py-4">
          <div className="px-3 space-y-1">
            <NavItem href="/dashboard" icon={<LayoutDashboard size={18} />}>
              Dashboard
            </NavItem>
            <NavItem href="/analytics" icon={<BarChart2 size={18} />}>
              Analytics
            </NavItem>
            <NavItem href="/devices" icon={<Activity size={18} />}>
              Devices
            </NavItem>
            <NavItem href="/alerts" icon={<BellRing size={18} />}>
              Alerts
            </NavItem>
            <NavItem href="/reports" icon={<FileBarChart size={18} />}>
              Reports
            </NavItem>
          </div>
          
          <Separator className="my-4 mx-3" />
          
          <div className="px-3 space-y-1">
            <div className={cn("px-3 text-xs text-slate-500 dark:text-slate-400 font-medium mb-2", !expanded && "hidden")}>
              System Control
            </div>
            <NavItem href="/energy-flow" icon={<CircuitBoard size={18} />}>
              Energy Flow
            </NavItem>
            <NavItem href="/microgrid" icon={<Cpu size={18} />}>
              Microgrid Control
            </NavItem>
            <NavItem href="/system-status" icon={<MonitorCheck size={18} />}>
              System Status
            </NavItem>
          </div>
          
          <Separator className="my-4 mx-3" />
          
          <div className="px-3 space-y-1">
            <div className={cn("px-3 text-xs text-slate-500 dark:text-slate-400 font-medium mb-2", !expanded && "hidden")}>
              Administration
            </div>
            <NavItem href="/settings" icon={<Settings size={18} />}>
              Settings
            </NavItem>
            <NavItem href="/security" icon={<Shield size={18} />}>
              Security
            </NavItem>
            <NavItem href="/documentation" icon={<Book size={18} />}>
              Documentation
            </NavItem>
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t border-slate-200 dark:border-slate-700/50">
          <Button 
            variant="outline" 
            size={expanded ? "default" : "icon"} 
            onClick={toggleSidebar}
            className="w-full"
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
      </div>
      
      {!expanded && !isMobile && (
        <div className="fixed top-0 left-0 z-10 h-screen w-14 bg-transparent flex items-center justify-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
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
