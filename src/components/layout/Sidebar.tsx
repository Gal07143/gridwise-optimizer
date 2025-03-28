import React from 'react';
import SidebarNavSection from "./SidebarNavSection";
import { NavItem } from './NavItem';
import { sidebarNavData } from "./sidebarNavData";
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
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const navSections = [
    {
      title: 'Overview',
      items: [
        { name: 'Dashboard', href: '/', icon: <Home className="h-4 w-4" /> },
        { name: 'Analytics', href: '/analytics', icon: <BarChart3 className="h-4 w-4" /> },
        { name: 'Energy Flow', href: '/energy-flow', icon: <Plug className="h-4 w-4" /> },
      ],
    },
    {
      title: 'Energy Management',
      items: [
        { name: 'Devices', href: '/devices', icon: <Cpu className="h-4 w-4" /> },
        { name: 'Microgrid Control', href: '/microgrid', icon: <Gauge className="h-4 w-4" /> },
        { name: 'Battery Storage', href: '/battery', icon: <BatteryFull className="h-4 w-4" /> },
        { name: 'Weather', href: '/weather', icon: <Cloud className="h-4 w-4" /> },
      ],
    },
    {
      title: 'System',
      items: [
        { name: 'Alerts', href: '/alerts', icon: <Thermometer className="h-4 w-4" /> },
        { name: 'Reports', href: '/reports', icon: <Blocks className="h-4 w-4" /> },
        { name: 'Settings', href: '/settings', icon: <Settings className="h-4 w-4" /> },
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
