
import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { subscribeToTable, unsubscribeFromTable } from '@/services/supabaseRealtimeService';

interface Notification {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  useEffect(() => {
    // Subscribe to alerts table
    const alertsChannel = subscribeToTable({
      table: 'alerts',
      events: ['INSERT'],
      enabled: true,
      onData: (payload) => {
        const newAlert = payload.new;
        setNotifications(prev => [
          {
            id: newAlert.id,
            message: newAlert.message || 'New alert received',
            timestamp: newAlert.created_at || new Date().toISOString(),
            read: false
          },
          ...prev
        ]);
        setUnreadCount(prev => prev + 1);
      }
    });
    
    // Subscribe to devices table for status changes
    const devicesChannel = subscribeToTable({
      table: 'devices',
      events: ['UPDATE'],
      enabled: true,
      onData: (payload) => {
        const device = payload.new;
        if (payload.old.status !== device.status) {
          setNotifications(prev => [
            {
              id: `device_${device.id}_${Date.now()}`,
              message: `Device "${device.name}" status changed to ${device.status}`,
              timestamp: new Date().toISOString(),
              read: false
            },
            ...prev
          ]);
          setUnreadCount(prev => prev + 1);
        }
      }
    });
    
    // Clean up on unmount
    return () => {
      unsubscribeFromTable(alertsChannel);
      unsubscribeFromTable(devicesChannel);
    };
  }, []);
  
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[18px] h-[18px] bg-red-500" 
              variant="destructive"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-3 border-b flex items-center justify-between">
          <h4 className="font-medium">Notifications</h4>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="h-auto py-1 px-2 text-xs"
            >
              Mark all as read
            </Button>
          )}
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="py-6 text-center text-muted-foreground">
              No notifications
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`p-3 text-sm ${notification.read ? '' : 'bg-muted/40'}`}
                >
                  <p>{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(notification.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Notifications;
