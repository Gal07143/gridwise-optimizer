
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, BarChart2, Settings, Zap, Battery, 
  Sun, PlusCircle, Package, Map, Layers,
  Database, Grid, MonitorSmartphone 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Logo from './Logo';
import SidebarNavSection from './SidebarNavSection';

interface SidebarProps {
  expanded: boolean;
  toggleSidebar: () => void;
}

export const Sidebar = ({ expanded, toggleSidebar }: SidebarProps) => {
  const location = useLocation();
  
  const NavItem = ({ to, icon: Icon, label }: { to: string; icon: React.ElementType; label: string }) => {
    const isActive = location.pathname === to || 
                    (to !== '/' && location.pathname.startsWith(to));
                    
    return (
      <NavLink
        to={to}
        className={({ isActive }) => cn(
          'flex items-center py-2 px-3 text-sm font-medium rounded-lg transition-colors',
          isActive
            ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/30 dark:text-indigo-100'
            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800/50'
        )}
      >
        <Icon className="h-4 w-4 mr-3 shrink-0" />
        {expanded && <span>{label}</span>}
      </NavLink>
    );
  };

  return (
    <aside className={cn(
      "border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col h-full transition-all duration-300",
      expanded ? "w-56" : "w-16"
    )}>
      <div className="h-16 flex items-center px-4 border-b border-slate-200 dark:border-slate-800 justify-center">
        {expanded ? <Logo /> : <Zap className="h-6 w-6 text-primary" />}
      </div>
      
      <div className="flex-1 overflow-auto py-2 px-3">
        <SidebarNavSection heading="Main" collapsed={!expanded}>
          <NavItem to="/" icon={Home} label="Dashboard" />
          <NavItem to="/energy-flow" icon={Zap} label="Energy Flow" />
          <NavItem to="/consumption" icon={BarChart2} label="Consumption" />
          <NavItem to="/savings" icon={Battery} label="Savings" />
        </SidebarNavSection>
        
        <SidebarNavSection heading="Energy Assets" collapsed={!expanded}>
          <NavItem to="/devices" icon={MonitorSmartphone} label="Devices" />
          <NavItem to="/solar" icon={Sun} label="Solar" />
          <NavItem to="/optimization" icon={Zap} label="Optimization" />
        </SidebarNavSection>
        
        <SidebarNavSection heading="Organization" collapsed={!expanded}>
          <NavItem to="/sites" icon={Map} label="Sites" />
          <NavItem to="/projects" icon={Layers} label="Projects" />
          <NavItem to="/integrations" icon={PlusCircle} label="Integrations" />
          <NavItem to="/modbus" icon={Grid} label="Modbus" />
        </SidebarNavSection>
        
        <SidebarNavSection heading="System" collapsed={!expanded}>
          <NavItem to="/analytics" icon={BarChart2} label="Analytics" />
          <NavItem to="/settings" icon={Settings} label="Settings" />
          <NavItem to="/preferences" icon={Database} label="Preferences" />
        </SidebarNavSection>
      </div>
    </aside>
  );
};
