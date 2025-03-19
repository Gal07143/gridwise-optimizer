
import React from 'react';
import { cn } from '@/lib/utils';
import NavItem from './NavItem';
import { Separator } from '@/components/ui/separator';

interface NavSectionProps {
  title?: string;
  items: Array<{
    href: string;
    icon: React.ReactNode;
    label: string;
  }>;
  expanded: boolean;
}

const SidebarNavSection = ({ title, items, expanded }: NavSectionProps) => {
  return (
    <div className="px-3 space-y-1">
      {title && (
        <div className={cn("px-3 text-xs text-slate-500 dark:text-slate-400 font-medium mb-2", !expanded && "hidden")}>
          {title}
        </div>
      )}
      
      {items.map((item) => (
        <NavItem 
          key={item.href} 
          href={item.href} 
          icon={item.icon}
          expanded={expanded}
        >
          {item.label}
        </NavItem>
      ))}
    </div>
  );
};

export default SidebarNavSection;
