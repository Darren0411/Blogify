import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { BookOpenIcon, PlusIcon, HeartIcon } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BlogListCard from '../components/BlogListCard';

const MyBlogs = () => {
  const navigate = useNavigate();
  const [myBlogs, setMyBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
        setError(err.response?.status === 401 ? 'Please login to view your blogs' : 'Failed to fetch your blogs');
      } finally {
        setLoading(false);
      }
    };
    fetchMyBlogs();
  }, []);

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
            <BookOpenIcon className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
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

  const totalLikes = myBlogs.reduce((acc, blog) => acc + (blog.likes || 0), 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BookOpenIcon className="h-5 w-5 text-muted-foreground" />
              <h1 className="text-xl font-semibold text-foreground">My Blogs</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              {myBlogs.length} {myBlogs.length === 1 ? 'blog' : 'blogs'} published
            </p>
          </div>
          <Link
            to="/add-blog"
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <PlusIcon className="h-4 w-4" />
            Write New Blog
          </Link>
        </div>

        {myBlogs.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="border border-border rounded-lg p-4 flex items-center gap-3">
              <div className="p-2 bg-secondary rounded-md">
                <BookOpenIcon className="h-4 w-4 text-foreground" />
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground">{myBlogs.length}</p>
                <p className="text-xs text-muted-foreground">Total Blogs</p>
              </div>
            </div>
            <div className="border border-border rounded-lg p-4 flex items-center gap-3">
              <div className="p-2 bg-secondary rounded-md">
                <HeartIcon className="h-4 w-4 text-foreground" />
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground">{totalLikes}</p>
                <p className="text-xs text-muted-foreground">Total Likes</p>
              </div>
            </div>
          </div>
        )}

        {myBlogs.length === 0 ? (
          <div className="text-center py-16">
            <BookOpenIcon className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-base font-semibold text-foreground mb-1">No blogs yet</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Start writing your first blog to share your thoughts with the world!
            </p>
            <Link
              to="/add-blog"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <PlusIcon className="h-4 w-4" />
              Write Your First Blog
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {myBlogs.map((blog) => (
              <BlogListCard key={blog._id} blog={blog} variant="mine" />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MyBlogs;