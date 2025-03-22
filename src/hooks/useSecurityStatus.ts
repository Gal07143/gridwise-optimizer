
import { useState } from 'react';
import { toast } from 'sonner';

// Mock security audit data
export const securityAudits = [
  {
    id: 'audit1',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    action: 'Login attempt',
    status: 'success',
    actor: 'admin@example.com',
    details: 'Successful login from IP 192.168.1.1',
    source_ip: '192.168.1.1'
  },
  {
    id: 'audit2',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    action: 'Password change',
    status: 'success',
    actor: 'john@example.com',
    details: 'User changed their password',
    source_ip: '192.168.1.2'
  },
  {
    id: 'audit3',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    action: 'Login attempt',
    status: 'failure',
    actor: 'unknown',
    details: 'Failed login attempt for user admin@example.com',
    source_ip: '10.0.0.5'
  },
  {
    id: 'audit4',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
    action: 'Permission change',
    status: 'success',
    actor: 'admin@example.com',
    details: 'Changed user role from viewer to editor',
    source_ip: '192.168.1.1'
  },
  {
    id: 'audit5',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    action: 'API key created',
    status: 'success',
    actor: 'admin@example.com',
    details: 'Created new API key for integration',
    source_ip: '192.168.1.1'
  }
];

// Mock security scores
export const securityScores = {
  accessControl: 85,
  dataEncryption: 92,
  apiSecurity: 78,
  userAuthentication: 88,
  networkSecurity: 75,
  vulnerabilities: 90,
  malwareProtection: 95
};

export const useSecurityStatus = () => {
  const [isScanning, setIsScanning] = useState(false);

  // Calculate overall security score based on component scores
  const overallScore = Math.round(
    Object.values(securityScores).reduce((sum, score) => sum + score, 0) / 
    Object.values(securityScores).length
  );

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 75) return 'text-amber-500';
    return 'text-red-500';
  };

  const getProgressColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 75) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const handleRunScan = () => {
    setIsScanning(true);
    
    // Simulate security scan
    toast.info('Security scan initiated...');
    
    setTimeout(() => {
      setIsScanning(false);
      toast.success('Security scan completed successfully');
    }, 3000);
  };

  return {
    isLoading: isScanning,
    overallScore,
    getScoreColor,
    getProgressColor,
    handleRunScan
  };
};
