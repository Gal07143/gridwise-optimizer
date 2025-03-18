
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  BarChart, 
  Settings, 
  Grid, 
  Zap, 
  Layers, 
  Bell, 
  FileText, 
  Shield 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const NavItem = ({ to, icon: Icon, label }: { to: string; icon: React.ElementType; label: string }) => {
    return (
      <Link to={to} className={cn(
        "nav-link group",
        isActive(to) && "active"
      )}>
        <Icon size={20} className="transition-transform duration-300 group-hover:translate-x-0.5" />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <div className="w-64 h-full bg-card border-r border-border flex flex-col">
      <div className="p-6 pb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-energy-blue to-energy-teal flex items-center justify-center text-white font-bold text-lg">
            G
          </div>
          <span className="font-semibold text-xl">GridWise</span>
        </div>
      </div>
      
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="mb-2 px-4 text-xs uppercase font-semibold text-muted-foreground">
          Main
        </div>
        <NavItem to="/" icon={Home} label="Dashboard" />
        <NavItem to="/analytics" icon={BarChart} label="Analytics" />
        <NavItem to="/devices" icon={Grid} label="Devices" />
        
        <div className="my-4 px-4 text-xs uppercase font-semibold text-muted-foreground">
          Energy Management
        </div>
        <NavItem to="/energy-flow" icon={Zap} label="Energy Flow" />
        <NavItem to="/microgrid" icon={Layers} label="Microgrid Control" />
        <NavItem to="/alerts" icon={Bell} label="Alerts" />
        <NavItem to="/reports" icon={FileText} label="Reports" />
        
        <div className="my-4 px-4 text-xs uppercase font-semibold text-muted-foreground">
          System
        </div>
        <NavItem to="/security" icon={Shield} label="Security" />
        <NavItem to="/settings" icon={Settings} label="Settings" />
      </div>

      <div className="p-4 border-t border-border">
        <div className="glass-panel p-4 rounded-lg">
          <div className="text-sm font-medium">System Status</div>
          <div className="mt-2 flex items-center text-xs">
            <div className="w-2 h-2 rounded-full bg-energy-green mr-2"></div>
            <span className="text-muted-foreground">All Systems Operational</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
