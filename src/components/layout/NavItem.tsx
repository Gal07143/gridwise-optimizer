
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  expanded: boolean;
}

const NavItem = ({ href, icon, children, expanded }: NavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === href || location.pathname.startsWith(`${href}/`);
  
  return (
    <NavLink 
      to={href}
      className={cn(
        'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
        isActive 
          ? 'bg-primary/10 text-primary' 
          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
      )}
    >
      {React.cloneElement(icon as React.ReactElement, {
        className: cn('mr-3 h-5 w-5', 
          isActive ? 'text-primary' : 'text-slate-500 dark:text-slate-400'
        ),
      })}
      <span className={cn('flex-1', !expanded && 'hidden')}>
        {children}
      </span>
    </NavLink>
  );
};

export default NavItem;
