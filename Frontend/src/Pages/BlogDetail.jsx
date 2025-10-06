import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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
  ClockIcon
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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
  const [bookmarked, setBookmarked] = useState(false);

  // Mock blog data - replace with actual API call
  useEffect(() => {
    const fetchBlogData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data based on your blog model
        const mockBlog = {
          _id: id,
          title: 'The Future of Artificial Intelligence in Healthcare',
          body: `Artificial Intelligence is revolutionizing the healthcare industry in unprecedented ways. From diagnostic imaging to personalized treatment plans, AI is making healthcare more accurate, efficient, and accessible.

The integration of AI in healthcare has opened up possibilities that were once considered science fiction. Machine learning algorithms can now analyze medical images with greater accuracy than human radiologists in many cases, detecting early-stage cancers and other conditions that might be missed by the human eye.

One of the most promising applications of AI in healthcare is in drug discovery. Traditional drug development can take decades and cost billions of dollars. AI is accelerating this process by predicting how different compounds will interact with the human body, potentially reducing development time from years to months.

Personalized medicine is another area where AI is making significant strides. By analyzing a patient's genetic makeup, medical history, and lifestyle factors, AI can help doctors create treatment plans tailored specifically to individual patients. This approach not only improves treatment outcomes but also reduces the risk of adverse reactions.

However, the implementation of AI in healthcare is not without challenges. Privacy concerns, data security, and the need for regulatory approval are significant hurdles that need to be addressed. Additionally, there's the important question of maintaining the human touch in healthcare while leveraging the power of AI.

As we move forward, the collaboration between healthcare professionals and AI systems will be crucial. AI should augment human capabilities, not replace them. The future of healthcare lies in finding the perfect balance between technological advancement and human compassion.`,
          coverImageURL: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          createdBy: {
            _id: '1',
            fullName: 'Dr. Sarah Johnson',
            ProfileUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
          },
          createdAt: '2024-09-25T10:30:00Z',
          category: 'Technology',
          readingTime: '8 min read',
          likes: 234,
          views: 1567
        };

        const mockComments = [
          {
            _id: '1',
            content: 'This is a fascinating article! The insights about AI in drug discovery are particularly interesting. I had no idea the development time could be reduced so dramatically.',
            createdBy: {
              _id: '2',
              fullName: 'Emma Wilson',
              ProfileUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b550?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
            },
            createdAt: '2024-09-25T14:20:00Z'
          },
          {
            _id: '2',
            content: 'Great read! As someone working in healthcare, I can definitely see the potential of AI. The key point about maintaining human compassion while leveraging technology really resonates with me.',
            createdBy: {
              _id: '3',
              fullName: 'Dr. Michael Chen',
              ProfileUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
            },
            createdAt: '2024-09-25T16:45:00Z'
          },
          {
            _id: '3',
            content: 'The privacy concerns mentioned are very valid. How do you think we can address these while still advancing AI in healthcare?',
            createdBy: {
              _id: '4',
              fullName: 'Lisa Rodriguez',
              ProfileUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
            },
            createdAt: '2024-09-26T09:15:00Z'
          }
        ];

        setBlog(mockBlog);
        setComments(mockComments);
      } catch (error) {
        console.error('Error fetching blog:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogData();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const comment = {
        _id: Date.now().toString(),
        content: newComment,
        createdBy: {
          _id: user.id,
          fullName: user.fullName,
          ProfileUrl: user.ProfileUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
        },
        createdAt: new Date().toISOString()
      };

      setComments(prev => [...prev, comment]);
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
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
      {/* Back Button */}
      <div className="w-full px-4 pt-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-6 group"
          >
            <ArrowLeftIcon className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            Back to Articles
          </button>
        </div>
      </div>

      {/* Article Header */}
      <div className="w-full px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 overflow-hidden">
            
            {/* Cover Image */}
            <div className="relative h-96 overflow-hidden">
              <img
                src={blog.coverImageURL}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              
              {/* Category Badge */}
              <div className="absolute top-6 left-6">
                <span className="flex items-center gap-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-800 dark:text-gray-200 px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  <TagIcon className="h-4 w-4" />
                  {blog.category}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="absolute top-6 right-6 flex gap-3">
                <button
                  onClick={() => setLiked(!liked)}
                  className={`p-3 rounded-full backdrop-blur-sm transition-all ${
                    liked 
                      ? 'bg-red-500/90 text-white' 
                      : 'bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 hover:bg-red-500/90 hover:text-white'
                  }`}
                >
                  <HeartIcon className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={() => setBookmarked(!bookmarked)}
                  className={`p-3 rounded-full backdrop-blur-sm transition-all ${
                    bookmarked 
                      ? 'bg-indigo-500/90 text-white' 
                      : 'bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 hover:bg-indigo-500/90 hover:text-white'
                  }`}
                >
                  <BookmarkIcon className={`h-5 w-5 ${bookmarked ? 'fill-current' : ''}`} />
                </button>
                <button className="p-3 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-500/90 hover:text-white transition-all">
                  <ShareIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

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
                  <ClockIcon className="h-4 w-4" />
                  <span className="text-sm">{blog.readingTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <EyeIcon className="h-4 w-4" />
                  <span className="text-sm">{blog.views} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <HeartIcon className="h-4 w-4" />
                  <span className="text-sm">{blog.likes} likes</span>
                </div>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-4 p-6 bg-gray-50/50 dark:bg-gray-700/50 rounded-2xl mb-8">
                <img
                  src={blog.createdBy.ProfileUrl}
                  alt={blog.createdBy.fullName}
                  className="w-16 h-16 rounded-full object-cover border-4 border-white dark:border-gray-600 shadow-lg"
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {blog.createdBy.fullName}
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
                  <img
                    src={user.ProfileUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}
                    alt={user.fullName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
                  />
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
                    <img
                      src={comment.createdBy.ProfileUrl}
                      alt={comment.createdBy.fullName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600 flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {comment.createdBy.fullName}
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
    </div>
  );
};

export default BlogDetail;