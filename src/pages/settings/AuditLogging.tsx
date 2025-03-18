
import React from 'react';
import SettingsPageTemplate from '@/components/settings/SettingsPageTemplate';
import { FileText } from 'lucide-react';

const AuditLogging = () => {
  return (
    <SettingsPageTemplate 
      title="Audit Logging" 
      description="Configure system audit logs and compliance features"
      headerIcon={<FileText size={20} />}
    >
      <div className="space-y-6">
        <p>This settings page is under development.</p>
      </div>
    </SettingsPageTemplate>
  );
};

export default AuditLogging;
