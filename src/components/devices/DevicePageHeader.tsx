
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, Save } from 'lucide-react';

interface DevicePageHeaderProps {
  title: string;
  subtitle: string;
  onBack: () => void;
  onSave: () => void;
  isSaving: boolean;
}

const DevicePageHeader: React.FC<DevicePageHeaderProps> = ({
  title,
  subtitle,
  onBack,
  onSave,
  isSaving
}) => {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1 mb-2"
          onClick={onBack}
        >
          <ChevronLeft size={16} />
          <span>Back to Devices</span>
        </Button>
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>
      <Button 
        className="flex items-center gap-2"
        onClick={onSave}
        disabled={isSaving}
      >
        <Save size={16} />
        <span>{isSaving ? 'Saving...' : 'Save Device'}</span>
      </Button>
    </div>
  );
};

export default DevicePageHeader;
