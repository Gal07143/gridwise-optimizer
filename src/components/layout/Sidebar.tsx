
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/appStore';
import { 
  Home, 
  Settings, 
  BarChart2, 
  Zap, 
  Battery, 
  Wind, 
  Sun, 
  Building,
  Server,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  expanded: boolean;
  toggleSidebar: () => void;
}

const navItems = [
  { path: '/', icon: <Home size={20} />, label: 'Dashboard' },
  { path: '/energy', icon: <Zap size={20} />, label: 'Energy' },
  { path: '/solar', icon: <Sun size={20} />, label: 'Solar' },
  { path: '/devices', icon: <Server size={20} />, label: 'Devices' },
  { path: '/sites', icon: <Building size={20} />, label: 'Sites' },
  { path: '/settings', icon: <Settings size={20} />, label: 'Settings' },
];

export const Sidebar: React.FC<SidebarProps> = ({ expanded, toggleSidebar }) => {
  const location = useLocation();
  const { sidebarOpen, setSidebarOpen } = useAppStore();

  const isActive = (path: string) => {
    return location.pathname === path || 
           (path !== '/' && location.pathname.startsWith(path));
  };

  return (
    <aside 
      className={cn(
        "bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen transition-all duration-300",
        expanded ? "w-64" : "w-16"
      )}
    >
      <div className="flex flex-col h-full">
        <div className={cn(
          "flex items-center h-16 px-4 border-b border-slate-200 dark:border-slate-800",
          expanded ? "justify-between" : "justify-center"
        )}>
          {expanded ? (
            <>
              <div className="font-bold text-xl dark:text-white">EnergyEMS</div>
              <button onClick={toggleSidebar}>
                <ChevronRight className="h-5 w-5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white" />
              </button>
            </>
          ) : (
            <button onClick={toggleSidebar}>
              <ChevronRight className="h-5 w-5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transform rotate-180" />
            </button>
          )}
        </div>
        
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center px-3 py-2.5 rounded-md transition-all",
                isActive(item.path) ? 
                  "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" : 
                  "text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800/60",
                !expanded && "justify-center"
              )}
            >
              <div className={expanded ? "mr-3" : ""}>{item.icon}</div>
              {expanded && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
};
