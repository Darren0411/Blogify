import React from 'react';
import { Link } from 'react-router-dom';
import { BellIcon, UserIcon, ClockIcon, RefreshCwIcon } from 'lucide-react';
import ProfileAvatar from './ProfileAvatar';

const formatNotificationDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  return `${Math.floor(diffInHours / 24)}d ago`;
};

const NotificationDropdown = ({ blogs, loading, onRefresh, onClose }) => {
  return (
    <div className="absolute right-0 mt-3 w-80 bg-popover border border-border rounded-lg shadow-lg py-2 z-50 max-h-96 overflow-y-auto">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-sm text-foreground">Latest blogs</h3>
          <p className="text-xs text-muted-foreground">From other writers</p>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary transition-colors"
        >
          <RefreshCwIcon className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
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
      ) : blogs.length > 0 ? (
        blogs.map((blog) => (
          <Link
            key={blog._id}
            to={`/blog/${blog._id}`}
            className="flex items-start gap-3 px-4 py-3 hover:bg-secondary transition-colors"
            onClick={onClose}
          >
            <ProfileAvatar user={blog.createdBy} size="w-9 h-9" textSize="text-xs" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <UserIcon className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs font-medium text-foreground">
                  {blog.createdBy.fullName || blog.createdBy.name}
                </span>
              </div>
              <h4 className="text-sm font-medium text-foreground truncate mb-1">
                {blog.title}
              </h4>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <ClockIcon className="h-3 w-3" />
                {formatNotificationDate(blog.createdAt)}
              </div>
            </div>
          </Link>
        ))
      ) : (
        <div className="px-4 py-8 text-center">
          <BellIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No new blogs</p>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;