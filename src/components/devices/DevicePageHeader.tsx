
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks/use-mobile';

interface DevicePageHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  onSettings?: () => void;
  children?: React.ReactNode;
}

const DevicePageHeader: React.FC<DevicePageHeaderProps> = ({
  title,
  subtitle,
  onBack,
  onSettings,
  children,
}) => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/devices');
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={handleBack} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back</span>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {subtitle && (
            <p className="text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2 w-full sm:w-auto">
        {children}
        
        {onSettings && (
          <Button variant="outline" size="sm" onClick={onSettings}>
            <Settings className="h-4 w-4 mr-2" />
            {!isMobile && "Settings"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default DevicePageHeader;
