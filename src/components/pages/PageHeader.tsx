
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backLink?: string;
  backLabel?: string;
  actions?: React.ReactNode;
  breadcrumbs?: Array<{
    label: string;
    link?: string;
  }>;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  backLink,
  backLabel = 'Back',
  actions,
  breadcrumbs,
}) => {
  return (
    <div className="flex flex-col space-y-2 pb-4 mb-4 border-b">
      {(backLink || breadcrumbs) && (
        <div className="flex items-center text-sm text-muted-foreground">
          {backLink && (
            <Button variant="ghost" size="sm" className="mr-2 -ml-2 h-8" asChild>
              <Link to={backLink}>
                <ArrowLeft className="mr-1 h-4 w-4" />
                {backLabel}
              </Link>
            </Button>
          )}
          
          {breadcrumbs && (
            <div className="flex items-center">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <ChevronRight className="mx-1 h-4 w-4" />}
                  {crumb.link ? (
                    <Link to={crumb.link} className="hover:underline">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span>{crumb.label}</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {subtitle && (
            <p className="text-muted-foreground">{subtitle}</p>
          )}
        </div>
        
        {actions && (
          <div className="flex items-center space-x-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
