
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AccessControlTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Access Control Settings</CardTitle>
        <CardDescription>Configure authentication and access policies</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-slate-50 dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="text-base">Multi-Factor Authentication</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">Require secondary verification when users log in</p>
              <Button>Configure MFA</Button>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-50 dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="text-base">Login Policies</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">Set password requirements and login restrictions</p>
              <Button>Manage Policies</Button>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-50 dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="text-base">IP Restrictions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">Control which IP addresses can access the system</p>
              <Button>Configure IP Rules</Button>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-50 dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="text-base">Session Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">Configure timeout and session handling</p>
              <Button>Manage Sessions</Button>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessControlTab;
