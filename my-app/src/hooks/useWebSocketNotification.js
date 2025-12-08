import { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import Cookies from 'js-cookie';

const useWebSocketNotification = (userId, isShopOwner = false) => {
  const [notifications, setNotifications] = useState([]);
  const [connected, setConnected] = useState(false);
  const stompClientRef = useRef(null);

  useEffect(() => {
    if (!userId) {
      return;
    }

    // Determine WebSocket URL based on environment
    // Development: http://localhost:8080/ws/notifications
    // Production: ws://shopee-fake.id.vn/api/ws/notifications (via Nginx -> Gateway)
    const getWebSocketUrl = () => {
      if (process.env.NODE_ENV === 'production' || window.location.hostname !== 'localhost') {
        // Production: Use current protocol (http/https) and host
        const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
        const host = window.location.host;
        // Frontend runs on root, but API is proxied via /api
        return `${protocol}//${host}/api/ws/notifications`;
      } else {
        // Development: Direct connection to Gateway
        return 'http://localhost:8080/ws/notifications';
      }
    };

    const wsUrl = getWebSocketUrl();

    const socket = new SockJS(wsUrl);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('WebSocket connected via Gateway');
        setConnected(true);

        // Subscribe to notification channel based on user type
        const destination = isShopOwner 
          ? `/topic/shop/${userId}`
          : `/topic/user/${userId}`;

        const subscription = stompClient.subscribe(destination, (message) => {
          try {
            const notification = JSON.parse(message.body);
            console.log('Received real-time notification:', notification);
            
            // Add notification to state (prepend to array)
            setNotifications(prev => {
              // Check if notification already exists (avoid duplicates)
              const exists = prev.some(n => n.id === notification.id);
              if (exists) {
                return prev;
              }
              return [notification, ...prev];
            });
            
            // Dispatch custom event to notify other components (e.g., Header)
            window.dispatchEvent(new CustomEvent('realtimeNotification', { 
              detail: notification 
            }));

            // Optional: Show browser notification (if permission granted)
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('New Notification', {
                body: notification.message,
                icon: '/favicon.ico'
              });
            }
          } catch (error) {
            console.error('Error parsing notification:', error);
          }
        });

        // Store subscription for cleanup
        stompClientRef.current.subscription = subscription;

        // Subscribe to notification updates (mark as read, delete, etc.)
        const updatesDestination = isShopOwner 
          ? `/topic/shop/${userId}/updates`
          : `/topic/user/${userId}/updates`;

        const updatesSubscription = stompClient.subscribe(updatesDestination, (message) => {
          try {
            const updateEvent = JSON.parse(message.body);
            console.log('Received notification update event:', updateEvent);
            
            // Dispatch custom event để components có thể handle
            window.dispatchEvent(new CustomEvent('notificationUpdate', { 
              detail: updateEvent 
            }));
          } catch (error) {
            console.error('Error parsing update event:', error);
          }
        });

        // Store updates subscription for cleanup
        stompClientRef.current.updatesSubscription = updatesSubscription;
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame);
        setConnected(false);
      },
      onDisconnect: () => {
        console.log('WebSocket disconnected');
        setConnected(false);
      },
      onWebSocketError: (error) => {
        console.error('WebSocket error:', error);
        setConnected(false);
      }
    });

    // Add JWT token to headers (Gateway will forward this header)
    const token = Cookies.get('accessToken');
    if (token) {
      stompClient.connectHeaders = {
        Authorization: `Bearer ${token}`
      };
    } else {
      console.warn('No JWT token found in Cookies. WebSocket connection may fail authentication.');
    }

    stompClient.activate();
    stompClientRef.current = stompClient;

    // Cleanup on unmount
    return () => {
      if (stompClientRef.current) {
        if (stompClientRef.current.subscription) {
          stompClientRef.current.subscription.unsubscribe();
        }
        if (stompClientRef.current.updatesSubscription) {
          stompClientRef.current.updatesSubscription.unsubscribe();
        }
        stompClientRef.current.deactivate();
        stompClientRef.current = null;
      }
    };
  }, [userId, isShopOwner]);

  return { notifications, connected };
};

export default useWebSocketNotification;

