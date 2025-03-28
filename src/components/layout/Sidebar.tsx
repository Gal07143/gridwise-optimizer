
import React from 'react';
import { Link } from 'react-router-dom';
import NavItem from './NavItem';
import SidebarNavSection from './SidebarNavSection';
import ThemeToggle from './ThemeToggle';
import SiteSelector from '@/components/sites/SiteSelector';
import Logo from './Logo';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { mainNavItems, systemControlItems, adminItems } from './sidebarNavData';

export interface SidebarProps {
  className?: string;
  isExpanded: boolean;
  toggleSidebar: () => void;
}

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
        <SidebarNavSection 
          key="main" 
          heading="Main"
          collapsed={!isExpanded}
        >
          {mainNavItems.map((item) => (
            <NavItem 
              key={item.href} 
              href={item.href} 
              icon={item.icon} 
              label={item.label}
              collapsed={!isExpanded}
            />
          ))}
        </SidebarNavSection>

        <SidebarNavSection 
          key="control" 
          heading="System Control"
          collapsed={!isExpanded}
        >
          {systemControlItems.map((item) => (
            <NavItem 
              key={item.href} 
              href={item.href} 
              icon={item.icon} 
              label={item.label}
              collapsed={!isExpanded}
            />
          ))}
        </SidebarNavSection>
        
        <SidebarNavSection 
          key="admin" 
          heading="Administration"
          collapsed={!isExpanded}
        >
          {adminItems.map((item) => (
            <NavItem 
              key={item.href} 
              href={item.href} 
              icon={item.icon} 
              label={item.label}
              collapsed={!isExpanded}
            />
          ))}
        </SidebarNavSection>
      </div>
      
      <div className="p-4 border-t">
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Sidebar;
