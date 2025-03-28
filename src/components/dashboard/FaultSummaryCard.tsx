
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export interface Fault {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  timestamp: string;
  status: 'active' | 'acknowledged' | 'resolved';
  device?: {
    id: string;
    name: string;
  };
}

interface FaultSummaryCardProps {
  faults?: Fault[];
}

const FaultSummaryCard: React.FC<FaultSummaryCardProps> = ({ faults = [] }) => {
  // Count faults by severity
  const criticalCount = faults.filter(f => f.severity === 'critical' && f.status === 'active').length;
  const warningCount = faults.filter(f => f.severity === 'warning' && f.status === 'active').length;
  const infoCount = faults.filter(f => f.severity === 'info' && f.status === 'active').length;
  const acknowledgedCount = faults.filter(f => f.status === 'acknowledged').length;
  
  return (
    <Card className="col-span-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">System Faults</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50">
            <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/50">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{criticalCount}</div>
              <div className="text-xs text-muted-foreground">Critical</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50">
            <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/50">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{warningCount}</div>
              <div className="text-xs text-muted-foreground">Warnings</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50">
              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{acknowledgedCount}</div>
              <div className="text-xs text-muted-foreground">Acknowledged</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-100 dark:border-green-900/50">
            <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/50">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{faults.length - (criticalCount + warningCount + acknowledgedCount)}</div>
              <div className="text-xs text-muted-foreground">Resolved</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FaultSummaryCard;
