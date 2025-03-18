
import React, { useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from 'sonner';
import { useRealtimeUpdates } from '@/hooks/use-realtime-updates';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

interface NotificationProps {
  enableRealtime?: boolean;
}

export const Notifications: React.FC<NotificationProps> = ({ 
  enableRealtime = true 
}) => {
  const { toast } = useToast();
  
  // Set up realtime notifications for device and alert events
  useRealtimeUpdates({
    table: 'devices',
    events: ['UPDATE'],
    enabled: enableRealtime,
    onData: (payload) => {
      const { new: newData } = payload;
      if (newData && newData.status === 'error') {
        sonnerToast.error(`Device ${newData.name} is reporting an error`);
      } else if (newData && newData.status === 'maintenance') {
        sonnerToast.warning(`Device ${newData.name} is in maintenance mode`);
      }
    }
  });
  
  useRealtimeUpdates({
    table: 'alerts',
    events: ['INSERT'],
    enabled: enableRealtime,
    onData: (payload) => {
      const { new: newData } = payload;
      if (newData) {
        if (newData.type === 'critical') {
          sonnerToast.error(`Critical Alert: ${newData.message}`);
        } else if (newData.type === 'warning') {
          sonnerToast.warning(`Warning: ${newData.message}`);
        } else {
          sonnerToast.info(`Info: ${newData.message}`);
        }
      }
    }
  });
  
  return null;
};

export const showNotification = (
  message: string, 
  type: NotificationType = 'info', 
  duration = 5000
) => {
  switch (type) {
    case 'success':
      sonnerToast.success(message, { duration });
      break;
    case 'warning':
      sonnerToast.warning(message, { duration });
      break;
    case 'error':
      sonnerToast.error(message, { duration });
      break;
    default:
      sonnerToast.info(message, { duration });
  }
};

export default Notifications;
