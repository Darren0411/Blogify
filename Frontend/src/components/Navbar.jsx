import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';
import { 
  PenToolIcon, 
  HomeIcon, 
  PlusIcon, 
  LogOutIcon, 
  MenuIcon, 
  XIcon, 
  SearchIcon,
  BellIcon,
  UserIcon,
  SettingsIcon,
  BookOpenIcon
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsProfileOpen(false);
  };

  return (
    <>
      <nav className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-2.5 rounded-xl group-hover:shadow-lg transition-all duration-300">
                <PenToolIcon className="h-7 w-7 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  ThoughtSphere
                </span>
                <p className="text-xs text-gray-500 -mt-1">Share Your Thoughts</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link 
                to="/" 
                className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 transition-colors group"
              >
                <HomeIcon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Home</span>
              </Link>

              <Link 
                to="/explore" 
                className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 transition-colors group"
              >
                <BookOpenIcon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Explore</span>
              </Link>

              {/* Search Bar */}
              <div className="relative">
                <SearchIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="pl-10 pr-4 py-2 w-64 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>

              {user ? (
                <div className="flex items-center space-x-4">
                  {/* Write Button */}
                  <Link 
                    to="/add-blog" 
                    className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <PlusIcon className="h-4 w-4" />
                    <span className="font-medium">Write</span>
                  </Link>

                  {/* Notifications */}
                  <button className="relative p-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <BellIcon className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
                  </button>

                  {/* Profile Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {user?.fullName?.charAt(0) || 'U'}
                      </div>
                      <span className="text-sm font-medium text-gray-700 max-w-24 truncate">
                        {user?.fullName || 'User'}
                      </span>
                    </button>

                    {/* Profile Dropdown Menu */}
                    {isProfileOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
                          <p className="text-sm text-gray-500">{user?.email}</p>
                        </div>
                        
                        <Link 
                          to="/profile" 
                          className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <UserIcon className="h-4 w-4" />
                          <span>Your Profile</span>
                        </Link>
                        
                        <Link 
                          to="/my-blogs" 
                          className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <BookOpenIcon className="h-4 w-4" />
                          <span>My Articles</span>
                        </Link>
                        
                        <Link 
                          to="/settings" 
                          className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <SettingsIcon className="h-4 w-4" />
                          <span>Settings</span>
                        </Link>
                        
                        <hr className="my-2" />
                        
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                        >
                          <LogOutIcon className="h-4 w-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link 
                    to="/login" 
                    className="text-gray-700 hover:text-indigo-600 transition-colors font-medium"
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/signup" 
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 font-medium shadow-lg"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-gray-100 py-4">
              <div className="flex flex-col space-y-3">
                {/* Mobile Search */}
                <div className="relative mx-2">
                  <SearchIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    className="pl-10 pr-4 py-2 w-full bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <Link 
                  to="/" 
                  className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg mx-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <HomeIcon className="h-5 w-5" />
                  <span>Home</span>
                </Link>

                <Link 
                  to="/explore" 
                  className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg mx-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <BookOpenIcon className="h-5 w-5" />
                  <span>Explore</span>
                </Link>

                {user ? (
                  <>
                    <Link 
                      to="/add-blog" 
                      className="flex items-center space-x-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-xl mx-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <PlusIcon className="h-5 w-5" />
                      <span>Write Article</span>
                    </Link>

                    <div className="border-t border-gray-100 mt-3 pt-3 mx-2">
                      <div className="flex items-center space-x-3 px-4 py-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {user?.fullName?.charAt(0) || 'U'}
                        </div>
                        <span className="font-medium text-gray-900">{user?.fullName}</span>
                      </div>
                      
                      <Link 
                        to="/profile" 
                        className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <UserIcon className="h-5 w-5" />
                        <span>Profile</span>
                      </Link>

                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg w-full text-left"
                      >
                        <LogOutIcon className="h-5 w-5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="border-t border-gray-100 mt-3 pt-3 mx-2 space-y-2">
                    <Link 
                      to="/login" 
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link 
                      to="/signup" 
                      className="block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-xl text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {isProfileOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsProfileOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Navbar;