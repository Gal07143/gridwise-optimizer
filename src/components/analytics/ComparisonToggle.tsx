
import React from 'react';
import { Switch } from '@/components/ui/switch';

interface ComparisonToggleProps {
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
  timeframe?: string;
}

const ComparisonToggle = ({
  checked,
  onCheckedChange,
  timeframe = 'period'
}: ComparisonToggleProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Switch 
        id="comparison-toggle"
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
      <label 
        htmlFor="comparison-toggle" 
        className="text-sm font-medium cursor-pointer"
      >
        Compare with previous {timeframe}
      </label>
    </div>
  );
};

export default ComparisonToggle;
