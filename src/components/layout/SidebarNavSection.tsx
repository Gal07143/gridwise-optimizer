
import React from 'react';
import NavItem from './NavItem';

export interface NavSectionProps {
  items: Array<{
    href: string;
    icon: React.ReactNode;
    label: string;
    isLabelledSection?: boolean;
  }>;
  expanded: boolean; // Changed from isExpanded to expanded
  sectionTitle: string;
  icon?: React.ReactNode;
}

const SidebarNavSection: React.FC<NavSectionProps> = ({ 
  items, 
  expanded, // Changed from isExpanded to expanded
  sectionTitle,
  icon
}) => {
  return (
    <div className="px-2 py-2">
      {expanded && (
        <div className="px-3 py-2 text-xs text-muted-foreground uppercase font-medium flex items-center gap-1.5">
          {icon && icon}
          <span>{sectionTitle}</span>
        </div>
      )}
      <div className="space-y-1">
        {items.map((item, i) => (
          <NavItem 
            key={`${item.href}-${i}`} 
            {...item} 
            expanded={expanded} // Changed from isExpanded to expanded
          />
        ))}
      </div>
    </div>
  );
};

export default SidebarNavSection;
