
import React from 'react';

export interface NavSectionProps {
  heading: string;
  children: React.ReactNode;
  collapsed?: boolean;
}

const SidebarNavSection: React.FC<NavSectionProps> = ({ 
  heading, 
  children, 
  collapsed = false 
}) => {
  return (
    <div className="mb-6">
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
