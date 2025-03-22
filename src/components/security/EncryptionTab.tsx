
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Key, 
  RefreshCw, 
  Plus, 
  Rotate3D,
  CheckCircle,
  AlertTriangle,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';

const EncryptionTab = () => {
  const handleGenerateKey = () => {
    toast.info("Key generation initiated");
    setTimeout(() => {
      toast.success("New encryption key generated successfully");
    }, 1500);
  };

  const handleRotateKeys = () => {
    toast.info("Key rotation initiated");
    setTimeout(() => {
      toast.success("Encryption keys rotated successfully");
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-primary" />
              <div>
                <CardTitle>Encryption Status</CardTitle>
                <CardDescription>System-wide encryption overview</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Data at Rest</span>
                <span className="text-sm text-green-600">100%</span>
              </div>
              <Progress value={100} className="h-2 bg-green-200" />
              <div className="flex items-center text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                AES-256 encryption
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Data in Transit</span>
                <span className="text-sm text-green-600">100%</span>
              </div>
              <Progress value={100} className="h-2 bg-green-200" />
              <div className="flex items-center text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                TLS 1.3 with strong ciphers
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Backup Encryption</span>
                <span className="text-sm text-amber-600">80%</span>
              </div>
              <Progress value={80} className="h-2 bg-amber-200" />
              <div className="flex items-center text-sm text-muted-foreground">
                <AlertTriangle className="h-4 w-4 mr-1 text-amber-500" />
                Some older backups unencrypted
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Encryption Keys</CardTitle>
              <CardDescription>Manage system encryption keys</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleRotateKeys}>
                <Rotate3D className="h-4 w-4 mr-2" />
                Rotate Keys
              </Button>
              <Button onClick={handleGenerateKey}>
                <Plus className="h-4 w-4 mr-2" />
                New Key
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Key Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Rotated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <div className="flex items-center">
                    <Key className="h-4 w-4 mr-2 text-primary" />
                    <span>master-key-001</span>
                  </div>
                </TableCell>
                <TableCell>AES-256</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                    Active
                  </Badge>
                </TableCell>
                <TableCell>2023-01-15</TableCell>
                <TableCell>2023-07-20</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <div className="flex items-center">
                    <Key className="h-4 w-4 mr-2 text-primary" />
                    <span>backup-key-001</span>
                  </div>
                </TableCell>
                <TableCell>RSA-2048</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                    Active
                  </Badge>
                </TableCell>
                <TableCell>2023-02-10</TableCell>
                <TableCell>2023-08-05</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <div className="flex items-center">
                    <Key className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>master-key-000</span>
                  </div>
                </TableCell>
                <TableCell>AES-256</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    Archived
                  </Badge>
                </TableCell>
                <TableCell>2022-06-20</TableCell>
                <TableCell>2023-01-15</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Encryption Compliance</CardTitle>
              <CardDescription>Regulatory and compliance status</CardDescription>
            </div>
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Status
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center p-3 rounded-md border bg-background">
                <CheckCircle className="h-5 w-5 mr-3 text-green-500" />
                <div>
                  <div className="font-medium">GDPR Compliant</div>
                  <div className="text-sm text-muted-foreground">Last verified: 2 days ago</div>
                </div>
              </div>
              
              <div className="flex items-center p-3 rounded-md border bg-background">
                <CheckCircle className="h-5 w-5 mr-3 text-green-500" />
                <div>
                  <div className="font-medium">HIPAA Compliant</div>
                  <div className="text-sm text-muted-foreground">Last verified: 5 days ago</div>
                </div>
              </div>
              
              <div className="flex items-center p-3 rounded-md border bg-background">
                <XCircle className="h-5 w-5 mr-3 text-red-500" />
                <div>
                  <div className="font-medium">PCI DSS Compliance</div>
                  <div className="text-sm text-muted-foreground">Not applicable</div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center p-4 rounded-md bg-amber-50 border border-amber-200">
              <AlertTriangle className="h-5 w-5 mr-3 text-amber-500 shrink-0" />
              <div>
                <div className="font-medium text-amber-700">Recommended Action</div>
                <div className="text-sm text-amber-600">
                  Schedule your annual encryption key rotation for optimal security. 
                  Last full key rotation was 220 days ago.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EncryptionTab;
