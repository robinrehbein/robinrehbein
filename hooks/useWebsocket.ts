import { IS_BROWSER } from "$fresh/runtime.ts";
import { Signal, signal } from "@preact/signals";
import { useCallback, useEffect } from "preact/hooks";

export type WebSocketMessage =
  | string
  | ArrayBufferLike
  | Blob
  | ArrayBufferView;
export type WebSocketStatus =
  | "CONNECTING"
  | "CONNECTED"
  | "DISCONNECTED"
  | "ERROR";

interface UseWebSocketOptions {
  url: string;
  reconnectAttempts?: number;
  reconnectInterval?: number;
  onMessage?: (event: MessageEvent) => void;
  onError?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
  onOpen?: (event: Event) => void;
}

interface UseWebSocketReturn {
  status: Signal<WebSocketStatus>;
  sendMessage: (data: WebSocketMessage) => void;
}

export const useWebSocket = ({
  url,
  reconnectAttempts = 3,
  reconnectInterval = 3000,
  onMessage,
  onError,
  onClose,
  onOpen,
}: UseWebSocketOptions): UseWebSocketReturn => {
  const status = signal<WebSocketStatus>("DISCONNECTED");
  const ws = signal<WebSocket | null>(null);
  const reconnectCount = signal(0);

  const handleMessage = useCallback((event: MessageEvent) => {
    onMessage?.(event);
  }, [onMessage]);

  const handleError = useCallback((event: Event) => {
    status.value = "ERROR";
    onError?.(event);
  }, [onError]);

  const handleClose = useCallback((event: CloseEvent) => {
    status.value = "DISCONNECTED";
    onClose?.(event);

    if (reconnectCount.value < reconnectAttempts) {
      setTimeout(() => {
        reconnectCount.value++;
        initializeWebSocket();
      }, reconnectInterval);
    }
  }, [onClose, reconnectAttempts, reconnectInterval]);

  const handleOpen = useCallback((event: Event) => {
    status.value = "CONNECTED";
    reconnectCount.value = 0;
    onOpen?.(event);
  }, [onOpen]);

  const sendMessage = useCallback((data: WebSocketMessage) => {
    try {
      if (!ws.value) {
        throw new Error("WebSocket is not initialized");
      }

      if (ws.value.readyState !== WebSocket.OPEN) {
        throw new Error("WebSocket is not open");
      }

      ws.value.send(data);
    } catch (error) {
      console.error("Failed to send message:", error);
      throw error;
    }
  }, []);

  const initializeWebSocket = useCallback(() => {
    try {
      if (!IS_BROWSER) return;

      if (ws.value?.readyState === WebSocket.OPEN) {
        ws.value.close();
      }

      status.value = "CONNECTING";
      ws.value = new WebSocket(url);
      ws.value.onopen = handleOpen;
      ws.value.onmessage = handleMessage;
      ws.value.onerror = handleError;
      ws.value.onclose = handleClose;
    } catch (error) {
      console.error("WebSocket initialization failed:", error);
      status.value = "ERROR";
    }
  }, [url, handleOpen, handleMessage, handleError, handleClose]);

  useEffect(() => {
    initializeWebSocket();

    return () => {
      ws.value?.close();
      ws.value = null;
      status.value = "DISCONNECTED";
    };
  }, [url]);

  return {
    status,
    sendMessage,
  };
};
