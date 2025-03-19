
import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TimeframeSelector from './TimeframeSelector';
import ComparisonToggle from './ComparisonToggle';

interface AnalyticsHeaderProps {
  timeframe: string;
  setTimeframe: (value: string) => void;
  dataComparisonEnabled: boolean;
  setDataComparisonEnabled: (value: boolean) => void;
}

const AnalyticsHeader = ({
  timeframe,
  setTimeframe,
  dataComparisonEnabled,
  setDataComparisonEnabled
}: AnalyticsHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Energy Analytics</h1>
        <p className="text-muted-foreground">Comprehensive data analysis and performance insights</p>
      </div>
      <div className="flex items-center gap-3">
        <TimeframeSelector 
          timeframe={timeframe} 
          setTimeframe={setTimeframe} 
        />
        <ComparisonToggle 
          timeframe={timeframe}
          dataComparisonEnabled={dataComparisonEnabled}
          setDataComparisonEnabled={setDataComparisonEnabled}
        />
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Download size={16} />
          <span>Export</span>
        </Button>
      </div>
    </div>
  );
};

export default AnalyticsHeader;
