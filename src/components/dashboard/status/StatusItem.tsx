
import React from 'react';
import { CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SystemStatus {
  category: string;
  status: 'operational' | 'maintenance' | 'issue' | 'critical';
  lastUpdated: string;
  details?: string;
}

interface StatusItemProps {
  status: SystemStatus;
}

const StatusItem: React.FC<StatusItemProps> = ({ status }) => {
  const getStatusIcon = (statusType: SystemStatus['status']) => {
    switch (statusType) {
      case 'operational':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'maintenance':
        return <Clock size={16} className="text-blue-500" />;
      case 'issue':
        return <AlertTriangle size={16} className="text-amber-500" />;
      case 'critical':
        return <AlertTriangle size={16} className="text-red-500" />;
      default:
        return null;
    }
  };
  
  const getStatusColor = (statusType: SystemStatus['status']) => {
    switch (statusType) {
      case 'operational':
        return 'bg-green-100 text-green-600 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30';
      case 'maintenance':
        return 'bg-blue-100 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30';
      case 'issue':
        return 'bg-amber-100 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/30';
      case 'critical':
        return 'bg-red-100 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30';
      default:
        return '';
    }
  };

  return (
    <div className="bg-gradient-to-br from-white/80 to-slate-50/80 dark:from-slate-800/50 dark:to-slate-900/50 p-3 rounded-lg border border-slate-200/50 dark:border-slate-700/30 backdrop-blur-sm flex items-center justify-between transition-all hover:shadow-md group">
      <div className="flex-1">
        <div className="text-sm font-medium">{status.category}</div>
        <div className="text-xs text-muted-foreground mt-1">{status.details}</div>
      </div>
      
      <div className="flex items-center">
        <div className={cn(
          "py-1 px-2 rounded-full text-xs font-medium flex items-center mr-3",
          getStatusColor(status.status)
        )}>
          {getStatusIcon(status.status)}
          <span className="ml-1.5 capitalize">{status.status}</span>
        </div>
        <div className="text-xs text-muted-foreground">{status.lastUpdated}</div>
      </div>
    </div>
  );
};

export default StatusItem;
