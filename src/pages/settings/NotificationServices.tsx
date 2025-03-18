
import React from 'react';
import SettingsPageTemplate from '@/components/settings/SettingsPageTemplate';
import { Bell } from 'lucide-react';

const NotificationServices = () => {
  return (
    <SettingsPageTemplate 
      title="Notification Services" 
      description="Configure system notifications and alerts"
      headerIcon={<Bell size={20} />}
    >
      <div className="space-y-6">
        <p>This settings page is under development.</p>
      </div>
    </SettingsPageTemplate>
  );
};

export default NotificationServices;
