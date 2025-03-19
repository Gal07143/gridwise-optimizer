
import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const NoRecommendations = () => {
  return (
    <div className="h-[200px] flex flex-col items-center justify-center text-muted-foreground p-4 text-center">
      <CheckCircle2 className="h-12 w-12 text-green-500 mb-2 opacity-50" />
      <p>Your system is already well optimized!</p>
      <p className="text-sm mt-1">We'll generate new recommendations as we gather more data.</p>
    </div>
  );
};

export default NoRecommendations;
