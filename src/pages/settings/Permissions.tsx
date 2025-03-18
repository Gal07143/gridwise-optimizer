
import React from 'react';
import SettingsPageTemplate from '@/components/settings/SettingsPageTemplate';
import { KeyRound } from 'lucide-react';

const Permissions = () => {
  return (
    <SettingsPageTemplate 
      title="Permissions" 
      description="Configure granular permissions for system features"
      headerIcon={<KeyRound size={20} />}
    >
      <div className="space-y-6">
        <p>This settings page is under development.</p>
      </div>
    </SettingsPageTemplate>
  );
};

export default Permissions;
