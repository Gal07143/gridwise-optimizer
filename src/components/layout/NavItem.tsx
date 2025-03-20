
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  expanded: boolean; // Changed from isExpanded to expanded
  isLabelledSection?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ 
  href, 
  icon, 
  label, 
  expanded, // Changed from isExpanded to expanded
  isLabelledSection 
}) => {
  return (
    <NavLink
      to={href}
      className={({ isActive }) => cn(
        "flex items-center py-2 px-3 text-sm rounded-md transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        isActive ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground",
        !expanded && "justify-center"
      )}
    >
      <span className={`${!expanded ? 'mx-auto' : 'mr-2'}`}>
        {icon}
      </span>
      {expanded && <span>{label}</span>}
    </NavLink>
  );
};

export default NavItem;
