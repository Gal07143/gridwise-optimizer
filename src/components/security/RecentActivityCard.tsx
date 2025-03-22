
import React from 'react';
import {
  LayoutList,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Globe
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ActivityItem {
  id: string;
  timestamp: Date;
  action: string;
  status: string;
  actor: string;
  details: string;
  source_ip: string;
}

interface RecentActivityCardProps {
  audits: ActivityItem[];
}

const RecentActivityCard: React.FC<RecentActivityCardProps> = ({ audits }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failure':
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <Card className="col-span-1">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <LayoutList className="h-5 w-5 text-primary mr-2" />
            <CardTitle>Recent Activity</CardTitle>
          </div>
        </div>
        <CardDescription>
          Recent security events and user activities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {audits.map((item) => (
            <div key={item.id} className="flex items-start">
              <div className="mr-3 mt-0.5">
                {getStatusIcon(item.status)}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium leading-none">{item.action}</p>
                  <span className="text-xs text-muted-foreground">
                    {formatTime(item.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {item.details}
                </p>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <User className="h-3 w-3 mr-1" />
                  <span className="mr-3">{item.actor}</span>
                  <Globe className="h-3 w-3 mr-1" />
                  <span>{item.source_ip}</span>
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
