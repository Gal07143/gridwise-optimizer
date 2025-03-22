
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Shield, Lock, Key, UserCheck, Network, Bug, Shield as ShieldIcon } from 'lucide-react';

interface SecurityOverviewProps {
  overallScore: number;
  scoreColor: string;
  progressColor: (score: number) => string;
  securityScores: {
    accessControl: number;
    dataEncryption: number;
    apiSecurity: number;
    userAuthentication: number;
    networkSecurity: number;
    vulnerabilities: number;
    malwareProtection: number;
  };
}

const SecurityOverview: React.FC<SecurityOverviewProps> = ({
  overallScore,
  scoreColor,
  progressColor,
  securityScores
}) => {
  const scoreCategories = [
    { 
      name: 'Access Control', 
      score: securityScores.accessControl,
      icon: <Lock className="h-4 w-4" />,
      description: 'User access and permissions'
    },
    { 
      name: 'Data Encryption', 
      score: securityScores.dataEncryption,
      icon: <Shield className="h-4 w-4" />,
      description: 'Data-at-rest and data-in-transit'
    },
    { 
      name: 'API Security', 
      score: securityScores.apiSecurity,
      icon: <Key className="h-4 w-4" />,
      description: 'API authentication and logging'
    },
    { 
      name: 'User Authentication', 
      score: securityScores.userAuthentication,
      icon: <UserCheck className="h-4 w-4" />,
      description: 'Login and session security'
    },
    { 
      name: 'Network Security', 
      score: securityScores.networkSecurity,
      icon: <Network className="h-4 w-4" />,
      description: 'Firewall rules and restrictions'
    },
    { 
      name: 'Vulnerabilities', 
      score: securityScores.vulnerabilities,
      icon: <Bug className="h-4 w-4" />,
      description: 'Known security vulnerabilities'
    },
    { 
      name: 'Malware Protection', 
      score: securityScores.malwareProtection,
      icon: <ShieldIcon className="h-4 w-4" />,
      description: 'Protection against malicious code'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Overall Security</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center text-center">
            <div className={`text-5xl font-bold mb-2 ${scoreColor}`}>
              {overallScore}%
            </div>
            <Progress 
              value={overallScore} 
              className={`w-full h-2 ${progressColor(overallScore)}`} 
            />
            <p className="mt-4 text-sm text-muted-foreground">
              Your overall security score is calculated based on seven key security dimensions.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Security Dimensions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {scoreCategories.map((category) => (
              <div key={category.name} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {category.icon}
                    <span className="text-sm font-medium">{category.name}</span>
                  </div>
                  <span 
                    className={`text-sm font-medium ${progressColor(category.score).replace('bg-', 'text-')}`}
                  >
                    {category.score}%
                  </span>
                </div>
                <Progress 
                  value={category.score} 
                  className={`w-full h-1.5 ${progressColor(category.score)}`} 
                />
                <p className="text-xs text-muted-foreground mt-0.5">{category.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityOverview;
