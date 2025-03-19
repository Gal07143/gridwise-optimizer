
import React from 'react';
import { Key } from 'lucide-react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import SettingsPageTemplate from '@/components/settings/SettingsPageTemplate';

const ApiKeyManagement = () => {
  return (
    <SettingsPageTemplate
      title="API Key Management"
      description="Create and manage API keys for secure access to the Energy Management System"
      headerIcon={<Key size={20} />}
    >
      <div className="max-w-4xl mx-auto text-center py-12">
        <Key className="w-16 h-16 mx-auto mb-4 text-primary" />
        <h2 className="text-2xl font-bold mb-4">API Key Management Coming Soon</h2>
        <p className="text-muted-foreground mb-6">
          We're currently building out our API key management interface. Check back soon for 
          tools to generate, manage, and monitor API keys for integration with external systems.
        </p>
      </div>
    </SettingsPageTemplate>
  );
};

export default ApiKeyManagement;
