import React from 'react';
import SettingsPageTemplate from '@/components/settings/SettingsPageTemplate';
import { Lock } from 'lucide-react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

const Authentication = () => {
  return (
    <SettingsPageTemplate 
      title="Authentication" 
      description="Configure authentication methods and security policies"
      headerIcon={<Lock size={20} />}
    >
      <div className="space-y-6">
        <p>This settings page is under development.</p>
      </div>
    </SettingsPageTemplate>
  );
};

export default Authentication;
