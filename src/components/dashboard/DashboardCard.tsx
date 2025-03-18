
import React from 'react';
import { cn } from '@/lib/utils';
import GlassPanel from '../ui/GlassPanel';

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  loading?: boolean;
  interactive?: boolean;
}

const DashboardCard = ({
  title,
  children,
  className,
  icon,
  actions,
  loading = false,
  interactive = false,
}: DashboardCardProps) => {
  return (
    <GlassPanel
      className={cn("overflow-hidden", className)}
      interactive={interactive}
    >
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center space-x-3">
          {icon && <div className="text-muted-foreground">{icon}</div>}
          <h3 className="font-medium text-sm">{title}</h3>
        </div>
        {actions && <div>{actions}</div>}
      </div>
      <div className={cn("p-4", loading && "animate-pulse")}>
        {children}
      </div>
    </GlassPanel>
  );
};

export default DashboardCard;
