import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpenIcon, BookmarkIcon, LogOutIcon } from 'lucide-react';
import ProfileAvatar from './ProfileAvatar';

const ProfileDropdown = ({ user, onLogout, onClose }) => {
  return (
    <div className="absolute right-0 mt-3 w-64 bg-popover border border-border rounded-lg shadow-lg py-2 z-50">
      <div className="px-4 py-3 border-b border-border flex items-center gap-3">
        <ProfileAvatar user={user} size="w-10 h-10" textSize="text-sm" />
        <div className="min-w-0">
          <p className="font-medium text-sm text-foreground truncate">
            {user?.fullName || user?.name}
          </p>
          <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
        </div>
      </div>

      <div className="py-1">
        <Link
          to="/my-blogs"
          className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
          onClick={onClose}
        >
          <BookOpenIcon className="h-4 w-4" />
          My Blogs
        </Link>
        <Link
          to="/saved-blogs"
          className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
          onClick={onClose}
        >
          <BookmarkIcon className="h-4 w-4" />
          Saved Blogs
        </Link>
      </div>

      <div className="border-t border-border pt-1">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-secondary transition-colors w-full text-left"
        >
          <LogOutIcon className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;