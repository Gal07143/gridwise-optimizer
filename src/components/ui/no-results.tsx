
import React from 'react';
import { SearchX } from 'lucide-react';

interface NoResultsProps {
  message: string;
  suggestion?: string;
  icon?: React.ReactNode;
}

const NoResults: React.FC<NoResultsProps> = ({
  message,
  suggestion,
  icon = <SearchX className="h-12 w-12 text-muted-foreground/70" />,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-slate-50 dark:bg-slate-800/50 rounded-lg">
      <div className="mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium mb-2">{message}</h3>
      {suggestion && (
        <p className="text-sm text-muted-foreground max-w-md">{suggestion}</p>
      )}
    </div>
  );
};

export default NoResults;
