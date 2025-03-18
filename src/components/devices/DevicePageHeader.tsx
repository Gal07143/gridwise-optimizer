
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, Save } from 'lucide-react';

interface DevicePageHeaderProps {
  title: string;
  subtitle: string;
  onBack: () => void;
  onSave: (e?: React.FormEvent) => void;  // Updated to accept an optional FormEvent
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
        onClick={(e) => onSave(e)}  // Pass the event to the onSave function
        disabled={isSaving}
      >
        <Save size={16} />
        <span>{isSaving ? 'Saving...' : 'Save Device'}</span>
      </Button>
    </div>
  );
};

export default DevicePageHeader;
