import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { 
  BookmarkIcon, 
  CalendarIcon, 
  UserIcon, 
  EyeIcon,
  ArrowLeftIcon,
  TrashIcon
} from 'lucide-react';

const SavedBlogs = () => {
  const navigate = useNavigate();
  const [savedBlogs, setSavedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Initialize dark mode
  useEffect(() => {
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

  // Fetch saved blogs
  useEffect(() => {
    const fetchSavedBlogs = async () => {
      try {
        setLoading(true);
        const response = await api.get('/blog/saved');

        if (response.data?.success) {
          setSavedBlogs(response.data.savedBlogs);
        } else {
          setError('Failed to fetch saved blogs');
        }
      } catch (err) {
        console.error('Error fetching saved blogs:', err);
        if (err.response?.status === 401) {
          setError('Please login to view saved blogs');
        } else {
          setError('Failed to fetch saved blogs');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSavedBlogs();
  }, []);

  // Remove from saved
  const handleUnsave = async (blogId) => {
    try {
      const response = await api.post(`/blog/${blogId}/save`, {});

      if (response.data?.success) {
        setSavedBlogs(prev => prev.filter(blog => blog._id !== blogId));
      }
    } catch (err) {
      console.error('Error unsaving blog:', err);
      alert('Failed to remove blog from saved');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Profile Avatar Component
  const ProfileAvatar = ({ user, size = 'w-8 h-8' }) => {
    const initials = user?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 
                    user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
    
    return (
      <div className={`${size} rounded-full overflow-hidden shadow-lg bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm`}>
        {initials}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 flex items-center justify-center">
        <div className="text-center">
          <BookmarkIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {error}
          </h2>
          <button
            onClick={() => navigate('/')}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <button
                onClick={() => navigate('/')}
                className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                <ArrowLeftIcon className="h-6 w-6" />
              </button>
              <BookmarkIcon className="h-8 w-8 text-purple-600" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Saved Blogs
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {savedBlogs.length} saved {savedBlogs.length === 1 ? 'blog' : 'blogs'}
            </p>
          </div>
        </div>

        {/* Saved Blogs List */}
        {savedBlogs.length === 0 ? (
          <div className="text-center py-16">
            <BookmarkIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No saved blogs yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start saving blogs to read them later!
            </p>
            <Link
              to="/"
              className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Explore Blogs
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {savedBlogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Cover Image */}
                  {blog.coverImageURL && (
                    <div className="w-full md:w-64 h-48 md:h-auto overflow-hidden">
                      <img
                        src={blog.coverImageURL}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <Link
                          to={`/blog/${blog._id}`}
                          className="block hover:text-purple-600 transition-colors"
                        >
                          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                            {blog.title}
                          </h2>
                        </Link>

                        {/* Author and Meta Info */}
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                          <div className="flex items-center space-x-2">
                            <ProfileAvatar user={blog.createdBy} />
                            <span>{blog.createdBy?.fullName || blog.createdBy?.name || 'Anonymous'}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <CalendarIcon className="h-4 w-4" />
                            <span>{formatDate(blog.createdAt)}</span>
                          </div>
                          {blog.views && (
                            <div className="flex items-center space-x-1">
                              <EyeIcon className="h-4 w-4" />
                              <span>{blog.views} views</span>
                            </div>
                          )}
                        </div>

                        {/* Blog Preview */}
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-3">
                          {blog.body?.substring(0, 200)}...
                        </p>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleUnsave(blog._id)}
                        className="ml-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Remove from saved"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between">
                      <Link
                        to={`/blog/${blog._id}`}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                      >
                        Read More
                      </Link>

                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Saved on {formatDate(blog.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedBlogs;