
import { useState } from 'react';
import { toast } from 'sonner';

// Mock security audit data
export const securityAudits = [
  {
    id: 1,
    event: "User Login Attempt",
    user: "admin@example.com",
    ip: "192.168.1.105",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    status: "success"
  },
  {
    id: 2,
    event: "Password Changed",
    user: "operator@example.com",
    ip: "192.168.1.120",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    status: "success"
  },
  {
    id: 3,
    event: "Failed Login Attempt",
    user: "unknown",
    ip: "203.0.113.42",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
    status: "failure"
  },
  {
    id: 4,
    event: "User Role Modified",
    user: "technician@example.com",
    ip: "192.168.1.110",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    status: "success"
  },
  {
    id: 5,
    event: "API Key Generated",
    user: "admin@example.com",
    ip: "192.168.1.105",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    status: "success"
  }
];

// Security score details
export const securityScores = [
  { name: "Access Controls", score: 85, recommendation: "Enable multi-factor authentication for all admin accounts" },
  { name: "Data Encryption", score: 92, recommendation: null },
  { name: "User Permissions", score: 78, recommendation: "Review role-based access control settings for operator accounts" },
  { name: "System Updates", score: 95, recommendation: null },
  { name: "Vulnerability Management", score: 70, recommendation: "Schedule a security audit for API endpoints" }
];

export const useSecurityStatus = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Calculate overall security score
  const overallScore = Math.round(
    securityScores.reduce((sum, item) => sum + item.score, 0) / securityScores.length
  );

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 70) return "text-amber-500";
    return "text-red-500";
  };

  const getProgressColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 70) return "bg-amber-500";
    return "bg-red-500";
  };

  const handleRunScan = () => {
    setIsLoading(true);
    toast.info("Security scan started. This may take a few minutes.");
    
    // Simulate scan completion
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Security scan completed successfully.");
    }, 3000);
  };

  return {
    isLoading,
    overallScore,
    getScoreColor,
    getProgressColor,
    handleRunScan
  };
};
