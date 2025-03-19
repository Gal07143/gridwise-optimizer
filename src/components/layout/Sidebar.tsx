
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-mobile';
import { Zap, X, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

import SidebarNavSection from './SidebarNavSection';
import SidebarToggleButton from './SidebarToggleButton';
import { mainNavItems, systemControlItems, adminItems } from './sidebarNavData';

const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);
  const isMobile = useMediaQuery('(max-width: 1024px)');
  const location = useLocation();
  
  // Handle mobile/desktop view changes
  useEffect(() => {
    if (isMobile) {
      setExpanded(false);
    } else {
      setExpanded(true);
    }
  }, [isMobile]);
  
  const toggleSidebar = () => {
    setExpanded(!expanded);
  };
  
  // Close sidebar on route change in mobile view
  useEffect(() => {
    if (isMobile) {
      setExpanded(false);
    }
  }, [location.pathname, isMobile]);
  
  return (
    <>
      {/* Backdrop overlay for mobile */}
      <div
        className={cn(
          "bg-black/20 backdrop-blur-sm h-screen fixed inset-0 z-40 transition-opacity lg:hidden",
          expanded ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={toggleSidebar}
      />
      
      {/* Main sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700/50 transition-transform lg:translate-x-0 lg:z-10 lg:fixed lg:h-screen",
          !expanded && "-translate-x-full"
        )}
      >
        {/* Sidebar header with logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200 dark:border-slate-700/50">
          <div className="flex items-center gap-2 text-primary font-semibold text-lg">
            <Zap size={24} className="text-primary" />
            <span className={cn("font-semibold", !expanded && "hidden")}>GridWise</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="lg:hidden"
          >
            <X size={20} />
          </Button>
        </div>
        
        {/* Scrollable sidebar content */}
        <ScrollArea className="flex-1 py-4">
          {/* Main navigation */}
          <SidebarNavSection
            items={mainNavItems}
            expanded={expanded}
          />
          
          <Separator className="my-4 mx-3" />
          
          {/* System Control section */}
          <SidebarNavSection
            title="System Control"
            items={systemControlItems}
            expanded={expanded}
          />
          
          <Separator className="my-4 mx-3" />
          
          {/* Administration section */}
          <SidebarNavSection
            title="Administration"
            items={adminItems}
            expanded={expanded}
          />
        </ScrollArea>
        
        {/* Footer with collapse button */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700/50">
          <SidebarToggleButton 
            expanded={expanded} 
            onClick={toggleSidebar} 
          />
        </div>
      </div>
      
      {/* Toggle button for desktop collapsed state */}
      {!expanded && !isMobile && (
        <div className="fixed top-0 left-0 z-10 h-screen w-14 bg-transparent flex items-center justify-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            <Menu size={20} />
          </Button>
        </div>
      )}
      
      {/* Mobile menu toggle button */}
      {isMobile && !expanded && (
        <div className="sticky top-0 z-30 bg-transparent py-3 px-4">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleSidebar}
          >
            <Menu size={20} />
          </Button>
        </div>
      )}
    </>
  );
};

export default Sidebar;
