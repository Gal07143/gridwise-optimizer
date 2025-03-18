
import React from 'react';
import SettingsPageTemplate from '@/components/settings/SettingsPageTemplate';
import { Shield } from 'lucide-react';

const Encryption = () => {
  return (
    <SettingsPageTemplate 
      title="Encryption" 
      description="Configure data encryption and security protocols"
      headerIcon={<Shield size={20} />}
    >
      <div className="space-y-6">
        <p>This settings page is under development.</p>
      </div>
    </SettingsPageTemplate>
  );
};

export default Encryption;
