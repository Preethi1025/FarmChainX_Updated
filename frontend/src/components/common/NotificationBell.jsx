import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, AlertCircle, MessageSquare, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supportApi } from '../../api';

const NotificationBell = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user.id && user.role) {
      loadNotifications();
      // Refresh every 30 seconds
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadNotifications = async () => {
    if (!user || !user.id || !user.role) return;
    
    try {
      setLoading(true);
      const response = await supportApi.getUserNotifications(user.id, user.role);
      console.log('📡 Notifications response:', response.data);
      
      if (response.data && response.data.success) {
        const notificationsData = response.data.notifications || [];
        const unread = response.data.unreadCount || 0;
        
        setNotifications(notificationsData);
        setUnreadCount(unread);
        console.log(`✅ Loaded ${notificationsData.length} notifications, ${unread} unread`);
      }
    } catch (error) {
      console.error('❌ Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await supportApi.markNotificationAsRead(notificationId);
      loadNotifications(); // Refresh list
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user || !user.id || !user.role) return;
    
    try {
      await supportApi.markAllNotificationsAsRead(user.id, user.role);
      loadNotifications(); // Refresh list
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'TICKET_UPDATE':
        return <MessageSquare size={16} className="text-blue-500" />;
      case 'SUCCESS':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'ERROR':
        return <AlertCircle size={16} className="text-red-500" />;
      default:
        return <Bell size={16} className="text-gray-500" />;
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Notifications"
      >
        <Bell size={20} className="text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowDropdown(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-white">
              <div>
                <h3 className="font-bold text-gray-800">Notifications</h3>
                <p className="text-xs text-gray-600">
                  {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={loadNotifications}
                  disabled={loading}
                  className="p-1 hover:bg-gray-100 rounded"
                  title="Refresh"
                >
                  <svg 
                    className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      d="M21 12a9 9 0 11-2.636-6.364M21 3v6h-6"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {loading && notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-sm text-gray-500">Loading notifications...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell size={32} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500 font-medium">No notifications</p>
                  <p className="text-sm text-gray-400 mt-1">You're all caught up!</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50/50' : ''}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {getNotificationIcon(notification.notificationType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold text-gray-800 text-sm">
                            {notification.title}
                          </h4>
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {formatTime(notification.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mt-1">
                          {notification.message}
                        </p>
                        {notification.relatedTicketId && (
                          <div className="mt-2">
                            <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                              <MessageSquare size={10} />
                              Ticket #{notification.relatedTicketId}
                            </span>
                          </div>
                        )}
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <div className="flex justify-between items-center text-sm">
                <button
                  onClick={() => {
                    // You can add a "View All" page later
                    console.log('View all notifications');
                  }}
                  className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded hover:bg-blue-50"
                >
                  View All
                </button>
                <span className="text-gray-500">
                  {notifications.length} total
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;