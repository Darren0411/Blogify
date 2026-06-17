import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { BookmarkIcon, ArrowLeftIcon } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BlogListCard from '../components/BlogListCard';

const SavedBlogs = () => {
  const navigate = useNavigate();
  const [savedBlogs, setSavedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
        setError(err.response?.status === 401 ? 'Please login to view saved blogs' : 'Failed to fetch saved blogs');
      } finally {
        setLoading(false);
      }
    };
    fetchSavedBlogs();
  }, []);

  const handleUnsave = async (blogId) => {
    try {
      const response = await api.post(`/blog/${blogId}/save`, {});
      if (response.data?.success) {
        setSavedBlogs((prev) => prev.filter((b) => b._id !== blogId));
      }
    } catch {
      alert('Failed to remove blog from saved');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-10 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border border-border rounded-lg p-5 animate-pulse">
              <div className="h-5 bg-secondary rounded w-3/4 mb-3" />
              <div className="h-3.5 bg-secondary rounded w-1/2 mb-2" />
              <div className="h-3.5 bg-secondary rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <BookmarkIcon className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-foreground mb-4">{error}</h2>
            <button
              onClick={() => navigate('/')}
              className="bg-primary text-primary-foreground px-5 py-2.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Go Back Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-1">
          <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeftIcon className="h-4 w-4" />
          </button>
          <BookmarkIcon className="h-5 w-5 text-muted-foreground" />
          <h1 className="text-xl font-semibold text-foreground">Saved Blogs</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-8 ml-7">
          {savedBlogs.length} saved {savedBlogs.length === 1 ? 'blog' : 'blogs'}
        </p>

        {savedBlogs.length === 0 ? (
          <div className="text-center py-16">
            <BookmarkIcon className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-base font-semibold text-foreground mb-1">No saved blogs yet</h3>
            <p className="text-sm text-muted-foreground mb-6">Start saving blogs to read them later!</p>
            <Link
              to="/"
              className="inline-block bg-primary text-primary-foreground px-5 py-2.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Explore Blogs
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {savedBlogs.map((blog) => (
              <BlogListCard key={blog._id} blog={blog} variant="saved" onRemove={handleUnsave} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SavedBlogs;