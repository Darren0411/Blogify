import React from 'react';
import { Link } from 'react-router-dom';
import { BellIcon, RefreshCwIcon, ThumbsUpIcon, MessageSquareIcon, CheckIcon } from 'lucide-react';
import ProfileAvatar from './ProfileAvatar';
import api from '../../utils/api';

const formatNotificationDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  return `${Math.floor(diffInHours / 24)}d ago`;
};

const NotificationDropdown = ({ notifications, loading, onRefresh, onClose }) => {
  const handleMarkAsRead = async (notificationId, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await api.patch(`/blog/notifications/${notificationId}/read`);
      onRefresh(); // Refresh the list
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.patch('/blog/notifications/mark-all-read');
      onRefresh(); // Refresh the list
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="absolute right-0 mt-3 w-80 bg-popover border border-border rounded-lg shadow-lg py-2 z-50 max-h-96 overflow-y-auto">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-sm text-foreground">Notifications</h3>
          <p className="text-xs text-muted-foreground">On your blogs</p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary transition-colors text-xs font-medium"
            >
              Mark all read
            </button>
          )}
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary transition-colors"
          >
            <RefreshCwIcon className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="px-4 py-4 space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-9 h-9 bg-secondary rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-secondary rounded w-3/4" />
                <div className="h-2.5 bg-secondary rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : notifications.length > 0 ? (
        notifications.map((notif) => (
          <div
            key={notif._id}
            className={`flex items-start gap-3 px-4 py-3 hover:bg-secondary transition-colors group ${
              !notif.isRead ? 'bg-secondary/50' : ''
            }`}
          >
            <Link
              to={`/blog/${notif.blogId._id}`}
              className="flex items-start gap-3 flex-1"
              onClick={onClose}
            >
              <ProfileAvatar 
                user={notif.triggerUserId} 
                size="w-9 h-9" 
                textSize="text-xs" 
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  {notif.type === 'like' ? (
                    <ThumbsUpIcon className="h-3 w-3 text-destructive" />
                  ) : (
                    <MessageSquareIcon className="h-3 w-3 text-blue-500" />
                  )}
                  <span className="text-xs font-medium text-foreground">
                    {notif.triggerUserId.fullName || notif.triggerUserId.name}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-1">
                  {notif.type === 'like' 
                    ? `liked your post` 
                    : `commented on your post`}
                </p>
                <h4 className="text-sm font-medium text-foreground truncate mb-1">
                  "{notif.blogId.title}"
                </h4>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  {formatNotificationDate(notif.createdAt)}
                </div>
              </div>
            </Link>
            {!notif.isRead && (
              <button
                onClick={(e) => handleMarkAsRead(notif._id, e)}
                className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                title="Mark as read"
              >
                <CheckIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        ))
      ) : (
        <div className="px-4 py-8 text-center">
          <BellIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No notifications yet</p>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;