
import React from 'react';
import { cn } from '@/lib/utils';

export interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
  categoryId?: string;
  actions?: React.ReactNode;
}

const PageHeader = ({
  title,
  description,
  className,
  categoryId,
  actions,
}: PageHeaderProps) => {
  return (
    <div className={cn("flex flex-col md:flex-row items-start md:items-center justify-between mb-6", className)}>
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
      {actions && <div className="mt-4 md:mt-0 flex gap-2">{actions}</div>}
    </div>
  );
};

export default PageHeader;
