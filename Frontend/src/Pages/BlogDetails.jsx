import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { ArrowLeftIcon } from "lucide-react";
import Toast from "../components/blogdetail/Toast";
import BlogHeader from "../components/blogdetail/BlogHeader";
import CommentsSection from "../components/blogdetail/CommentsSection";

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
  const [isAuthor, setIsAuthor] = useState(false);

  const showToast = (message, type = "info") => {
    setToasts((prev) => [...prev, { id: Date.now(), message, type }]);
  };
  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/user/me');
        if (response.data?.success) setUser(response.data.user);
      } catch {
        setUser(null);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (user && blog) setIsAuthor(blog.createdBy._id === user._id);
  }, [user, blog]);

  useEffect(() => {
    const checkSavedStatus = async () => {
      if (user && id) {
        try {
          const response = await api.get(`/blog/${id}/is-saved`);
          if (response.data?.success) setIsSaved(response.data.saved);
        } catch (err) {
          console.error("Error checking saved status:", err);
        }
      }
    };
    checkSavedStatus();
  }, [user, id]);

  useEffect(() => {
    const checkLikedStatus = async () => {
      if (user && id) {
        try {
          const response = await api.get(`/blog/${id}/is-liked`);
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

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/blog/${id}`);
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
    if (id) fetchBlog();
  }, [id]);

  const handleSave = async () => {
    if (!user) return showToast("Please login to save this blog", "error");
    try {
      setSaveLoading(true);
      const response = await api.post(`/blog/${id}/save`, {});
      if (response.data?.success) {
        setIsSaved(response.data.saved);
        showToast(response.data.saved ? "Blog saved!" : "Blog removed from saved", "success");
      }
    } catch {
      showToast("Failed to save blog", "error");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) return showToast("Please login to comment", "error");
    if (isAuthor) return showToast("You cannot comment on your own blog", "error");
    if (!commentContent.trim()) return showToast("Please enter a comment", "error");

    try {
      setCommentLoading(true);
      const response = await api.post(`/blog/${id}/comments`, { content: commentContent });
      if (response.data?.success) {
        setComments((prev) => [...prev, response.data.comment]);
        setCommentContent("");
        showToast("Comment posted!", "success");
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to add comment", "error");
    } finally {
      setCommentLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) return showToast("Please login to like this blog", "error");
    if (isAuthor) return showToast("You cannot like your own blog", "error");

    const newLikedState = !isLiked;
    const newLikeCount = newLikedState ? likeCount + 1 : likeCount - 1;
    setIsLiked(newLikedState);
    setLikeCount(newLikeCount);

    try {
      const response = await api.post(`/blog/${id}/like`, {});
      if (response.data?.success) {
        setIsLiked(response.data.liked);
        setLikeCount(response.data.likes);
      } else {
        setIsLiked(!newLikedState);
        setLikeCount(likeCount);
        showToast("Failed to update like", "error");
      }
    } catch (err) {
      setIsLiked(!newLikedState);
      setLikeCount(likeCount);
      showToast(err.response?.data?.message || "Failed to update like", "error");
    }
  };

  const handleShare = async (platform) => {
    const blogUrl = window.location.href;
    const blogTitle = blog?.title || "Check out this blog";
    const blogDescription = blog?.body?.substring(0, 100) + "..." || "";

    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(blogTitle)}&url=${encodeURIComponent(blogUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(blogUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(blogUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(blogTitle + " " + blogUrl)}`,
    };

    if (platform === "copy") {
      try {
        await navigator.clipboard.writeText(blogUrl);
        setCopySuccess(true);
        showToast("Link copied!", "success");
        setTimeout(() => setCopySuccess(false), 2000);
      } catch {
        showToast("Failed to copy link", "error");
      }
    } else if (platform === "email") {
      window.location.href = `mailto:?subject=${encodeURIComponent(blogTitle)}&body=${encodeURIComponent(blogDescription + "\n\nRead more: " + blogUrl)}`;
    } else if (urls[platform]) {
      window.open(urls[platform], "_blank");
    }
    setShowShareMenu(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-6 py-12 animate-pulse">
          <div className="h-7 bg-secondary rounded mb-4 w-2/3" />
          <div className="h-56 bg-secondary rounded mb-6" />
          <div className="space-y-3">
            <div className="h-3.5 bg-secondary rounded w-3/4" />
            <div className="h-3.5 bg-secondary rounded w-1/2" />
            <div className="h-3.5 bg-secondary rounded w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-4">{error || "Blog not found"}</h2>
          <button
            onClick={() => navigate("/")}
            className="bg-primary text-primary-foreground px-5 py-2.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
        ))}
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Blogs
        </button>

        <article className="bg-card border border-border rounded-lg overflow-hidden">
          {blog.coverImageURL && (
            <div className="w-full h-64 md:h-80 overflow-hidden">
              <img src={blog.coverImageURL} alt={blog.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="p-6 md:p-8">
            <BlogHeader
              blog={blog}
              isAuthor={isAuthor}
              isLiked={isLiked}
              likeCount={likeCount}
              onLike={handleLike}
              isSaved={isSaved}
              saveLoading={saveLoading}
              onSave={handleSave}
              showShareMenu={showShareMenu}
              setShowShareMenu={setShowShareMenu}
              onShare={handleShare}
              copySuccess={copySuccess}
            />

            <div className="text-foreground leading-relaxed whitespace-pre-wrap" style={{ wordBreak: "break-word" }}>
              {blog.body}
            </div>
          </div>
        </article>

        <CommentsSection
          comments={comments}
          user={user}
          isAuthor={isAuthor}
          commentContent={commentContent}
          setCommentContent={setCommentContent}
          commentLoading={commentLoading}
          onSubmit={handleCommentSubmit}
        />
      </div>
    </div>
  );
};

export default BlogDetail;