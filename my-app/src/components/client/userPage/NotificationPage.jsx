import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getNotificationsByUserId, 
  markNotificationAsRead, 
  deleteNotification,
  deleteAllNotifications as deleteAllNotificationsAPI,
  markAllNotificationsAsRead
} from '../../../api/notification.js';
import { getUser } from '../../../api/user.js';
import useWebSocketNotification from '../../../hooks/useWebSocketNotification.js';

// Format time from timestamp
const formatTimeAgo = (timestamp) => {
  if (!timestamp) return 'Unknown';
  
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US');
  } catch (error) {
    return 'Unknown';
  }
};

// Format data from backend to UI format
const formatNotification = (notification) => {
  // All notifications from backend are order notifications
  const type = 'order';
  const icon = 'fa-shopping-cart';
  
  // Create title from message or orderId
  let title = 'Order Notification';
  if (notification.orderId) {
    title = `Order #${notification.orderId.substring(0, 8)}`;
  }
  
  return {
    id: notification.id,
    type,
    title,
    message: notification.message || 'Your order has been updated',
    time: formatTimeAgo(notification.creationTimestamp),
    isRead: notification.isRead || false,
    icon,
    color: 'primary',
    orderId: notification.orderId,
    originalTimestamp: notification.creationTimestamp
  };
};

export default function NotificationPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, unread, order
  const [searchQuery, setSearchQuery] = useState('');
  const [userId, setUserId] = useState(null);
  
  // WebSocket for real-time notifications
  const { notifications: wsNotifications, connected: wsConnected } = useWebSocketNotification(userId, false);
  
  // Fetch initial notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        setError(null);
        const user = await getUser();
        if (!user || !user.id) {
          throw new Error('Unable to get user information');
        }
        
        setUserId(user.id);
        const data = await getNotificationsByUserId(user.id);
        // Only get notifications with orderId (orders)
        const orderNotifications = Array.isArray(data) 
          ? data.filter(n => n.orderId).map(formatNotification)
          : [];
        setNotifications(orderNotifications);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError(err.message || 'Unable to load notifications');
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Merge WebSocket real-time notifications with API notifications
  useEffect(() => {
    if (wsNotifications && wsNotifications.length > 0) {
      // Format WebSocket notifications
      const formattedWsNotifications = wsNotifications
        .filter(n => n.orderId) // Only order notifications
        .map(formatNotification);
      
      // Merge with existing notifications, avoiding duplicates
      setNotifications(prev => {
        const existingIds = new Set(prev.map(n => n.id));
        const newNotifications = formattedWsNotifications.filter(n => !existingIds.has(n.id));
        return [...newNotifications, ...prev];
      });
      
      // Dispatch event to notify Header component
      window.dispatchEvent(new CustomEvent('notificationsUpdated'));
    }
  }, [wsNotifications]);

  // Handle notification update events from WebSocket (mark as read, delete, etc.)
  useEffect(() => {
    const handleNotificationUpdate = (event) => {
      const updateEvent = event.detail;
      
      switch (updateEvent.updateType) {
        case 'MARKED_AS_READ':
          // Update notification to read
          setNotifications(prev => 
            prev.map(n => 
              n.id === updateEvent.notificationId 
                ? { ...n, isRead: true }
                : n
            )
          );
          break;
          
        case 'DELETED':
          // Remove notification from list
          setNotifications(prev => 
            prev.filter(n => n.id !== updateEvent.notificationId)
          );
          break;
          
        case 'MARKED_ALL_AS_READ':
          // Mark all as read
          setNotifications(prev => 
            prev.map(n => ({ ...n, isRead: true }))
          );
          break;
          
        case 'DELETED_ALL':
          // Clear all notifications
          setNotifications([]);
          break;
          
        default:
          break;
      }
      
      // Refresh notification count in header
      window.dispatchEvent(new CustomEvent('notificationsUpdated'));
    };

    window.addEventListener('notificationUpdate', handleNotificationUpdate);
    
    return () => {
      window.removeEventListener('notificationUpdate', handleNotificationUpdate);
    };
  }, []);

  // Refresh notifications after actions
  const refreshNotifications = async () => {
    try {
      const user = await getUser();
      if (user && user.id) {
        const data = await getNotificationsByUserId(user.id);
        const orderNotifications = Array.isArray(data) 
          ? data.filter(n => n.orderId).map(formatNotification)
          : [];
        setNotifications(orderNotifications);
        // Dispatch event to notify Header to refresh
        window.dispatchEvent(new CustomEvent('notificationsUpdated'));
      }
    } catch (err) {
      console.error('Error refreshing notifications:', err);
    }
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' 
      ? true 
      : filter === 'unread' 
        ? !notification.isRead 
        : notification.type === filter;
    
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      // Update will be handled via WebSocket update event, but we can optimistically update
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
      window.dispatchEvent(new CustomEvent('notificationsUpdated'));
    } catch (err) {
      console.error('Error marking notification as read:', err);
      alert('Failed to mark notification as read');
      // Refresh on error to sync state
      await refreshNotifications();
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      // Update will be handled via WebSocket update event, but we can optimistically update
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      window.dispatchEvent(new CustomEvent('notificationsUpdated'));
    } catch (err) {
      console.error('Error marking all as read:', err);
      alert('Failed to mark all notifications as read');
      // Refresh on error to sync state
      await refreshNotifications();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        await deleteNotification(id);
        // Update will be handled via WebSocket update event, but we can optimistically update
        setNotifications(prev => prev.filter(n => n.id !== id));
        window.dispatchEvent(new CustomEvent('notificationsUpdated'));
      } catch (err) {
        console.error('Error deleting notification:', err);
        alert('Failed to delete notification');
        // Refresh on error to sync state
        await refreshNotifications();
      }
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm('Are you sure you want to delete all notifications?')) {
      try {
        await deleteAllNotificationsAPI();
        // Update will be handled via WebSocket update event, but we can optimistically update
        setNotifications([]);
        window.dispatchEvent(new CustomEvent('notificationsUpdated'));
      } catch (err) {
        console.error('Error deleting all notifications:', err);
        alert('Failed to delete all notifications');
        // Refresh on error to sync state
        await refreshNotifications();
      }
    }
  };

  const handleViewOrder = (orderId) => {
    navigate(`/information/orders?orderId=${orderId}`);
  };

  const getTimeAgoColor = (time) => {
    if (time.includes('minute') || time.includes('hour') || time === 'Just now') {
      return '#ee4d2d';
    }
    return '#6c757d';
  };

  if (loading) {
    return (
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <i className="fas fa-spinner fa-spin fa-3x" style={{ color: '#ee4d2d', marginBottom: '16px' }}></i>
        <p>Loading notifications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <i className="fas fa-exclamation-triangle fa-3x" style={{ color: '#ffc107', marginBottom: '16px' }}></i>
        <p style={{ color: '#666' }}>{error}</p>
        <button 
          className="btn btn-primary mt-3"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '24px',
        borderBottom: '2px solid #ee4d2d',
        paddingBottom: '16px'
      }}>
        <div>
          <div>
            <h2 style={{ margin: 0, color: '#333', fontWeight: 600 }}>
              Notifications
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
              {wsConnected ? (
                <span style={{ 
                  fontSize: '10px', 
                  color: '#28a745', 
                  backgroundColor: '#d4edda', 
                  padding: '2px 6px', 
                  borderRadius: '4px',
                  fontWeight: 500
                }}>
                  ● Real-time
                </span>
              ) : (
                <span style={{ 
                  fontSize: '10px', 
                  color: '#dc3545', 
                  backgroundColor: '#f8d7da', 
                  padding: '2px 6px', 
                  borderRadius: '4px',
                  fontWeight: 500
                }}>
                  ● Offline
                </span>
              )}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {unreadCount > 0 && (
            <button 
              className="btn btn-sm"
              onClick={handleMarkAllAsRead}
              style={{ backgroundColor: '#ee4d2d', color: 'white', border: 'none' }}
            >
              <i className="fas fa-check-double me-1"></i>
              Mark All as Read
            </button>
          )}
          {notifications.length > 0 && (
            <button 
              className="btn btn-sm btn-outline-danger"
              onClick={handleDeleteAll}
            >
              <i className="fas fa-trash me-1"></i>
              Delete All
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        <button
          className="btn btn-sm"
          onClick={() => setFilter('all')}
          style={{ 
            backgroundColor: filter === 'all' ? '#ee4d2d' : 'white', 
            color: filter === 'all' ? 'white' : '#ee4d2d',
            border: filter === 'all' ? 'none' : '1px solid #ee4d2d'
          }}
        >
          All ({notifications.length})
        </button>
        <button
          className="btn btn-sm"
          onClick={() => setFilter('unread')}
          style={{ 
            backgroundColor: filter === 'unread' ? '#ee4d2d' : 'white', 
            color: filter === 'unread' ? 'white' : '#ee4d2d',
            border: filter === 'unread' ? 'none' : '1px solid #ee4d2d'
          }}
        >
          Unread ({unreadCount})
        </button>
        <button
          className="btn btn-sm"
          onClick={() => setFilter('order')}
          style={{ 
            backgroundColor: filter === 'order' ? '#ee4d2d' : 'white', 
            color: filter === 'order' ? 'white' : '#ee4d2d',
            border: filter === 'order' ? 'none' : '1px solid #ee4d2d'
          }}
        >
          <i className="fas fa-shopping-cart me-1"></i>
          Orders ({notifications.length})
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '20px' }}>
        <div className="input-group">
          <span className="input-group-text">
            <i className="fas fa-search"></i>
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Notification List */}
      {filteredNotifications.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: '#f8f9fa',
          borderRadius: '8px'
        }}>
          <i className="fas fa-bell-slash" style={{ fontSize: '48px', color: '#ccc', marginBottom: '16px' }}></i>
          <p style={{ color: '#999', fontSize: '16px', margin: 0 }}>
            No notifications found
          </p>
        </div>
      ) : (
        <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden' }}>
          {filteredNotifications.map(notification => (
            <div
              key={notification.id}
              className={notification.isRead ? '' : 'unread'}
              style={{
                padding: '20px',
                borderBottom: '1px solid #eee',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: notification.isRead ? 'white' : '#f8f9ff',
                borderLeft: notification.isRead ? 'none' : '4px solid #ee4d2d'
              }}
              onClick={() => handleMarkAsRead(notification.id)}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  background: notification.isRead ? '#f0f0f0' : '#ffede8',
                  opacity: 1
                }}
              >
                <i 
                  className={`fas ${notification.icon}`} 
                  style={{color: notification.isRead ? '#999' : '#ee4d2d', fontSize: '20px'}}
                ></i>
              </div>
              
              <div style={{flex: 1, minWidth: 0}}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <h6 style={{margin: 0, marginBottom: '4px', fontWeight: notification.isRead ? 500 : 600, color: notification.isRead ? '#333' : '#000'}}>
                      {notification.title}
                    </h6>
                    <p style={{margin: 0, color: '#666', fontSize: '14px', lineHeight: '1.5', marginBottom: '8px'}}>
                      {notification.message}
                    </p>
                    <span style={{fontSize: '12px', color: getTimeAgoColor(notification.time)}}>
                      {notification.time}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    {notification.type === 'order' && notification.orderId && (
                      <button 
                        className="btn btn-sm"
                        style={{ 
                          fontSize: '12px',
                          backgroundColor: notification.isRead ? '#6c757d' : '#ee4d2d',
                          color: 'white',
                          border: 'none'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewOrder(notification.orderId);
                        }}
                      >
                        <i className="fas fa-eye me-1"></i> View Order
                      </button>
                    )}
                    <button 
                      className="btn btn-sm"
                      style={{ 
                        fontSize: '12px',
                        backgroundColor: 'transparent',
                        color: '#ee4d2d',
                        border: '1px solid #ee4d2d'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(notification.id);
                      }}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

