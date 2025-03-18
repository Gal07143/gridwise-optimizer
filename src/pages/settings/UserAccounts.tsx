
import React from 'react';
import SettingsPageTemplate from '@/components/settings/SettingsPageTemplate';
import { Users } from 'lucide-react';

const UserAccounts = () => {
  return (
    <SettingsPageTemplate 
      title="User Accounts" 
      description="Manage user accounts and access control"
      headerIcon={<Users size={20} />}
    >
      <div className="space-y-6">
        <p>This settings page is under development.</p>
      </div>
    </SettingsPageTemplate>
  );
};

export default UserAccounts;
