import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Shield, Key, Clock, Globe, History, AlertTriangle, Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import QRCodeComponent from '@/components/security/QRCode';
import { securityService, SecurityAuditLog, ApiKey, Session } from '@/services/securityService';
import ErrorBoundary from '@/components/ErrorBoundary';

const SecuritySettings: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [secret, setSecret] = useState<string>('');
  const [auditLogs, setAuditLogs] = useState<SecurityAuditLog[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [whitelistedIPs, setWhitelistedIPs] = useState<string[]>([]);
  const [newIP, setNewIP] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  useEffect(() => {
    if (user?.id) {
      loadSecurityData();
    }
  }, [user?.id]);

  const loadSecurityData = async () => {
    try {
      setIsLoading(true);
      const [logs, keys, activeSessions, ips] = await Promise.all([
        securityService.getAuditLogs(user!.id),
        securityService.getApiKeys(user!.id),
        securityService.getActiveSessions(user!.id),
        securityService.getWhitelistedIPs(user!.id)
      ]);

      setAuditLogs(logs);
      setApiKeys(keys);
      setSessions(activeSessions);
      setWhitelistedIPs(ips);
    } catch (error) {
      toast.error('Failed to load security data');
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FAToggle = async () => {
    try {
      setIsLoading(true);
      if (!is2FAEnabled) {
        const newSecret = Math.random().toString(36).substr(2, 16).toUpperCase();
        setSecret(newSecret);
        await securityService.enable2FA(user!.id, newSecret);
        await securityService.logSecurityEvent(user!.id, '2FA_ENABLED');
      } else {
        await securityService.disable2FA(user!.id);
        await securityService.logSecurityEvent(user!.id, '2FA_DISABLED');
      }
      setIs2FAEnabled(!is2FAEnabled);
      toast.success(`Two-factor authentication ${!is2FAEnabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      toast.error('Failed to update 2FA settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify2FA = async () => {
    try {
      setIsLoading(true);
      const isValid = await securityService.verify2FACode(user!.id, verificationCode);
      if (isValid) {
        await securityService.logSecurityEvent(user!.id, '2FA_VERIFIED');
        toast.success('2FA verification successful');
      } else {
        toast.error('Invalid verification code');
      }
    } catch (error) {
      toast.error('Failed to verify 2FA code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddIP = async () => {
    try {
      setIsLoading(true);
      await securityService.addWhitelistedIP(user!.id, newIP);
      await securityService.logSecurityEvent(user!.id, 'IP_WHITELIST_ADDED', { ip: newIP });
      setWhitelistedIPs([...whitelistedIPs, newIP]);
      setNewIP('');
      toast.success('IP address added to whitelist');
    } catch (error) {
      toast.error('Failed to add IP address');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveIP = async (ip: string) => {
    try {
      setIsLoading(true);
      await securityService.removeWhitelistedIP(user!.id, ip);
      await securityService.logSecurityEvent(user!.id, 'IP_WHITELIST_REMOVED', { ip });
      setWhitelistedIPs(whitelistedIPs.filter(i => i !== ip));
      toast.success('IP address removed from whitelist');
    } catch (error) {
      toast.error('Failed to remove IP address');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      setIsLoading(true);
      await securityService.revokeSession(sessionId);
      await securityService.logSecurityEvent(user!.id, 'SESSION_REVOKED', { sessionId });
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
      const newKey = await securityService.createApiKey(user!.id, `API Key ${apiKeys.length + 1}`, ['read']);
      await securityService.logSecurityEvent(user!.id, 'API_KEY_CREATED', { keyId: newKey.id });
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
      await securityService.revokeApiKey(keyId);
      await securityService.logSecurityEvent(user!.id, 'API_KEY_REVOKED', { keyId });
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
                    onVerify={handleVerify2FA}
                    verificationCode={verificationCode}
                    setVerificationCode={setVerificationCode}
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
                    <Button onClick={handleAddIP} disabled={isLoading}>
                      Add IP
                    </Button>
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
                          disabled={isLoading}
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