
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ForecastFooterProps {
  confidence: number;
}

const ForecastFooter = ({ confidence }: ForecastFooterProps) => {
  return (
    <div className="mt-2 flex justify-between items-center text-xs text-muted-foreground">
      <div className="flex items-center">
        <AlertCircle size={12} className="mr-1" />
        <span>Forecast Confidence: {confidence}%</span>
      </div>
      <span>Forecasts update hourly</span>
    </div>
  );
};

export default ForecastFooter;
