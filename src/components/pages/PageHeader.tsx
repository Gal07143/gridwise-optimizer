
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export interface PageHeaderProps {
  title: string;
  description?: string;
  categoryId?: string;
  backLink?: string;
  onBack?: () => void;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  backLink,
  onBack,
  children,
  actions,
  className,
}) => {
  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else if (backLink) {
      window.history.back();
    }
  };

  return (
    <div className={cn("pb-6", className)}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-0">
          <div className="flex items-center gap-2">
            {(backLink || onBack) && (
              <Button
                variant="ghost"
                size="sm"
                className="mr-2 h-8 w-8 p-0"
                onClick={handleBackClick}
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
            )}
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          </div>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
          {children}
        </div>
        {actions && (
          <div className="flex items-center gap-2 self-start md:self-center">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
