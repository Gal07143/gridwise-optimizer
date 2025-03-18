
import React, { useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from 'sonner';
import { useRealtimeUpdates } from '@/hooks/use-realtime-updates';
import { useIsMobile } from '@/hooks/use-mobile';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';
export type NotificationPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

interface NotificationProps {
  enableRealtime?: boolean;
  position?: NotificationPosition;
  duration?: number;
}

export const Notifications: React.FC<NotificationProps> = ({ 
  enableRealtime = true,
  position,
  duration = 5000
}) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // Set different default positions based on device type
  const defaultPosition: NotificationPosition = isMobile ? 'top-center' : 'top-right';
  const effectivePosition = position || defaultPosition;
  
  // Set up realtime notifications for device and alert events
  useRealtimeUpdates({
    table: 'devices',
    events: ['UPDATE'],
    enabled: enableRealtime,
    onData: (payload) => {
      const { new: newData, old: oldData } = payload;
      
      // Only notify about significant changes
      if (newData && oldData && newData.status !== oldData.status) {
        if (newData.status === 'error') {
          showNotification(`Device ${newData.name} is reporting an error`, 'error', duration, effectivePosition);
        } else if (newData.status === 'maintenance') {
          showNotification(`Device ${newData.name} is in maintenance mode`, 'warning', duration, effectivePosition);
        } else if (oldData.status === 'offline' && newData.status === 'online') {
          showNotification(`Device ${newData.name} is now online`, 'success', duration, effectivePosition);
        } else if (oldData.status === 'online' && newData.status === 'offline') {
          showNotification(`Device ${newData.name} went offline`, 'warning', duration, effectivePosition);
        }
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
          showNotification(`Critical Alert: ${newData.message}`, 'error', duration, effectivePosition);
        } else if (newData.type === 'warning') {
          showNotification(`Warning: ${newData.message}`, 'warning', duration, effectivePosition);
        } else {
          showNotification(`Info: ${newData.message}`, 'info', duration, effectivePosition);
        }
      }
    }
  });
  
  return null;
};

export const showNotification = (
  message: string, 
  type: NotificationType = 'info', 
  duration = 5000,
  position?: NotificationPosition
) => {
  const options = {
    duration,
    position: position as any, // Sonner has compatible position types
  };
  
  switch (type) {
    case 'success':
      sonnerToast.success(message, options);
      break;
    case 'warning':
      sonnerToast.warning(message, options);
      break;
    case 'error':
      sonnerToast.error(message, options);
      break;
    default:
      sonnerToast.info(message, options);
  }
};

// Helper function to create a notification with a dedicated action button
export const showActionNotification = (
  message: string,
  actionText: string,
  onAction: () => void,
  type: NotificationType = 'info',
  duration = 8000,
  position?: NotificationPosition
) => {
  const options = {
    duration,
    position: position as any,
    action: {
      label: actionText,
      onClick: onAction,
    },
  };
  
  switch (type) {
    case 'success':
      sonnerToast.success(message, options);
      break;
    case 'warning':
      sonnerToast.warning(message, options);
      break;
    case 'error':
      sonnerToast.error(message, options);
      break;
    default:
      sonnerToast.info(message, options);
  }
};

export default Notifications;
