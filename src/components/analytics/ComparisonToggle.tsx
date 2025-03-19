
import React from 'react';
import { Switch } from '@/components/ui/switch';

interface ComparisonToggleProps {
  timeframe: string;
  dataComparisonEnabled: boolean;
  setDataComparisonEnabled: (value: boolean) => void;
}

const ComparisonToggle = ({
  timeframe,
  dataComparisonEnabled,
  setDataComparisonEnabled
}: ComparisonToggleProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Switch 
        id="comparison-toggle"
        checked={dataComparisonEnabled}
        onCheckedChange={setDataComparisonEnabled}
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
