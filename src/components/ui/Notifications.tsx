import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { subscribeToTable } from '@/services/supabaseRealtimeService';
import { AlertItem } from '@/components/microgrid/types';
import { useAuth } from '@/contexts/auth/AuthContext';

interface NotificationsProps {
  onNewAlert: (alert: AlertItem) => void;
}

const Notifications: React.FC<NotificationsProps> = ({ onNewAlert }) => {
  const { isAuthenticated } = useAuth();

  const handleNewAlert = (payload: any) => {
    const newAlert = {
      id: payload.record.id,
      timestamp: payload.record.timestamp,
      title: payload.record.title,
      message: payload.record.message,
      severity: payload.record.severity,
      deviceId: payload.record.device_id,
      acknowledged: payload.record.acknowledged,
    };
    
    toast.info(newAlert.message, {
      description: newAlert.title,
    });
    
    onNewAlert(newAlert);
  };

  useEffect(() => {
    let unsubscribe: () => void = () => {};
    
    if (isAuthenticated) {
      unsubscribe = subscribeToTable({
        table: 'alerts',
        event: 'INSERT',
        callback: handleNewAlert
      });
    }
    
    return () => {
      unsubscribe();
    };
  }, [isAuthenticated]);

  return <></>;
};

export default Notifications;
