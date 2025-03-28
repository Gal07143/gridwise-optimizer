
import React from 'react';
import SidebarNavSection from "./SidebarNavSection";
import NavItem from './NavItem';
import { 
  BarChart3, 
  BatteryFull, 
  Blocks, 
  Cloud, 
  Cpu, 
  Gauge, 
  Home, 
  Plug, 
  Settings, 
  Thermometer, 
  Wind 
} from 'lucide-react';
import SiteSelector from "@/components/sites/SiteSelector";

interface SidebarProps {
  className?: string;
  isExpanded?: boolean;
  toggleSidebar?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ className, isExpanded, toggleSidebar }) => {
  const navSections = [
    {
      title: 'Overview',
      items: [
        { href: '/', icon: <Home className="h-4 w-4" />, label: 'Dashboard' },
        { href: '/analytics', icon: <BarChart3 className="h-4 w-4" />, label: 'Analytics' },
        { href: '/energy-flow', icon: <Plug className="h-4 w-4" />, label: 'Energy Flow' },
      ],
    },
    {
      title: 'Energy Management',
      items: [
        { href: '/devices', icon: <Cpu className="h-4 w-4" />, label: 'Devices' },
        { href: '/microgrid', icon: <Gauge className="h-4 w-4" />, label: 'Microgrid Control' },
        { href: '/battery', icon: <BatteryFull className="h-4 w-4" />, label: 'Battery Storage' },
        { href: '/weather', icon: <Cloud className="h-4 w-4" />, label: 'Weather' },
      ],
    },
    {
      title: 'System',
      items: [
        { href: '/alerts', icon: <Thermometer className="h-4 w-4" />, label: 'Alerts' },
        { href: '/reports', icon: <Blocks className="h-4 w-4" />, label: 'Reports' },
        { href: '/settings', icon: <Settings className="h-4 w-4" />, label: 'Settings' },
      ],
    },
  ];

  return (
    <div className={`pb-12 ${className}`}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <SiteSelector />
        </div>
        
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Energy Management
          </h2>
          <div className="space-y-1">
            {navSections.map((section) => (
              <SidebarNavSection 
                key={section.title} 
                title={section.title}
                items={section.items}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
