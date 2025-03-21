import React from 'react';
import SettingsPageTemplate from '@/components/settings/SettingsPageTemplate';
import { DatabaseBackup } from 'lucide-react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

const BackupSettings = () => {
  return (
    <SettingsPageTemplate
      title="Backup Settings"
      description="Configure backup schedules and storage options"
      headerIcon={<DatabaseBackup size={20} />}
    >
      <div className="space-y-6">
        <p>This settings page is under development.</p>
        {/* Example usage of the Calendar component */}
        <CalendarComponent mode="single" onSelect={() => {}} />
      </div>
    </SettingsPageTemplate>
  );
};

export default BackupSettings;
