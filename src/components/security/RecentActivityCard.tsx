
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, AlertTriangle } from 'lucide-react';

interface AuditItem {
  id: number;
  event: string;
  user: string;
  ip: string;
  timestamp: Date;
  status: string;
}

interface RecentActivityCardProps {
  audits: AuditItem[];
}

const RecentActivityCard = ({ audits }: RecentActivityCardProps) => {
  return (
    <Card className="hover-card">
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
        <CardDescription>Recent security events from the system</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {audits.slice(0, 3).map(audit => (
            <div key={audit.id} className="flex items-start space-x-3 p-3 border rounded-md animate-scale">
              {audit.status === "success" ? (
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
              )}
              <div className="flex-1">
                <div className="flex justify-between">
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

export default RecentActivityCard;
