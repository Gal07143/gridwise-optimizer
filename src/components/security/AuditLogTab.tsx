
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertTriangle } from 'lucide-react';

interface AuditItem {
  id: number;
  event: string;
  user: string;
  ip: string;
  timestamp: Date;
  status: string;
}

interface AuditLogTabProps {
  audits: AuditItem[];
}

const AuditLogTab = ({ audits }: AuditLogTabProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Security Audit Log</CardTitle>
          <CardDescription>Review system security events and activities</CardDescription>
        </div>
        <Button variant="outline" className="mt-4 sm:mt-0 self-start sm:self-auto">
          Export Logs
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {audits.map(audit => (
            <div key={audit.id} className="flex items-start space-x-3 p-3 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              {audit.status === "success" ? (
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
              )}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <span className="font-medium">{audit.event}</span>
                  <span className="text-xs text-muted-foreground">
                    {format(audit.timestamp, 'MMM d, yyyy h:mm a')}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  User: {audit.user} • IP: {audit.ip}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditLogTab;
