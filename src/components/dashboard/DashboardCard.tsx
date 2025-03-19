
import React from 'react';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  loading?: boolean;
  interactive?: boolean;
  style?: React.CSSProperties;
}

const DashboardCard = ({
  title,
  children,
  className,
  icon,
  actions,
  loading = false,
  interactive = false,
  style,
}: DashboardCardProps) => {
  return (
    <div
      className={cn(
        "rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700/50",
        "bg-white dark:bg-slate-800",
        interactive && "hover:shadow-md transition-shadow duration-300",
        className
      )}
      style={style}
    >
      <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700/50">
        <div className="flex items-center space-x-3">
          {icon && <div className="text-primary">{icon}</div>}
          <h3 className="font-medium text-sm">{title}</h3>
        </div>
        {actions && <div>{actions}</div>}
      </div>
      <div className={cn("p-4", loading && "animate-pulse")}>
        {children}
      </div>
    </div>
  );
};

export default DashboardCard;
