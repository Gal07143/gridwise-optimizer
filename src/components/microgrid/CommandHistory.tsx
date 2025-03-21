
import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '@/components/ui/card';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge-extended';
import { Terminal } from 'lucide-react';
import { CommandHistoryItem } from '@/components/microgrid/types';

export interface CommandHistoryProps {
  commandHistory: CommandHistoryItem[];
}

const CommandHistory: React.FC<CommandHistoryProps> = ({ commandHistory }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Terminal className="h-5 w-5" />
          Command History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {commandHistory.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No commands have been executed
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Command</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {commandHistory.slice(0, 10).map((command, index) => (
                <TableRow key={command.id || index}>
                  <TableCell className="text-xs">
                    {new Date(command.timestamp).toLocaleTimeString()}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{command.command}</div>
                    {command.details && (
                      <div className="text-xs text-muted-foreground">{command.details}</div>
                    )}
                  </TableCell>
                  <TableCell>{command.user}</TableCell>
                  <TableCell>
                    {command.success ? (
                      <Badge variant="success">Success</Badge>
                    ) : (
                      <Badge variant="destructive">Failed</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default CommandHistory;
