import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  PenToolIcon,
  HomeIcon,
  PlusIcon,
  LogOutIcon,
  MenuIcon,
  XIcon,
  SearchIcon,
  BellIcon,
  BookOpenIcon,
  ChevronDownIcon,
  SunIcon,
  MoonIcon,
  BookmarkIcon,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4500";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Simple Profile Avatar Component
  const ProfileAvatar = ({
    user,
    size = "w-10 h-10",
    textSize = "text-sm",
  }) => {
    const initials =
      user?.fullName
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) ||
      user?.name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) ||
      "U";

    // If user is logged in, show profile picture from public folder
    if (user) {
      return (
        <div className={`${size} rounded-full overflow-hidden shadow-lg`}>
          <img
            src="./image.png" // Your profile image from public folder
            alt={user?.fullName || user?.name || "User"}
            className="w-full h-full object-cover"
          />
        </div>
      );
    }

    // If no user (not logged in), show initials
    return (
      <div
        className={`${size} bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold ${textSize} shadow-lg`}
      >
        {initials}
      </div>
    );
  };

  // Fetch user details from cookies only
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Only fetch from backend using cookies
        const response = await axios.get(`${API_BASE_URL}/user/me`, {
          withCredentials: true,
          headers: { Accept: "application/json" },
        });

        if (response.data?.success && response.data.user) {
          console.log("User from backend:", response.data.user);
          setUser(response.data.user);
        } else {
          // Clear user if no valid response
          setUser(null);
        }
      } catch (error) {
        console.error("Auth error:", error);
        // If 401/403, user is not authenticated
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dark mode logic
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    const isDark = savedMode === null ? true : savedMode === "true";

    setIsDarkMode(isDark);

    if (isDark) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("darkMode", newMode.toString());

    if (newMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/user/logout`,
        {},
        { withCredentials: true }
      );
    } catch (e) {
      // silent fail - cookie might already be cleared
    }

    // Clear user state only
    setUser(null);
    navigate("/");
    setIsProfileOpen(false);
  };

  const isActiveRoute = (path) => location.pathname === path;

  // Show loading state briefly
  if (isLoading) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-2xl">
                <PenToolIcon className="h-6 w-6 text-white" />
              </div>
              <span className="hidden sm:block text-2xl font-black bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                ThoughtSphere
              </span>
            </Link>
            <div className="animate-pulse bg-gray-300 dark:bg-gray-700 h-10 w-32 rounded-lg"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl border-b border-white/20 dark:border-gray-700/20"
            : "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg"
        }`}
      >
        {/* Animated gradient border */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500 opacity-60"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo Section */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-2xl group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-110">
                  <PenToolIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="hidden sm:block">
                <span className="text-2xl font-black bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                  ThoughtSphere
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium -mt-1">
                  Where Ideas Come Alive
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Navigation Links */}
              <div className="flex items-center space-x-1 bg-gray-100/50 dark:bg-gray-800/50 rounded-2xl p-1">
                <Link
                  to="/"
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                    isActiveRoute("/")
                      ? "bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-lg"
                      : "text-gray-700 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-700/70 hover:text-purple-600"
                  }`}
                >
                  <HomeIcon className="h-4 w-4" />
                  <span>Home</span>
                </Link>
              </div>

              {/* Search Bar */}
              <div className="relative w-64">
                <SearchIcon className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-100/50 dark:bg-gray-800/50 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white font-medium transition-all"
                />
              </div>

              {/* Dark/Light Mode Toggle Button */}
              <div className="flex items-center">
                <button
                  onClick={toggleDarkMode}
                  className="relative p-3 rounded-2xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 group shadow-lg hover:shadow-xl border-2 border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500"
                  title={
                    isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
                  }
                >
                  <div className="relative flex items-center justify-center">
                    {isDarkMode ? (
                      <SunIcon className="h-6 w-6 text-yellow-500 group-hover:rotate-90 group-hover:scale-110 transition-all duration-300" />
                    ) : (
                      <MoonIcon className="h-6 w-6 text-gray-700 group-hover:text-indigo-600 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
                    )}
                  </div>
                  <div
                    className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 transition-all duration-300 ${
                      isDarkMode
                        ? "bg-indigo-500 shadow-indigo-200"
                        : "bg-yellow-400 shadow-yellow-200"
                    } shadow-lg`}
                  ></div>
                </button>
              </div>

              {user ? (
                <div className="flex items-center space-x-3">
                  {/* Write Button */}
                  <Link
                    to="/add-blog"
                    className="group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-2xl">
                      <PlusIcon className="h-4 w-4" />
                      <span>Add Blog</span>
                    </div>
                  </Link>

                  {/* Notifications */}
                  <button className="relative p-3 text-gray-600 dark:text-gray-300 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-gray-800 rounded-2xl transition-all duration-300 group">
                    <BellIcon className="h-5 w-5 group-hover:animate-pulse" />
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-bounce">
                      3
                    </span>
                  </button>

                  {/* Profile Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center space-x-3 p-2 hover:bg-gray-100/70 dark:hover:bg-gray-800/70 rounded-2xl transition-all duration-300 group"
                    >
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full blur opacity-75"></div>
                        <div className="relative">
                          <ProfileAvatar user={user} />
                        </div>
                      </div>
                      <div className="hidden xl:block text-left">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white max-w-24 truncate">
                          {user?.fullName || user?.name || "User"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Writer
                        </p>
                      </div>
                      <ChevronDownIcon
                        className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${
                          isProfileOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Profile Dropdown Menu - Simplified */}
                    {isProfileOpen && (
                      <div className="absolute right-0 mt-3 w-72 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 py-2 z-50 opacity-100 transition-opacity duration-200">
                        {/* User Info Header */}
                        <div className="px-6 py-4 border-b border-gray-100/50 dark:border-gray-700/50">
                          <div className="flex items-center space-x-3">
                            <ProfileAvatar
                              user={user}
                              size="w-12 h-12"
                              textSize="text-base"
                            />
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {user?.fullName || user?.name}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {user?.email}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items - Only My Blogs, Saved Blogs, Sign Out */}
                        <div className="py-2">
                          <Link
                            to="/my-blogs"
                            className="flex items-center space-x-3 px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700 hover:text-purple-600 transition-all duration-200"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <BookOpenIcon className="h-5 w-5" />
                            <span className="font-medium">My Blogs</span>
                          </Link>

                          <Link
                            to="/saved-blogs"
                            className="flex items-center space-x-3 px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700 hover:text-purple-600 transition-all duration-200"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <BookmarkIcon className="h-5 w-5" />
                            <span className="font-medium">Saved Blogs</span>
                          </Link>
                        </div>

                        {/* Sign Out */}
                        <div className="border-t border-gray-100/50 dark:border-gray-700/50 mt-2 pt-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center space-x-3 px-6 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 w-full text-left"
                          >
                            <LogOutIcon className="h-5 w-5" />
                            <span className="font-medium">Sign Out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="text-gray-700 dark:text-gray-300 hover:text-purple-600 transition-colors font-semibold px-4 py-2 hover:bg-purple-50 dark:hover:bg-gray-800 rounded-xl"
                  >
                    Sign In
                  </Link>
                  <Link to="/signup" className="group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 text-white px-8 py-3 rounded-2xl font-bold transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-2xl hover:shadow-pink-500/25">
                      <span className="relative z-10 text-white">
                        Get Started
                      </span>
                      <div className="absolute inset-0 -top-2 -left-2 w-6 h-full bg-white/40 transform -skew-x-12 group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button & Dark mode */}
            <div className="lg:hidden flex items-center space-x-3">
              <button
                onClick={toggleDarkMode}
                className="p-3 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-lg border-2 border-gray-300 dark:border-gray-600"
                title={
                  isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
                }
              >
                {isDarkMode ? (
                  <SunIcon className="h-6 w-6 text-yellow-500" />
                ) : (
                  <MoonIcon className="h-6 w-6 text-gray-700" />
                )}
              </button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-3 text-gray-600 dark:text-gray-300 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-gray-800 rounded-2xl transition-all duration-300"
              >
                {isMenuOpen ? (
                  <XIcon className="h-6 w-6" />
                ) : (
                  <MenuIcon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-gray-100/50 dark:border-gray-700/50 py-6 opacity-100 transition-opacity duration-300">
              <div className="space-y-4">
                {/* Mobile Search */}
                <div className="relative mx-4">
                  <SearchIcon className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    className="w-full pl-12 pr-4 py-3 bg-gray-100/50 dark:bg-gray-800/50 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white"
                  />
                </div>

                {/* Navigation Links */}
                <div className="space-y-2 mx-4">
                  <Link
                    to="/"
                    className={`flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
                      isActiveRoute("/")
                        ? "bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-700"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100/70 dark:hover:bg-gray-800/70"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <HomeIcon className="h-5 w-5" />
                    <span className="font-medium">Home</span>
                  </Link>

                  {user && (
                    <Link
                      to="/add-blog"
                      className={`flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
                        isActiveRoute("/add-blog")
                          ? "bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-700"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100/70 dark:hover:bg-gray-800/70"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <PlusIcon className="h-5 w-5" />
                      <span className="font-medium">Add Blog</span>
                    </Link>
                  )}
                </div>

                {user ? (
                  <div className="border-t border-gray-100/50 dark:border-gray-700/50 pt-4 mx-4">
                    <div className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl mb-3">
                      <ProfileAvatar user={user} />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {user?.fullName || user?.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Writer
                        </p>
                      </div>
                    </div>

                    {/* Mobile Menu - Simplified */}
                    <div className="space-y-2">
                      <Link
                        to="/my-blogs"
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100/70 dark:hover:bg-gray-800/70 rounded-2xl transition-all duration-300"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <BookOpenIcon className="h-5 w-5" />
                        <span className="font-medium">My Blogs</span>
                      </Link>

                      <Link
                        to="/saved-blogs"
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100/70 dark:hover:bg-gray-800/70 rounded-2xl transition-all duration-300"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <BookmarkIcon className="h-5 w-5" />
                        <span className="font-medium">Saved Blogs</span>
                      </Link>

                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all duration-300 w-full text-left"
                      >
                        <LogOutIcon className="h-5 w-5" />
                        <span className="font-medium">Sign Out</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 mx-4 pt-4 border-t border-gray-100/50 dark:border-gray-700/50">
                    <Link
                      to="/login"
                      className="block px-4 py-3 text-center text-gray-700 dark:text-gray-300 hover:bg-gray-100/70 dark:hover:bg-gray-800/70 rounded-2xl transition-all duration-300 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className="block relative overflow-hidden rounded-2xl group"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 text-white px-6 py-4 text-center font-bold shadow-xl">
                        <span className="relative z-10">Get Started</span>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Click outside handlers */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileOpen(false)}
        ></div>
      )}

      {/* Spacer for fixed navbar */}
      <div className="h-20"></div>
    </>
  );
};

export default Navbar;