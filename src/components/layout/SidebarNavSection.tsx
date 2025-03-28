
import React, { ReactNode } from 'react';

export interface SidebarNavSectionProps {
  heading: string;
  children: ReactNode;
  collapsed?: boolean;
}

const SidebarNavSection: React.FC<SidebarNavSectionProps> = ({ 
  heading, 
  children, 
  collapsed = false 
}) => {
  return (
    <div className="py-2">
      {!collapsed && (
        <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {heading}
        </h3>
      )}
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
};

export default SidebarNavSection;
