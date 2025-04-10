
import React from 'react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/appStore';
import { 
  Home, 
  BarChart3, 
  Settings, 
  Battery, 
  Sun, 
  LayoutDashboard,
  Zap,
  Building2,
  PackageOpen,
  Shield,
  Users,
  Cpu,
  Plug,
  Activity,
  Radio,
  PanelTop,
  Lightbulb,
  Gauge,
  Workflow,
  PlugZap,
  CalendarDays
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  className?: string;
}

export const Sidebar = ({ className }: SidebarProps) => {
  const { sidebarExpanded, toggleSidebar } = useAppStore();

  return (
    <div
      className={cn(
        "bg-background border-r border-border/40 h-screen transition-all duration-300",
        sidebarExpanded ? "w-64" : "w-16",
        className
      )}
    >
      <div className="p-4 flex items-center justify-between h-16 border-b border-border/40">
        {sidebarExpanded ? (
          <span className="font-semibold text-lg">EnergyEMS</span>
        ) : (
          <span className="font-bold text-xl flex justify-center w-full">E</span>
        )}
        <button onClick={toggleSidebar} className="text-gray-500 hover:text-gray-700">
          {/* Hamburger icon or similar */}
        </button>
      </div>

      <div className="flex flex-col h-[calc(100vh-4rem)] overflow-y-auto">
        <nav className="p-2 space-y-1">
          {/* Main Navigation */}
          <NavItem to="/" icon={<LayoutDashboard size={18} />} label="Dashboard" expanded={sidebarExpanded} />
          
          {/* Energy Management */}
          {sidebarExpanded && (
            <div className="pt-4 pb-1">
              <p className="px-3 text-xs font-medium text-muted-foreground">ENERGY MANAGEMENT</p>
            </div>
          )}
          <NavItem to="/energy-optimization" icon={<Zap size={18} />} label="Optimization" expanded={sidebarExpanded} />
          <NavItem to="/solar" icon={<Sun size={18} />} label="Solar" expanded={sidebarExpanded} />
          <NavItem to="/battery" icon={<Battery size={18} />} label="Battery" expanded={sidebarExpanded} />
          
          {/* Device Management */}
          {sidebarExpanded && (
            <div className="pt-4 pb-1">
              <p className="px-3 text-xs font-medium text-muted-foreground">DEVICES & CONTROL</p>
            </div>
          )}
          <NavItem to="/devices" icon={<PanelTop size={18} />} label="Devices" expanded={sidebarExpanded} />
          <NavItem to="/modbus-devices" icon={<Radio size={18} />} label="Modbus Devices" expanded={sidebarExpanded} />
          <NavItem to="/ev-charging" icon={<PlugZap size={18} />} label="EV Charging" expanded={sidebarExpanded} />
          <NavItem to="/schedules" icon={<CalendarDays size={18} />} label="Schedules" expanded={sidebarExpanded} />

          {/* Monitoring & Analytics */}
          {sidebarExpanded && (
            <div className="pt-4 pb-1">
              <p className="px-3 text-xs font-medium text-muted-foreground">MONITORING & ANALYTICS</p>
            </div>
          )}
          <NavItem to="/analytics" icon={<BarChart3 size={18} />} label="Analytics" expanded={sidebarExpanded} />
          <NavItem to="/energy-flow" icon={<Workflow size={18} />} label="Energy Flow" expanded={sidebarExpanded} />
          <NavItem to="/consumption" icon={<Lightbulb size={18} />} label="Consumption" expanded={sidebarExpanded} />
          <NavItem to="/telemetry" icon={<Gauge size={18} />} label="Live Telemetry" expanded={sidebarExpanded} />
          
          {/* System & Administration */}
          {sidebarExpanded && (
            <div className="pt-4 pb-1">
              <p className="px-3 text-xs font-medium text-muted-foreground">SYSTEM</p>
            </div>
          )}
          <NavItem to="/sites" icon={<Building2 size={18} />} label="Sites" expanded={sidebarExpanded} />
          <NavItem to="/users" icon={<Users size={18} />} label="Users" expanded={sidebarExpanded} />
          <NavItem to="/security" icon={<Shield size={18} />} label="Security" expanded={sidebarExpanded} />
          <NavItem to="/settings" icon={<Settings size={18} />} label="Settings" expanded={sidebarExpanded} />
        </nav>
        
        {/* Bottom section for user profile, etc. */}
        <div className="mt-auto p-2 border-t border-border/40">
          <NavItem 
            to="/projects" 
            icon={<Cpu size={18} />} 
            label="Edge AI System" 
            expanded={sidebarExpanded} 
            />
        </div>
      </div>
    </div>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  expanded: boolean;
}

const NavItem = ({ to, icon, label, expanded }: NavItemProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center p-2 rounded-md transition-colors",
          expanded ? "justify-start" : "justify-center",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )
      }
    >
      <span className="shrink-0">{icon}</span>
      {expanded && <span className="ml-3 text-sm">{label}</span>}
    </NavLink>
  );
};

export default Sidebar;
