
import React from 'react';
import SettingsPageTemplate from '@/components/settings/SettingsPageTemplate';
import { RefreshCw } from 'lucide-react';

const SystemUpdates = () => {
  return (
    <SettingsPageTemplate 
      title="System Updates" 
      description="Manage system updates and version control"
      headerIcon={<RefreshCw size={20} />}
    >
      <div className="space-y-6">
        <p>This settings page is under development.</p>
      </div>
    </SettingsPageTemplate>
  );
};

export default SystemUpdates;
