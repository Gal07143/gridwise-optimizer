
import React from 'react';
import { CloudSun, Zap } from 'lucide-react';

interface ForecastFooterProps {
  confidence: number;
}

const ForecastFooter = ({ confidence }: ForecastFooterProps) => {
  return (
    <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
      <div className="flex items-center">
        <CloudSun size={14} className="mr-1" />
        <span>Weather data updated: {new Date().toLocaleTimeString()}</span>
      </div>
      <div className="flex items-center">
        <Zap size={14} className="mr-1" />
        <span>AI forecast model: {confidence.toFixed(1)}% accuracy</span>
      </div>
    </div>
  );
};

export default ForecastFooter;
