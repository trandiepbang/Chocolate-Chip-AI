import { useState, useEffect, useCallback, useRef } from 'react';

interface WebSocketHookOptions {
  url: string;
  reconnectAttempts?: number;
  reconnectInterval?: number;
  onMessage?: (data: any) => void;
}

export const useWebSocket = ({
  url,
  reconnectAttempts = 5,
  reconnectInterval = 3000,
  onMessage,
}: WebSocketHookOptions) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectCountRef = useRef(0);
  
  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(url);
      
      ws.onopen = () => {
        setIsConnected(true);
        setError(null);
        reconnectCountRef.current = 0;
      };

      ws.onclose = () => {
        setIsConnected(false);
        if (reconnectCountRef.current < reconnectAttempts) {
          reconnectCountRef.current += 1;
          setTimeout(connect, reconnectInterval);
        }
      };

      ws.onerror = (event) => {
        setError('WebSocket error occurred');
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        onMessage?.(data);
      };

      wsRef.current = ws;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect');
    }
  }, [url, reconnectAttempts, reconnectInterval, onMessage]);

  const sendMessage = useCallback((data: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    } else {
      setError('WebSocket is not connected');
    }
  }, []);

  const disconnect = useCallback(() => {
    wsRef.current?.close();
    wsRef.current = null;
    setIsConnected(false);
  }, []);

  useEffect(() => {
    connect();
    return () => {
      console.log("Socket disconnected");
      disconnect();
    };
  }, []);

  return {
    isConnected,
    error,
    sendMessage,
    disconnect,
  };
};