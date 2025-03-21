import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Key, Plus, Eye, EyeOff, Copy, Check, Trash2, RefreshCw, Clock, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import SettingsPageTemplate from '@/components/settings/SettingsPageTemplate';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge-extended';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import ErrorMessage from '@/components/ui/error-message';
import { executeSql } from '@/services/sqlExecutor';
import { useAuth } from '@/contexts/AuthContext';

interface ApiKey {
  id: string;
  api_key: string; // Only the first/last few characters
  service: string;
  created_at: string;
  last_used: string | null;
  usage_count: number;
  is_active: boolean;
  expires_at: string | null;
  description: string | null;
  permissions: any;
  allowed_ips: string[] | null;
  created_by: string | null;
  created_by_email: string | null;
}

const ApiKeyManagement = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [newKeyDialog, setNewKeyDialog] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [showKey, setShowKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [deleteKeyId, setDeleteKeyId] = useState<string | null>(null);
  const [newKeyData, setNewKeyData] = useState({
    service: '',
    description: '',
    expires_at: null as Date | null,
    permissions: {
      read: true,
      write: false,
      delete: false
    },
    allowed_ips: '' // Comma-separated list
  });
  
  const {
    data: apiKeys,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['api-keys'],
    queryFn: async () => {
      const result = await executeSql<ApiKey>(`
        SELECT 
          k.id, 
          CASE
            WHEN length(k.api_key) > 8 THEN 
              substring(k.api_key, 1, 4) || '...' || substring(k.api_key, length(k.api_key) - 3, 4)
            ELSE k.api_key
          END as api_key,
          k.service, k.created_at, k.last_used, k.usage_count, 
          k.is_active, k.expires_at, k.description, k.permissions,
          k.allowed_ips, k.created_by, p.email as created_by_email
        FROM api_keys k
        LEFT JOIN profiles p ON k.created_by = p.id
        ORDER BY k.created_at DESC
      `);
      return result;
    }
  });
  
  const createApiKeyMutation = useMutation({
    mutationFn: async (keyData: typeof newKeyData) => {
      const generatedApiKey = Array.from(
        { length: 32 },
        () => "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(Math.random() * 62)]
      ).join('');
      
      setGeneratedKey(generatedApiKey);
      
      const result = await executeSql<{ id: string }>(`
        INSERT INTO api_keys (
          api_key, service, description, expires_at,
          permissions, allowed_ips, created_by, is_active
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, true
        ) RETURNING id
      `, [
        generatedApiKey,
        keyData.service,
        keyData.description,
        keyData.expires_at ? format(keyData.expires_at, 'yyyy-MM-dd') : null,
        JSON.stringify(keyData.permissions),
        keyData.allowed_ips.split(',').map(ip => ip.trim()).filter(ip => ip !== ''),
        user?.id,
      ]);
      
      return result[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
      toast.success('API key created successfully');
    },
    onError: (error) => {
      toast.error(`Failed to create API key: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setGeneratedKey(null);
    }
  });
  
  const toggleApiKeyStatusMutation = useMutation({
    mutationFn: async ({ keyId, isActive }: { keyId: string; isActive: boolean }) => {
      await executeSql(`
        UPDATE api_keys
        SET is_active = $1
        WHERE id = $2
      `, [isActive, keyId]);
      
      return { id: keyId, isActive };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
      toast.success(`API key ${data.isActive ? 'activated' : 'deactivated'} successfully`);
    },
    onError: (error) => {
      toast.error(`Failed to update API key: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });
  
  const deleteApiKeyMutation = useMutation({
    mutationFn: async (keyId: string) => {
      await executeSql(`
        DELETE FROM api_keys
        WHERE id = $1
      `, [keyId]);
      
      return { id: keyId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
      setDeleteKeyId(null);
      toast.success('API key deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete API key: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });
  
  const handleCreateKey = () => {
    createApiKeyMutation.mutate(newKeyData);
  };
  
  const handleToggleKeyStatus = (keyId: string, currentStatus: boolean) => {
    toggleApiKeyStatusMutation.mutate({ keyId, isActive: !currentStatus });
  };
  
  const handleDeleteKey = (keyId: string) => {
    setDeleteKeyId(keyId);
  };
  
  const handleCopyKey = () => {
    if (generatedKey) {
      navigator.clipboard.writeText(generatedKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };
  
  const closeAndResetDialog = () => {
    if (!generatedKey) {
      setNewKeyDialog(false);
      setNewKeyData({
        service: '',
        description: '',
        expires_at: null,
        permissions: {
          read: true,
          write: false,
          delete: false
        },
        allowed_ips: ''
      });
    }
  };
  
  const closeKeyCreatedDialog = () => {
    setNewKeyDialog(false);
    setGeneratedKey(null);
    setShowKey(false);
    setCopiedKey(false);
    setNewKeyData({
      service: '',
      description: '',
      expires_at: null,
      permissions: {
        read: true,
        write: false,
        delete: false
      },
      allowed_ips: ''
    });
  };
  
  if (isLoading) {
    return (
      <SettingsPageTemplate 
        title="API Key Management" 
        description="Create and manage API keys for integrations"
        headerIcon={<Key size={20} />}
      >
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      </SettingsPageTemplate>
    );
  }
  
  if (error) {
    return (
      <SettingsPageTemplate 
        title="API Key Management" 
        description="Create and manage API keys for integrations"
        headerIcon={<Key size={20} />}
      >
        <ErrorMessage 
          message="Failed to load API keys" 
          description={error instanceof Error ? error.message : "Unknown error occurred"}
          retryAction={refetch}
        />
      </SettingsPageTemplate>
    );
  }
  
  return (
    <SettingsPageTemplate 
      title="API Key Management" 
      description="Create and manage API keys for integrations"
      headerIcon={<Key size={20} />}
    >
      <div className="space-y-6">
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold">Your API Keys</h2>
          <Button onClick={() => setNewKeyDialog(true)}>
            <Plus className="mr-2 h-4 w-4" /> Create New API Key
          </Button>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service / Description</TableHead>
                <TableHead>API Key</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys && apiKeys.length > 0 ? (
                apiKeys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{key.service}</p>
                        <p className="text-sm text-muted-foreground">{key.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="bg-muted px-1 py-0.5 rounded text-sm">{key.api_key}</code>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {key.permissions && key.permissions.read && (
                          <Badge variant="outline" className="text-xs">read</Badge>
                        )}
                        {key.permissions && key.permissions.write && (
                          <Badge variant="outline" className="text-xs">write</Badge>
                        )}
                        {key.permissions && key.permissions.delete && (
                          <Badge variant="outline" className="text-xs">delete</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">
                          {new Date(key.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {key.expires_at ? (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">
                            {new Date(key.expires_at).toLocaleDateString()}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">Never</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={key.is_active ? "success" : "secondary"}>
                        {key.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleKeyStatus(key.id, key.is_active)}
                          disabled={toggleApiKeyStatusMutation.isPending}
                        >
                          {key.is_active ? "Deactivate" : "Activate"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteKey(key.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          disabled={deleteApiKeyMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Key className="h-12 w-12 mb-3" />
                      <h3 className="font-medium">No API Keys Found</h3>
                      <p className="text-sm mt-1 mb-4">
                        You haven't created any API keys yet.
                      </p>
                      <Button onClick={() => setNewKeyDialog(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Create API Key
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        <div className="bg-muted rounded-lg p-4 mt-8">
          <h3 className="text-lg font-semibold mb-2">API Key Usage Guidelines</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                <Key className="h-3 w-3 text-primary" />
              </div>
              <span>Keep your API keys secure and never expose them in client-side code.</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                <RefreshCw className="h-3 w-3 text-primary" />
              </div>
              <span>Rotate your API keys periodically for enhanced security.</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                <Copy className="h-3 w-3 text-primary" />
              </div>
              <span>API keys are only shown once at creation time. Make sure to copy and store them securely.</span>
            </li>
          </ul>
        </div>
      </div>
      
      <Dialog open={newKeyDialog} onOpenChange={closeAndResetDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{generatedKey ? 'Your New API Key' : 'Create New API Key'}</DialogTitle>
            <DialogDescription>
              {generatedKey 
                ? 'Copy your API key now. You won\'t be able to see it again.' 
                : 'Create a new API key for use with external services.'}
            </DialogDescription>
          </DialogHeader>
          
          {generatedKey ? (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>API Key</Label>
                <div className="flex">
                  <div className="relative flex-1">
                    <Input 
                      value={generatedKey} 
                      readOnly 
                      type={showKey ? "text" : "password"} 
                      className="pr-10 font-mono"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowKey(!showKey)}
                    >
                      {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="sr-only">{showKey ? "Hide" : "Show"} key</span>
                    </Button>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="ml-2"
                    onClick={handleCopyKey}
                  >
                    {copiedKey ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    <span className="sr-only">Copy key</span>
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  This key will not be shown again. Please store it securely.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">Service</div>
                <p className="text-sm">{newKeyData.service}</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="space-y-1">
                  <div className="text-sm font-medium">Permissions</div>
                  <div className="flex gap-1">
                    {newKeyData.permissions.read && <Badge variant="outline" className="text-xs">read</Badge>}
                    {newKeyData.permissions.write && <Badge variant="outline" className="text-xs">write</Badge>}
                    {newKeyData.permissions.delete && <Badge variant="outline" className="text-xs">delete</Badge>}
                  </div>
                </div>
                
                {newKeyData.expires_at && (
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Expires</div>
                    <div className="text-sm">
                      {format(newKeyData.expires_at, 'MMMM d, yyyy')}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="service">Service Name</Label>
                <Input 
                  id="service" 
                  placeholder="e.g., Weather API Integration" 
                  value={newKeyData.service}
                  onChange={(e) => setNewKeyData({...newKeyData, service: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea 
                  id="description" 
                  placeholder="What will this API key be used for?" 
                  value={newKeyData.description}
                  onChange={(e) => setNewKeyData({...newKeyData, description: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Permissions</Label>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="permission-read"
                      checked={newKeyData.permissions.read}
                      onChange={(e) => setNewKeyData({
                        ...newKeyData,
                        permissions: {
                          ...newKeyData.permissions,
                          read: e.target.checked
                        }
                      })}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="permission-read">Read</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="permission-write"
                      checked={newKeyData.permissions.write}
                      onChange={(e) => setNewKeyData({
                        ...newKeyData,
                        permissions: {
                          ...newKeyData.permissions,
                          write: e.target.checked
                        }
                      })}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="permission-write">Write</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="permission-delete"
                      checked={newKeyData.permissions.delete}
                      onChange={(e) => setNewKeyData({
                        ...newKeyData,
                        permissions: {
                          ...newKeyData.permissions,
                          delete: e.target.checked
                        }
                      })}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="permission-delete">Delete</Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiration Date (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {newKeyData.expires_at ? (
                        format(newKeyData.expires_at, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={newKeyData.expires_at || undefined}
                      onSelect={(date) => setNewKeyData({...newKeyData, expires_at: date})}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="allowed-ips">Allowed IP Addresses (Optional)</Label>
                <Input 
                  id="allowed-ips" 
                  placeholder="e.g., 192.168.1.1, 10.0.0.1" 
                  value={newKeyData.allowed_ips}
                  onChange={(e) => setNewKeyData({...newKeyData, allowed_ips: e.target.value})}
                />
                <p className="text-xs text-muted-foreground">
                  Comma-separated list of IP addresses allowed to use this key. Leave empty to allow all IPs.
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            {generatedKey ? (
              <Button onClick={closeKeyCreatedDialog}>Done</Button>
            ) : (
              <>
                <Button variant="outline" onClick={closeAndResetDialog}>Cancel</Button>
                <Button 
                  onClick={handleCreateKey}
                  disabled={!newKeyData.service || createApiKeyMutation.isPending}
                >
                  {createApiKeyMutation.isPending ? (
                    <LoadingSpinner className="mr-2 h-4 w-4" />
                  ) : (
                    <Key className="mr-2 h-4 w-4" />
                  )}
                  {createApiKeyMutation.isPending ? 'Creating...' : 'Create API Key'}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={!!deleteKeyId} onOpenChange={(open) => !open && setDeleteKeyId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete API Key</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The API key will be permanently deleted and any services using it will stop working.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteKeyId && deleteApiKeyMutation.mutate(deleteKeyId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteApiKeyMutation.isPending ? (
                <LoadingSpinner className="mr-2 h-4 w-4" />
              ) : null}
              {deleteApiKeyMutation.isPending ? 'Deleting...' : 'Delete API Key'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SettingsPageTemplate>
  );
};

export default ApiKeyManagement;
