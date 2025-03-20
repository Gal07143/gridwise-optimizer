
import React from 'react';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { CommandHistoryItem } from './types';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CommandHistoryProps {
  commands: CommandHistoryItem[];
}

const CommandHistory: React.FC<CommandHistoryProps> = ({ commands }) => {
  if (!commands || commands.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Command History</CardTitle>
          <CardDescription>Recent system commands and operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No commands have been executed yet.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Command History</CardTitle>
        <CardDescription>Recent system commands and operations</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[300px] overflow-y-auto">
          {commands.map((command, index) => (
            <div 
              key={command.id || index}
              className={cn(
                "flex items-start gap-3 p-4 border-b last:border-b-0",
                command.success ? "hover:bg-green-50 dark:hover:bg-green-900/10" : "hover:bg-red-50 dark:hover:bg-red-900/10"
              )}
            >
              <div className={cn(
                "mt-1 flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center",
                command.success ? "bg-green-100 dark:bg-green-900/20" : "bg-red-100 dark:bg-red-900/20" 
              )}>
                {command.success ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                )}
              </div>
              
              <div className="flex-grow">
                <div className="font-medium">{command.command}</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <Clock className="h-3 w-3" />
                  <span>
                    {format(new Date(command.timestamp), 'MMM d, yyyy h:mm a')}
                  </span>
                  <span className="mx-1">•</span>
                  <span>By {command.user}</span>
                </div>
                {command.details && (
                  <div className="text-sm text-muted-foreground mt-2">{command.details}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CommandHistory;
