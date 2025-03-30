// components/ui/NotificationCenter.tsx
import React, { useEffect, useState } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error';
  timestamp: string;
}

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const ws = new WebSocket('wss://your-api/ws');
    ws.onmessage = (event) => {
      const alert = JSON.parse(event.data);
      setNotifications((prev) => [alert, ...prev.slice(0, 4)]);
    };
    return () => ws.close();
  }, []);

  return (
    <div className="space-y-2">
      {notifications.map((n) => (
        <Alert key={n.id} variant={n.type}>
          <AlertTitle>{n.title}</AlertTitle>
          <AlertDescription>{n.message} <span className="text-xs text-muted-foreground">{new Date(n.timestamp).toLocaleTimeString()}</span></AlertDescription>
        </Alert>
      ))}
    </div>
  );
};

export default NotificationCenter;
