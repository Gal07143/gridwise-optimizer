
import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GlassPanel from '@/components/ui/GlassPanel';
import AppLayout from '@/components/layout/AppLayout';
import { SettingsPageTemplateProps } from './SettingsPageTemplateProps';

const SettingsPageTemplate = ({ 
  title, 
  description, 
  children, 
  backLink = '/settings',
  headerIcon,
  actions
}: SettingsPageTemplateProps) => {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div>
        <div className="mb-6 flex justify-between items-start">
          <div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1 mb-2"
              onClick={() => navigate(backLink)}
            >
              <ChevronLeft size={16} />
              <span>Back to Settings</span>
            </Button>
            <div className="flex items-center gap-3 mb-1">
              {headerIcon && (
                <div className="rounded-full p-2 bg-primary/10 text-primary">
                  {headerIcon}
                </div>
              )}
              <h1 className="text-2xl font-semibold">{title}</h1>
            </div>
            {description && <p className="text-muted-foreground">{description}</p>}
          </div>
          {actions && (
            <div className="flex items-center gap-2">
              {actions}
            </div>
          )}
        </div>
        
        <GlassPanel className="p-6">
          {children}
        </GlassPanel>
      </div>
    </AppLayout>
  );
};

export default SettingsPageTemplate;
