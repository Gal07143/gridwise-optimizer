
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Edit, UserX, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const AccessControlTab = () => {
  const handleAddUser = () => {
    toast.info("This feature is coming soon!");
  };

  const handleEditUser = (userId: string) => {
    toast.info(`Edit user with ID: ${userId}`);
  };

  const handleRevokeAccess = (userId: string) => {
    toast.info(`Revoke access for user with ID: ${userId}`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Access Control</CardTitle>
              <CardDescription>Manage user permissions and access</CardDescription>
            </div>
            <Button onClick={handleAddUser}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Access</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <div>
                    <div className="font-medium">Admin User</div>
                    <div className="text-sm text-muted-foreground">admin@example.com</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge>Administrator</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                    Active
                  </Badge>
                </TableCell>
                <TableCell>20 minutes ago</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEditUser('admin')}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleRevokeAccess('admin')}>
                      <UserX className="h-4 w-4 text-destructive" />
                      <span className="sr-only">Revoke</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <div>
                    <div className="font-medium">John Doe</div>
                    <div className="text-sm text-muted-foreground">john@example.com</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">Operator</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                    Active
                  </Badge>
                </TableCell>
                <TableCell>2 hours ago</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEditUser('john')}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleRevokeAccess('john')}>
                      <UserX className="h-4 w-4 text-destructive" />
                      <span className="sr-only">Revoke</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <div>
                    <div className="font-medium">Jane Smith</div>
                    <div className="text-sm text-muted-foreground">jane@example.com</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">Viewer</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                    Inactive
                  </Badge>
                </TableCell>
                <TableCell>5 days ago</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEditUser('jane')}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleRevokeAccess('jane')}>
                      <UserX className="h-4 w-4 text-destructive" />
                      <span className="sr-only">Revoke</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Access Logs</CardTitle>
              <CardDescription>Recent system access attempts</CardDescription>
            </div>
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>User</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Today, 10:23 AM</TableCell>
                <TableCell>admin@example.com</TableCell>
                <TableCell>192.168.1.1</TableCell>
                <TableCell>Login</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                    Success
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Today, 09:45 AM</TableCell>
                <TableCell>john@example.com</TableCell>
                <TableCell>192.168.1.2</TableCell>
                <TableCell>Login</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                    Success
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Yesterday, 04:12 PM</TableCell>
                <TableCell>unknown@example.com</TableCell>
                <TableCell>10.0.0.5</TableCell>
                <TableCell>Login</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                    Failed
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessControlTab;
