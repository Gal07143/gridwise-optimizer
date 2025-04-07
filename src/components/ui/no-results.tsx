
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
  icon = <SearchX className="h-12 w-12 text-muted-foreground/60" />
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium">{message}</h3>
      {suggestion && (
        <p className="mt-2 text-muted-foreground">{suggestion}</p>
      )}
    </div>
  );
};

export default NoResults;
