
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SettingsPageTemplateProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  headerIcon?: React.ReactNode;
  backLink?: string;
}

const SettingsPageTemplate: React.FC<SettingsPageTemplateProps> = ({
  title,
  description,
  children,
  actions,
  headerIcon,
  backLink
}) => {
  return (
    <div className="container max-w-5xl p-6 mx-auto">
      <div className="mb-8">
        {backLink && (
          <Link 
            to={backLink} 
            className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
        )}
        
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            {headerIcon && (
              <div className="p-2 bg-primary/10 text-primary rounded-full">
                {headerIcon}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
              {description && (
                <p className="text-muted-foreground">{description}</p>
              )}
            </div>
          </div>
          
          {actions && (
            <div className="flex gap-2">
              {actions}
            </div>
          )}
        </div>
      </div>
      
      <div className={cn("space-y-6", backLink && "ml-4")}>
        {children}
      </div>
    </div>
  );
};

export default SettingsPageTemplate;
