import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import NavItem from './NavItem';
import SidebarNavSection from './SidebarNavSection';
import ThemeToggle from './ThemeToggle';
import SiteSelector from '@/components/sites/SiteSelector';
import Logo from './Logo';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { mainNavItems, systemControlItems, adminItems, integrationItems, deviceManagementItems } from './sidebarNavData';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/appStore';

export interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const { sidebarExpanded, toggleSidebar } = useAppStore();
  
  // Sidebar animation variants
  const sidebarVariants = {
    expanded: { width: '16rem' },
    collapsed: { width: '4rem' }
  };
  
  return (
    <motion.div 
      className={`${className} bg-background border-r h-screen flex flex-col z-30 fixed transition-shadow ${sidebarExpanded ? 'shadow-lg' : ''}`}
      initial={sidebarExpanded ? 'expanded' : 'collapsed'}
      animate={sidebarExpanded ? 'expanded' : 'collapsed'}
      variants={sidebarVariants}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <div className="flex items-center justify-between p-4">
        {sidebarExpanded ? (
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
          aria-label={sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          {sidebarExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </Button>
      </div>
      
      <div className="mt-2 px-2">
        <SiteSelector />
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 px-2">
        <SidebarNavSection 
          key="main" 
          heading="Main"
          collapsed={!sidebarExpanded}
        >
          {mainNavItems.map((item) => (
            <NavItem 
              key={item.href} 
              href={item.href} 
              icon={item.icon} 
              label={item.label}
              collapsed={!sidebarExpanded}
            />
          ))}
        </SidebarNavSection>

        <SidebarNavSection 
          key="device-management" 
          heading="Device Management"
          collapsed={!sidebarExpanded}
        >
          {deviceManagementItems.map((item) => (
            <NavItem 
              key={item.href} 
              href={item.href} 
              icon={item.icon} 
              label={item.label}
              collapsed={!sidebarExpanded}
            />
          ))}
        </SidebarNavSection>

        <SidebarNavSection 
          key="control" 
          heading="System Control"
          collapsed={!sidebarExpanded}
        >
          {systemControlItems.map((item) => (
            <NavItem 
              key={item.href} 
              href={item.href} 
              icon={item.icon} 
              label={item.label}
              collapsed={!sidebarExpanded}
            />
          ))}
        </SidebarNavSection>
        
        <SidebarNavSection 
          key="admin" 
          heading="Administration"
          collapsed={!sidebarExpanded}
        >
          {adminItems.map((item) => (
            <NavItem 
              key={item.href} 
              href={item.href} 
              icon={item.icon} 
              label={item.label}
              collapsed={!sidebarExpanded}
            />
          ))}
        </SidebarNavSection>
      </div>
      
      <div className="p-4 border-t">
        <ThemeToggle />
      </div>
    </motion.div>
  );
};

export default Sidebar;
