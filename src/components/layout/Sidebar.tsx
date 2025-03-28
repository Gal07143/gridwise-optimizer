
import React from 'react';
import { Link } from 'react-router-dom';
import NavItem from './NavItem';
import SidebarNavSection from './SidebarNavSection';
import ThemeToggle from './ThemeToggle';
import SiteSelector from '@/components/sites/SiteSelector';
import Logo from './Logo';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, LayoutDashboard, BarChart2, Activity, Wind, LightbulbIcon, Settings } from 'lucide-react';

export interface SidebarProps {
  className?: string;
  isExpanded: boolean;
  toggleSidebar: () => void;
}

// Define the navigation data structure
export const sidebarNavData = [
  {
    key: 'main',
    title: 'Main',
    items: [
      { href: '/dashboard', icon: <LayoutDashboard size={16} />, label: 'Dashboard' },
      { href: '/energy-flow', icon: '⚡', label: 'Energy Flow' },
      { href: '/analytics', icon: <BarChart2 size={16} />, label: 'Analytics' },
      { href: '/consumption', icon: <LightbulbIcon size={16} />, label: 'Consumption' },
      { href: '/production', icon: <Wind size={16} />, label: 'Production' },
      { href: '/devices', icon: <Activity size={16} />, label: 'Devices' },
    ]
  },
  {
    key: 'admin',
    title: 'Administration',
    items: [
      { href: '/settings', icon: <Settings size={16} />, label: 'Settings' },
      { href: '/reports', icon: '📑', label: 'Reports' },
      { href: '/system-status', icon: '🔍', label: 'System Status' },
    ]
  }
];

const Sidebar: React.FC<SidebarProps> = ({ className = '', isExpanded, toggleSidebar }) => {
  return (
    <div className={`${className} bg-background border-r h-screen flex flex-col transition-all duration-300 ${isExpanded ? 'w-64' : 'w-16'}`}>
      <div className="flex items-center justify-between p-4">
        {isExpanded ? (
          <Logo />
        ) : (
          <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
            <span className="text-primary text-xs font-bold">EMS</span>
          </div>
        )}
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar} 
          className="h-6 w-6"
        >
          {isExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </Button>
      </div>
      
      <div className="mt-2 px-2">
        <SiteSelector />
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 px-2">
        {sidebarNavData.map((section) => (
          <SidebarNavSection 
            key={section.key} 
            heading={section.title}
            collapsed={!isExpanded}
          >
            {section.items.map((item) => (
              <NavItem 
                key={item.href} 
                href={item.href} 
                icon={item.icon} 
                label={item.label}
                collapsed={!isExpanded}
              />
            ))}
          </SidebarNavSection>
        ))}
      </div>
      
      <div className="p-4 border-t">
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Sidebar;
