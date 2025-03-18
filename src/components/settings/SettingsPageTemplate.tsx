
import React, { ReactNode } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import GlassPanel from '@/components/ui/GlassPanel';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SettingsPageTemplateProps {
  title: string;
  description?: string;
  children: ReactNode;
  backLink?: string;
  headerIcon?: ReactNode;
}

const SettingsPageTemplate = ({ 
  title, 
  description, 
  children, 
  backLink = '/settings',
  headerIcon
}: SettingsPageTemplateProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
          <div className="mb-6">
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
          
          <GlassPanel className="p-6">
            {children}
          </GlassPanel>
        </div>
      </div>
    </div>
  );
};

export default SettingsPageTemplate;
