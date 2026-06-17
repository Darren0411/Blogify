import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/api';
import {
  PenToolIcon, HomeIcon, PlusIcon, MenuIcon, XIcon,
  SearchIcon, BellIcon, BookOpenIcon, ChevronDownIcon,
  SunIcon, MoonIcon,
} from 'lucide-react';
import ProfileAvatar from './navbar/ProfileAvatar';
import NotificationDropdown from './navbar/NotificationDropdown';
import ProfileDropdown from './navbar/ProfileDropdown';
import MobileMenu from './navbar/MobileMenu';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [notificationLoading, setNotificationLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/user/me');
        setUser(response.data?.success ? response.data.user : null);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const fetchLatestBlogs = async () => {
    if (!user) return;
    try {
      setNotificationLoading(true);
      const response = await api.get('/');
      if (response.data?.success && response.data.blogs) {
        setLatestBlogs(
          response.data.blogs.filter(b => b.createdBy._id !== user._id).slice(0, 5)
        );
      } else {
        setLatestBlogs([]);
      }
    } catch {
      setLatestBlogs([]);
    } finally {
      setNotificationLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchLatestBlogs();
    else setLatestBlogs([]);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(fetchLatestBlogs, 30000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    const isDark = savedMode === null ? true : savedMode === 'true';
    setIsDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
    document.documentElement.classList.toggle('dark', newMode);
  };

  const handleLogout = async () => {
    try {
      await api.post('/user/logout');
    } finally {
      setUser(null);
      setIsProfileOpen(false);
      navigate('/');
    }
  };

  const isActiveRoute = (path) => location.pathname === path;

  if (isLoading) {
    return (
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <PenToolIcon className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">ThoughtSphere</span>
          </div>
          <div className="h-9 w-24 bg-secondary rounded-md animate-pulse" />
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <PenToolIcon className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-foreground hidden sm:inline">ThoughtSphere</span>
        </Link>

        <div className="hidden lg:flex items-center gap-2">
          <Link
            to="/"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm transition-colors ${
              isActiveRoute('/') ? 'bg-secondary text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <HomeIcon className="h-4 w-4" />
            Home
          </Link>
          {user && (
            <Link
              to="/my-blogs"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm transition-colors ${
                isActiveRoute('/my-blogs') ? 'bg-secondary text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <BookOpenIcon className="h-4 w-4" />
              My Blogs
            </Link>
          )}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <div className="relative w-56">
            <SearchIcon className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-9 pr-3 py-2 bg-secondary border-0 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-ring text-foreground placeholder-muted-foreground"
            />
          </div>

          <button
            onClick={toggleDarkMode}
            className="w-9 h-9 flex items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-secondary transition-colors"
          >
            {isDarkMode ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
          </button>

          {user ? (
            <>
              <Link
                to="/add-blog"
                className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <PlusIcon className="h-4 w-4" />
                Write
              </Link>

              <div className="relative">
                <button
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="relative w-9 h-9 flex items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-secondary transition-colors"
                >
                  <BellIcon className="h-4 w-4" />
                  {latestBlogs.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-destructive-foreground text-[10px] rounded-full flex items-center justify-center font-medium">
                      {latestBlogs.length}
                    </span>
                  )}
                </button>
                {isNotificationOpen && (
                  <NotificationDropdown
                    blogs={latestBlogs}
                    loading={notificationLoading}
                    onRefresh={fetchLatestBlogs}
                    onClose={() => setIsNotificationOpen(false)}
                  />
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-md hover:bg-secondary transition-colors"
                >
                  <ProfileAvatar user={user} />
                  <ChevronDownIcon className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>
                {isProfileOpen && (
                  <ProfileDropdown
                    user={user}
                    onLogout={handleLogout}
                    onClose={() => setIsProfileOpen(false)}
                  />
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary rounded-md transition-colors">
                Sign In
              </Link>
              <Link to="/signup" className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                Get Started
              </Link>
            </>
          )}
        </div>

        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={toggleDarkMode}
            className="w-9 h-9 flex items-center justify-center rounded-md border border-border text-muted-foreground"
          >
            {isDarkMode ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-9 h-9 flex items-center justify-center rounded-md border border-border text-foreground"
          >
            {isMenuOpen ? <XIcon className="h-4 w-4" /> : <MenuIcon className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <MobileMenu
          user={user}
          isActiveRoute={isActiveRoute}
          onLogout={handleLogout}
          onClose={() => setIsMenuOpen(false)}
        />
      )}

      {(isProfileOpen || isNotificationOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => { setIsProfileOpen(false); setIsNotificationOpen(false); }}
        />
      )}
    </nav>
  );
};

export default Navbar;