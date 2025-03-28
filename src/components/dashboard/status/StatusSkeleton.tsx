
import React from 'react';

const StatusSkeleton: React.FC = () => {
  return (
    <div className="space-y-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-lg"></div>
      ))}
    </div>
  );
};

export default StatusSkeleton;
