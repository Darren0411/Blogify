import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, BookOpenIcon, PlusIcon, BookmarkIcon, LogOutIcon } from 'lucide-react';
import ProfileAvatar from './ProfileAvatar';

const MobileMenu = ({ user, isActiveRoute, onLogout, onClose }) => {
  const linkClass = (path) =>
    `flex items-center gap-3 px-4 py-3 rounded-md text-sm transition-colors ${
      isActiveRoute(path)
        ? 'bg-secondary text-foreground font-medium'
        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
    }`;

  return (
    <div className="border-t border-border py-4">
      <div className="space-y-1 px-2">
        <Link to="/" className={linkClass('/')} onClick={onClose}>
          <HomeIcon className="h-4 w-4" />
          Home
        </Link>
        {user && (
          <>
            <Link to="/my-blogs" className={linkClass('/my-blogs')} onClick={onClose}>
              <BookOpenIcon className="h-4 w-4" />
              My Blogs
            </Link>
            <Link to="/add-blog" className={linkClass('/add-blog')} onClick={onClose}>
              <PlusIcon className="h-4 w-4" />
              Add Blog
            </Link>
          </>
        )}
      </div>

      {user ? (
        <div className="border-t border-border mt-4 pt-4 px-2">
          <div className="flex items-center gap-3 px-4 py-2 mb-2">
            <ProfileAvatar user={user} />
            <div>
              <p className="text-sm font-medium text-foreground">{user?.fullName || user?.name}</p>
              <p className="text-xs text-muted-foreground">Writer</p>
            </div>
          </div>
          <Link to="/saved-blogs" className={linkClass('/saved-blogs')} onClick={onClose}>
            <BookmarkIcon className="h-4 w-4" />
            Saved Blogs
          </Link>
          <button
            onClick={() => { onLogout(); onClose(); }}
            className="flex items-center gap-3 px-4 py-3 rounded-md text-sm text-destructive hover:bg-secondary transition-colors w-full text-left"
          >
            <LogOutIcon className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      ) : (
        <div className="border-t border-border mt-4 pt-4 px-2 space-y-2">
          <Link
            to="/login"
            className="block px-4 py-2.5 text-center text-sm text-foreground border border-border rounded-md hover:bg-secondary transition-colors"
            onClick={onClose}
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="block px-4 py-2.5 text-center text-sm bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition-opacity"
            onClick={onClose}
          >
            Get Started
          </Link>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;