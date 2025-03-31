
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Check, Info, AlertTriangle, CalendarIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Sample alert data
const alertHistory = [
  { 
    id: 1, 
    date: '2023-08-18', 
    time: '14:32', 
    message: 'PV production 15% below prediction - panel cleaning recommended',
    severity: 'warning',
    resolved: true
  },
  { 
    id: 2, 
    date: '2023-08-17', 
    time: '08:15', 
    message: 'Battery cycle efficiency decreased to 92% - monitoring',
    severity: 'info',
    resolved: false
  },
  { 
    id: 3, 
    date: '2023-08-15', 
    time: '22:04', 
    message: 'Grid outage detected - switched to backup power',
    severity: 'alert',
    resolved: true
  },
  { 
    id: 4, 
    date: '2023-08-12', 
    time: '16:45', 
    message: 'Inverter efficiency optimization performed',
    severity: 'info',
    resolved: true
  },
  { 
    id: 5, 
    date: '2023-08-10', 
    time: '11:30', 
    message: 'Weather pattern change detected - adjusted forecast',
    severity: 'info',
    resolved: true
  },
];

const AIAlertHistory = () => {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'alert':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'info':
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <Card className="col-span-1">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-primary" />
          AI Alert History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 overflow-auto max-h-64">
          {alertHistory.map(alert => (
            <div 
              key={alert.id} 
              className={`p-2 rounded-md text-sm ${
                alert.severity === 'alert' ? 'bg-red-50 dark:bg-red-900/10' : 
                alert.severity === 'warning' ? 'bg-amber-50 dark:bg-amber-900/10' : 
                'bg-blue-50 dark:bg-blue-900/10'
              }`}
            >
              <div className="flex items-start gap-2">
                {getSeverityIcon(alert.severity)}
                <div className="flex-1">
                  <p>{alert.message}</p>
                  <div className="flex justify-between items-center mt-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-3 w-3" />
                      <span>{alert.date} {alert.time}</span>
                    </div>
                    {alert.resolved ? (
                      <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 dark:bg-green-900/10 flex items-center gap-1 h-5">
                        <Check className="h-3 w-3" />
                        <span>Resolved</span>
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-900/10 h-5">
                        Active
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIAlertHistory;
