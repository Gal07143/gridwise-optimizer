
import React from 'react';
import { Shield, FileText, AlarmClock, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SecurityHeaderProps {
  isLoading: boolean;
  onRunScan: () => void;
}

const SecurityHeader: React.FC<SecurityHeaderProps> = ({ 
  isLoading, 
  onRunScan 
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-gridx-blue" />
          <h1 className="text-2xl font-semibold text-gridx-navy dark:text-white">Security Center</h1>
        </div>
        <p className="text-gridx-gray dark:text-gray-400 mt-1 text-sm">
          Monitor and manage system security settings and access controls
        </p>
      </div>
      <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          className="h-9 border-gridx-blue/20 text-gridx-blue hover:bg-gridx-blue/5"
        >
          <FileText className="h-4 w-4 mr-2" />
          Export Report
        </Button>
        <Button 
          variant="outline" 
          className="h-9 border-gridx-blue/20 text-gridx-blue hover:bg-gridx-blue/5"
        >
          <AlarmClock className="h-4 w-4 mr-2" />
          Schedule Audit
        </Button>
        <Button 
          onClick={onRunScan} 
          disabled={isLoading}
          className="h-9 bg-gridx-blue hover:bg-gridx-blue/90"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Scanning...' : 'Run Security Scan'}
        </Button>
      </div>
    </div>
  );
};

export default SecurityHeader;
