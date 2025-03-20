import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Shield, Lock, Users, Activity, FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';

// Mock security audit data
const securityAudits = [
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
const securityScores = [
  { name: "Access Controls", score: 85, recommendation: "Enable multi-factor authentication for all admin accounts" },
  { name: "Data Encryption", score: 92, recommendation: null },
  { name: "User Permissions", score: 78, recommendation: "Review role-based access control settings for operator accounts" },
  { name: "System Updates", score: 95, recommendation: null },
  { name: "Vulnerability Management", score: 70, recommendation: "Schedule a security audit for API endpoints" }
];

const Security = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
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

  return (
    <AppLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold mb-1">Security Center</h1>
            <p className="text-muted-foreground">Manage and monitor system security</p>
          </div>
          <Button>
            <Shield className="mr-2 h-4 w-4" />
            Run Security Scan
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="access">Access Control</TabsTrigger>
            <TabsTrigger value="encryption">Encryption</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Security Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="text-center">
                      <div className="relative inline-flex items-center justify-center">
                        <svg className="w-32 h-32">
                          <circle
                            className="text-muted stroke-current"
                            strokeWidth="8"
                            stroke="currentColor"
                            fill="transparent"
                            r="56"
                            cx="64"
                            cy="64"
                          />
                          <circle
                            className={`${getScoreColor(overallScore)} stroke-current`}
                            strokeWidth="8"
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="56"
                            cx="64"
                            cy="64"
                            strokeDasharray={`${overallScore * 3.51}, 400`}
                          />
                        </svg>
                        <span className={`absolute text-2xl font-bold ${getScoreColor(overallScore)}`}>
                          {overallScore}%
                        </span>
                      </div>
                      <h3 className="text-lg font-medium mt-2">Overall Score</h3>
                    </div>
                    
                    <div className="space-y-4">
                      {securityScores
                        .filter(item => item.recommendation)
                        .slice(0, 3)
                        .map(item => (
                          <div key={item.name} className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">{item.name}</span>
                              <span className={`text-sm ${getScoreColor(item.score)}`}>{item.score}%</span>
                            </div>
                            <Progress value={item.score} className={getProgressColor(item.score)} />
                            <p className="text-xs text-muted-foreground">{item.recommendation}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Lock className="mr-2 h-4 w-4" />
                      Configure 2FA
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="mr-2 h-4 w-4" />
                      Manage User Access
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Activity className="mr-2 h-4 w-4" />
                      View Audit Logs
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="mr-2 h-4 w-4" />
                      Security Policies
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
                <CardDescription>Recent security events from the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {securityAudits.slice(0, 3).map(audit => (
                    <div key={audit.id} className="flex items-start space-x-3 p-3 border rounded-md">
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
          </TabsContent>

          <TabsContent value="access" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Access Control Settings</CardTitle>
                <CardDescription>Configure authentication and access policies</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-12 text-muted-foreground">
                  Access control content will be implemented here
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="encryption" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Encryption Settings</CardTitle>
                <CardDescription>Manage data encryption and security protocols</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-12 text-muted-foreground">
                  Encryption settings content will be implemented here
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Audit Log</CardTitle>
                <CardDescription>Review system security events and activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {securityAudits.map(audit => (
                    <div key={audit.id} className="flex items-start space-x-3 p-3 border rounded-md">
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
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Security;
