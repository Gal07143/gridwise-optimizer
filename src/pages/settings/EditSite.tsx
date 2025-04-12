
import React from 'react';
import { useConnectionStatus } from '@/hooks/useConnectionStatus';

const EditSite: React.FC = () => {
  const {
    isConnected,
    status,
    connect,
    disconnect,
  } = useConnectionStatus({
    deviceId: 'site-1', 
    autoReconnect: true,
    timeout: 5000
  });

  return (
    <div>
      <h1>Edit Site</h1>
      <p>Connection Status: {status}</p>
      <button onClick={connect} disabled={isConnected}>Connect</button>
      <button onClick={disconnect} disabled={!isConnected}>Disconnect</button>
    </div>
  );
};

export default EditSite;
