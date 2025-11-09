import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  CalendarIcon,
  UserIcon,
  EyeIcon,
  MessageCircleIcon,
  SendIcon,
  ArrowLeftIcon,
  HeartIcon,
  ShareIcon,
  BookmarkIcon,
  CheckIcon,
  CopyIcon,
  XIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  InfoIcon,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4500";

// Toast Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getToastStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-500 text-white";
      case "error":
        return "bg-red-500 text-white";
      case "info":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-800 text-white";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircleIcon className="h-5 w-5" />;
      case "error":
        return <AlertCircleIcon className="h-5 w-5" />;
      case "info":
        return <InfoIcon className="h-5 w-5" />;
      default:
        return <InfoIcon className="h-5 w-5" />;
    }
  };

  return (
    <div
      className={`fixed top-24 right-4 z-[9999] flex items-center space-x-3 px-6 py-4 rounded-lg shadow-2xl transform transition-all duration-300 animate-slide-in ${getToastStyles()}`}
    >
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
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [isAuthor, setIsAuthor] = useState(false); // ✅ NEW: Track if current user is the author

  // Toast functions
  const showToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Initialize dark mode on component mount
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    const isDark = savedMode === null ? true : savedMode === "true";

    if (isDark) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
  }, []);

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/user/me`, {
          withCredentials: true,
        });
        if (response.data?.success) {
          setUser(response.data.user);
        }
      } catch (err) {
        setUser(null);
      }
    };
    checkAuth();
  }, []);

  // ✅ NEW: Check if current user is the author
  useEffect(() => {
    if (user && blog) {
      setIsAuthor(blog.createdBy._id === user._id);
    }
  }, [user, blog]);

  // Check if blog is saved by current user
  useEffect(() => {
    const checkSavedStatus = async () => {
      if (user && id) {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/blog/${id}/is-saved`,
            {
              withCredentials: true,
            }
          );
          if (response.data?.success) {
            setIsSaved(response.data.saved);
          }
        } catch (err) {
          console.error("Error checking saved status:", err);
        }
      }
    };
    checkSavedStatus();
  }, [user, id]);

  // Check if blog is liked by current user
  useEffect(() => {
    const checkLikedStatus = async () => {
      if (user && id) {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/blog/${id}/is-liked`,
            {
              withCredentials: true,
            }
          );
          if (response.data?.success) {
            setIsLiked(response.data.liked);
            setLikeCount(response.data.likes);
          }
        } catch (err) {
          console.error("Error checking liked status:", err);
        }
      }
    };
    checkLikedStatus();
  }, [user, id]);

  // Fetch blog and comments
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/blog/${id}`);

        if (response.data?.success) {
          setBlog(response.data.blog);
          setComments(response.data.comments || []);
          setLikeCount(response.data.blog.likes || 0);
        } else {
          setError("Blog not found");
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError("Failed to load blog");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id]);

  // Handle save/unsave
  const handleSave = async () => {
    if (!user) {
      showToast("Please login to save this blog", "error");
      return;
    }

    try {
      setSaveLoading(true);

      const response = await axios.post(
        `${API_BASE_URL}/blog/${id}/save`,
        {},
        { withCredentials: true }
      );

      if (response.data?.success) {
        setIsSaved(response.data.saved);
        showToast(
          response.data.saved
            ? "Blog saved successfully!"
            : "Blog removed from saved",
          "success"
        );
      }
    } catch (err) {
      console.error("Error saving blog:", err);
      showToast("Failed to save blog", "error");
    } finally {
      setSaveLoading(false);
    }
  };

  // Handle comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      showToast("Please login to comment", "error");
      return;
    }

    // ✅ NEW: Check if user is the author
    if (isAuthor) {
      showToast("You cannot comment on your own blog", "error");
      return;
    }

    if (!commentContent.trim()) {
      showToast("Please enter a comment", "error");
      return;
    }

    try {
      setCommentLoading(true);
      const response = await axios.post(
        `${API_BASE_URL}/blog/${id}/comments`,
        { content: commentContent },
        { withCredentials: true }
      );

      if (response.data?.success) {
        setComments((prev) => [...prev, response.data.comment]);
        setCommentContent("");
        showToast("Comment posted successfully!", "success");
      }
    } catch (err) {
      console.error("Error adding comment:", err);
      // ✅ Show backend error message if available
      showToast(
        err.response?.data?.message || "Failed to add comment",
        "error"
      );
    } finally {
      setCommentLoading(false);
    }
  };

  // Handle like/unlike
  const handleLike = async () => {
    if (!user) {
      showToast("Please login to like this blog", "error");
      return;
    }

    // ✅ NEW: Check if user is the author
    if (isAuthor) {
      showToast("You cannot like your own blog", "error");
      return;
    }

    try {
      // Optimistic update
      const newLikedState = !isLiked;
      const newLikeCount = newLikedState ? likeCount + 1 : likeCount - 1;

      setIsLiked(newLikedState);
      setLikeCount(newLikeCount);

      const response = await axios.post(
        `${API_BASE_URL}/blog/${id}/like`,
        {},
        { withCredentials: true }
      );

      if (response.data?.success) {
        // Update with actual server response
        setIsLiked(response.data.liked);
        setLikeCount(response.data.likes);
        showToast(
          response.data.liked ? "Added like" : "Removed like",
          "success"
        );
      } else {
        // Revert on failure
        setIsLiked(!newLikedState);
        setLikeCount(likeCount);
        showToast("Failed to update like", "error");
      }
    } catch (err) {
      // Revert on error
      setIsLiked(!isLiked);
      setLikeCount(likeCount);
      console.error("Error liking blog:", err);
      // ✅ Show backend error message if available
      showToast(
        err.response?.data?.message || "Failed to update like",
        "error"
      );
    }
  };

  // Handle share
  const handleShare = async (platform) => {
    const blogUrl = window.location.href;
    const blogTitle = blog?.title || "Check out this blog";
    const blogDescription = blog?.body?.substring(0, 100) + "..." || "";

    switch (platform) {
      case "copy":
        try {
          await navigator.clipboard.writeText(blogUrl);
          setCopySuccess(true);
          showToast("Link copied to clipboard!", "success");
          setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
          console.error("Failed to copy:", err);
          const textArea = document.createElement("textarea");
          textArea.value = blogUrl;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);
          setCopySuccess(true);
          showToast("Link copied to clipboard!", "success");
          setTimeout(() => setCopySuccess(false), 2000);
        }
        break;

      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            blogTitle
          )}&url=${encodeURIComponent(blogUrl)}`,
          "_blank"
        );
        showToast("Opening Twitter...", "info");
        break;

      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            blogUrl
          )}`,
          "_blank"
        );
        showToast("Opening Facebook...", "info");
        break;

      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            blogUrl
          )}`,
          "_blank"
        );
        showToast("Opening LinkedIn...", "info");
        break;

      case "whatsapp":
        window.open(
          `https://wa.me/?text=${encodeURIComponent(
            blogTitle + " " + blogUrl
          )}`,
          "_blank"
        );
        showToast("Opening WhatsApp...", "info");
        break;

      case "email":
        window.location.href = `mailto:?subject=${encodeURIComponent(
          blogTitle
        )}&body=${encodeURIComponent(
          blogDescription + "\n\nRead more: " + blogUrl
        )}`;
        showToast("Opening email client...", "info");
        break;

      default:
        break;
    }
    setShowShareMenu(false);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Profile Avatar Component
  const ProfileAvatar = ({ user, size = "w-10 h-10" }) => {
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

    return (
      <div
        className={`${size} rounded-full overflow-hidden shadow-lg bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold`}
      >
        {initials}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {error || "Blog not found"}
          </h2>
          <button
            onClick={() => navigate("/")}
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
      {/* Toast Container */}
      <div className="fixed top-0 right-0 z-[9999] space-y-2 p-4">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="group flex items-center space-x-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-xl mb-6 shadow-lg relative"
        >
          <ArrowLeftIcon className="h-5 w-5 group-hover:translate-x-[-2px] transition-transform duration-200" />
          <span>Back to Blogs</span>
          <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
        </button>

        {/* Blog Content */}
        <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Cover Image */}
          {blog.coverImageURL && (
            <div className="w-full h-64 md:h-80 overflow-hidden">
              <img
                src={blog.coverImageURL}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6 md:p-8">
            {/* Blog Header */}
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {blog.title}
              </h1>

              {/* Author Info */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-4">
                  <ProfileAvatar user={blog.createdBy} />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {blog.createdBy?.fullName ||
                        blog.createdBy?.name ||
                        "Anonymous"}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
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
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                  {/* ✅ UPDATED: Like Button - Hide if author */}
                  {!isAuthor ? (
                    <button
                      onClick={handleLike}
                      className={`flex items-center space-x-1 p-2 rounded-lg transition-colors ${
                        isLiked
                          ? "text-red-500 bg-red-50 dark:bg-red-900/20"
                          : "text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                      }`}
                    >
                      <HeartIcon
                        className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`}
                      />
                      <span className="text-sm font-medium">{likeCount}</span>
                    </button>
                  ) : (
                    <div className="flex items-center space-x-1 p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                      <HeartIcon className="h-5 w-5" />
                      <span className="text-sm font-medium">{likeCount}</span>
                    </div>
                  )}

                  {/* Share Button */}
                  <div className="relative">
                    <button
                      onClick={() => setShowShareMenu(!showShareMenu)}
                      className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    >
                      <ShareIcon className="h-5 w-5" />
                    </button>

                    {/* Share Menu */}
                    {showShareMenu && (
                      <>
                        <div
                          className="fixed inset-0 z-[9990]"
                          onClick={() => setShowShareMenu(false)}
                        />

                        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 py-4 z-[9999] backdrop-blur-lg">
                          <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-700">
                            <p className="text-sm font-bold text-gray-900 dark:text-white">
                              Share this article
                            </p>
                          </div>

                          <div className="py-2">
                            <button
                              onClick={() => handleShare("copy")}
                              className="flex items-center space-x-3 w-full px-5 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              {copySuccess ? (
                                <CheckIcon className="h-5 w-5 text-green-500" />
                              ) : (
                                <CopyIcon className="h-5 w-5 text-blue-500" />
                              )}
                              <span className="font-medium">
                                {copySuccess ? "Copied!" : "Copy Link"}
                              </span>
                            </button>

                            <button
                              onClick={() => handleShare("twitter")}
                              className="flex items-center space-x-3 w-full px-5 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              <div className="h-5 w-5 bg-blue-400 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">
                                  T
                                </span>
                              </div>
                              <span className="font-medium">
                                Share on Twitter
                              </span>
                            </button>

                            <button
                              onClick={() => handleShare("facebook")}
                              className="flex items-center space-x-3 w-full px-5 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              <div className="h-5 w-5 bg-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">
                                  f
                                </span>
                              </div>
                              <span className="font-medium">
                                Share on Facebook
                              </span>
                            </button>

                            <button
                              onClick={() => handleShare("linkedin")}
                              className="flex items-center space-x-3 w-full px-5 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              <div className="h-5 w-5 bg-blue-700 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">
                                  in
                                </span>
                              </div>
                              <span className="font-medium">
                                Share on LinkedIn
                              </span>
                            </button>

                            <button
                              onClick={() => handleShare("whatsapp")}
                              className="flex items-center space-x-3 w-full px-5 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              <div className="h-5 w-5 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">
                                  W
                                </span>
                              </div>
                              <span className="font-medium">
                                Share on WhatsApp
                              </span>
                            </button>

                            <button
                              onClick={() => handleShare("email")}
                              className="flex items-center space-x-3 w-full px-5 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              <div className="h-5 w-5 bg-gray-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">
                                  @
                                </span>
                              </div>
                              <span className="font-medium">
                                Share via Email
                              </span>
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Save Button */}
                  <button
                    onClick={handleSave}
                    disabled={saveLoading}
                    className={`p-2 rounded-lg transition-colors ${
                      isSaved
                        ? "text-green-500 bg-green-50 dark:bg-green-900/20"
                        : "text-gray-500 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
                    } ${saveLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <BookmarkIcon
                      className={`h-5 w-5 ${isSaved ? "fill-current" : ""}`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Blog Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
              <div
                className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap"
                style={{ wordBreak: "break-word" }}
              >
                {blog.body}
              </div>
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
          <div className="flex items-center space-x-2 mb-6">
            <MessageCircleIcon className="h-6 w-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Comments ({comments.length})
            </h2>
          </div>

          {/* ✅ UPDATED: Comment Form - Hide if author or not logged in */}
          {user ? (
            isAuthor ? (
              <div className="mb-8 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                <div className="flex items-center space-x-2 text-yellow-800 dark:text-yellow-400">
                  <InfoIcon className="h-5 w-5" />
                  <p className="font-medium">
                    You cannot comment on your own blog
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCommentSubmit} className="mb-8">
                <div className="flex space-x-4">
                  <ProfileAvatar user={user} />
                  <div className="flex-1">
                    <textarea
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      placeholder="Write a comment..."
                      className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                      rows="3"
                      disabled={commentLoading}
                    />
                    <div className="flex justify-end mt-3">
                      <button
                        type="submit"
                        disabled={commentLoading || !commentContent.trim()}
                        className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <SendIcon className="h-4 w-4" />
                        <span>
                          {commentLoading ? "Posting..." : "Post Comment"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )
          ) : (
            <div className="mb-8 p-4 bg-gray-100 dark:bg-gray-700 rounded-xl text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                Please log in to post a comment
              </p>
              <Link
                to="/login"
                className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Login
              </Link>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-6">
            {comments.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">
                  No comments yet. Be the first to comment!
                </p>
              </div>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment._id}
                  className="flex space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
                >
                  <ProfileAvatar user={comment.createdBy} />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {comment.createdBy?.fullName ||
                          comment.createdBy?.name ||
                          "Anonymous"}
                      </h4>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style>
        {`
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
        `}
      </style>
    </div>
  );
};

export default BlogDetail;