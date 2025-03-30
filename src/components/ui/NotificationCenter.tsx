
// components/ui/NotificationCenter.tsx
import React, { useEffect, useState } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { X } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error';
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
          setNotifications((prev) => [alert, ...prev.slice(0, 4)]);
          
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
    return <div className="p-4 text-center text-red-500">Failed to load notifications</div>;
  }

  if (notifications.length === 0) {
    return <div className="p-4 text-center text-muted-foreground">No notifications</div>;
  }

  return (
    <div className="space-y-2 p-2 max-h-[400px] overflow-y-auto">
      {notifications.map((n) => (
        <Alert 
          key={n.id} 
          variant={n.type === 'error' ? 'destructive' : n.type === 'warning' ? 'default' : 'default'}
          className={`relative ${n.read ? 'opacity-70' : ''}`}
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

export default NotificationCenter;
