
import React from 'react';
import SettingsPageTemplate from '@/components/settings/SettingsPageTemplate';
import { Link } from 'lucide-react';

const ExternalServices = () => {
  return (
    <SettingsPageTemplate 
      title="External Services" 
      description="Connect and configure external service integrations"
      headerIcon={<Link size={20} />}
    >
      <div className="space-y-6">
        <p>This settings page is under development.</p>
      </div>
    </SettingsPageTemplate>
  );
};

export default ExternalServices;
