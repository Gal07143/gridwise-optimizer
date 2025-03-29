
import React from 'react';
import TimeframeSelector from './TimeframeSelector';
import { ArrowUpRight } from 'lucide-react';

interface AnalyticsHeaderProps {
  timeframe: string;
  siteName?: string;
}

const AnalyticsHeader = ({
  timeframe,
  siteName = 'Energy Analytics'
}: AnalyticsHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">{siteName}</h1>
        <p className="text-sm text-muted-foreground flex items-center">
          <span>Data for {timeframe}</span>
          <ArrowUpRight className="ml-2 h-4 w-4 text-green-500" />
          <span className="text-green-500 font-medium">+8.2% vs previous period</span>
        </p>
      </div>
    </div>
  );
};

export default AnalyticsHeader;
