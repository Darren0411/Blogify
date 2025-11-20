import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { 
  BookOpenIcon, 
  CalendarIcon, 
  ArrowLeftIcon,
  PlusIcon,
  HeartIcon,
  MessageCircleIcon
} from 'lucide-react';
import Navbar from '../components/Navbar';

const MyBlogs = () => {
  const navigate = useNavigate();
  const [myBlogs, setMyBlogs] = useState([]);
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

  // Fetch user's blogs
  useEffect(() => {
    const fetchMyBlogs = async () => {
      try {
        setLoading(true);
        const response = await api.get('/blog/my-blogs');

        if (response.data?.success) {
          setMyBlogs(response.data.blogs);
        } else {
          setError('Failed to fetch your blogs');
        }
      } catch (err) {
        console.error('Error fetching my blogs:', err);
        if (err.response?.status === 401) {
          setError('Please login to view your blogs');
        } else {
          setError('Failed to fetch your blogs');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMyBlogs();
  }, []);

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
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <BookOpenIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
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
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-8">


          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <BookOpenIcon className="h-8 w-8 text-purple-600" />
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  My Blogs
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                {myBlogs.length} {myBlogs.length === 1 ? 'blog' : 'blogs'} published
              </p>
            </div>
            
            {/* Add New Blog Button */}
            <Link
              to="/add-blog"
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Write New Blog</span>
            </Link>
          </div>

          {/* Stats Cards - Removed Views */}
          {myBlogs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
                    <BookOpenIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {myBlogs.length}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">Total Blogs</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-xl">
                    <HeartIcon className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {myBlogs.reduce((acc, blog) => acc + (blog.likes || 0), 0)}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">Total Likes</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* My Blogs List */}
          {myBlogs.length === 0 ? (
            <div className="text-center py-16">
              <BookOpenIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No blogs yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start writing your first blog to share your thoughts with the world!
              </p>
              <Link
                to="/add-blog"
                className="inline-flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Write Your First Blog</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {myBlogs.map((blog) => (
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
                      <div className="mb-4">
                        <Link
                          to={`/blog/${blog._id}`}
                          className="block hover:text-purple-600 transition-colors"
                        >
                          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                            {blog.title}
                          </h2>
                        </Link>

                        {/* Meta Info - Removed Views */}
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                          <div className="flex items-center space-x-1">
                            <CalendarIcon className="h-4 w-4" />
                            <span>Published {formatDate(blog.createdAt)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <HeartIcon className="h-4 w-4" />
                            <span>{blog.likes || 0} likes</span>
                          </div>
                          {blog.comments && (
                            <div className="flex items-center space-x-1">
                              <MessageCircleIcon className="h-4 w-4" />
                              <span>{blog.comments.length || 0} comments</span>
                            </div>
                          )}
                        </div>

                        {/* Blog Preview */}
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-3">
                          {blog.body?.substring(0, 200)}...
                        </p>
                      </div>

                      {/* Bottom Actions - Only View Blog Button */}
                      <div className="flex items-center justify-between">
                        <Link
                          to={`/blog/${blog._id}`}
                          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                        >
                          View Blog
                        </Link>

                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {blog.updatedAt !== blog.createdAt && (
                            <span>Updated {formatDate(blog.updatedAt)}</span>
                          )}
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
    </>
  );
};

export default MyBlogs;