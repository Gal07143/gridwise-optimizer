import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CommandHistoryItem } from './types';

export interface CommandHistoryProps {
  commandHistory: CommandHistoryItem[];
}

const CommandHistory: React.FC<CommandHistoryProps> = ({ commandHistory = [] }) => {
  if (commandHistory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Command History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No commands have been executed yet
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Command History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Command</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {commandHistory.map((command) => (
              <TableRow key={command.id || command.timestamp}>
                <TableCell>
                  {new Date(command.timestamp).toLocaleString()}
                </TableCell>
                <TableCell className="font-medium">{command.command}</TableCell>
                <TableCell>{command.user}</TableCell>
                <TableCell>
                  {command.success ? (
                    <Badge className="bg-green-100 text-green-800 border-green-300">
                      <CheckCircle className="h-3.5 w-3.5 mr-1" />
                      Success
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-300">
                      <XCircle className="h-3.5 w-3.5 mr-1" />
                      Failed
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {command.details || '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CommandHistory;
