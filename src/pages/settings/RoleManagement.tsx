
import React from 'react';
import SettingsPageTemplate from '@/components/settings/SettingsPageTemplate';
import { ShieldCheck } from 'lucide-react';

const RoleManagement = () => {
  return (
    <SettingsPageTemplate 
      title="Role Management" 
      description="Configure user roles and responsibilities"
      headerIcon={<ShieldCheck size={20} />}
    >
      <div className="space-y-6">
        <p>This settings page is under development.</p>
      </div>
    </SettingsPageTemplate>
  );
};

export default RoleManagement;
