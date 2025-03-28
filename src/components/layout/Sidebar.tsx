import React from 'react';
import { SidebarNavSection } from './SidebarNavSection';
import { useSiteContext } from '@/contexts/SiteContext';
import { sidebarNavData } from './sidebarNavData';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from 'lucide-react';
import { SiteSelector } from '@/components/sites/SiteSelector';

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const { activeSite } = useSiteContext();

  return (
    <aside className={`hidden md:block flex-shrink-0 w-64 border-r ${className}`}>
      <div className="p-4">
        <SiteSelector />
      </div>
      <nav className="flex flex-col h-full">
        {sidebarNavData.map((section, index) => (
          <SidebarNavSection key={index} section={section} />
        ))}
        <div className="mt-auto p-4 text-center text-muted-foreground text-sm">
          {activeSite ? `Active Site: ${activeSite.name}` : 'No Active Site'}
        </div>
      </nav>
    </aside>
  );
};

export const MobileSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Menu className="md:hidden h-6 w-6" />
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0 border-r">
        <div className="p-4">
          <SiteSelector />
        </div>
        <nav className="flex flex-col h-full">
          {sidebarNavData.map((section, index) => (
            <SidebarNavSection key={index} section={section} />
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}

export default Sidebar;
