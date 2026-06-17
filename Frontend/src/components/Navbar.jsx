import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../utils/api";
import {
  PenToolIcon,
  HomeIcon,
  PlusIcon,
  MenuIcon,
  XIcon,
  SearchIcon,
  BellIcon,
  BookOpenIcon,
  ChevronDownIcon,
  SunIcon,
  MoonIcon,
} from "lucide-react";
import ProfileAvatar from "./navbar/ProfileAvatar";
import NotificationDropdown from "./navbar/NotificationDropdown";
import ProfileDropdown from "./navbar/ProfileDropdown";
import MobileMenu from "./navbar/MobileMenu";

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
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsCompact(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/user/me");
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
      const response = await api.get("/");
      if (response.data?.success && response.data.blogs) {
        setLatestBlogs(
          response.data.blogs
            .filter((b) => b.createdBy._id !== user._id)
            .slice(0, 5),
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
    const savedMode = localStorage.getItem("darkMode");
    const isDark = savedMode === null ? true : savedMode === "true";
    setIsDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("darkMode", newMode.toString());
    document.documentElement.classList.toggle("dark", newMode);
  };

  const handleLogout = async () => {
    try {
      await api.post("/user/logout");
    } finally {
      setUser(null);
      setIsProfileOpen(false);
      navigate("/");
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
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm transition-all duration-300">
      <div
        className={`mx-auto px-6 flex items-center justify-between transition-all duration-300 ${
          isCompact ? "h-12 max-w-2xl" : "h-16 max-w-5xl"
        }`}
      >
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div
            className={`rounded-lg bg-primary flex items-center justify-center transition-all duration-300 ${
              isCompact ? "w-6 h-6" : "w-8 h-8"
            }`}
          >
            <PenToolIcon
              className={`text-primary-foreground transition-all duration-300 ${isCompact ? "h-3 w-3" : "h-4 w-4"}`}
            />
          </div>
          <span
            className={`font-semibold text-foreground hidden sm:inline transition-all duration-300 ${
              isCompact ? "text-sm" : "text-base"
            }`}
          >
            ThoughtSphere
          </span>
        </Link>

        <div
          className={`hidden lg:flex items-center transition-all duration-300 ${isCompact ? "gap-1" : "gap-2"}`}
        >
          <Link
            to="/"
            className={`flex items-center gap-1.5 rounded-md text-sm transition-all duration-300 ${
              isCompact ? "px-2 py-1.5" : "px-3 py-2"
            } ${
              isActiveRoute("/")
                ? "bg-secondary text-foreground font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <HomeIcon className="h-4 w-4" />
            {!isCompact && "Home"}
          </Link>
          {user && (
            <Link
              to="/my-blogs"
              className={`flex items-center gap-1.5 rounded-md text-sm transition-all duration-300 ${
                isCompact ? "px-2 py-1.5" : "px-3 py-2"
              } ${
                isActiveRoute("/my-blogs")
                  ? "bg-secondary text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BookOpenIcon className="h-4 w-4" />
              {!isCompact && "My Blogs"}
            </Link>
          )}
        </div>

        <div
          className={`hidden lg:flex items-center transition-all duration-300 ${isCompact ? "gap-1.5" : "gap-3"}`}
        >
          <div
            className={`relative transition-all duration-300 ${isCompact ? "w-36" : "w-56"}`}
          >
            <SearchIcon className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search..."
              className={`w-full pl-9 pr-3 bg-secondary border-0 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-ring text-foreground placeholder-muted-foreground transition-all duration-300 ${
                isCompact ? "py-1.5" : "py-2"
              }`}
            />
          </div>

          <button
            onClick={toggleDarkMode}
            className={`flex items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-secondary transition-all duration-300 ${
              isCompact ? "w-7 h-7" : "w-9 h-9"
            }`}
          >
            {isDarkMode ? (
              <SunIcon className="h-4 w-4" />
            ) : (
              <MoonIcon className="h-4 w-4" />
            )}
          </button>

          {user ? (
            <>
              <Link
                to="/add-blog"
                className={`flex items-center gap-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all duration-300 ${
                  isCompact ? "px-3 py-1.5" : "px-4 py-2"
                }`}
              >
                <PlusIcon className="h-4 w-4" />
                {!isCompact && "Write"}
              </Link>

              <div className="relative">
                <button
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className={`relative flex items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-secondary transition-all duration-300 ${
                    isCompact ? "w-7 h-7" : "w-9 h-9"
                  }`}
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
                  className="flex items-center gap-1.5 p-1 rounded-md hover:bg-secondary transition-colors"
                >
                  <ProfileAvatar
                    user={user}
                    size={isCompact ? "w-7 h-7" : "w-9 h-9"}
                    textSize={isCompact ? "text-xs" : "text-sm"}
                  />
                  {!isCompact && (
                    <ChevronDownIcon
                      className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${isProfileOpen ? "rotate-180" : ""}`}
                    />
                  )}
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
              <Link
                to="/login"
                className={`text-sm font-medium text-foreground hover:bg-secondary rounded-md transition-all duration-300 ${
                  isCompact ? "px-3 py-1.5" : "px-4 py-2"
                }`}
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className={`rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all duration-300 ${
                  isCompact ? "px-3 py-1.5" : "px-4 py-2"
                }`}
              >
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
            {isDarkMode ? (
              <SunIcon className="h-4 w-4" />
            ) : (
              <MoonIcon className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-9 h-9 flex items-center justify-center rounded-md border border-border text-foreground"
          >
            {isMenuOpen ? (
              <XIcon className="h-4 w-4" />
            ) : (
              <MenuIcon className="h-4 w-4" />
            )}
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
          onClick={() => {
            setIsProfileOpen(false);
            setIsNotificationOpen(false);
          }}
        />
      )}
    </nav>
  );
};

export default Navbar;
