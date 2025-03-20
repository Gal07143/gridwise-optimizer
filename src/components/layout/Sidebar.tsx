
import React, { useMemo } from 'react';
import { useSite } from '@/contexts/SiteContext';
import SidebarNavSection from './SidebarNavSection';
import SidebarToggleButton from './SidebarToggleButton';
import { mainNavItems, systemControlItems, adminItems, integrationItems } from './sidebarNavData';
import { Cpu, Settings } from 'lucide-react';

interface SidebarProps {
  isExpanded: boolean;
  toggleSidebar: () => void;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isExpanded, toggleSidebar, className }) => {
  const { currentSite } = useSite();
  
  const mainNavItemsWithLabeledSections = useMemo(() => {
    return mainNavItems.map(item => ({ ...item, isLabelledSection: true }));
  }, []);

  return (
    <div className={`${className} min-h-screen h-full flex flex-col bg-background border-r`}>
      <div className="p-4 flex items-center justify-between">
        <div className={`flex items-center gap-2 ${!isExpanded && 'justify-center w-full'}`}>
          <img 
            src="/placeholder.svg" 
            alt="Logo" 
            className="h-6 w-6"
          />
          {isExpanded && <span className="font-semibold text-lg">Energy EMS</span>}
        </div>
        
        <SidebarToggleButton isExpanded={isExpanded} toggleSidebar={toggleSidebar} />
      </div>
      
      {currentSite && (
        <div className={`px-3 py-2 text-xs text-muted-foreground uppercase font-medium ${!isExpanded && 'sr-only'}`}>
          {currentSite.name}
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto py-2">
        <SidebarNavSection 
          items={mainNavItemsWithLabeledSections} 
          isExpanded={isExpanded} 
          sectionTitle="Main" 
        />

        <SidebarNavSection 
          items={systemControlItems} 
          isExpanded={isExpanded} 
          sectionTitle="System Control"
          icon={<Cpu size={14} />}
        />
        
        <SidebarNavSection 
          items={integrationItems} 
          isExpanded={isExpanded} 
          sectionTitle="Device Integrations"
          icon={<Cpu size={14} />}
        />
        
        <SidebarNavSection 
          items={adminItems} 
          isExpanded={isExpanded} 
          sectionTitle="Administration"
          icon={<Settings size={14} />}
        />
      </div>
    </div>
  );
};

export default Sidebar;
