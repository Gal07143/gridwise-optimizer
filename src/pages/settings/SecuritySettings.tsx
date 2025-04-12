import React from 'react';

const SecuritySettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Security Settings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 border rounded-lg">
          <h3 className="font-medium mb-2">Authentication</h3>
          <p className="text-gray-600">Configure authentication methods and policies</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h3 className="font-medium mb-2">Encryption</h3>
          <p className="text-gray-600">Manage data encryption settings</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h3 className="font-medium mb-2">API Security</h3>
          <p className="text-gray-600">Configure API access and security</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h3 className="font-medium mb-2">Audit Logging</h3>
          <p className="text-gray-600">Manage security audit logs</p>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings; 