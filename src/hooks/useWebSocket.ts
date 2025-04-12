import { useState, useEffect, useCallback } from 'react';

export interface WebSocketMessage {
  type: string;
  data: any;
}

export function useWebSocket(url: string) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      setIsConnected(true);
      console.log('WebSocket connected');
    };

    ws.onclose = () => {
      setIsConnected(false);
      console.log('WebSocket disconnected');
      
      // Attempt to reconnect after 5 seconds
      setTimeout(() => {
        if (socket === null) {
          console.log('Attempting to reconnect...');
          setSocket(new WebSocket(url));
        }
      }, 5000);
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        setLastMessage(message);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [url]);

  const sendMessage = useCallback(
    (message: string | object) => {
      if (socket?.readyState === WebSocket.OPEN) {
        socket.send(typeof message === 'string' ? message : JSON.stringify(message));
      } else {
        console.error('WebSocket is not connected');
      }
    },
    [socket]
  );

  return {
    lastMessage,
    sendMessage,
    isConnected,
  };
}

export default useWebSocket; 