
import React from 'react';
import SettingsPageTemplate from '@/components/settings/SettingsPageTemplate';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Copy, Eye, EyeOff, Key, RefreshCw, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

// Mock data for demo
const mockApiKeys = [
  { id: 1, name: 'Production API Key', key: 'sk_prod_c8f3b9e72a4d5f6g7h8i9j', created: '2023-05-15', lastUsed: '2023-08-20', status: 'active' },
  { id: 2, name: 'Development API Key', key: 'sk_dev_a1b2c3d4e5f6g7h8i9j0k', created: '2023-06-22', lastUsed: '2023-08-21', status: 'active' },
  { id: 3, name: 'Testing API Key', key: 'sk_test_9j8h7g6f5e4d3c2b1a0z', created: '2023-07-10', lastUsed: '2023-08-15', status: 'inactive' },
];

const ApiSettings = () => {
  const [showKeys, setShowKeys] = React.useState<{[key: number]: boolean}>({});

  const toggleKeyVisibility = (id: number) => {
    setShowKeys(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('API key copied to clipboard');
  };

  const maskApiKey = (key: string) => {
    return `${key.substring(0, 8)}************************${key.substring(key.length - 4)}`;
  };

  return (
    <SettingsPageTemplate 
      title="API Configuration" 
      description="Manage API keys and external service connections"
    >
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium mb-4">API Keys</h3>
          
          <div className="mb-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="keyName">Key Name</Label>
                <Input id="keyName" placeholder="e.g., Production API Key" />
              </div>
              <div>
                <Label htmlFor="keyPermission">Permission Level</Label>
                <Select>
                  <SelectTrigger id="keyPermission">
                    <SelectValue placeholder="Select permission" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="read">Read Only</SelectItem>
                    <SelectItem value="write">Read & Write</SelectItem>
                    <SelectItem value="admin">Full Access</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button 
              className="flex items-center gap-2"
              onClick={() => toast.success('New API key generated')}
            >
              <Key size={16} />
              <span>Generate New API Key</span>
            </Button>
          </div>
          
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>API Key</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Used</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockApiKeys.map(apiKey => (
                  <TableRow key={apiKey.id}>
                    <TableCell>{apiKey.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">
                          {showKeys[apiKey.id] ? apiKey.key : maskApiKey(apiKey.key)}
                        </code>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => toggleKeyVisibility(apiKey.id)}
                        >
                          {showKeys[apiKey.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => copyToClipboard(apiKey.key)}
                        >
                          <Copy size={14} />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{apiKey.created}</TableCell>
                    <TableCell>{apiKey.lastUsed}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={apiKey.status === 'active' ? 'default' : 'secondary'}
                        className={apiKey.status === 'active' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                      >
                        {apiKey.status === 'active' ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8"
                          title="Rotate Key"
                          onClick={() => toast.info('Rotate API key functionality')}
                        >
                          <RefreshCw size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 hover:bg-red-100 hover:text-red-600"
                          title="Delete Key"
                          onClick={() => toast.info('Delete API key functionality')}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-lg font-medium mb-4">External Service Connections</h3>
          
          <div className="space-y-4">
            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <div className="text-base font-medium">Weather Service API</div>
                <div className="text-sm text-muted-foreground">
                  Connect to weather forecasting services for energy production predictions
                </div>
              </div>
              <Switch 
                checked={true}
                onCheckedChange={() => toast.success('Weather API connection updated')}
              />
            </div>
            
            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <div className="text-base font-medium">Grid Utility API</div>
                <div className="text-sm text-muted-foreground">
                  Connection to utility grid services for energy exchange data
                </div>
              </div>
              <Switch 
                checked={false}
                onCheckedChange={() => toast.success('Grid API connection updated')}
              />
            </div>
            
            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <div className="text-base font-medium">Energy Market API</div>
                <div className="text-sm text-muted-foreground">
                  Connect to real-time energy market pricing services
                </div>
              </div>
              <Switch 
                checked={true}
                onCheckedChange={() => toast.success('Energy Market API connection updated')}
              />
            </div>
          </div>
        </div>
      </div>
    </SettingsPageTemplate>
  );
};

export default ApiSettings;
