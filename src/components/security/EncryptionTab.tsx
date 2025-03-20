
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const EncryptionTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Encryption Settings</CardTitle>
        <CardDescription>Manage data encryption and security protocols</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-slate-50 dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="text-base">Data at Rest</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">Configure encryption for stored data</p>
              <Button>Manage Encryption</Button>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-50 dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="text-base">Data in Transit</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">Configure TLS and connection security</p>
              <Button>Configure TLS</Button>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-50 dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="text-base">Key Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">Manage encryption keys and certificates</p>
              <Button>Manage Keys</Button>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-50 dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="text-base">Secure Communication</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">Configure secure API and device communication</p>
              <Button>Configure Settings</Button>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default EncryptionTab;
