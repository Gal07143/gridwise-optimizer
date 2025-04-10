
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Save, UserCog, Mail, AtSign, Calendar, Lock, 
  Building, Shield, CircleAlert
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const UserProfile = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    role: '',
    company: '',
    title: '',
  });

  useEffect(() => {
    if (userId) {
      fetchUserProfile(userId);
    }
  }, [userId]);

  const fetchUserProfile = async (id: string) => {
    try {
      setIsLoading(true);
      
      // Fetch user profile from profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      setUser(data);
      setFormData({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        email: data.email || '',
        role: data.role || 'user',
        company: data.company || '',
        title: data.title || '',
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error('Failed to load user profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleChange = (value: string) => {
    setFormData({
      ...formData,
      role: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      
      // Update profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          role: formData.role,
          company: formData.company,
          title: formData.title,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);
        
      if (error) throw error;
      
      toast.success('User profile updated successfully');
    } catch (error: any) {
      console.error('Error updating user profile:', error);
      toast.error(`Failed to update user: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const getRoleBadge = (role?: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return <Badge variant="destructive">Admin</Badge>;
      case 'manager':
        return <Badge variant="default">Manager</Badge>;
      case 'technician':
        return <Badge variant="secondary">Technician</Badge>;
      case 'viewer':
      default:
        return <Badge variant="outline">Viewer</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Button variant="ghost" onClick={() => navigate('/users')}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Users
      </Button>

      <PageHeader 
        title={isLoading ? "Loading User..." : `${formData.first_name} ${formData.last_name}`}
        description="View and edit user account details"
      />

      {isLoading ? (
        <div className="space-y-2">
          <Card>
            <CardHeader>
              <div className="h-7 w-1/3 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="h-8 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 w-full bg-gray-200 rounded animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <UserCog className="h-5 w-5 mr-2" />
                    Account Information
                  </CardTitle>
                  <CardDescription>
                    Update user's profile information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first_name">First Name</Label>
                        <Input 
                          id="first_name" 
                          name="first_name"
                          value={formData.first_name} 
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="last_name">Last Name</Label>
                        <Input 
                          id="last_name" 
                          name="last_name"
                          value={formData.last_name} 
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        name="email"
                        value={formData.email} 
                        disabled
                        className="bg-muted"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select 
                        value={formData.role} 
                        onValueChange={handleRoleChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Administrator</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="technician">Technician</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input 
                          id="company" 
                          name="company"
                          value={formData.company} 
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="title">Job Title</Label>
                        <Input 
                          id="title" 
                          name="title"
                          value={formData.title} 
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end pt-4">
                      <Button 
                        type="submit" 
                        disabled={isSaving}
                      >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                        {!isSaving && <Save className="ml-2 h-4 w-4" />}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">User Profile</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center text-center">
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarImage src={user?.avatar_url} />
                      <AvatarFallback className="text-lg">
                        {formData.first_name && formData.last_name 
                          ? `${formData.first_name[0]}${formData.last_name[0]}` 
                          : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-medium text-lg">{formData.first_name} {formData.last_name}</h3>
                    <p className="text-muted-foreground">{formData.title}</p>
                    <p className="text-muted-foreground">{formData.company}</p>
                    
                    <div className="mt-4">
                      {getRoleBadge(formData.role)}
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="w-full space-y-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4" />
                        <span>{user?.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        <span>Joined: {new Date(user?.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Access Control</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Access Level</span>
                        </div>
                        <Badge variant={formData.role === 'admin' ? 'destructive' : 'outline'}>
                          {formData.role === 'admin' ? 'Full Access' : 'Limited'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Lock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Two Factor Auth</span>
                        </div>
                        <Badge variant="outline">Not Enabled</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="security" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage user's security settings and password
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Security settings page is under development. Check back soon.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="activity" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Activity Log</CardTitle>
                <CardDescription>
                  Recent activity for this user
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    User activity logging is under development. Check back soon.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default UserProfile;
