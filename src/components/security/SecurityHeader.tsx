
import React from 'react';
import { Button } from '@/components/ui/button';
import { Shield, RefreshCw } from 'lucide-react';

interface SecurityHeaderProps {
  isLoading: boolean;
  onRunScan: () => void;
}

const SecurityHeader = ({ isLoading, onRunScan }: SecurityHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Security Center</h1>
        <p className="text-muted-foreground">Manage and monitor system security</p>
      </div>
      <Button 
        onClick={onRunScan} 
        disabled={isLoading}
        className="mt-4 sm:mt-0"
      >
        {isLoading ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Running Scan...
          </>
        ) : (
          <>
            <Shield className="mr-2 h-4 w-4" />
            Run Security Scan
          </>
        )}
      </Button>
    </div>
  );
};

export default SecurityHeader;
