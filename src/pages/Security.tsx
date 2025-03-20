import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import GlassPanel from '@/components/ui/GlassPanel';
import { Shield, Lock, UserCheck, AlertTriangle, Key, Fingerprint, Eye, EyeOff, HistoryIcon, Clock, Calendar, RefreshCw, CheckCircle2, XCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

// Mock data for security events
const securityEvents = [
  {
    id: 'evt-001',
    timestamp: '2023-12-15T10:30:42Z',
    type: 'authentication',
    action: 'login_success',
    user: 'admin@example.com',
    source: '192.168.1.105',
    details: 'Successful login via web interface'
  },
  {
    id: 'evt-002',
    timestamp: '2023-12-15T08:15:22Z',
    type: 'authentication',
    action: 'login_failed',
    user: 'user@example.com',
    source: '192.168.1.120',
    details: 'Failed login attempt (incorrect password)'
  },
  {
    id: 'evt-003',
    timestamp: '2023-12-14T16:42:10Z',
    type: 'authorization',
    action: 'permission_denied',
    user: 'guest@example.com',
    source: '192.168.1.130',
    details: 'Attempted to access admin settings'
  },
  {
    id: 'evt-004',
    timestamp: '2023-12-14T12:10:05Z',
    type: 'system',
    action: 'settings_changed',
    user: 'admin@example.com',
    source: '192.168.1.105',
    details: 'Security settings updated'
  },
  {
    id: 'evt-005',
    timestamp: '2023-12-13T09:30:18Z',
    type: 'system',
    action: 'firmware_updated',
    user: 'system',
    source: 'localhost',
    details: 'Security firmware updated to v2.3.4'
  }
];

// Mock data for active sessions
const activeSessions = [
  {
    id: 'sess-001',
    user: 'admin@example.com',
    device: 'MacBook Pro',
    browser: 'Chrome 119.0',
    ip: '192.168.1.105',
    location: 'San Francisco, CA',
    loginTime: '2023-12-15T10:30:42Z',
    lastActive: '2023-12-15T11:45:22Z'
  },
  {
    id: 'sess-002',
    user: 'user@example.com',
    device: 'iPhone 14',
    browser: 'Safari 16.0',
    ip: '192.168.1.120',
    location: 'San Francisco, CA',
    loginTime: '2023-12-15T11:05:18Z',
    lastActive: '2023-12-15T11:42:08Z'
  },
  {
    id: 'sess-003',
    user: 'admin@example.com',
    device: 'Windows PC',
    browser: 'Edge 109.0',
    ip: '203.0.113.42',
    location: 'New York, NY',
    loginTime: '2023-12-15T08:22:10Z',
    lastActive: '2023-12-15T10:15:45Z'
  }
];

// Mock data for security threats
const securityThreats = [
  {
    id: 'threat-001',
    timestamp: '2023-12-15T06:42:18Z',
    severity: 'medium',
    type: 'suspicious_login',
    status: 'investigating',
    source: '203.0.113.100',
    details: 'Multiple failed login attempts detected'
  },
  {
    id: 'threat-002',
    timestamp: '2023-12-14T22:15:30Z',
    severity: 'high',
    type: 'api_abuse',
    status: 'mitigated',
    source: '198.51.100.75',
    details: 'Unusual API request pattern detected and blocked'
  }
];

const Security = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [timeRange, setTimeRange] = useState('24h');
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  
  const timeSince = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 3600;
    if (interval > 24) {
      return Math.floor(interval / 24) + "d ago";
    }
    if (interval > 1) {
      return Math.floor(interval) + "h ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + "m ago";
    }
    return Math.floor(seconds) + "s ago";
  };
  
  const SecurityStat = ({ 
    icon: Icon, 
    title, 
    value, 
    status,
    detail
  }: { 
    icon: React.ElementType; 
    title: string; 
    value: string | number;
    status: 'good' | 'warning' | 'critical';
    detail?: string;
  }) => (
    <div className="flex items-center bg-card p-4 rounded-lg border">
      <div className={`p-3 rounded-full ${
        status === 'good' ? 'bg-green-500/10' : 
        status === 'warning' ? 'bg-amber-500/10' : 
        'bg-destructive/10'
      }`}>
        <Icon className={`h-5 w-5 ${
          status === 'good' ? 'text-green-500' : 
          status === 'warning' ? 'text-amber-500' : 
          'text-destructive'
        }`} />
      </div>
      <div className="ml-4">
        <div className="text-sm font-medium">{title}</div>
        <div className="text-lg font-bold">
          {value}
          {detail && (
            <span className="text-xs font-normal text-muted-foreground ml-2">
              {detail}
            </span>
          )}
        </div>
      </div>
    </div>
  );
  
  const EventTypeBadge = ({ type }: { type: string }) => {
    switch (type) {
      case 'authentication':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Authentication</Badge>;
      case 'authorization':
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">Authorization</Badge>;
      case 'system':
        return <Badge variant="outline" className="bg-indigo-500/10 text-indigo-500 border-indigo-500/20">System</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };
  
  const SecurityLevel = ({ level }: { level: string }) => {
    switch (level) {
      case 'high':
        return <Badge className="bg-green-500">{level}</Badge>;
      case 'medium':
        return <Badge className="bg-amber-500">{level}</Badge>;
      case 'low':
        return <Badge variant="destructive">{level}</Badge>;
      default:
        return <Badge>{level}</Badge>;
    }
  };
  
  const SeverityBadge = ({ severity }: { severity: string }) => {
    switch (severity) {
      case 'low':
        return <Badge className="bg-blue-500">{severity}</Badge>;
      case 'medium':
        return <Badge className="bg-amber-500">{severity}</Badge>;
      case 'high':
        return <Badge variant="destructive">{severity}</Badge>;
      default:
        return <Badge>{severity}</Badge>;
    }
  };
  
  const ActionBadge = ({ action }: { action: string }) => {
    switch (action) {
      case 'login_success':
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Login Success</Badge>;
      case 'login_failed':
        return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">Login Failed</Badge>;
      case 'permission_denied':
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">Permission Denied</Badge>;
      case 'settings_changed':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Settings Changed</Badge>;
      case 'firmware_updated':
        return <Badge variant="outline" className="bg-indigo-500/10 text-indigo-500 border-indigo-500/20">Firmware Updated</Badge>;
      default:
        return <Badge variant="outline">{action}</Badge>;
    }
  };
  
  return (
    <AppLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Security Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor system security, access control, and threat detection
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Select
            defaultValue={timeRange}
            onValueChange={setTimeRange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">Export Report</Button>
        </div>
      </div>
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-4 mb-6">
        <SecurityStat 
          icon={Shield} 
          title="Security Level" 
          value="High" 
          status="good"
          detail="All systems secure"
        />
        
        <SecurityStat 
          icon={AlertTriangle} 
          title="Active Threats" 
          value={securityThreats.filter(t => t.status !== 'mitigated').length} 
          status={securityThreats.filter(t => t.status !== 'mitigated').length > 0 ? 'warning' : 'good'}
          detail="Under investigation"
        />
        
        <SecurityStat 
          icon={UserCheck} 
          title="Active Sessions" 
          value={activeSessions.length} 
          status="good"
        />
        
        <SecurityStat 
          icon={Lock} 
          title="Failed Logins" 
          value="2" 
          status="warning"
          detail="Last 24 hours"
        />
      </div>
      
      <Tabs defaultValue="events" className="space-y-6">
        <TabsList>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <HistoryIcon className="h-4 w-4" />
            Security Events
          </TabsTrigger>
          <TabsTrigger value="sessions" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            Active Sessions
          </TabsTrigger>
          <TabsTrigger value="threats" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Threats
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="events">
          <GlassPanel>
            <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center">
                <HistoryIcon className="h-5 w-5 text-primary mr-2" />
                <h2 className="font-medium">Security Event Log</h2>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search events..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {securityEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <div className="font-medium">{timeSince(event.timestamp)}</div>
                        <div className="text-xs text-muted-foreground">{formatDate(event.timestamp)}</div>
                      </TableCell>
                      <TableCell>
                        <EventTypeBadge type={event.type} />
                      </TableCell>
                      <TableCell>
                        <ActionBadge action={event.action} />
                      </TableCell>
                      <TableCell>{event.user}</TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted p-1 rounded">{event.source}</code>
                      </TableCell>
                      <TableCell>{event.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </GlassPanel>
        </TabsContent>
        
        <TabsContent value="sessions">
          <GlassPanel>
            <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center">
                <UserCheck className="h-5 w-5 text-primary mr-2" />
                <h2 className="font-medium">Active User Sessions</h2>
              </div>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Login Time</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeSessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell>
                        <div className="font-medium">{session.user}</div>
                        <div className="text-xs text-muted-foreground">IP: {session.ip}</div>
                      </TableCell>
                      <TableCell>
                        <div>{session.device}</div>
                        <div className="text-xs text-muted-foreground">{session.browser}</div>
                      </TableCell>
                      <TableCell>{session.location}</TableCell>
                      <TableCell>
                        <div>{timeSince(session.loginTime)}</div>
                        <div className="text-xs text-muted-foreground">{formatDate(session.loginTime)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                          <span>{timeSince(session.lastActive)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-destructive">Terminate</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </GlassPanel>
        </TabsContent>
        
        <TabsContent value="threats">
          <GlassPanel>
            <div className="p-4 border-b border-border">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-primary mr-2" />
                <h2 className="font-medium">Detected Security Threats</h2>
              </div>
            </div>
            
            {securityThreats.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {securityThreats.map((threat) => (
                      <TableRow key={threat.id}>
                        <TableCell>
                          <div>{timeSince(threat.timestamp)}</div>
                          <div className="text-xs text-muted-foreground">{formatDate(threat.timestamp)}</div>
                        </TableCell>
                        <TableCell>
                          <SeverityBadge severity={threat.severity} />
                        </TableCell>
                        <TableCell className="font-medium capitalize">{threat.type.replace('_', ' ')}</TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted p-1 rounded">{threat.source}</code>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {threat.status === 'mitigated' ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500 mr-1.5" />
                            ) : (
                              <Clock className="h-4 w-4 text-amber-500 mr-1.5" />
                            )}
                            <span className="capitalize">{threat.status}</span>
                          </div>
                        </TableCell>
                        <TableCell>{threat.details}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            disabled={threat.status === 'mitigated'}
                          >
                            {threat.status === 'mitigated' ? 'Resolved' : 'Resolve'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center p-8">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium">No Active Threats</h3>
                <p className="text-muted-foreground mt-2">
                  Your system is secure. No security threats detected.
                </p>
              </div>
            )}
          </GlassPanel>
        </TabsContent>
      </Tabs>
      
      <div className="grid gap-6 md:grid-cols-3 mt-6">
        <GlassPanel>
          <div className="p-4 border-b border-border">
            <div className="flex items-center">
              <Lock className="h-5 w-5 text-primary mr-2" />
              <h2 className="font-medium">Authentication Settings</h2>
            </div>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Two-Factor Authentication</div>
                <div className="text-xs text-muted-foreground">Require 2FA for all admin users</div>
              </div>
              <div className="flex h-5 items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-xs">Enforced</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Password Complexity</div>
                <div className="text-xs text-muted-foreground">Minimum 12 characters with mixed types</div>
              </div>
              <div className="flex h-5 items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-xs">High</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Session Timeout</div>
                <div className="text-xs text-muted-foreground">Inactive sessions auto-logout</div>
              </div>
              <div className="flex h-5 items-center space-x-2">
                <span className="text-xs">30 minutes</span>
              </div>
            </div>
            
            <Button variant="outline" size="sm" className="w-full mt-2">
              <Settings className="h-4 w-4 mr-2" />
              Manage Authentication
            </Button>
          </div>
        </GlassPanel>
        
        <GlassPanel>
          <div className="p-4 border-b border-border">
            <div className="flex items-center">
              <Key className="h-5 w-5 text-primary mr-2" />
              <h2 className="font-medium">API Security</h2>
            </div>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">API Rate Limiting</div>
                <div className="text-xs text-muted-foreground">Prevent API abuse</div>
              </div>
              <div className="flex h-5 items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-xs">Enabled</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Token Expiration</div>
                <div className="text-xs text-muted-foreground">API tokens auto-expire</div>
              </div>
              <div className="flex h-5 items-center space-x-2">
                <span className="text-xs">24 hours</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">API Audit Logging</div>
                <div className="text-xs text-muted-foreground">Log all API access</div>
              </div>
              <div className="flex h-5 items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-xs">Verbose</span>
              </div>
            </div>
            
            <Button variant="outline" size="sm" className="w-full mt-2">
              <Settings className="h-4 w-4 mr-2" />
              Manage API Security
            </Button>
          </div>
        </GlassPanel>
        
        <GlassPanel>
          <div className="p-4 border-b border-border">
            <div className="flex items-center">
              <Fingerprint className="h-5 w-5 text-primary mr-2" />
              <h2 className="font-medium">Access Control</h2>
            </div>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Role-Based Access</div>
                <div className="text-xs text-muted-foreground">Granular permission control</div>
              </div>
              <div className="flex h-5 items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-xs">Enabled</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">IP Restrictions</div>
                <div className="text-xs text-muted-foreground">Limit access by IP address</div>
              </div>
              <div className="flex h-5 items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                <span className="text-xs">Partial</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Device Authorization</div>
                <div className="text-xs text-muted-foreground">Verify new device logins</div>
              </div>
              <div className="flex h-5 items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-xs">Enabled</span>
              </div>
            </div>
            
            <Button variant="outline" size="sm" className="w-full mt-2">
              <Settings className="h-4 w-4 mr-2" />
              Manage Access Control
            </Button>
          </div>
        </GlassPanel>
      </div>
    </AppLayout>
  );
};

// Settings icon component
const Settings = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export default Security;
