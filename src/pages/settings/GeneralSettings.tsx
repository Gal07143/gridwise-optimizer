
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SiteSettings from './SiteSettings';

const GeneralSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Configure general system settings and preferences.
          </p>
          <SiteSettings />
        </CardContent>
      </Card>
    </div>
  );
};

export default GeneralSettings;
