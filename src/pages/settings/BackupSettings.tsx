
import React from 'react';
import SettingsPageTemplate from '@/components/settings/SettingsPageTemplate';
import { Archive } from 'lucide-react';

const BackupSettings = () => {
  return (
    <SettingsPageTemplate 
      title="Backup & Restore" 
      description="Configure automated backups and restore points"
      headerIcon={<Archive size={20} />}
    >
      <div className="space-y-6">
        <p>This settings page is under development.</p>
      </div>
    </SettingsPageTemplate>
  );
};

export default BackupSettings;
