
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
  Users
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

      <nav className="p-2 space-y-1">
        <NavItem to="/" icon={<LayoutDashboard size={18} />} label="Dashboard" expanded={sidebarExpanded} />
        <NavItem to="/solar" icon={<Sun size={18} />} label="Solar" expanded={sidebarExpanded} />
        <NavItem to="/battery" icon={<Battery size={18} />} label="Battery" expanded={sidebarExpanded} />
        <NavItem to="/projects" icon={<PackageOpen size={18} />} label="Projects" expanded={sidebarExpanded} />
        <NavItem to="/sites" icon={<Building2 size={18} />} label="Sites" expanded={sidebarExpanded} />
        <NavItem to="/analytics" icon={<BarChart3 size={18} />} label="Analytics" expanded={sidebarExpanded} />
        <NavItem to="/energy" icon={<Zap size={18} />} label="Energy Flow" expanded={sidebarExpanded} />
        <NavItem to="/users" icon={<Users size={18} />} label="Users" expanded={sidebarExpanded} />
        <NavItem to="/security" icon={<Shield size={18} />} label="Security" expanded={sidebarExpanded} />
        <NavItem to="/settings" icon={<Settings size={18} />} label="Settings" expanded={sidebarExpanded} />
      </nav>
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
