import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { 
  CalendarIcon, 
  UserIcon, 
  MessageCircleIcon, 
  SendIcon, 
  ArrowLeftIcon,
  HeartIcon,
  ShareIcon,
  BookmarkIcon,
  EyeIcon,
  TagIcon,
  ClockIcon,
  XIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  InfoIcon
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4500';

// Toast Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'info':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-800 text-white';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5" />;
      case 'error':
        return <AlertCircleIcon className="h-5 w-5" />;
      case 'info':
        return <InfoIcon className="h-5 w-5" />;
      default:
        return <InfoIcon className="h-5 w-5" />;
    }
  };

  return (
    <div className={`fixed top-24 right-4 z-50 flex items-center space-x-3 px-6 py-4 rounded-lg shadow-2xl transform transition-all duration-300 animate-slide-in ${getToastStyles()}`}>
      {getIcon()}
      <span className="font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-4 hover:bg-white/20 rounded-full p-1 transition-colors"
      >
        <XIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Toast functions
  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Fetch blog data
  useEffect(() => {
    const fetchBlogData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/blog/${id}`);
        
        if (response.data?.success) {
          setBlog(response.data.blog);
          setComments(response.data.comments || []);
          setLikeCount(response.data.blog.likes || 0);
          
          // Check if user has liked/saved this blog
          if (user) {
            // Check like status
            try {
              const likeResponse = await axios.get(`${API_BASE_URL}/blog/${id}/is-liked`, {
                withCredentials: true,
              });
              if (likeResponse.data?.success) {
                setLiked(likeResponse.data.liked);
                setLikeCount(likeResponse.data.likes);
              }
            } catch (err) {
              console.error('Error checking like status:', err);
            }

            // Check save status
            try {
              const saveResponse = await axios.get(`${API_BASE_URL}/blog/${id}/is-saved`, {
                withCredentials: true,
              });
              if (saveResponse.data?.success) {
                setBookmarked(saveResponse.data.saved);
              }
            } catch (err) {
              console.error('Error checking save status:', err);
            }
          }
        } else {
          showToast('Blog not found', 'error');
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
        showToast('Failed to load blog', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchBlogData();
    }
  }, [id, user]);

  // Handle like/unlike
  const handleLike = async () => {
    if (!user) {
      showToast('Please login to like this blog', 'error');
      return;
    }

    setLikeLoading(true);
    const previousLiked = liked;
    const previousCount = likeCount;

    try {
      // Optimistic update
      setLiked(!liked);
      setLikeCount(prev => liked ? prev - 1 : prev + 1);

      const response = await axios.post(
        `${API_BASE_URL}/blog/${id}/like`,
        {},
        { withCredentials: true }
      );

      if (response.data?.success) {
        setLiked(response.data.liked);
        setLikeCount(response.data.likes);
        showToast(response.data.liked ? 'Blog liked!' : 'Like removed', 'success');
      } else {
        // Revert on failure
        setLiked(previousLiked);
        setLikeCount(previousCount);
        showToast('Failed to update like', 'error');
      }
    } catch (err) {
      // Revert on error
      setLiked(previousLiked);
      setLikeCount(previousCount);
      console.error('Error liking blog:', err);
      showToast('Failed to update like', 'error');
    } finally {
      setLikeLoading(false);
    }
  };

  // Handle bookmark/unbookmark
  const handleBookmark = async () => {
    if (!user) {
      showToast('Please login to save this blog', 'error');
      return;
    }

    setBookmarkLoading(true);
    const previousBookmarked = bookmarked;

    try {
      // Optimistic update
      setBookmarked(!bookmarked);

      const response = await axios.post(
        `${API_BASE_URL}/blog/${id}/save`,
        {},
        { withCredentials: true }
      );

      if (response.data?.success) {
        setBookmarked(response.data.saved);
        showToast(response.data.saved ? 'Blog saved!' : 'Blog removed from saved', 'success');
      } else {
        // Revert on failure
        setBookmarked(previousBookmarked);
        showToast('Failed to update bookmark', 'error');
      }
    } catch (err) {
      // Revert on error
      setBookmarked(previousBookmarked);
      console.error('Error bookmarking blog:', err);
      showToast('Failed to update bookmark', 'error');
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      showToast('Please enter a comment', 'error');
      return;
    }

    if (!user) {
      showToast('Please login to comment', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/blog/${id}/comments`,
        { content: newComment },
        { withCredentials: true }
      );

      if (response.data?.success) {
        setComments(prev => [...prev, response.data.comment]);
        setNewComment('');
        showToast('Comment posted successfully!', 'success');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      showToast('Failed to post comment', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const commentDate = new Date(dateString);
    const diffInHours = Math.floor((now - commentDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return formatDate(dateString);
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 dark:text-gray-400">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Article not found</h2>
          <button
            onClick={() => navigate('/')}
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar/>
      
      {/* Toast Container */}
      <div className="fixed top-0 right-0 z-50 space-y-2 p-4">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>

      {/* Back Button */}
      <div className="w-full px-4 pt-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/')}
            className="group flex items-center space-x-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-xl mb-6 shadow-lg"
          >
            <ArrowLeftIcon className="h-5 w-5 group-hover:translate-x-[-2px] transition-transform duration-200" />
            <span>Back to Articles</span>
          </button>
        </div>
      </div>

      {/* Article Header */}
      <div className="w-full px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 overflow-hidden">
            
            {/* Cover Image */}
            {blog.coverImageURL && (
              <div className="relative h-96 overflow-hidden">
                <img
                  src={blog.coverImageURL}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                
                {/* Action Buttons */}
                <div className="absolute top-6 right-6 flex gap-3">
                  <button
                    onClick={handleLike}
                    disabled={likeLoading}
                    className={`p-3 rounded-full backdrop-blur-sm transition-all ${
                      liked 
                        ? 'bg-red-500/90 text-white' 
                        : 'bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 hover:bg-red-500/90 hover:text-white'
                    } ${likeLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <HeartIcon className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={handleBookmark}
                    disabled={bookmarkLoading}
                    className={`p-3 rounded-full backdrop-blur-sm transition-all ${
                      bookmarked 
                        ? 'bg-indigo-500/90 text-white' 
                        : 'bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 hover:bg-indigo-500/90 hover:text-white'
                    } ${bookmarkLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <BookmarkIcon className={`h-5 w-5 ${bookmarked ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-3 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-500/90 hover:text-white transition-all">
                    <ShareIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Article Content */}
            <div className="p-8 md:p-12">
              {/* Title */}
              <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-8 leading-tight">
                {blog.title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 mb-8 text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span className="text-sm">{formatDate(blog.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <EyeIcon className="h-4 w-4" />
                  <span className="text-sm">{blog.views || 0} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <HeartIcon className="h-4 w-4" />
                  <span className="text-sm">{likeCount} likes</span>
                </div>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-4 p-6 bg-gray-50/50 dark:bg-gray-700/50 rounded-2xl mb-8">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {blog.createdBy?.fullName?.charAt(0) || blog.createdBy?.name?.charAt(0) || 'A'}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {blog.createdBy?.fullName || blog.createdBy?.name || 'Anonymous'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">Author</p>
                </div>
              </div>

              {/* Article Body */}
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line text-lg">
                  {blog.body}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="w-full px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-8 md:p-12">
            
            {/* Comments Header */}
            <div className="flex items-center gap-3 mb-8">
              <MessageCircleIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Comments ({comments.length})
              </h2>
            </div>

            {/* Add Comment Form - Only if user is logged in */}
            {user && (
              <form onSubmit={handleCommentSubmit} className="mb-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-lg">
                    {user.fullName?.charAt(0) || user.name?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share your thoughts..."
                      rows="3"
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all duration-300 resize-none placeholder-gray-500 dark:placeholder-gray-400"
                    />
                    <div className="flex justify-end mt-3">
                      <button
                        type="submit"
                        disabled={!newComment.trim() || isSubmitting}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white font-semibold rounded-2xl hover:from-indigo-700 hover:to-purple-700 dark:hover:from-indigo-600 dark:hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Posting...
                          </>
                        ) : (
                          <>
                            <SendIcon className="h-4 w-4" />
                            Post Comment
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}

            {/* Login Prompt for Non-users */}
            {!user && (
              <div className="text-center p-8 bg-gray-50/50 dark:bg-gray-700/50 rounded-2xl mb-8">
                <MessageCircleIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Join the conversation! Sign in to leave a comment.
                </p>
                <Link
                  to="/login"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
                >
                  Sign In
                </Link>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-6">
              {comments.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircleIcon className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-xl text-gray-500 dark:text-gray-400">No comments yet</p>
                  <p className="text-gray-400 dark:text-gray-500">Be the first to share your thoughts!</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment._id} className="flex gap-4 p-6 bg-gray-50/50 dark:bg-gray-700/50 rounded-2xl hover:bg-gray-100/50 dark:hover:bg-gray-700/70 transition-all duration-300">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-lg">
                      {comment.createdBy?.fullName?.charAt(0) || comment.createdBy?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {comment.createdBy?.fullName || comment.createdBy?.name || 'Anonymous'}
                        </h4>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatTimeAgo(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer/>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default BlogDetail;