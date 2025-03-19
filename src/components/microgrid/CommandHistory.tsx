
import React from 'react';
import { History, Check, X } from 'lucide-react';
import { CommandHistoryItem } from './types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface CommandHistoryProps {
  commandHistory: CommandHistoryItem[];
}

const CommandHistory: React.FC<CommandHistoryProps> = ({ commandHistory }) => {
  // Function to format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString() + ', ' + date.toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader className="bg-primary/5">
        <CardTitle className="flex items-center text-lg">
          <History className="mr-2 h-5 w-5 text-primary" />
          Command History
        </CardTitle>
        <CardDescription>
          Recent control actions and system commands
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="relative">
          <div className="absolute inset-0 w-0.5 bg-slate-200 dark:bg-slate-700 ml-4 mt-6 mb-6"></div>
          <div className="space-y-6 relative">
            {commandHistory.map((command, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center z-10">
                  {command.success ? 
                    <Check className="h-5 w-5 text-primary" /> : 
                    <X className="h-5 w-5 text-red-500" />
                  }
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <div className="font-medium">{command.command}</div>
                    <div className="text-sm text-muted-foreground">{formatDate(command.timestamp)}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Initiated by: {command.user}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommandHistory;
