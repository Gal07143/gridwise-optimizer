
// components/ui/NotificationCenter.tsx
import React, { useEffect, useState } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { X, AlertCircle } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: string;
  read?: boolean;
}

// Mock API call to fetch notifications
const fetchNotifications = async (): Promise<Notification[]> => {
  try {
    // Try to fetch from actual API first
    const response = await axios.get('/api/notifications');
    return response.data;
  } catch (error) {
    console.warn('Using fallback notifications due to API error:', error);
    // Fallback to mock data if API fails
    return [
      {
        id: '1',
        title: 'System Update',
        message: 'Energy management system updated to version 2.3.0',
        type: 'info',
        timestamp: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Battery Low',
        message: 'Battery storage system below 20% charge',
        type: 'warning',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      }
    ];
  }
};

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();
  
  const { data, error, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    refetchInterval: 60000, // Refresh every minute
    retry: 3, // Retry failed requests up to 3 times
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });

  useEffect(() => {
    if (data) {
      setNotifications(data);
    }
  }, [data]);

  useEffect(() => {
    // Setup WebSocket connection for real-time notifications
    const wsUrl = import.meta.env.VITE_WS_URL || 'wss://your-api/ws';
    let ws: WebSocket;
    
    try {
      ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log('WebSocket connected');
      };
      
      ws.onmessage = (event) => {
        try {
          const alert = JSON.parse(event.data);
          setNotifications((prev) => [alert, ...prev.slice(0, 9)]); // Keep the last 10 notifications
          
          // Show toast for new notifications
          toast({
            title: alert.title,
            description: alert.message,
            variant: alert.type === 'error' ? 'destructive' : 'default',
          });
        } catch (e) {
          console.error('Error processing WebSocket message', e);
        }
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast({
          title: 'Connection Error',
          description: 'Failed to connect to notification service. Retrying...',
          variant: 'destructive',
        });
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed. Attempting to reconnect in 5 seconds...');
        // Attempt to reconnect after 5 seconds
        setTimeout(() => {
          console.log('Attempting to reconnect WebSocket...');
        }, 5000);
      };
    } catch (error) {
      console.warn('WebSocket connection failed:', error);
    }
    
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [toast]);

  // Function to add a system notification programmatically
  const addSystemNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `local-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Also show as toast
    toast({
      title: notification.title,
      description: notification.message,
      variant: notification.type === 'error' ? 'destructive' : 'default',
    });
  };

  const dismissNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  if (isLoading) {
    return <div className="p-4 text-center text-muted-foreground">Loading notifications...</div>;
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert variant="destructive" className="mb-2">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertTitle>Failed to load notifications</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Unknown error occurred'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (notifications.length === 0) {
    return <div className="p-4 text-center text-muted-foreground">No notifications</div>;
  }

  return (
    <div className="space-y-2 p-2 max-h-[400px] overflow-y-auto">
      {notifications.map((n) => (
        <Alert 
          key={n.id} 
          variant={
            n.type === 'error' ? 'destructive' : 
            n.type === 'warning' ? 'default' : 
            n.type === 'success' ? 'default' : 'default'
          }
          className={`relative ${n.read ? 'opacity-70' : ''} ${
            n.type === 'success' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : ''
          }`}
          onClick={() => markAsRead(n.id)}
        >
          <button 
            className="absolute top-2 right-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-1"
            onClick={(e) => {
              e.stopPropagation();
              dismissNotification(n.id);
            }}
          >
            <X className="h-4 w-4" />
          </button>
          <AlertTitle className="pr-6">{n.title}</AlertTitle>
          <AlertDescription className="flex justify-between">
            <span>{n.message}</span>
            <span className="text-xs text-muted-foreground">
              {new Date(n.timestamp).toLocaleTimeString()}
            </span>
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
};

// Export both the component and the function to add notifications
export { NotificationCenter, type Notification };
export default NotificationCenter;
