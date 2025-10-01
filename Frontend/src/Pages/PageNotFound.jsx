import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  HomeIcon, 
  ArrowLeftIcon, 
  SearchIcon,
  BookOpenIcon,
  PenToolIcon,
  AlertTriangleIcon,
  RefreshCwIcon
} from 'lucide-react';

const PageNotFound = () => {
  const navigate = useNavigate();

  // Apply dark mode on component mount
  useEffect(() => {
    // Check if user has a saved preference, otherwise default to dark
    const savedMode = localStorage.getItem('darkMode');
    const isDark = savedMode === null ? true : savedMode === 'true';
    
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, []);

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        
        {/* Animated 404 */}
        <div className="relative mb-8">
          <div className="text-8xl md:text-9xl font-black text-transparent bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 dark:from-purple-400 dark:via-indigo-400 dark:to-blue-400 bg-clip-text animate-pulse">
            404
          </div>
          
          {/* Floating Icons */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full">
              <AlertTriangleIcon className="absolute top-1/4 left-1/4 h-8 w-8 text-orange-500 dark:text-orange-400 animate-bounce delay-100" />
              <SearchIcon className="absolute top-1/3 right-1/4 h-6 w-6 text-purple-500 dark:text-purple-400 animate-bounce delay-300" />
              <BookOpenIcon className="absolute bottom-1/3 left-1/3 h-7 w-7 text-indigo-500 dark:text-indigo-400 animate-bounce delay-500" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-8 md:p-12 mb-8">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 dark:from-red-400 dark:to-orange-400 rounded-3xl mb-6 shadow-2xl">
              <AlertTriangleIcon className="h-10 w-10 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6">
            Oops! Page Not Found
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            The page you're looking for seems to have wandered off into the digital wilderness. 
            Don't worry, even the best explorers sometimes take a wrong turn!
          </p>

          {/* Suggested Actions */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50/50 dark:bg-gray-700/50 rounded-2xl p-6">
              <SearchIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Double-check the URL</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Make sure the web address is spelled correctly
              </p>
            </div>
            
            <div className="bg-gray-50/50 dark:bg-gray-700/50 rounded-2xl p-6">
              <RefreshCwIcon className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Try refreshing</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sometimes a simple refresh does the trick
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/"
              className="flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white px-8 py-4 rounded-2xl font-bold hover:from-indigo-700 hover:to-purple-700 dark:hover:from-indigo-600 dark:hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-lg"
            >
              <HomeIcon className="h-6 w-6" />
              Go Home
            </Link>
            
            <button
              onClick={handleGoBack}
              className="flex items-center gap-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-2xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-lg"
            >
              <ArrowLeftIcon className="h-6 w-6" />
              Go Back
            </button>

            <button
              onClick={handleRefresh}
              className="flex items-center gap-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-8 py-4 rounded-2xl font-bold hover:bg-green-200 dark:hover:bg-green-900/50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-lg"
            >
              <RefreshCwIcon className="h-6 w-6" />
              Refresh
            </button>
          </div>
        </div>

        {/* Popular Links */}
        <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            While you're here, check these out:
          </h2>
          
          <div className="grid sm:grid-cols-3 gap-4">
            <Link 
              to="/explore"
              className="group bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-700/50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <BookOpenIcon className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Explore Articles</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Discover amazing stories from our community
              </p>
            </Link>

            <Link 
              to="/add-blog"
              className="group bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-700/50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <PenToolIcon className="h-8 w-8 text-orange-600 dark:text-orange-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Write Article</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Share your thoughts with the world
              </p>
            </Link>

            <Link 
              to="/signup"
              className="group bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700/50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <HomeIcon className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Join Community</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Become part of our writing community
              </p>
            </Link>
          </div>
        </div>

        {/* Fun Quote */}
        <div className="mt-8 text-center">
          <p className="text-lg text-gray-500 dark:text-gray-400 italic">
            "Not all who wander are lost... but this page definitely is!" 🗺️
          </p>
        </div>
      </div>

      {/* Background Animation */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 dark:bg-purple-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 dark:bg-blue-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-indigo-500/5 dark:bg-indigo-400/3 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
    </div>
  );
};

export default PageNotFound;