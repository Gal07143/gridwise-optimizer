
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Shield, Search, Edit, Trash2, Check, X, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger
} from '@/components/ui/tooltip';

// Sample role data
const roles = [
  {
    id: 1,
    name: 'Administrator',
    description: 'Full system access with all privileges',
    users: 2,
    permissions: {
      dashboard: true,
      devices: { view: true, edit: true, add: true, delete: true },
      users: { manage: true },
      settings: { manage: true },
    },
    isDefault: false,
    isSystem: true,
  },
  {
    id: 2,
    name: 'Manager',
    description: 'Can manage devices and view analytics',
    users: 5,
    permissions: {
      dashboard: true,
      devices: { view: true, edit: true, add: true, delete: false },
      users: { manage: false },
      settings: { manage: false },
    },
    isDefault: false,
    isSystem: false,
  },
  {
    id: 3,
    name: 'Technician',
    description: 'Technical staff with device access',
    users: 8,
    permissions: {
      dashboard: true,
      devices: { view: true, edit: true, add: false, delete: false },
      users: { manage: false },
      settings: { manage: false },
    },
    isDefault: false,
    isSystem: false,
  },
  {
    id: 4,
    name: 'Viewer',
    description: 'Read-only access to the system',
    users: 12,
    permissions: {
      dashboard: true,
      devices: { view: true, edit: false, add: false, delete: false },
      users: { manage: false },
      settings: { manage: false },
    },
    isDefault: true,
    isSystem: true,
  },
];

const UserRoles = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter roles based on search
  const filteredRoles = roles.filter(role => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      role.name.toLowerCase().includes(query) ||
      role.description.toLowerCase().includes(query)
    );
  });

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Back button */}
      <Button variant="ghost" onClick={() => navigate('/users')}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Users
      </Button>

      <PageHeader 
        title="User Roles" 
        description="Define and manage system roles and permissions"
      />

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Search roles..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-1" /> Create New Role
        </Button>
      </div>

      {/* Roles list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Shield className="h-5 w-5 mr-2" /> System Roles
          </CardTitle>
          <CardDescription>
            Roles define what users can see and do within the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-center">Users</TableHead>
                <TableHead className="text-center">Default</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">
                    {role.name}
                    {role.isSystem && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge variant="outline" className="ml-2">System</Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>System roles cannot be deleted</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </TableCell>
                  <TableCell>{role.description}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary">{role.users}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {role.isDefault ? (
                      <Check className="h-4 w-4 mx-auto text-green-500" />
                    ) : (
                      <X className="h-4 w-4 mx-auto text-muted-foreground" />
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge 
                              variant={role.permissions.devices.edit ? "default" : "outline"}
                              className="cursor-help"
                            >
                              Edit
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Can edit devices and settings</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge 
                              variant={role.permissions.devices.add ? "default" : "outline"}
                              className="cursor-help"
                            >
                              Add
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Can add new devices</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge 
                              variant={role.permissions.devices.delete ? "destructive" : "outline"}
                              className="cursor-help"
                            >
                              Delete
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Can delete devices</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge 
                              variant={role.permissions.users.manage ? "secondary" : "outline"}
                              className="cursor-help"
                            >
                              Users
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Can manage users</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge 
                              variant={role.permissions.settings.manage ? "warning" : "outline"}
                              className="cursor-help"
                            >
                              Settings
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Can manage system settings</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Info className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" /> Edit Role
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Shield className="h-4 w-4 mr-2" /> Permissions
                        </DropdownMenuItem>
                        {!role.isDefault && (
                          <DropdownMenuItem>
                            <Check className="h-4 w-4 mr-2" /> Make Default
                          </DropdownMenuItem>
                        )}
                        {!role.isSystem && (
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserRoles;
