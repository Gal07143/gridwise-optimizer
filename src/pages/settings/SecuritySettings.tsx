import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { SecuritySettings as SecuritySettingsType } from '@/types/settings';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { supabaseService } from '@/services/supabaseService';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Shield, Key, Clock, Globe, History, AlertTriangle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import QRCodeComponent from '@/components/security/QRCode';

const securitySettingsSchema = z.object({
  authentication: z.object({
    twoFactorEnabled: z.boolean(),
    sessionTimeout: z.number().min(5).max(120),
    passwordPolicy: z.object({
      minLength: z.number().min(8).max(32),
      requireSpecialChars: z.boolean(),
      requireNumbers: z.boolean(),
    }),
  }),
  encryption: z.object({
    enabled: z.boolean(),
    algorithm: z.string(),
    keyRotation: z.number().min(1).max(365),
  }),
  apiSecurity: z.object({
    rateLimiting: z.boolean(),
    allowedOrigins: z.array(z.string()),
    tokenExpiration: z.number().min(1).max(24),
  }),
  auditLogging: z.object({
    enabled: z.boolean(),
    retentionPeriod: z.number().min(1).max(365),
    logLevel: z.enum(['info', 'warning', 'error']),
  }),
});

interface SecurityAuditLog {
  id: string;
  action: string;
  timestamp: string;
  ip_address: string;
  user_agent: string;
}

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created_at: string;
  last_used: string | null;
}

interface Session {
  id: string;
  device: string;
  ip_address: string;
  last_active: string;
  current: boolean;
}

const SecuritySettings: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<SecuritySettingsType>({
    resolver: zodResolver(securitySettingsSchema),
  });

  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [auditLogs, setAuditLogs] = useState<SecurityAuditLog[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [whitelistedIPs, setWhitelistedIPs] = useState<string[]>([]);
  const [newIP, setNewIP] = useState('');
  const [secret, setSecret] = useState<string>('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        if (!user?.id) {
          throw new Error('User not authenticated');
        }
        const data = await supabaseService.getSecuritySettings(user.id);
        if (data) {
          setValue('authentication.twoFactorEnabled', data.two_factor_enabled);
          setValue('authentication.sessionTimeout', data.session_timeout);
          setValue('authentication.passwordPolicy', data.password_policy);
          setValue('encryption.enabled', data.encryption_enabled);
          setValue('encryption.algorithm', data.encryption_algorithm);
          setValue('encryption.keyRotation', data.key_rotation);
          setValue('apiSecurity.rateLimiting', data.rate_limiting);
          setValue('apiSecurity.allowedOrigins', data.allowed_origins);
          setValue('apiSecurity.tokenExpiration', data.token_expiration);
          setValue('auditLogging.enabled', data.audit_logging_enabled);
          setValue('auditLogging.retentionPeriod', data.retention_period);
          setValue('auditLogging.logLevel', data.log_level);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load security settings');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      fetchSettings();
    }
  }, [setValue, user?.id]);

  const onSubmit = async (data: SecuritySettingsType) => {
    try {
      setIsLoading(true);
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      await supabaseService.updateSecuritySettings(user.id, data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save security settings');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FAToggle = async () => {
    try {
      setIsLoading(true);
      if (!is2FAEnabled) {
        // Generate a new secret when enabling 2FA
        const newSecret = Math.random().toString(36).substr(2, 16).toUpperCase();
        setSecret(newSecret);
      }
      setIs2FAEnabled(!is2FAEnabled);
      toast.success(`Two-factor authentication ${!is2FAEnabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      toast.error('Failed to update 2FA settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddIP = () => {
    if (newIP && !whitelistedIPs.includes(newIP)) {
      setWhitelistedIPs([...whitelistedIPs, newIP]);
      setNewIP('');
      toast.success('IP address added to whitelist');
    }
  };

  const handleRemoveIP = (ip: string) => {
    setWhitelistedIPs(whitelistedIPs.filter(i => i !== ip));
    toast.success('IP address removed from whitelist');
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      setIsLoading(true);
      // Implement session revocation logic here
      setSessions(sessions.filter(session => session.id !== sessionId));
      toast.success('Session revoked successfully');
    } catch (error) {
      toast.error('Failed to revoke session');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateApiKey = async () => {
    try {
      setIsLoading(true);
      // Implement API key creation logic here
      const newKey: ApiKey = {
        id: Math.random().toString(36).substr(2, 9),
        name: `API Key ${apiKeys.length + 1}`,
        key: Math.random().toString(36).substr(2, 24),
        created_at: new Date().toISOString(),
        last_used: null
      };
      setApiKeys([...apiKeys, newKey]);
      toast.success('New API key created');
    } catch (error) {
      toast.error('Failed to create API key');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevokeApiKey = async (keyId: string) => {
    try {
      setIsLoading(true);
      // Implement API key revocation logic here
      setApiKeys(apiKeys.filter(key => key.id !== keyId));
      toast.success('API key revoked successfully');
    } catch (error) {
      toast.error('Failed to revoke API key');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">
        {error}
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="2fa">
              <TabsList>
                <TabsTrigger value="2fa">Two-Factor Auth</TabsTrigger>
                <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
                <TabsTrigger value="api">API Keys</TabsTrigger>
                <TabsTrigger value="ip">IP Whitelist</TabsTrigger>
                <TabsTrigger value="audit">Security Log</TabsTrigger>
              </TabsList>

              <TabsContent value="2fa" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch
                    checked={is2FAEnabled}
                    onCheckedChange={handle2FAToggle}
                    disabled={isLoading}
                  />
                </div>
                {is2FAEnabled && secret && (
                  <QRCodeComponent
                    secret={secret}
                    email={user?.email || ''}
                  />
                )}
              </TabsContent>

              <TabsContent value="sessions">
                <div className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Device</TableHead>
                        <TableHead>IP Address</TableHead>
                        <TableHead>Last Active</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sessions.map((session) => (
                        <TableRow key={session.id}>
                          <TableCell>{session.device}</TableCell>
                          <TableCell>{session.ip_address}</TableCell>
                          <TableCell>
                            {format(new Date(session.last_active), 'PPpp')}
                          </TableCell>
                          <TableCell>
                            {!session.current && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRevokeSession(session.id)}
                                disabled={isLoading}
                              >
                                Revoke
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="api">
                <div className="space-y-4">
                  <Button onClick={handleCreateApiKey} disabled={isLoading}>
                    <Key className="h-4 w-4 mr-2" />
                    Create New API Key
                  </Button>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Key</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Last Used</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {apiKeys.map((key) => (
                        <TableRow key={key.id}>
                          <TableCell>{key.name}</TableCell>
                          <TableCell className="font-mono">{key.key}</TableCell>
                          <TableCell>
                            {format(new Date(key.created_at), 'PP')}
                          </TableCell>
                          <TableCell>
                            {key.last_used
                              ? format(new Date(key.last_used), 'PPpp')
                              : 'Never'}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRevokeApiKey(key.id)}
                              disabled={isLoading}
                            >
                              Revoke
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="ip">
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter IP address"
                      value={newIP}
                      onChange={(e) => setNewIP(e.target.value)}
                    />
                    <Button onClick={handleAddIP}>Add IP</Button>
                  </div>
                  <div className="space-y-2">
                    {whitelistedIPs.map((ip) => (
                      <div
                        key={ip}
                        className="flex items-center justify-between p-2 bg-muted rounded-md"
                      >
                        <span>{ip}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveIP(ip)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="audit">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Action</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Device</TableHead>
                      <TableHead>Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{log.action}</TableCell>
                        <TableCell>{log.ip_address}</TableCell>
                        <TableCell>{log.user_agent}</TableCell>
                        <TableCell>
                          {format(new Date(log.timestamp), 'PPpp')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
};

export default SecuritySettings; 