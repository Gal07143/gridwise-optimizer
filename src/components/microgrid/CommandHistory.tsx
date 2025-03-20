
import React from 'react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { format } from 'date-fns';
import { CommandHistoryItem } from './types';
import { BadgeExtended } from '@/components/ui/badge-extended';
import { Check, X, Info } from 'lucide-react';

interface CommandHistoryProps {
  history: CommandHistoryItem[];
}

const CommandHistory: React.FC<CommandHistoryProps> = ({ history }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Command History</CardTitle>
        <CardDescription>Recent system commands and their status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Timestamp</TableHead>
                <TableHead>Command</TableHead>
                <TableHead>User</TableHead>
                <TableHead className="w-[100px] text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                    No commands have been executed yet
                  </TableCell>
                </TableRow>
              ) : (
                history.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-xs">
                      {format(new Date(item.timestamp), 'yyyy-MM-dd HH:mm:ss')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-start gap-2">
                        <div>
                          <span className="font-medium">{item.command}</span>
                          {item.details && (
                            <p className="text-xs text-muted-foreground mt-1">{item.details}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{item.user || 'System'}</TableCell>
                    <TableCell className="text-right">
                      {item.success ? (
                        <BadgeExtended variant="success" className="inline-flex items-center">
                          <Check className="h-3 w-3 mr-1" />
                          Success
                        </BadgeExtended>
                      ) : (
                        <BadgeExtended variant="destructive" className="inline-flex items-center">
                          <X className="h-3 w-3 mr-1" />
                          Failed
                        </BadgeExtended>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommandHistory;
